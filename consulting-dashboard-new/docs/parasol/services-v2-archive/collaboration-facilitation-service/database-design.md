# データベース設計: コラボレーション促進サービス

**バージョン**: 1.0.0
**更新日**: 2025-10-01
**DBMS**: SQLite（開発環境）/ PostgreSQL（本番環境）
**文字エンコーディング**: UTF-8
**タイムゾーン**: UTC

## 設計概要

### データベース配置
- **開発環境**: `prisma/collaboration-service/data/collaboration.db` (SQLite)
- **本番環境**: PostgreSQL 14以上
- **接続プール**: 最大20接続

### 設計方針
- **パラソルドメイン言語準拠**: domain-language.mdのエンティティ定義に基づく
- **集約単位でのテーブル設計**: WorkspaceAggregate, ChannelAggregate, DocumentAggregate, MeetingAggregate
- **正規化**: 第3正規形を基本としつつ、パフォーマンスのための非正規化を適用
- **インデックス戦略**: 検索パフォーマンスとストレージのバランス
- **パーティション**: メッセージテーブルは日付ベースのパーティション（本番環境）

---

## 論理設計

### ER図

```mermaid
erDiagram
    workspaces ||--o{ channels : "contains"
    workspaces ||--o{ documents : "contains"
    workspaces ||--o{ meetings : "contains"
    workspaces ||--o{ notifications : "contains"

    channels ||--o{ messages : "contains"
    channels ||--o{ threads : "contains"
    channels ||--o{ channel_members : "has"

    messages ||--o{ threads : "starts"
    messages ||--o{ file_attachments : "has"

    documents ||--o{ document_versions : "has versions"

    meetings ||--o{ meeting_participants : "has"

    workspaces {
        UUID id PK
        STRING name
        UUID organizationId
        TEXT description
        UUID ownerId
        ENUM plan
        BIGINT storageUsed
        BIGINT storageLimit
        ENUM status
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    channels {
        UUID id PK
        UUID workspaceId FK
        STRING name
        ENUM type
        TEXT purpose
        STRING topic
        UUID ownerId
        BOOLEAN isArchived
        TIMESTAMP lastActivityAt
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    messages {
        UUID id PK
        UUID channelId FK
        UUID authorId
        TEXT content
        ENUM type
        UUID threadId FK
        TIMESTAMP editedAt
        TIMESTAMP deletedAt
        TIMESTAMP createdAt
    }

    threads {
        UUID id PK
        UUID parentMessageId FK
        INTEGER replyCount
        TIMESTAMP lastReplyAt
        BOOLEAN isResolved
        TIMESTAMP createdAt
    }

    channel_members {
        UUID channelId FK
        UUID userId
        ENUM role
        TIMESTAMP joinedAt
        TIMESTAMP lastReadAt
        BOOLEAN notificationEnabled
    }

    documents {
        UUID id PK
        UUID workspaceId FK
        STRING title
        TEXT content
        ENUM type
        UUID authorId
        UUID parentId FK
        INTEGER version
        ENUM status
        TIMESTAMP publishedAt
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    document_versions {
        UUID documentId FK
        INTEGER version
        TEXT content
        UUID authorId
        STRING changeNote
        TIMESTAMP createdAt
    }

    meetings {
        UUID id PK
        UUID workspaceId FK
        STRING title
        TEXT description
        ENUM type
        UUID hostId
        TIMESTAMP scheduledStart
        TIMESTAMP scheduledEnd
        TIMESTAMP actualStart
        TIMESTAMP actualEnd
        STRING meetingUrl
        ENUM status
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    meeting_participants {
        UUID meetingId FK
        UUID userId
        ENUM role
        TIMESTAMP joinedAt
        TIMESTAMP leftAt
        ENUM status
    }

    notifications {
        UUID id PK
        UUID workspaceId FK
        UUID recipientId
        ENUM type
        STRING title
        TEXT message
        ENUM sourceType
        UUID sourceId
        BOOLEAN isRead
        TIMESTAMP readAt
        TIMESTAMP createdAt
    }

    file_attachments {
        UUID id PK
        UUID messageId FK
        STRING filename
        BIGINT filesize
        STRING mimetype
        STRING url
        STRING thumbnailUrl
        UUID uploadedBy
        TIMESTAMP uploadedAt
    }
```

---

## 物理設計

### 1. workspaces テーブル

**目的**: ワークスペース（コラボレーションスペース）の管理

| カラム名 | データ型 | NULL | デフォルト | 制約 | 説明 |
|---------|---------|------|-----------|------|------|
| id | UUID | NOT NULL | gen_random_uuid() | PK | ワークスペースID |
| name | VARCHAR(100) | NOT NULL | - | - | ワークスペース名 |
| organizationId | UUID | NOT NULL | - | FK | 所属組織ID |
| description | TEXT | NULL | - | - | 説明 |
| ownerId | UUID | NOT NULL | - | FK | オーナーID |
| plan | VARCHAR(20) | NOT NULL | 'free' | - | 利用プラン(free/standard/premium) |
| storageUsed | BIGINT | NOT NULL | 0 | CHECK >= 0 | 使用ストレージ量（バイト） |
| storageLimit | BIGINT | NOT NULL | - | CHECK > 0 | ストレージ上限（バイト） |
| status | VARCHAR(20) | NOT NULL | 'active' | - | ステータス(active/inactive/deleted) |
| createdAt | TIMESTAMP | NOT NULL | NOW() | - | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | NOW() | - | 更新日時 |

