# 統合仕様: コラボレーション促進サービス

**バージョン**: 1.0.0
**更新日**: 2025-10-01

## 1. サービス依存関係

### 1.1 依存サービス（このサービスが依存する外部サービス）

#### セキュアアクセスサービス
- **依存理由**: ユーザー認証、認可、組織情報の取得
- **連携方式**: REST API（同期呼び出し）
- **重要度**: High（必須）
- **フェイルオーバー**: 認証キャッシュによる一時的な動作継続（最大15分）

**連携内容**:
- ユーザー認証・JWT検証
- ユーザー情報取得
- 組織情報取得
- ロール・権限確認
- 監査ログ記録

**API例**:
```
GET /v1/auth/verify-token
GET /v1/users/{id}
GET /v1/organizations/{id}
GET /v1/users/{id}/permissions
POST /v1/audit-logs
```

#### プロジェクト成功支援サービス
- **依存理由**: プロジェクト情報の取得、プロジェクトチャネルの自動作成
- **連携方式**: REST API（同期）+ イベント駆動（非同期）
- **重要度**: Medium（機能によっては必須）
- **フェイルオーバー**: キャッシュデータによる読み取り継続

**連携内容**:
- プロジェクト情報取得
- プロジェクトメンバー一覧取得
- プロジェクト作成時のチャネル自動生成
- プロジェクト状態変更の通知

**API例**:
```
GET /v1/projects/{id}
GET /v1/projects/{id}/members
POST /v1/projects/{id}/channels (逆方向)
```

#### ナレッジ共創サービス
- **依存理由**: ドキュメントのナレッジベース化、タグ付け、検索連携
- **連携方式**: REST API（非同期）+ イベント駆動
- **重要度**: Low（機能拡張的）
- **フェイルオーバー**: 連携なしでも基本機能は動作

**連携内容**:
- ドキュメントのナレッジ記事化
- タグ・カテゴリ情報の取得
- ナレッジ検索結果の統合
- ベストプラクティス抽出

**API例**:
```
POST /v1/knowledge/articles/from-document
GET /v1/knowledge/tags
GET /v1/knowledge/search?q={query}
```

#### 生産性可視化サービス
- **依存理由**: コラボレーション活動の分析・可視化
- **連携方式**: イベント駆動（非同期）
- **重要度**: Low（分析・レポーティング用）
- **フェイルオーバー**: イベント送信失敗時はキューに保存

**連携内容**:
- メッセージ投稿数の記録
- ドキュメント編集時間の記録
- 会議参加時間の記録
- コラボレーション指標の提供

**イベント送信**:
- MessagePosted
- DocumentPublished
- MeetingCompleted
- ChannelCreated

---

### 1.2 依存されるサービス（このサービスを利用する外部サービス）

#### プロジェクト成功支援サービス
- **利用内容**: プロジェクトチャネルの作成・管理
- **連携方式**: REST API呼び出し

#### ナレッジ共創サービス
- **利用内容**: ドキュメントの共同編集基盤として利用
- **連携方式**: REST API + ドメインイベント購読

#### 生産性可視化サービス
- **利用内容**: コラボレーション活動データの収集
- **連携方式**: ドメインイベント購読

---

## 2. 提供ドメインイベント

### 2.1 WorkspaceCreated
**トリガー**: ワークスペースが作成された時
**発行タイミング**: ワークスペース作成トランザクション完了後
**購読者**: 生産性可視化サービス、セキュアアクセスサービス（監査ログ）

**ペイロード**:
```json
{
  "eventId": "uuid",
  "eventType": "WorkspaceCreated",
  "aggregateId": "workspace-uuid",
  "occurredAt": "2025-10-01T10:00:00Z",
  "payload": {
    "workspaceId": "uuid",
    "name": "プロジェクトAワークスペース",
    "organizationId": "uuid",
    "ownerId": "uuid",
    "plan": "premium",
    "createdBy": "uuid"
  }
}
```

**ビジネス意義**: 組織内の新しいコラボレーションスペースが確立された

---

