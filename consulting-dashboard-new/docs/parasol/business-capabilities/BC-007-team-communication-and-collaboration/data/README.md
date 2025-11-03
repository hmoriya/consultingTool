# BC-007: データ層設計 [Data Layer Design]

**BC**: Team Communication & Collaboration [チームコミュニケーションとコラボレーション] [BC_007]
**作成日**: 2025-10-31
**最終更新**: 2025-11-03
**V2移行元**: services/collaboration-facilitation-service/database-design.md

---

## 目次

1. [概要](#overview)
2. [データベーステーブル](#tables)
3. [インデックス戦略](#indexes)
4. [パーティショニング戦略](#partitioning)
5. [データフロー](#data-flow)

---

## 概要 {#overview}

BC-007のデータ層は、メッセージング、通知、会議、コラボレーションの4つのコンテキストに対応する28テーブルで構成されます。

### データベース構成

- **RDBMS**: PostgreSQL 14+
- **テーブル数**: 28
- **推定データ量**: 100 GB（1年間）
- **パーティショニング**: messages、notifications テーブルは月次パーティション
- **全文検索**: PostgreSQL Full Text Search + Elasticsearch連携
- **キャッシュ**: Redis（プレゼンス情報、リアルタイムデータ）

### テーブルカテゴリ

| カテゴリ | テーブル数 | 主要テーブル |
|---------|-----------|-------------|
| **Messaging** | 10 | channels, messages, reactions, read_receipts |
| **Notification** | 6 | notifications, notification_delivery_attempts, preferences |
| **Meeting** | 7 | meetings, participants, meeting_minutes, action_items |
| **Collaboration** | 5 | workspaces, documents, document_versions, comments |

---

## データベーステーブル {#tables}

### Messaging Context

#### channels
チャネル

```sql
CREATE TABLE channels (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('public', 'private')),
  topic VARCHAR(500),
  created_by UUID NOT NULL,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_channel_name_per_workspace UNIQUE (workspace_id, name)
);

CREATE INDEX idx_channels_workspace ON channels(workspace_id) WHERE archived_at IS NULL;
CREATE INDEX idx_channels_type ON channels(type);
```

---

#### channel_members
チャネルメンバー

```sql
CREATE TABLE channel_members (
  id UUID PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ,

  CONSTRAINT unique_channel_member UNIQUE (channel_id, user_id)
);

CREATE INDEX idx_channel_members_channel ON channel_members(channel_id);
CREATE INDEX idx_channel_members_user ON channel_members(user_id);
```

---

#### messages
メッセージ（月次パーティション）

```sql
CREATE TABLE messages (
  id UUID NOT NULL,
  channel_id UUID,
  sender_id UUID NOT NULL,
  recipient_info JSONB NOT NULL,
  content TEXT NOT NULL,
  content_search TSVECTOR,
  type VARCHAR(30) NOT NULL DEFAULT 'text',
  thread_id UUID,
  parent_message_id UUID,
  is_pinned BOOLEAN DEFAULT false,
  pinned_by UUID,
  pinned_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- 月次パーティション作成
CREATE TABLE messages_2025_11 PARTITION OF messages
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- インデックス
CREATE INDEX idx_messages_channel ON messages(channel_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_sender ON messages(sender_id, created_at DESC);
CREATE INDEX idx_messages_thread ON messages(thread_id, created_at) WHERE thread_id IS NOT NULL;
CREATE INDEX idx_messages_search ON messages USING GIN(content_search);
```

---

#### message_attachments
メッセージ添付ファイル

```sql
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY,
  message_id UUID NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  storage_url TEXT NOT NULL,
  thumbnail_url TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attachments_message ON message_attachments(message_id);
```

---

#### reactions
リアクション

```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY,
  message_id UUID NOT NULL,
  user_id UUID NOT NULL,
  emoji VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_reaction UNIQUE (message_id, user_id, emoji)
);

CREATE INDEX idx_reactions_message ON reactions(message_id);
```

---

#### read_receipts
既読情報

```sql
CREATE TABLE read_receipts (
  id UUID PRIMARY KEY,
  message_id UUID NOT NULL,
  user_id UUID NOT NULL,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_read_receipt UNIQUE (message_id, user_id)
);

CREATE INDEX idx_read_receipts_message ON read_receipts(message_id);
CREATE INDEX idx_read_receipts_user ON read_receipts(user_id, read_at DESC);
```

---

#### direct_conversations
ダイレクト会話

```sql
CREATE TABLE direct_conversations (
  id UUID PRIMARY KEY,
  participant1_id UUID NOT NULL,
  participant2_id UUID NOT NULL,
  participant1_unread_count INT DEFAULT 0,
  participant2_unread_count INT DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_dm_participants UNIQUE (participant1_id, participant2_id),
  CHECK (participant1_id < participant2_id)
);

CREATE INDEX idx_dm_conv_participant1 ON direct_conversations(participant1_id, last_message_at DESC);
CREATE INDEX idx_dm_conv_participant2 ON direct_conversations(participant2_id, last_message_at DESC);
```

---

### Notification Context

#### notifications
通知（月次パーティション）

```sql
CREATE TABLE notifications (
  id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  action_url TEXT,
  image_url TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ,
  first_attempt_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  read_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE notifications_2025_11 PARTITION OF notifications
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

CREATE INDEX idx_notif_recipient ON notifications(recipient_id, created_at DESC);
CREATE INDEX idx_notif_status ON notifications(status, priority);
CREATE INDEX idx_notif_scheduled ON notifications(scheduled_at) WHERE status = 'pending';
```

---

#### notification_delivery_attempts
通知配信試行

```sql
CREATE TABLE notification_delivery_attempts (
  id UUID PRIMARY KEY,
  notification_id UUID NOT NULL,
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('push', 'email', 'sms', 'in_app')),
  attempt_number INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  external_id VARCHAR(255),
  error_message TEXT,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_delivery_attempts_notif ON notification_delivery_attempts(notification_id);
```

---

#### notification_preferences
通知設定

```sql
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY,
  channel_push_enabled BOOLEAN DEFAULT true,
  channel_email_enabled BOOLEAN DEFAULT true,
  channel_sms_enabled BOOLEAN DEFAULT false,
  channel_in_app_enabled BOOLEAN DEFAULT true,
  type_settings JSONB,
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start_hour INT CHECK (quiet_hours_start_hour BETWEEN 0 AND 23),
  quiet_hours_end_hour INT CHECK (quiet_hours_end_hour BETWEEN 0 AND 23),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### Meeting Context

#### meetings
会議

```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(30) NOT NULL,
  organizer_id UUID NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  duration_minutes INT NOT NULL,
  location_type VARCHAR(20) NOT NULL CHECK (location_type IN ('physical', 'online', 'hybrid')),
  physical_location VARCHAR(200),
  room_id UUID,
  online_meeting_provider VARCHAR(30),
  online_meeting_url TEXT,
  online_meeting_id VARCHAR(100),
  online_meeting_password VARCHAR(100),
  status VARCHAR(30) NOT NULL DEFAULT 'scheduled',
  recurrence_rule JSONB,
  parent_meeting_id UUID REFERENCES meetings(id),
  recording_url TEXT,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meetings_start_time ON meetings(start_time);
CREATE INDEX idx_meetings_organizer ON meetings(organizer_id, start_time);
CREATE INDEX idx_meetings_status ON meetings(status, start_time);
```

---

#### meeting_participants
会議参加者

```sql
CREATE TABLE meeting_participants (
  id UUID PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('organizer', 'required', 'optional', 'attendee')),
  attendance_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ,

  CONSTRAINT unique_meeting_participant UNIQUE (meeting_id, user_id)
);

CREATE INDEX idx_meeting_participants_meeting ON meeting_participants(meeting_id);
CREATE INDEX idx_meeting_participants_user ON meeting_participants(user_id, invited_at DESC);
```

---

#### meeting_minutes
会議議事録

```sql
CREATE TABLE meeting_minutes (
  id UUID PRIMARY KEY,
  meeting_id UUID NOT NULL UNIQUE REFERENCES meetings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID,
  updated_at TIMESTAMPTZ
);
```

---

#### action_items
アクションアイテム

```sql
CREATE TABLE action_items (
  id UUID PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES meetings(id),
  minutes_id UUID REFERENCES meeting_minutes(id),
  description TEXT NOT NULL,
  assignee_id UUID NOT NULL,
  due_date DATE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_action_items_meeting ON action_items(meeting_id);
CREATE INDEX idx_action_items_assignee ON action_items(assignee_id, is_completed, due_date);
```

---

### Collaboration Context

#### workspaces
ワークスペース

```sql
CREATE TABLE workspaces (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(30) NOT NULL CHECK (type IN ('project', 'team', 'department', 'personal')),
  owner_id UUID NOT NULL,
  project_id UUID,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_workspaces_project ON workspaces(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX idx_workspaces_active ON workspaces(type, created_at DESC) WHERE archived_at IS NULL;
```

---

#### workspace_members
ワークスペースメンバー

```sql
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  permission VARCHAR(20) NOT NULL CHECK (permission IN ('owner', 'admin', 'editor', 'commenter', 'viewer')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ,

  CONSTRAINT unique_workspace_member UNIQUE (workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
```

---

#### documents
ドキュメント

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  title VARCHAR(200) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  storage_url TEXT NOT NULL,
  owner_id UUID NOT NULL,
  current_version_number INT DEFAULT 1,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_workspace ON documents(workspace_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_owner ON documents(owner_id);
```

---

#### document_versions
ドキュメントバージョン

```sql
CREATE TABLE document_versions (
  id UUID PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  storage_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_by UUID NOT NULL,
  change_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_document_version UNIQUE (document_id, version_number)
);

CREATE INDEX idx_document_versions_document ON document_versions(document_id, version_number DESC);
```

---

#### document_comments
ドキュメントコメント

```sql
CREATE TABLE document_comments (
  id UUID PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  position JSONB,
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_comments_document ON document_comments(document_id, created_at);
```

---

## インデックス戦略 {#indexes}

### B-Tree インデックス

主キー、外部キー、範囲検索、ソートに使用：

```sql
-- 時系列検索
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_notif_created ON notifications(created_at DESC);

-- ユーザー別検索
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_notif_recipient ON notifications(recipient_id);

-- ステータス別検索
CREATE INDEX idx_meetings_status ON meetings(status, start_time);
CREATE INDEX idx_notif_status ON notifications(status, priority);
```

---

### GIN インデックス

全文検索、JSONB検索に使用：

```sql
-- 全文検索
CREATE INDEX idx_messages_search ON messages USING GIN(content_search);

-- JSONB検索
CREATE INDEX idx_notif_data ON notifications USING GIN(data);
CREATE INDEX idx_meetings_recurrence ON meetings USING GIN(recurrence_rule);
```

---

### 部分インデックス

条件付きクエリの最適化：

```sql
-- アクティブなチャネルのみ
CREATE INDEX idx_channels_active ON channels(workspace_id) WHERE archived_at IS NULL;

-- 削除されていないメッセージのみ
CREATE INDEX idx_messages_active ON messages(channel_id, created_at DESC) WHERE deleted_at IS NULL;

-- ペンディング通知のみ
CREATE INDEX idx_notif_pending ON notifications(scheduled_at) WHERE status = 'pending';
```

---

## パーティショニング戦略 {#partitioning}

### messages テーブル（月次パーティション）

```sql
-- 2025年11月パーティション
CREATE TABLE messages_2025_11 PARTITION OF messages
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- 2025年12月パーティション
CREATE TABLE messages_2025_12 PARTITION OF messages
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');
```

**パーティション作成スケジュール**: 毎月1日に次月のパーティションを自動作成
**古いパーティションの扱い**: 1年以上前のパーティションはアーカイブストレージへ移行

---

### notifications テーブル（月次パーティション）

```sql
CREATE TABLE notifications_2025_11 PARTITION OF notifications
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
```

**保持期間**: 3ヶ月（古い通知は自動削除）

---

## データフロー {#data-flow}

### メッセージ送信フロー

```
1. messages テーブルにINSERT
2. message_attachments テーブルに添付ファイルINSERT（あれば）
3. WebSocketでリアルタイム配信
4. オフラインユーザーに通知配信（notifications経由）
5. Elasticsearchに全文検索用インデックス作成（非同期）
```

---

### 通知配信フロー

```
1. notifications テーブルにINSERT（status = pending）
2. SLAに基づいて配信チャネル決定
3. 各チャネルで配信試行（notification_delivery_attempts記録）
4. 配信成功時、status = delivered に更新
5. リトライ必要時、スケジューラーに再キュー
6. ユーザーが既読時、read_at 更新
```

---

### 会議作成フロー

```
1. meetings テーブルにINSERT
2. meeting_participants テーブルに参加者INSERT
3. オンライン会議作成（Zoom/Teams API呼び出し）
4. online_meeting_url 等を更新
5. 参加者に通知配信（notifications経由）
6. リマインダーをスケジュール
```

---

### ドキュメント共有フロー

```
1. ファイルをストレージにアップロード
2. documents テーブルにINSERT
3. document_versions テーブルに初期バージョンINSERT
4. ワークスペースメンバーに通知配信
5. アクティビティフィードに記録
```

---

## パフォーマンス最適化

### クエリ最適化

```sql
-- チャネルメッセージ取得（最新50件）
EXPLAIN ANALYZE
SELECT m.*, u.name as sender_name
FROM messages m
JOIN users u ON m.sender_id = u.id
WHERE m.channel_id = $1
  AND m.deleted_at IS NULL
ORDER BY m.created_at DESC
LIMIT 50;
-- Expected: Index Scan on idx_messages_channel
```

---

### キャッシュ戦略

**Redis キャッシュ**:
- ユーザープレゼンス情報（TTL: 5分）
- チャネル未読カウント（TTL: 1分）
- アクティブなWebSocket接続情報

```
SET presence:user:{userId} "online" EX 300
GET presence:user:{userId}

INCR unread_count:channel:{channelId}:user:{userId}
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-007 データ層詳細化