**インデックス**:
```sql
CREATE UNIQUE INDEX idx_workspaces_id ON workspaces(id);
CREATE INDEX idx_workspaces_organizationId ON workspaces(organizationId);
CREATE INDEX idx_workspaces_ownerId ON workspaces(ownerId);
CREATE INDEX idx_workspaces_status ON workspaces(status);
CREATE INDEX idx_workspaces_createdAt ON workspaces(createdAt DESC);
```

**制約**:
```sql
ALTER TABLE workspaces
  ADD CONSTRAINT check_workspaces_name_length CHECK (length(name) >= 1 AND length(name) <= 100),
  ADD CONSTRAINT check_workspaces_storage CHECK (storageUsed <= storageLimit),
  ADD CONSTRAINT check_workspaces_timestamps CHECK (createdAt <= updatedAt);
```

---

### 2. channels テーブル

**目的**: チャネル（コミュニケーションチャネル）の管理

| カラム名 | データ型 | NULL | デフォルト | 制約 | 説明 |
|---------|---------|------|-----------|------|------|
| id | UUID | NOT NULL | gen_random_uuid() | PK | チャネルID |
| workspaceId | UUID | NOT NULL | - | FK | 所属ワークスペースID |
| name | VARCHAR(100) | NOT NULL | - | - | チャネル名 |
| type | VARCHAR(20) | NOT NULL | - | - | チャネルタイプ(public/private/direct) |
| purpose | TEXT | NULL | - | - | チャネルの目的 |
| topic | VARCHAR(200) | NULL | - | - | 現在のトピック |
| ownerId | UUID | NOT NULL | - | FK | オーナーID |
| isArchived | BOOLEAN | NOT NULL | false | - | アーカイブ状態 |
| lastActivityAt | TIMESTAMP | NOT NULL | NOW() | - | 最終活動日時 |
| createdAt | TIMESTAMP | NOT NULL | NOW() | - | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | NOW() | - | 更新日時 |

**インデックス**:
```sql
CREATE UNIQUE INDEX idx_channels_id ON channels(id);
CREATE INDEX idx_channels_workspaceId ON channels(workspaceId);
CREATE INDEX idx_channels_type ON channels(type);
CREATE INDEX idx_channels_isArchived ON channels(isArchived);
CREATE INDEX idx_channels_lastActivityAt ON channels(lastActivityAt DESC);
CREATE UNIQUE INDEX idx_channels_workspace_name ON channels(workspaceId, name) WHERE isArchived = false;
```

**制約**:
```sql
ALTER TABLE channels
  ADD CONSTRAINT fk_channels_workspaceId FOREIGN KEY (workspaceId) REFERENCES workspaces(id) ON DELETE CASCADE,
  ADD CONSTRAINT check_channels_name_length CHECK (length(name) >= 1 AND length(name) <= 100),
  ADD CONSTRAINT check_channels_type CHECK (type IN ('public', 'private', 'direct'));
```

---

### 3. messages テーブル

**目的**: メッセージの保存

| カラム名 | データ型 | NULL | デフォルト | 制約 | 説明 |
|---------|---------|------|-----------|------|------|
| id | UUID | NOT NULL | gen_random_uuid() | PK | メッセージID |
| channelId | UUID | NOT NULL | - | FK | 所属チャネルID |
| authorId | UUID | NOT NULL | - | FK | 送信者ID |
| content | TEXT | NOT NULL | - | - | メッセージ内容 |
| type | VARCHAR(20) | NOT NULL | 'text' | - | メッセージタイプ(text/file/system) |
| threadId | UUID | NULL | - | FK | スレッドID |
| editedAt | TIMESTAMP | NULL | - | - | 編集日時 |
| deletedAt | TIMESTAMP | NULL | - | - | 削除日時（論理削除） |
| createdAt | TIMESTAMP | NOT NULL | NOW() | - | 作成日時 |

**インデックス**:
```sql
CREATE UNIQUE INDEX idx_messages_id ON messages(id);
CREATE INDEX idx_messages_channelId_createdAt ON messages(channelId, createdAt DESC);
CREATE INDEX idx_messages_authorId ON messages(authorId);
CREATE INDEX idx_messages_threadId ON messages(threadId);
CREATE INDEX idx_messages_createdAt ON messages(createdAt DESC);
CREATE INDEX idx_messages_deletedAt ON messages(deletedAt) WHERE deletedAt IS NULL;
```

**制約**:
```sql
ALTER TABLE messages
  ADD CONSTRAINT fk_messages_channelId FOREIGN KEY (channelId) REFERENCES channels(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_messages_threadId FOREIGN KEY (threadId) REFERENCES threads(id) ON DELETE SET NULL,
  ADD CONSTRAINT check_messages_content_length CHECK (length(content) >= 1 AND length(content) <= 10000),
  ADD CONSTRAINT check_messages_type CHECK (type IN ('text', 'file', 'system'));
```