### 2.2 ChannelCreated
**トリガー**: チャネルが作成された時
**発行タイミング**: チャネル作成トランザクション完了後
**購読者**: プロジェクト成功支援サービス、生産性可視化サービス

**ペイロード**:
```json
{
  "eventId": "uuid",
  "eventType": "ChannelCreated",
  "aggregateId": "channel-uuid",
  "occurredAt": "2025-10-01T10:05:00Z",
  "payload": {
    "channelId": "uuid",
    "workspaceId": "uuid",
    "name": "general",
    "type": "public",
    "creatorId": "uuid",
    "initialMemberCount": 10
  }
}
```

**ビジネス意義**: 新しいコミュニケーションチャネルが開設された

---

### 2.3 MessagePosted
**トリガー**: メッセージが投稿された時
**発行タイミング**: メッセージ保存完了後（リアルタイム）
**購読者**: 生産性可視化サービス、ナレッジ共創サービス（重要メッセージの場合）

**ペイロード**:
```json
{
  "eventId": "uuid",
  "eventType": "MessagePosted",
  "aggregateId": "message-uuid",
  "occurredAt": "2025-10-01T10:30:00Z",
  "payload": {
    "messageId": "uuid",
    "channelId": "uuid",
    "workspaceId": "uuid",
    "authorId": "uuid",
    "content": "メッセージ内容",
    "type": "text",
    "mentions": ["uuid1", "uuid2"],
    "hasAttachments": true,
    "attachmentCount": 2
  }
}
```

**ビジネス意義**: チーム内でコミュニケーションが発生した

---

### 2.4 DocumentPublished
**トリガー**: ドキュメントが公開された時
**発行タイミング**: ドキュメント公開トランザクション完了後
**購読者**: ナレッジ共創サービス、プロジェクト成功支援サービス、生産性可視化サービス

**ペイロード**:
```json
{
  "eventId": "uuid",
  "eventType": "DocumentPublished",
  "aggregateId": "document-uuid",
  "occurredAt": "2025-10-01T11:00:00Z",
  "payload": {
    "documentId": "uuid",
    "workspaceId": "uuid",
    "title": "プロジェクト設計ドキュメント",
    "type": "markdown",
    "publisherId": "uuid",
    "version": 3,
    "tags": ["設計", "アーキテクチャ"],
    "collaboratorCount": 5
  }
}
```

**ビジネス意義**: 重要な知識・情報が組織内で共有された

---

### 2.5 DocumentUpdated
**トリガー**: 公開済みドキュメントが更新された時
**発行タイミング**: ドキュメント更新トランザクション完了後
**購読者**: ナレッジ共創サービス、プロジェクト成功支援サービス

**ペイロード**:
```json
{
  "eventId": "uuid",
  "eventType": "DocumentUpdated",
  "aggregateId": "document-uuid",
  "occurredAt": "2025-10-01T12:00:00Z",
  "payload": {
    "documentId": "uuid",
    "workspaceId": "uuid",
    "updaterId": "uuid",
    "previousVersion": 3,
    "currentVersion": 4,
    "changeNote": "セクション5を追加",
    "significantChange": true
  }
}
```

**ビジネス意義**: 既存の知識が更新・改善された

---

### 2.6 MeetingScheduled
**トリガー**: 会議がスケジュールされた時
**発行タイミング**: 会議作成トランザクション完了後
**購読者**: プロジェクト成功支援サービス、生産性可視化サービス

**ペイロード**:
```json
{
  "eventId": "uuid",
  "eventType": "MeetingScheduled",
  "aggregateId": "meeting-uuid",
  "occurredAt": "2025-10-01T09:00:00Z",
  "payload": {
    "meetingId": "uuid",
    "workspaceId": "uuid",
    "title": "週次進捗会議",
    "hostId": "uuid",
    "scheduledStart": "2025-10-05T14:00:00Z",
    "scheduledEnd": "2025-10-05T15:00:00Z",
    "participantIds": ["uuid1", "uuid2", "uuid3"],
    "type": "video"
  }
}
```

**ビジネス意義**: チーム会議が計画された

---

