# BC-007: データ設計

**BC**: Team Communication & Collaboration
**作成日**: 2025-10-31
**V2移行元**: services/collaboration-facilitation-service/database-design.md

---

## 概要

このドキュメントは、BC-007（チームコミュニケーションとコラボレーション）のデータモデルとデータベース設計を定義します。

---

## 主要テーブル

### messages
メッセージ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | メッセージID |
| sender_id | UUID | FK → users（BC-003）, NOT NULL | 送信者ID |
| content | TEXT | NOT NULL | 内容 |
| channel | VARCHAR(20) | NOT NULL | チャネル（chat/email/sms） |
| status | VARCHAR(20) | NOT NULL | 状態（draft/sent/delivered/read） |
| sent_at | TIMESTAMP | | 送信日時 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: sender_id, channel, sent_at

---

### notifications
通知

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 通知ID |
| title | VARCHAR(200) | NOT NULL | タイトル |
| message | TEXT | NOT NULL | メッセージ |
| priority | VARCHAR(20) | NOT NULL | 優先度（low/normal/high/urgent） |
| type | VARCHAR(50) | NOT NULL | タイプ |
| status | VARCHAR(20) | NOT NULL | 状態（pending/sent/delivered/read） |
| source_bc | VARCHAR(50) | | 発信元BC |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| sent_at | TIMESTAMP | | 送信日時 |

**インデックス**: priority, status, created_at

---

### notification_recipients
通知受信者

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 受信者ID |
| notification_id | UUID | FK → notifications, NOT NULL | 通知ID |
| recipient_id | UUID | FK → users（BC-003）, NOT NULL | 受信者ID |
| read_at | TIMESTAMP | | 既読日時 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: notification_id, recipient_id

---

### meetings
会議

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 会議ID |
| title | VARCHAR(200) | NOT NULL | タイトル |
| start_time | TIMESTAMP | NOT NULL | 開始時刻 |
| end_time | TIMESTAMP | NOT NULL | 終了時刻 |
| location | VARCHAR(200) | | 場所 |
| online_url | VARCHAR(500) | | オンラインURL |
| status | VARCHAR(20) | NOT NULL | 状態（scheduled/in_progress/completed/cancelled） |
| organizer_id | UUID | FK → users（BC-003）, NOT NULL | 主催者ID |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: start_time, organizer_id, status

---

### meeting_participants
会議参加者

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 参加者ID |
| meeting_id | UUID | FK → meetings, NOT NULL | 会議ID |
| participant_id | UUID | FK → users（BC-003）, NOT NULL | 参加者ID |
| response_status | VARCHAR(20) | NOT NULL | 返答状態（accepted/declined/tentative/no_response） |
| attended | BOOLEAN | DEFAULT false | 出席フラグ |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: meeting_id, participant_id

---

### workspaces
ワークスペース

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | ワークスペースID |
| name | VARCHAR(200) | NOT NULL | 名前 |
| description | TEXT | | 説明 |
| project_id | UUID | FK → projects（BC-001） | プロジェクトID |
| owner_id | UUID | FK → users（BC-003）, NOT NULL | オーナーID |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: project_id, owner_id

---

### workspace_members
ワークスペースメンバー

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | メンバーID |
| workspace_id | UUID | FK → workspaces, NOT NULL | ワークスペースID |
| user_id | UUID | FK → users（BC-003）, NOT NULL | ユーザーID |
| role | VARCHAR(50) | NOT NULL | ロール（owner/editor/viewer） |
| joined_at | TIMESTAMP | NOT NULL | 参加日時 |

**インデックス**: workspace_id, user_id

---

## データフロー

### 通知配信フロー
```
1. notifications テーブルにINSERT（status = pending）
2. notification_recipients テーブルに受信者INSERT
3. 優先度に応じた配信処理
   - urgent: 即座配信（10秒以内）
   - high: 優先配信（1分以内）
   - normal/low: バッチ配信
4. 配信完了後、status = sent に更新
5. 受信者が既読時、read_at を更新
```

### 会議作成フロー
```
1. meetings テーブルにINSERT
2. meeting_participants テーブルに参加者INSERT
3. 通知配信（notifications テーブル経由）
4. 参加者の返答時、response_status を更新
5. 会議終了後、attended フラグを更新
```

---

**ステータス**: Phase 0 - 基本構造作成完了