**パーティション設計（PostgreSQL本番環境）**:
```sql
-- 日付ベースのパーティション（月次）
CREATE TABLE messages (
    id UUID NOT NULL,
    channelId UUID NOT NULL,
    authorId UUID NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'text',
    threadId UUID,
    editedAt TIMESTAMP,
    deletedAt TIMESTAMP,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (createdAt);

-- 2025年10月のパーティション
CREATE TABLE messages_2025_10 PARTITION OF messages
FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- 2025年11月のパーティション
CREATE TABLE messages_2025_11 PARTITION OF messages
FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- 以降、月次で自動作成（運用スクリプト）
```

---

### 4. threads テーブル

**目的**: スレッド（メッセージの返信スレッド）の管理

| カラム名 | データ型 | NULL | デフォルト | 制約 | 説明 |
|---------|---------|------|-----------|------|------|
| id | UUID | NOT NULL | gen_random_uuid() | PK | スレッドID |
| parentMessageId | UUID | NOT NULL | - | FK | 親メッセージID |
| replyCount | INTEGER | NOT NULL | 0 | CHECK >= 0 | 返信数 |
| lastReplyAt | TIMESTAMP | NULL | - | - | 最終返信日時 |
| isResolved | BOOLEAN | NOT NULL | false | - | 解決済みフラグ |
| createdAt | TIMESTAMP | NOT NULL | NOW() | - | 作成日時 |

**インデックス**:
```sql
CREATE UNIQUE INDEX idx_threads_id ON threads(id);
CREATE UNIQUE INDEX idx_threads_parentMessageId ON threads(parentMessageId);
CREATE INDEX idx_threads_isResolved ON threads(isResolved);
CREATE INDEX idx_threads_lastReplyAt ON threads(lastReplyAt DESC);
```

**制約**:
```sql
ALTER TABLE threads
  ADD CONSTRAINT fk_threads_parentMessageId FOREIGN KEY (parentMessageId) REFERENCES messages(id) ON DELETE CASCADE,
  ADD CONSTRAINT check_threads_replyCount CHECK (replyCount >= 0);
```

---

### 5. channel_members テーブル

**目的**: チャネルメンバーシップの管理

| カラム名 | データ型 | NULL | デフォルト | 制約 | 説明 |
|---------|---------|------|-----------|------|------|
| channelId | UUID | NOT NULL | - | PK, FK | チャネルID |
| userId | UUID | NOT NULL | - | PK, FK | ユーザーID |
| role | VARCHAR(20) | NOT NULL | 'member' | - | ロール(owner/admin/member) |
| joinedAt | TIMESTAMP | NOT NULL | NOW() | - | 参加日時 |
| lastReadAt | TIMESTAMP | NULL | - | - | 最終既読日時 |
| notificationEnabled | BOOLEAN | NOT NULL | true | - | 通知有効フラグ |

**インデックス**:
```sql
CREATE UNIQUE INDEX idx_channel_members_pk ON channel_members(channelId, userId);
CREATE INDEX idx_channel_members_userId ON channel_members(userId);
CREATE INDEX idx_channel_members_role ON channel_members(role);
```

**制約**:
```sql
ALTER TABLE channel_members
  ADD CONSTRAINT fk_channel_members_channelId FOREIGN KEY (channelId) REFERENCES channels(id) ON DELETE CASCADE,
  ADD CONSTRAINT check_channel_members_role CHECK (role IN ('owner', 'admin', 'member'));
```

---

### 6. documents テーブル

**目的**: ドキュメントの管理

| カラム名 | データ型 | NULL | デフォルト | 制約 | 説明 |
|---------|---------|------|-----------|------|------|
| id | UUID | NOT NULL | gen_random_uuid() | PK | ドキュメントID |
| workspaceId | UUID | NOT NULL | - | FK | 所属ワークスペースID |
| title | VARCHAR(200) | NOT NULL | - | - | タイトル |
| content | TEXT | NOT NULL | - | - | 内容（Markdown/HTML） |
| type | VARCHAR(20) | NOT NULL | 'markdown' | - | ドキュメントタイプ(markdown/wiki/note) |
| authorId | UUID | NOT NULL | - | FK | 作成者ID |
| parentId | UUID | NULL | - | FK | 親ドキュメントID |
| version | INTEGER | NOT NULL | 1 | CHECK >= 1 | バージョン番号 |
| status | VARCHAR(20) | NOT NULL | 'draft' | - | ステータス(draft/published/archived) |
| publishedAt | TIMESTAMP | NULL | - | - | 公開日時 |
| createdAt | TIMESTAMP | NOT NULL | NOW() | - | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | NOW() | - | 更新日時 |