### 2.7 MeetingCompleted
**トリガー**: 会議が完了した時
**発行タイミング**: 会議終了処理完了後
**購読者**: プロジェクト成功支援サービス、生産性可視化サービス、ナレッジ共創サービス

**ペイロード**:
```json
{
  "eventId": "uuid",
  "eventType": "MeetingCompleted",
  "aggregateId": "meeting-uuid",
  "occurredAt": "2025-10-05T15:00:00Z",
  "payload": {
    "meetingId": "uuid",
    "workspaceId": "uuid",
    "actualStart": "2025-10-05T14:02:00Z",
    "actualEnd": "2025-10-05T14:58:00Z",
    "duration": 56,
    "participantCount": 8,
    "attendedCount": 7,
    "recordingAvailable": true,
    "recordingUrl": "https://storage.example.com/recordings/abc123.mp4",
    "minutesDocumentId": "uuid"
  }
}
```

**ビジネス意義**: 会議が実施され、議論の成果が記録された

---

### 2.8 MemberMentioned
**トリガー**: メッセージ内でユーザーがメンションされた時
**発行タイミング**: メッセージ投稿直後（リアルタイム）
**購読者**: セキュアアクセスサービス（通知配信）

**ペイロード**:
```json
{
  "eventId": "uuid",
  "eventType": "MemberMentioned",
  "aggregateId": "message-uuid",
  "occurredAt": "2025-10-01T10:30:00Z",
  "payload": {
    "messageId": "uuid",
    "channelId": "uuid",
    "workspaceId": "uuid",
    "mentionedUserId": "uuid",
    "authorId": "uuid",
    "messageSnippet": "@user プロジェクトの進捗について..."
  }
}
```

**ビジネス意義**: 特定のメンバーに対してアクションが求められている

---

### 2.9 CollaborationSessionStarted
**トリガー**: ドキュメントの共同編集セッションが開始された時
**発行タイミング**: 2人目の編集者がドキュメントを開いた時
**購読者**: 生産性可視化サービス

**ペイロード**:
```json
{
  "eventId": "uuid",
  "eventType": "CollaborationSessionStarted",
  "aggregateId": "document-uuid",
  "occurredAt": "2025-10-01T13:00:00Z",
  "payload": {
    "documentId": "uuid",
    "workspaceId": "uuid",
    "participantIds": ["uuid1", "uuid2"]
  }
}
```

**ビジネス意義**: チームメンバー間で積極的なコラボレーションが発生している

---

## 3. 購読ドメインイベント

### 3.1 ProjectCreated（プロジェクト成功支援サービス）
**発行元**: プロジェクト成功支援サービス
**処理内容**: プロジェクト専用ワークスペースとチャネルを自動作成

**処理フロー**:
1. イベントを受信
2. プロジェクト情報を取得（REST API呼び出し）
3. ワークスペースを作成（プロジェクト名ベース）
4. デフォルトチャネルを作成（general, announcements, issues）
5. プロジェクトメンバーをチャネルに自動招待
6. プロジェクトにワークスペースIDを通知（REST API）

**エラーハンドリング**:
- プロジェクト情報取得失敗 → リトライ（3回、指数バックオフ）
- ワークスペース作成失敗 → アラート通知、手動作成フローへ誘導

---

### 3.2 ProjectMemberAdded（プロジェクト成功支援サービス）
**発行元**: プロジェクト成功支援サービス
**処理内容**: プロジェクトワークスペースに新メンバーを追加

**処理フロー**:
1. イベントを受信
2. プロジェクトIDからワークスペースIDを取得
3. ワークスペース内の主要チャネルにメンバーを追加
4. ウェルカムメッセージを送信
5. ドキュメントへのアクセス権限を付与

**ビジネスルール**:
- PMロール → 全チャネルにadmin権限で追加
- メンバー → publicチャネルにmember権限で追加
- クライアント → 特定チャネルのみobserver権限で追加

---

### 3.3 TaskStatusChanged（プロジェクト成功支援サービス）
**発行元**: プロジェクト成功支援サービス
**処理内容**: タスク状態変更を関連チャネルに通知