**インデックス**:
```sql
CREATE UNIQUE INDEX idx_documents_id ON documents(id);
CREATE INDEX idx_documents_workspaceId ON documents(workspaceId);
CREATE INDEX idx_documents_authorId ON documents(authorId);
CREATE INDEX idx_documents_parentId ON documents(parentId);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_publishedAt ON documents(publishedAt DESC);
CREATE INDEX idx_documents_createdAt ON documents(createdAt DESC);
-- 全文検索用インデックス（PostgreSQL）
CREATE INDEX idx_documents_content_fts ON documents USING gin(to_tsvector('english', content));
CREATE INDEX idx_documents_title_fts ON documents USING gin(to_tsvector('english', title));
```

**制約**:
```sql
ALTER TABLE documents
  ADD CONSTRAINT fk_documents_workspaceId FOREIGN KEY (workspaceId) REFERENCES workspaces(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_documents_parentId FOREIGN KEY (parentId) REFERENCES documents(id) ON DELETE SET NULL,
  ADD CONSTRAINT check_documents_title_length CHECK (length(title) >= 1 AND length(title) <= 200),
  ADD CONSTRAINT check_documents_version CHECK (version >= 1),
  ADD CONSTRAINT check_documents_type CHECK (type IN ('markdown', 'wiki', 'note')),
  ADD CONSTRAINT check_documents_status CHECK (status IN ('draft', 'published', 'archived'));
```

---

### 7. document_versions テーブル

**目的**: ドキュメントのバージョン履歴管理

| カラム名 | データ型 | NULL | デフォルト | 制約 | 説明 |
|---------|---------|------|-----------|------|------|
| documentId | UUID | NOT NULL | - | PK, FK | ドキュメントID |
| version | INTEGER | NOT NULL | - | PK | バージョン番号 |
| content | TEXT | NOT NULL | - | - | 内容 |
| authorId | UUID | NOT NULL | - | FK | 編集者ID |
| changeNote | VARCHAR(500) | NULL | - | - | 変更内容メモ |
| createdAt | TIMESTAMP | NOT NULL | NOW() | - | 作成日時 |

**インデックス**:
```sql
CREATE UNIQUE INDEX idx_document_versions_pk ON document_versions(documentId, version);
CREATE INDEX idx_document_versions_authorId ON document_versions(authorId);
CREATE INDEX idx_document_versions_createdAt ON document_versions(createdAt DESC);
```

**制約**:
```sql
ALTER TABLE document_versions
  ADD CONSTRAINT fk_document_versions_documentId FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE,
  ADD CONSTRAINT check_document_versions_version CHECK (version >= 1);
```

---

### 8. meetings テーブル

**目的**: 会議の管理

| カラム名 | データ型 | NULL | デフォルト | 制約 | 説明 |
|---------|---------|------|-----------|------|------|
| id | UUID | NOT NULL | gen_random_uuid() | PK | 会議ID |
| workspaceId | UUID | NOT NULL | - | FK | 所属ワークスペースID |
| title | VARCHAR(200) | NOT NULL | - | - | 会議タイトル |
| description | TEXT | NULL | - | - | 会議の説明 |
| type | VARCHAR(20) | NOT NULL | - | - | 会議タイプ(video/audio/chat) |
| hostId | UUID | NOT NULL | - | FK | ホストID |
| scheduledStart | TIMESTAMP | NOT NULL | - | - | 開始予定時刻 |
| scheduledEnd | TIMESTAMP | NOT NULL | - | - | 終了予定時刻 |
| actualStart | TIMESTAMP | NULL | - | - | 実際の開始時刻 |
| actualEnd | TIMESTAMP | NULL | - | - | 実際の終了時刻 |
| meetingUrl | VARCHAR(500) | NULL | - | - | 会議URL |
| status | VARCHAR(20) | NOT NULL | 'scheduled' | - | ステータス(scheduled/in_progress/completed/cancelled) |
| createdAt | TIMESTAMP | NOT NULL | NOW() | - | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | NOW() | - | 更新日時 |

**インデックス**:
```sql
CREATE UNIQUE INDEX idx_meetings_id ON meetings(id);
CREATE INDEX idx_meetings_workspaceId ON meetings(workspaceId);
CREATE INDEX idx_meetings_hostId ON meetings(hostId);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_scheduledStart ON meetings(scheduledStart);
CREATE INDEX idx_meetings_scheduledEnd ON meetings(scheduledEnd);
```

**制約**:
```sql
ALTER TABLE meetings
  ADD CONSTRAINT fk_meetings_workspaceId FOREIGN KEY (workspaceId) REFERENCES workspaces(id) ON DELETE CASCADE,
  ADD CONSTRAINT check_meetings_title_length CHECK (length(title) >= 1 AND length(title) <= 200),
  ADD CONSTRAINT check_meetings_type CHECK (type IN ('video', 'audio', 'chat')),
  ADD CONSTRAINT check_meetings_status CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  ADD CONSTRAINT check_meetings_scheduled_times CHECK (scheduledStart < scheduledEnd),
  ADD CONSTRAINT check_meetings_actual_times CHECK (actualStart IS NULL OR actualEnd IS NULL OR actualStart < actualEnd),
  ADD CONSTRAINT check_meetings_duration CHECK (
    (scheduledEnd - scheduledStart) >= INTERVAL '15 minutes' AND
    (scheduledEnd - scheduledStart) <= INTERVAL '8 hours'
  );
```

---

### 9. meeting_participants テーブル

**目的**: 会議参加者の管理

| カラム名 | データ型 | NULL | デフォルト | 制約 | 説明 |
|---------|---------|------|-----------|------|------|
| meetingId | UUID | NOT NULL | - | PK, FK | 会議ID |
| userId | UUID | NOT NULL | - | PK, FK | ユーザーID |
| role | VARCHAR(20) | NOT NULL | 'participant' | - | ロール(host/presenter/participant) |
| joinedAt | TIMESTAMP | NULL | - | - | 参加時刻 |
| leftAt | TIMESTAMP | NULL | - | - | 退出時刻 |
| status | VARCHAR(20) | NOT NULL | 'invited' | - | ステータス(invited/accepted/declined/attended) |

**インデックス**:
```sql
CREATE UNIQUE INDEX idx_meeting_participants_pk ON meeting_participants(meetingId, userId);
CREATE INDEX idx_meeting_participants_userId ON meeting_participants(userId);
CREATE INDEX idx_meeting_participants_status ON meeting_participants(status);
```

**制約**:
```sql
ALTER TABLE meeting_participants
  ADD CONSTRAINT fk_meeting_participants_meetingId FOREIGN KEY (meetingId) REFERENCES meetings(id) ON DELETE CASCADE,
  ADD CONSTRAINT check_meeting_participants_role CHECK (role IN ('host', 'presenter', 'participant')),
  ADD CONSTRAINT check_meeting_participants_status CHECK (status IN ('invited', 'accepted', 'declined', 'attended')),
  ADD CONSTRAINT check_meeting_participants_times CHECK (joinedAt IS NULL OR leftAt IS NULL OR joinedAt < leftAt);
```

---

### 10. notifications テーブル

**目的**: 通知の管理

| カラム名 | データ型 | NULL | デフォルト | 制約 | 説明 |
|---------|---------|------|-----------|------|------|
| id | UUID | NOT NULL | gen_random_uuid() | PK | 通知ID |
| workspaceId | UUID | NOT NULL | - | FK | ワークスペースID |
| recipientId | UUID | NOT NULL | - | FK | 受信者ID |
| type | VARCHAR(20) | NOT NULL | - | - | 通知タイプ(mention/reply/meeting/document) |
| title | VARCHAR(200) | NOT NULL | - | - | タイトル |
| message | TEXT | NOT NULL | - | - | メッセージ |
| sourceType | VARCHAR(20) | NOT NULL | - | - | ソースタイプ(message/document/meeting) |
| sourceId | UUID | NOT NULL | - | - | ソースID |
| isRead | BOOLEAN | NOT NULL | false | - | 既読フラグ |
| readAt | TIMESTAMP | NULL | - | - | 既読日時 |
| createdAt | TIMESTAMP | NOT NULL | NOW() | - | 作成日時 |

**インデックス**:
```sql
CREATE UNIQUE INDEX idx_notifications_id ON notifications(id);
CREATE INDEX idx_notifications_recipientId_isRead ON notifications(recipientId, isRead);
CREATE INDEX idx_notifications_workspaceId ON notifications(workspaceId);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_createdAt ON notifications(createdAt DESC);
CREATE INDEX idx_notifications_sourceType_sourceId ON notifications(sourceType, sourceId);
```

**制約**:
```sql
ALTER TABLE notifications
  ADD CONSTRAINT fk_notifications_workspaceId FOREIGN KEY (workspaceId) REFERENCES workspaces(id) ON DELETE CASCADE,
  ADD CONSTRAINT check_notifications_type CHECK (type IN ('mention', 'reply', 'meeting', 'document')),
  ADD CONSTRAINT check_notifications_sourceType CHECK (sourceType IN ('message', 'document', 'meeting')),
  ADD CONSTRAINT check_notifications_title_length CHECK (length(title) >= 1 AND length(title) <= 200);
```

---

### 11. file_attachments テーブル

**目的**: ファイル添付の管理

| カラム名 | データ型 | NULL | デフォルト | 制約 | 説明 |
|---------|---------|------|-----------|------|------|
| id | UUID | NOT NULL | gen_random_uuid() | PK | ファイルID |
| messageId | UUID | NOT NULL | - | FK | メッセージID |
| filename | VARCHAR(255) | NOT NULL | - | - | ファイル名 |
| filesize | BIGINT | NOT NULL | - | CHECK > 0 | ファイルサイズ（バイト） |
| mimetype | VARCHAR(100) | NOT NULL | - | - | MIMEタイプ |
| url | VARCHAR(500) | NOT NULL | - | - | ファイルURL |
| thumbnailUrl | VARCHAR(500) | NULL | - | - | サムネイルURL |
| uploadedBy | UUID | NOT NULL | - | FK | アップロード者ID |
| uploadedAt | TIMESTAMP | NOT NULL | NOW() | - | アップロード日時 |