**処理フロー**:
1. イベントを受信
2. タスクが属するプロジェクトのワークスペースを特定
3. 該当チャネルにシステムメッセージを投稿
4. タスク担当者にメンションして通知

**通知例**:
```
[システム] タスク「APIエンドポイント実装」が「完了」に変更されました
担当: @山田太郎 | プロジェクト: DX推進プロジェクト
```

---

### 3.4 KnowledgeArticleCreated（ナレッジ共創サービス）
**発行元**: ナレッジ共創サービス
**処理内容**: ナレッジ記事をワークスペース内で共有通知

**処理フロー**:
1. イベントを受信
2. 関連ワークスペースを特定
3. generalチャネルに記事共有メッセージを投稿
4. タグに基づいて関連するチャネルにも通知

**通知例**:
```
📚 新しいナレッジ記事が公開されました
タイトル: 「効果的なプロジェクト進捗会議の進め方」
カテゴリ: ベストプラクティス | タグ: #プロジェクト管理, #会議運営
```

---

### 3.5 UserDeactivated（セキュアアクセスサービス）
**発行元**: セキュアアクセスサービス
**処理内容**: 無効化されたユーザーをすべてのチャネルから削除

**処理フロー**:
1. イベントを受信
2. ユーザーが所属する全ワークスペースを取得
3. 各ワークスペース内の全チャネルからメンバーを削除
4. ユーザーが作成したドキュメントの所有権を移譲
5. ユーザーがホストの会議をキャンセルまたは再割り当て

**データ保持**:
- メッセージ履歴 → 保持（匿名化オプション）
- ドキュメント → 保持（作成者表記は維持）
- 会議記録 → 保持

---

## 4. 同期API呼び出し

### 4.1 セキュアアクセスサービス.VerifyToken
**目的**: リクエストごとのJWT検証とユーザー情報取得
**タイミング**: 全APIリクエストの前処理
**エンドポイント**: `GET /v1/auth/verify-token`
**呼び出し頻度**: 全APIリクエスト（ただしRedisキャッシュで軽減）

**リクエスト**:
```http
GET /v1/auth/verify-token
Authorization: Bearer {jwt_token}
```

**レスポンス**:
```json
{
  "valid": true,
  "userId": "uuid",
  "email": "user@example.com",
  "role": "Consultant",
  "organizationId": "uuid",
  "expiresAt": "2025-10-02T10:00:00Z"
}
```

**エラーハンドリング**:
- タイムアウト（500ms）→ キャッシュデータで一時的に動作継続
- 401 Unauthorized → クライアントに即座に返却
- 5xx エラー → リトライ（1回のみ）

**キャッシュ戦略**:
- Redis: キー = `auth:token:{hash}`, TTL = 15分
- 無効化: ログアウト時、パスワード変更時

---

### 4.2 セキュアアクセスサービス.GetUserProfile
**目的**: ユーザープロファイル情報の取得（表示名、アバター等）
**タイミング**: メッセージ一覧取得時、ドキュメント作成者表示時
**エンドポイント**: `GET /v1/users/{id}`
**呼び出し頻度**: 中〜高（バッチ取得で最適化）

**リクエスト**:
```http
GET /v1/users/{userId}
```

**レスポンス**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "山田太郎",
  "avatarUrl": "https://storage.example.com/avatars/abc.jpg",
  "role": "Consultant",
  "organizationId": "uuid"
}
```

**最適化**:
- バッチ取得: `GET /v1/users?ids=uuid1,uuid2,uuid3`
- キャッシュ: Redis, TTL = 15分

---

### 4.3 プロジェクト成功支援サービス.GetProject
**目的**: プロジェクト情報取得（プロジェクトチャネル作成時）
**タイミング**: ProjectCreatedイベント受信時
**エンドポイント**: `GET /v1/projects/{id}`

**リクエスト**:
```http
GET /v1/projects/{projectId}
Authorization: Bearer {service_token}
```

**レスポンス**:
```json
{
  "id": "uuid",
  "name": "DX推進プロジェクト",
  "code": "DX001",
  "members": [
    {
      "userId": "uuid",
      "role": "pm"
    }
  ]
}
```

**エラーハンドリング**:
- 404 Not Found → イベント処理を中断、アラート
- タイムアウト → リトライ（3回、指数バックオフ）

---

### 4.4 プロジェクト成功支援サービス.LinkWorkspace
**目的**: プロジェクトとワークスペースを紐付け
**タイミング**: プロジェクト用ワークスペース作成完了後
**エンドポイント**: `PUT /v1/projects/{id}/workspace`

**リクエスト**:
```http
PUT /v1/projects/{projectId}/workspace
Content-Type: application/json
Authorization: Bearer {service_token}