**インデックス**:
```sql
CREATE UNIQUE INDEX idx_file_attachments_id ON file_attachments(id);
CREATE INDEX idx_file_attachments_messageId ON file_attachments(messageId);
CREATE INDEX idx_file_attachments_uploadedBy ON file_attachments(uploadedBy);
CREATE INDEX idx_file_attachments_uploadedAt ON file_attachments(uploadedAt DESC);
```

**制約**:
```sql
ALTER TABLE file_attachments
  ADD CONSTRAINT fk_file_attachments_messageId FOREIGN KEY (messageId) REFERENCES messages(id) ON DELETE CASCADE,
  ADD CONSTRAINT check_file_attachments_filesize CHECK (filesize > 0 AND filesize <= 104857600); -- 100MB
```

---

## テーブル作成SQL

### SQLite（開発環境）

```sql
-- Workspaces table
CREATE TABLE workspaces (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    name TEXT NOT NULL CHECK(length(name) >= 1 AND length(name) <= 100),
    organizationId TEXT NOT NULL,
    description TEXT,
    ownerId TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free',
    storageUsed INTEGER NOT NULL DEFAULT 0 CHECK(storageUsed >= 0),
    storageLimit INTEGER NOT NULL CHECK(storageLimit > 0),
    status TEXT NOT NULL DEFAULT 'active',
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    CHECK(storageUsed <= storageLimit)
);

CREATE INDEX idx_workspaces_organizationId ON workspaces(organizationId);
CREATE INDEX idx_workspaces_ownerId ON workspaces(ownerId);
CREATE INDEX idx_workspaces_status ON workspaces(status);

-- Channels table
CREATE TABLE channels (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    workspaceId TEXT NOT NULL,
    name TEXT NOT NULL CHECK(length(name) >= 1 AND length(name) <= 100),
    type TEXT NOT NULL CHECK(type IN ('public', 'private', 'direct')),
    purpose TEXT,
    topic TEXT,
    ownerId TEXT NOT NULL,
    isArchived INTEGER NOT NULL DEFAULT 0,
    lastActivityAt TEXT NOT NULL DEFAULT (datetime('now')),
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (workspaceId) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_channels_workspaceId ON channels(workspaceId);
CREATE INDEX idx_channels_type ON channels(type);
CREATE INDEX idx_channels_isArchived ON channels(isArchived);
CREATE UNIQUE INDEX idx_channels_workspace_name ON channels(workspaceId, name) WHERE isArchived = 0;

-- Messages table
CREATE TABLE messages (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    channelId TEXT NOT NULL,
    authorId TEXT NOT NULL,
    content TEXT NOT NULL CHECK(length(content) >= 1 AND length(content) <= 10000),
    type TEXT NOT NULL DEFAULT 'text' CHECK(type IN ('text', 'file', 'system')),
    threadId TEXT,
    editedAt TEXT,
    deletedAt TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (channelId) REFERENCES channels(id) ON DELETE CASCADE,
    FOREIGN KEY (threadId) REFERENCES threads(id) ON DELETE SET NULL
);

CREATE INDEX idx_messages_channelId_createdAt ON messages(channelId, createdAt DESC);
CREATE INDEX idx_messages_authorId ON messages(authorId);
CREATE INDEX idx_messages_threadId ON messages(threadId);

-- Other tables follow the same pattern...
```

### PostgreSQL（本番環境）

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces table
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL CHECK(length(name) >= 1),
    organizationId UUID NOT NULL,
    description TEXT,
    ownerId UUID NOT NULL,
    plan VARCHAR(20) NOT NULL DEFAULT 'free',
    storageUsed BIGINT NOT NULL DEFAULT 0 CHECK(storageUsed >= 0),
    storageLimit BIGINT NOT NULL CHECK(storageLimit > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT check_storage CHECK(storageUsed <= storageLimit),
    CONSTRAINT check_timestamps CHECK(createdAt <= updatedAt)
);

CREATE INDEX idx_workspaces_organizationId ON workspaces(organizationId);
CREATE INDEX idx_workspaces_ownerId ON workspaces(ownerId);
CREATE INDEX idx_workspaces_status ON workspaces(status);
CREATE INDEX idx_workspaces_createdAt ON workspaces(createdAt DESC);

-- Channels table
CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspaceId UUID NOT NULL,
    name VARCHAR(100) NOT NULL CHECK(length(name) >= 1),
    type VARCHAR(20) NOT NULL CHECK(type IN ('public', 'private', 'direct')),
    purpose TEXT,
    topic VARCHAR(200),
    ownerId UUID NOT NULL,
    isArchived BOOLEAN NOT NULL DEFAULT false,
    lastActivityAt TIMESTAMP NOT NULL DEFAULT NOW(),
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_workspaceId FOREIGN KEY (workspaceId) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_channels_workspaceId ON channels(workspaceId);
CREATE INDEX idx_channels_type ON channels(type);
CREATE INDEX idx_channels_isArchived ON channels(isArchived);
CREATE INDEX idx_channels_lastActivityAt ON channels(lastActivityAt DESC);
CREATE UNIQUE INDEX idx_channels_workspace_name ON channels(workspaceId, name) WHERE isArchived = false;

-- Messages table (with partitioning)
CREATE TABLE messages (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    channelId UUID NOT NULL,
    authorId UUID NOT NULL,
    content TEXT NOT NULL CHECK(length(content) >= 1 AND length(content) <= 10000),
    type VARCHAR(20) NOT NULL DEFAULT 'text' CHECK(type IN ('text', 'file', 'system')),
    threadId UUID,
    editedAt TIMESTAMP,
    deletedAt TIMESTAMP,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, createdAt)
) PARTITION BY RANGE (createdAt);

-- Create monthly partitions (automated in operations)
CREATE TABLE messages_2025_10 PARTITION OF messages
FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

CREATE TABLE messages_2025_11 PARTITION OF messages
FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

CREATE INDEX idx_messages_channelId_createdAt ON messages(channelId, createdAt DESC);
CREATE INDEX idx_messages_authorId ON messages(authorId);
CREATE INDEX idx_messages_threadId ON messages(threadId);

-- Other tables follow the same pattern...
```

---

## パフォーマンス最適化

### 1. インデックス戦略

**複合インデックス**:
- `idx_messages_channelId_createdAt`: メッセージ一覧取得（チャネル別、時系列降順）
- `idx_notifications_recipientId_isRead`: 未読通知の取得

**部分インデックス**:
- `idx_channels_workspace_name WHERE isArchived = false`: アクティブなチャネル名の一意性チェック
- `idx_messages_deletedAt WHERE deletedAt IS NULL`: 論理削除されていないメッセージの検索

**全文検索インデックス（PostgreSQL）**:
```sql
CREATE INDEX idx_documents_content_fts ON documents
  USING gin(to_tsvector('english', content));

CREATE INDEX idx_documents_title_fts ON documents
  USING gin(to_tsvector('english', title));
```

**使用例**:
```sql
SELECT * FROM documents
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'architecture & design')
ORDER BY publishedAt DESC
LIMIT 20;
```

---

### 2. パーティション戦略

**messagesテーブルのパーティション**:
- **戦略**: 日付ベースの月次パーティション
- **理由**: メッセージは時系列データであり、古いデータへのアクセスは少ない
- **メリット**: クエリパフォーマンス向上、古いデータのアーカイブが容易

**自動パーティション作成スクリプト（Cron）**:
```sql
-- 翌月のパーティションを作成
DO $$
DECLARE
    next_month DATE := DATE_TRUNC('month', NOW() + INTERVAL '1 month');
    partition_name TEXT := 'messages_' || TO_CHAR(next_month, 'YYYY_MM');
    start_date TEXT := TO_CHAR(next_month, 'YYYY-MM-DD');
    end_date TEXT := TO_CHAR(next_month + INTERVAL '1 month', 'YYYY-MM-DD');
BEGIN
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF messages FOR VALUES FROM (%L) TO (%L)',
                   partition_name, start_date, end_date);
END $$;
```

---

### 3. クエリ最適化例

**メッセージ一覧取得（ページネーション）**:
```sql
-- カーソルベースページネーション
SELECT m.id, m.channelId, m.authorId, m.content, m.type, m.createdAt
FROM messages m
WHERE m.channelId = :channelId
  AND m.deletedAt IS NULL
  AND m.createdAt < :cursor
ORDER BY m.createdAt DESC
LIMIT 50;
```

**未読通知の取得**:
```sql
SELECT n.id, n.type, n.title, n.message, n.createdAt
FROM notifications n
WHERE n.recipientId = :userId
  AND n.isRead = false
ORDER BY n.createdAt DESC
LIMIT 20;
```

**ドキュメント全文検索**:
```sql
SELECT d.id, d.title, ts_rank(to_tsvector('english', d.content), query) AS rank
FROM documents d,
     to_tsquery('english', :searchQuery) query
WHERE d.workspaceId = :workspaceId
  AND d.status = 'published'
  AND to_tsvector('english', d.content) @@ query
ORDER BY rank DESC
LIMIT 20;
```

---

## 運用設計

### 1. バックアップ戦略

**フルバックアップ**:
- 頻度: 日次（深夜2時）
- 保管期間: 30日間

**差分バックアップ**:
- 頻度: 1時間ごと
- 保管期間: 7日間

**バックアップスクリプト（PostgreSQL）**:
```bash
#!/bin/bash
BACKUP_DIR="/backup/collaboration"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump -U postgres -h localhost -d collaboration_db \
  --format=custom \
  --file="${BACKUP_DIR}/collaboration_${DATE}.dump"

# 古いバックアップの削除（30日以前）
find ${BACKUP_DIR} -name "*.dump" -mtime +30 -delete
```

---

### 2. データ保持ポリシー

| データ種別 | 保持期間 | アーカイブ方法 |
|-----------|---------|--------------|
| メッセージ（アクティブチャネル） | 無制限 | - |
| メッセージ（アーカイブチャネル） | 1年 | パーティション削除 |
| ドキュメントバージョン | 最大100バージョン | 古いバージョンを削除 |
| 通知 | 3ヶ月 | 定期削除 |
| 会議記録 | 無制限 | - |
| ファイル添付 | 無制限 | S3 Glacier（本番環境） |

**古いデータ削除スクリプト**:
```sql
-- 3ヶ月以前の既読通知を削除
DELETE FROM notifications
WHERE isRead = true
  AND createdAt < NOW() - INTERVAL '3 months';