{
  "workspaceId": "uuid"
}
```

**レスポンス**:
```json
{
  "success": true,
  "message": "Workspace linked to project"
}
```

---

### 4.5 ナレッジ共創サービス.CreateArticleFromDocument
**目的**: 公開ドキュメントをナレッジ記事化
**タイミング**: DocumentPublishedイベント受信後（ユーザーがナレッジ化を選択した場合）
**エンドポイント**: `POST /v1/knowledge/articles/from-document`

**リクエスト**:
```http
POST /v1/knowledge/articles/from-document
Content-Type: application/json
Authorization: Bearer {service_token}

{
  "documentId": "uuid",
  "title": "プロジェクト設計ドキュメント",
  "content": "...",
  "tags": ["設計", "アーキテクチャ"],
  "category": "ベストプラクティス"
}
```

**非同期処理**: 非同期ジョブキューで実行（即座のレスポンスは不要）

---

## 5. 非同期パターン

### 5.1 イベント駆動アーキテクチャ
**パターン**: Publish-Subscribe（Pub/Sub）
**実装**: メッセージブローカー（RabbitMQ / AWS SNS+SQS / Google Pub/Sub）

**イベントフロー**:
```
[コラボレーション促進サービス]
  ↓ イベント発行
[メッセージブローカー]
  ↓ ファンアウト