-- アーカイブチャネルの1年以前のメッセージを削除
DELETE FROM messages
WHERE channelId IN (SELECT id FROM channels WHERE isArchived = true)
  AND createdAt < NOW() - INTERVAL '1 year';
```

---

### 3. 監視項目

**パフォーマンス監視**:
- 平均クエリ実行時間
- スロークエリ（> 1秒）
- 接続数
- デッドロック発生数

**容量監視**:
- テーブルサイズ
- インデックスサイズ
- ワークスペース別ストレージ使用量
- パーティション別サイズ

**監視クエリ**:
```sql
-- テーブルサイズの確認
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- スロークエリの確認
SELECT query, calls, mean_exec_time, max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

### 4. メンテナンス

**定期メンテナンス（週次）**:
```sql
-- VACUUM ANALYZE（統計情報の更新）
VACUUM ANALYZE workspaces;
VACUUM ANALYZE channels;
VACUUM ANALYZE messages;
VACUUM ANALYZE documents;

-- インデックスの再構築
REINDEX TABLE messages;
REINDEX TABLE documents;
```

**ストレージ容量チェック**:
```sql
-- ワークスペース別ストレージ使用量の更新
UPDATE workspaces w
SET storageUsed = (
    SELECT COALESCE(SUM(fa.filesize), 0)
    FROM file_attachments fa
    JOIN messages m ON fa.messageId = m.id
    JOIN channels c ON m.channelId = c.id
    WHERE c.workspaceId = w.id
);
```

---

## セキュリティ設計

### 1. アクセス制御

**ロール定義**:
```sql
-- 読み取り専用ロール
CREATE ROLE collaboration_read;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO collaboration_read;

-- 書き込みロール
CREATE ROLE collaboration_write;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO collaboration_write;

-- 管理者ロール
CREATE ROLE collaboration_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO collaboration_admin;
```

---

### 2. データ暗号化

**保存時暗号化**:
- PostgreSQL: Transparent Data Encryption (TDE) または pgcrypto拡張
- SQLite: SQLCipher（開発環境は平文でも可）

**通信時暗号化**:
- SSL/TLS接続（PostgreSQL）
- 証明書検証

**接続文字列例**:
```
postgresql://user:password@host:5432/collaboration_db?sslmode=require
```

---

### 3. 監査ログ

**重要テーブルのトリガー**:
```sql
-- ワークスペース削除の監査ログ
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tableName VARCHAR(50) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    recordId UUID NOT NULL,
    userId UUID,
    oldData JSONB,
    newData JSONB,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION audit_workspace_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (tableName, operation, recordId, oldData)
        VALUES ('workspaces', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_workspace_delete
AFTER DELETE ON workspaces
FOR EACH ROW EXECUTE FUNCTION audit_workspace_changes();
```

---

## 付録

### A. データ型マッピング

| パラソル型 | SQLite | PostgreSQL |
|-----------|--------|------------|
| UUID | TEXT | UUID |
| STRING_N | TEXT | VARCHAR(N) |
| TEXT | TEXT | TEXT |
| TIMESTAMP | TEXT | TIMESTAMP |
| INTEGER | INTEGER | INTEGER |
| BIGINT | INTEGER | BIGINT |
| BOOLEAN | INTEGER | BOOLEAN |
| ENUM | TEXT | VARCHAR |

### B. サンプルデータ投入

```sql
-- ワークスペース
INSERT INTO workspaces (id, name, organizationId, ownerId, plan, storageLimit)
VALUES
('ws-001', 'プロジェクトAワークスペース', 'org-001', 'user-001', 'premium', 107374182400);

-- チャネル
INSERT INTO channels (id, workspaceId, name, type, purpose, ownerId)
VALUES
('ch-001', 'ws-001', 'general', 'public', '一般的な議論', 'user-001'),
('ch-002', 'ws-001', 'random', 'public', '雑談', 'user-001');

-- メッセージ
INSERT INTO messages (id, channelId, authorId, content)
VALUES
('msg-001', 'ch-001', 'user-001', 'プロジェクトが開始されました！'),
('msg-002', 'ch-001', 'user-002', 'よろしくお願いします。');
```

---

## まとめ

このデータベース設計は以下の特徴を持ちます：

1. **パラソルドメイン言語準拠**: domain-language.mdのエンティティ定義に忠実
2. **集約単位の設計**: DDD集約に基づいたテーブル構成
3. **スケーラビリティ**: パーティション、インデックス戦略による高性能化
4. **運用性**: バックアップ、監視、メンテナンスの仕組み
5. **セキュリティ**: アクセス制御、暗号化、監査ログ
6. **将来拡張性**: PostgreSQLへの移行を見据えた設計

本設計により、コラボレーション促進サービスの高品質なデータ管理が実現されます。