[生産性可視化サービス] [ナレッジ共創サービス] [プロジェクト成功支援サービス]
```

**利点**:
- 疎結合: サービス間の直接依存を削減
- スケーラビリティ: 購読者が独立してスケール可能
- 信頼性: メッセージ永続化により再送可能

**設定**:
- **Exchange**: `collaboration.events` (Topic Exchange)
- **Routing Key**: `{eventType}.{aggregateType}`
  - 例: `message.posted.channel`, `document.published.workspace`
- **DLQ（Dead Letter Queue）**: 失敗イベントの退避

---

### 5.2 CQRS（Command Query Responsibility Segregation）
**パターン**: 書き込み（Command）と読み取り（Query）の分離

**適用箇所**:
- **メッセージ検索**: 書き込みDBとは別に検索専用のElasticsearchインデックスを構築
- **ドキュメント全文検索**: PostgreSQL Full-Text Search または Elasticsearchを利用

**イベントソーシング連携**:
1. MessagePostedイベント発行
2. イベントハンドラーが検索インデックスを更新
3. 検索クエリは検索DBから直接取得（メインDBに負荷をかけない）

---

### 5.3 Saga パターン
**パターン**: 分散トランザクション管理（長期実行トランザクション）

**適用例**: プロジェクト用ワークスペース作成フロー

**ステップ**:
1. **Workspace作成** → 成功 → 次へ
2. **デフォルトチャネル作成** → 成功 → 次へ
3. **メンバー招待** → 成功 → 次へ
4. **プロジェクトへのリンク** → 成功 → 完了

**補償トランザクション（ロールバック）**:
- ステップ4失敗 → メンバー削除
- ステップ3失敗 → チャネル削除
- ステップ2失敗 → ワークスペース削除

**実装**:
- Saga Orchestrator（中央管理型）
- 状態管理テーブル: `saga_instances`

---

### 5.4 リトライ・Circuit Breaker パターン
**パターン**: 障害時の自動復旧と障害拡大防止

**リトライ戦略**:
- **指数バックオフ**: 1秒 → 2秒 → 4秒 → 8秒
- **最大リトライ回数**: 3回
- **ジッター**: ランダムな遅延を追加（サンダリングハード回避）

**Circuit Breaker**:
- **状態**: Closed（正常） → Open（遮断） → Half-Open（試行）
- **遮断条件**: 10秒間に5回以上の失敗
- **復旧試行**: 30秒後にHalf-Openに移行、1回成功でClosedに復帰

**適用対象**:
- セキュアアクセスサービスへのAPI呼び出し
- プロジェクト成功支援サービスへのAPI呼び出し

---

### 5.5 WebSocket接続管理
**パターン**: リアルタイム双方向通信

**接続フロー**:
1. クライアントがWebSocket接続リクエスト（JWT付き）
2. サーバーがJWT検証（セキュアアクセスサービス経由）
3. 接続確立、ユーザーIDとコネクションIDをマッピング
4. チャネル購読管理（Redis Pub/Sub）

**スケーリング**:
- **水平スケーリング**: 複数のWebSocketサーバー
- **セッション管理**: Redis（コネクションID → ユーザーID）
- **メッセージブロードキャスト**: Redis Pub/Sub

**切断処理**:
- プレゼンス更新（オンライン → オフライン）
- タイムアウト: 30秒無通信で切断
- 再接続: 指数バックオフで自動再接続

---

## 6. データ整合性戦略

### 6.1 結果整合性（Eventual Consistency）
**適用範囲**: サービス間のデータ同期

**例**: ドキュメント公開 → ナレッジ記事化
- コラボレーション促進サービス: ドキュメントを即座に公開
- ナレッジ共創サービス: イベント受信後、数秒〜数分で記事化
- ユーザー体験: 「ナレッジ化処理中...」表示

**整合性保証**:
- イベントの冪等性: 同じイベントを複数回処理しても結果が同じ
- イベントID管理: 処理済みイベントをDBに記録

---

### 6.2 分散ロック
**適用範囲**: 同時編集の競合制御

**実装**: Redis分散ロック（Redlock アルゴリズム）

**例**: ドキュメント同時編集
```
ユーザーA: ロック取得 → 編集 → ロック解放
ユーザーB: ロック取得待ち → ロック取得 → 編集
```

**ロック設定**:
- TTL: 30秒（編集操作の最大時間）
- 延長: 編集中は15秒ごとにTTL延長
- デッドロック回避: TTL切れで自動解放

---

## 7. エラーハンドリング・監視

### 7.1 エラー分類と対応

| エラー種別 | 対応方針 | アラート |
|-----------|---------|---------|
| ネットワークタイムアウト | 自動リトライ（3回） | 3回失敗で通知 |
| 認証エラー（401） | 即座に失敗、クライアントへ返却 | なし |
| 権限エラー（403） | 即座に失敗、クライアントへ返却 | なし |
| 依存サービスダウン（503） | Circuit Breaker発動、代替処理 | 即座に通知 |
| データ不整合 | ロールバック、管理者通知 | 即座に通知 |

---

### 7.2 監視指標

**API監視**:
- リクエスト数（1分あたり）
- エラー率（%）
- レスポンスタイム（p50, p95, p99）

**イベント監視**:
- イベント発行数
- イベント処理遅延（秒）
- DLQ滞留数

**WebSocket監視**:
- 同時接続数
- 接続・切断率
- メッセージ配信遅延

**依存サービス監視**:
- セキュアアクセスサービス応答時間
- プロジェクト成功支援サービス可用性

---

### 7.3 ログ戦略

**構造化ログ（JSON形式）**:
```json
{
  "timestamp": "2025-10-01T10:30:00Z",
  "level": "INFO",
  "service": "collaboration-facilitation",
  "traceId": "uuid",
  "spanId": "uuid",
  "userId": "uuid",
  "action": "message.posted",
  "channelId": "uuid",
  "duration": 45,
  "success": true
}
```

**ログレベル**:
- **DEBUG**: 開発時のみ
- **INFO**: 通常の処理（メッセージ投稿、ドキュメント公開）
- **WARN**: リトライ、一時的なエラー
- **ERROR**: 処理失敗、予期しないエラー
- **FATAL**: サービス停止レベルの障害

**集約**: CloudWatch Logs / Elasticsearch / Datadog

---

## 8. セキュリティ連携

### 8.1 認証フロー
```
[クライアント]
  ↓ ログイン（email/password）
[セキュアアクセスサービス]
  ↓ JWT発行
[クライアント]
  ↓ APIリクエスト（JWT付き）
[コラボレーション促進サービス]
  ↓ JWT検証（セキュアアクセスサービス経由 or キャッシュ）
[処理実行]
```

---

### 8.2 認可（アクセス制御）

**チャネルアクセス制御**:
- Public: 誰でも参加可能
- Private: メンバーのみアクセス可能
- Direct: 2名の当事者のみ

**ドキュメントアクセス制御**:
- Draft: 作成者のみ編集可能
- Published: ワークスペースメンバーは閲覧可能、編集者は編集可能
- Archived: 閲覧のみ可能

**権限チェック**:
1. JWT検証（ユーザー確認）
2. ワークスペースメンバーシップ確認
3. チャネル/ドキュメント固有の権限確認

---

### 8.3 監査ログ連携

**重要操作の監査ログ記録**（セキュアアクセスサービス経由）:
- ワークスペース作成・削除
- チャネル作成・削除
- ドキュメント公開・削除
- メンバー追加・削除

**ログ送信**:
```http
POST /v1/audit-logs
Content-Type: application/json
Authorization: Bearer {service_token}

{
  "userId": "uuid",
  "action": "workspace.created",
  "resourceType": "workspace",
  "resourceId": "uuid",
  "timestamp": "2025-10-01T10:00:00Z",
  "metadata": {
    "workspaceName": "プロジェクトA",
    "plan": "premium"
  }
}
```

---

## 9. パフォーマンス最適化

### 9.1 キャッシング戦略

**Redis利用**:
- **ユーザープロファイル**: TTL 15分
- **チャネル情報**: TTL 5分
- **メッセージ履歴（直近50件）**: TTL 1分
- **認証トークン**: TTL 15分

**キャッシュ無効化**:
- ユーザープロファイル更新時
- チャネル設定変更時
- メッセージ投稿時（該当チャネルのみ）

---

### 9.2 データベースクエリ最適化

**N+1問題の回避**:
- メッセージ一覧取得時にユーザー情報を一括取得（JOIN）
- バッチ取得API: `GET /v1/users?ids=uuid1,uuid2,uuid3`

**ページネーション**:
- カーソルベース: `GET /messages?before={timestamp}&limit=50`
- インデックス: `createdAt` に降順インデックス

---

### 9.3 WebSocketスケーリング

**水平スケーリング**:
- WebSocketサーバーを複数台起動
- ロードバランサー（ALB）でセッション維持（Sticky Session）

**メッセージブロードキャスト**:
- Redis Pub/Sub: チャネルごとのトピック
- メッセージ受信 → Redis Pub → 全WebSocketサーバーへ配信

---

## 10. テスト戦略

### 10.1 統合テスト
- セキュアアクセスサービスのモックAPI
- イベント発行・購読のテスト（テスト用メッセージブローカー）

### 10.2 契約テスト（Contract Testing）
- Pact: API仕様の互換性確認
- サービス間の契約を事前に定義

---

## 11. 今後の拡張計画

### 11.1 外部サービス連携
- Slack連携: メッセージ同期
- Microsoft Teams連携: チャネル同期
- Zoom連携: 会議自動記録

### 11.2 AI機能統合
- メッセージ要約（AI）
- ドキュメント自動タグ付け
- 会議議事録自動生成

---

## 付録: イベントカタログ

### 発行イベント一覧
1. WorkspaceCreated
2. ChannelCreated
3. MessagePosted
4. DocumentPublished
5. DocumentUpdated
6. MeetingScheduled
7. MeetingCompleted
8. MemberMentioned
9. CollaborationSessionStarted

### 購読イベント一覧
1. ProjectCreated（プロジェクト成功支援）
2. ProjectMemberAdded（プロジェクト成功支援）
3. TaskStatusChanged（プロジェクト成功支援）
4. KnowledgeArticleCreated（ナレッジ共創）
5. UserDeactivated（セキュアアクセス）
