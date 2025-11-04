# OP-001: 協働環境を提供する

**作成日**: 2025-10-31
**所属L3**: L3-003-collaborative-workspace: Collaborative Workspace
**所属BC**: BC-007: Team Communication & Collaboration
**V2移行元**: services/collaboration-facilitation-service/capabilities/provide-collaborative-environment/operations/provide-collaborative-environment

---

## 📋 How: この操作の定義

### 操作の概要
協働環境を提供するを実行し、ビジネス価値を創出する。

### 実現する機能
- 協働環境を提供するに必要な情報の入力と検証
- 協働環境を提供するプロセスの実行と進捗管理
- 結果の記録と関係者への通知
- 監査証跡の記録

### 入力
- 操作実行に必要なビジネス情報
- 実行者の認証情報と権限
- 関連エンティティの参照情報

### 出力
- 操作結果（成功/失敗）
- 更新されたエンティティ情報
- 監査ログと履歴情報
- 次のアクションへのガイダンス

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| ownerId | UUID | Yes | - | UUID形式、BC-003 User参照 | ワークスペース所有者ID |
| workspaceName | STRING_200 | Yes | - | 1-200文字 | ワークスペース名 |
| workspaceType | STRING_20 | Yes | - | project/team/department/private | ワークスペースタイプ |
| description | TEXT | No | \"\" | 最大5000文字 | ワークスペース説明 |
| visibility | STRING_20 | No | 'private' | private/internal/public | 公開範囲 |
| memberIds | Array<UUID> | Yes | - | UUID配列、1-500件 | 初期メンバーID配列 |
| memberRoles | Array | Yes | - | メンバー数と同数 | メンバーロール配列 |
| ├─ memberId | UUID | Yes | - | UUID形式 | メンバーID |
| ├─ role | STRING_20 | Yes | - | owner/admin/editor/viewer | ロール |
| └─ permissions | Array<Enum> | No | ロール別デフォルト | read/write/delete/share/invite | 個別権限 |
| features | Object | No | 全有効 | 機能設定オブジェクト | ワークスペース機能設定 |
| ├─ documentSharing | BOOLEAN | No | true | - | ドキュメント共有機能 |
| ├─ realTimeEditing | BOOLEAN | No | true | - | リアルタイム編集機能 |
| ├─ videoConference | BOOLEAN | No | true | - | ビデオ会議機能 |
| ├─ taskManagement | BOOLEAN | No | true | - | タスク管理機能 |
| └─ activityTracking | BOOLEAN | No | true | - | アクティビティ追跡 |
| storageQuota | INTEGER | No | 10GB | 1GB-1TB | ストレージ容量（バイト） |
| externalIntegrations | Array | No | [] | 最大10件 | 外部連携設定 |
| ├─ serviceName | STRING_20 | Yes | - | slack/github/jira/gdrive | サービス名 |
| ├─ enabled | BOOLEAN | No | true | - | 有効/無効 |
| └─ config | Object | No | {} | JSON形式 | サービス固有設定 |

### バリデーションルール
1. **ownerId**: BC-003のUserエンティティが存在、Active状態
2. **memberIds**: 全員BC-003のUser、重複なし、owner含む
3. **memberRoles**: memberIds数と一致、1人は必ずowner
4. **workspaceType=project**: BC-001のProjectと関連付け推奨
5. **workspaceType=team**: BC-005のTeamと関連付け推奨
6. **visibility=public**: organizationレベルの公開許可確認
7. **storageQuota**: organizationの残容量確認
8. **realTimeEditing=true**: WebSocket接続確立必須

## 📤 出力仕様

### 成功レスポンス
**HTTP 201 Created**
```json
{
  "workspaceId": "uuid",
  "ownerId": "uuid",
  "workspaceName": "プロジェクトX 協働スペース",
  "workspaceType": "project",
  "status": "active",
  "visibility": "private",
  "memberCount": 12,
  "members": [
    {
      "memberId": "uuid1",
      "role": "owner",
      "permissions": ["read", "write", "delete", "share", "invite"],
      "joinedAt": "2025-11-04T10:00:00Z"
    },
    {
      "memberId": "uuid2",
      "role": "admin",
      "permissions": ["read", "write", "delete", "share", "invite"],
      "joinedAt": "2025-11-04T10:00:00Z"
    },
    {
      "memberId": "uuid3",
      "role": "editor",
      "permissions": ["read", "write", "share"],
      "joinedAt": "2025-11-04T10:00:00Z"
    }
  ],
  "features": {
    "documentSharing": true,
    "realTimeEditing": true,
    "videoConference": true,
    "taskManagement": true,
    "activityTracking": true
  },
  "storageQuota": 10737418240,
  "storageUsed": 0,
  "webSocketEndpoint": "wss://ws.example.com/workspaces/uuid",
  "createdAt": "2025-11-04T10:00:00Z",
  "lastActivityAt": "2025-11-04T10:00:00Z"
}
```

### WebSocketリアルタイム同期
```json
{
  "event": "workspace.activity",
  "workspaceId": "uuid",
  "activityType": "document.edited",
  "actor": {
    "userId": "uuid",
    "userName": "山田太郎",
    "role": "editor"
  },
  "target": {
    "documentId": "uuid",
    "documentName": "要件定義書.docx"
  },
  "timestamp": "2025-11-04T10:05:00Z",
  "changes": {
    "section": "3.2 非機能要件",
    "operation": "insert",
    "content": "レスポンスタイム: 2秒以内"
  }
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC007_L3003_OP001_001**: ownerIdが不正（UUID形式エラー）
- **ERR_BC007_L3003_OP001_002**: workspaceName長さエラー（1-200文字）
- **ERR_BC007_L3003_OP001_003**: memberIds件数エラー（1-500件）
- **ERR_BC007_L3003_OP001_004**: memberRoles件数不一致
- **ERR_BC007_L3003_OP001_005**: ownerロールなし（最低1人必要）
- **ERR_BC007_L3003_OP001_006**: storageQuota超過（organization上限）

#### HTTP 403 Forbidden
- **ERR_BC007_L3003_OP001_403_01**: ワークスペース作成権限なし
- **ERR_BC007_L3003_OP001_403_02**: public公開権限なし

#### HTTP 404 Not Found
- **ERR_BC007_L3003_OP001_404_01**: 所有者が存在しません
- **ERR_BC007_L3003_OP001_404_02**: メンバーが存在しません（一部）

#### HTTP 409 Conflict
- **ERR_BC007_L3003_OP001_409**: 同名ワークスペースが既存

#### HTTP 413 Payload Too Large
- **ERR_BC007_L3003_OP001_413**: 組織のストレージ容量超過

#### HTTP 500 Internal Server Error
- **ERR_BC007_L3003_OP001_500**: ワークスペース作成中にシステムエラー（ログ参照）

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Workspace Aggregate**: 協働環境ライフサイクル管理
  - 参照: [../../../../domain/README.md#workspace-aggregate](../../../../domain/README.md#workspace-aggregate)
  - 集約ルート: Workspace
  - 包含エンティティ: WorkspaceMember, WorkspaceDocument, WorkspaceActivity

#### ドメインメソッド
```typescript
// ワークスペース作成
const workspace = Workspace.create({
  ownerId,
  workspaceName,
  workspaceType,
  visibility
});

// メンバー追加
workspace.addMember(userId, 'editor', ['read', 'write']);

// 機能設定
workspace.enableFeature('realTimeEditing', {
  conflictResolution: 'operational-transformation'
});

// ストレージ割り当て
workspace.allocateStorage(10 * 1024 * 1024 * 1024); // 10GB

// WebSocket room作成
const wsRoom = await workspace.createWebSocketRoom();
```

#### ドメインサービス
- **WorkspaceCollaborationService.createWorkspace()**: ワークスペース作成と初期化
- **WorkspaceCollaborationService.setupRealtimeSync()**: リアルタイム同期設定
- **WorkspaceMemberService.assignRoles()**: メンバーロール割り当て
- **WorkspaceMemberService.validatePermissions()**: 権限検証
- **WorkspaceStorageService.allocateQuota()**: ストレージ割り当て
- **WorkspaceStorageService.trackUsage()**: 使用量追跡
- **WorkspaceActivityService.trackActivity()**: アクティビティ記録

### リアルタイム協働アーキテクチャ
- **WebSocket**: ユーザー間リアルタイム通信（Socket.io）
- **Operational Transformation**: 同時編集の競合解決
- **CRDT (Conflict-free Replicated Data Type)**: 分散同期保証
- **Redis Pub/Sub**: マルチインスタンス間のイベント配信
- **Version Control**: ドキュメント履歴管理（Git方式）

### トランザクション境界
- **開始**: ワークスペース作成リクエスト受信時
- **コミット**: Workspace作成 + Member登録 + WebSocket room作成 + ストレージ割り当て完了時
- **ロールバック**: バリデーションエラー、ストレージ不足、WebSocket room作成失敗時

### 副作用
- **ドメインイベント発行**:
  - `WorkspaceCreated` - 全メンバーに通知
  - `MemberInvited` - 招待メンバーに通知
  - `DocumentShared` - ドキュメント共有時
  - `ActivityRecorded` - リアルタイムアクティビティ
- **通知**:
  - 招待メール: 全メンバー（即座）
  - アクティビティ通知: WebSocket経由（リアルタイム）
- **外部システム連携**:
  - WebSocket: リアルタイム協働
  - S3: ドキュメントストレージ
  - Redis: アクティビティキャッシュ
  - Elasticsearch: ドキュメント全文検索
  - BC-007 Notification: 招待・アクティビティ通知

### BC間連携
- **BC-003依存**: Userエンティティ参照、権限検証
- **BC-001参照**: プロジェクトワークスペース（Projectコンテキスト付加）
- **BC-005参照**: チームワークスペース（Teamコンテキスト付加）
- **BC-007 Notification**: 招待・アクティビティ通知

### 実装手順
1. 所有者存在・権限確認（BC-003）
2. メンバー存在確認（memberIds）
3. ロール・権限バリデーション
4. ストレージ容量確認（organization残容量）
5. Workspace Aggregate作成
6. トランザクション開始
7. Workspace保存
8. WorkspaceMember作成（全メンバー）
9. WebSocket room作成
10. ストレージ割り当て
11. 外部連携設定（Slack/GitHub等）
12. WorkspaceCreatedイベント発行
13. トランザクションコミット
14. 招待メール送信（BC-007 Notification経由）
15. WebSocketエンドポイント通知
16. アクティビティ追跡開始

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 |
|--------|---------------|------|-------------|
| ERR_BC007_L3003_OP001_001 | 400 | ownerId形式エラー | No |
| ERR_BC007_L3003_OP001_002 | 400 | workspaceName長さエラー | No |
| ERR_BC007_L3003_OP001_003 | 400 | memberIds件数エラー | No |
| ERR_BC007_L3003_OP001_004 | 400 | memberRoles件数不一致 | No |
| ERR_BC007_L3003_OP001_005 | 400 | ownerロールなし | No |
| ERR_BC007_L3003_OP001_006 | 400 | storageQuota超過 | No |
| ERR_BC007_L3003_OP001_403_01 | 403 | 作成権限なし | No |
| ERR_BC007_L3003_OP001_403_02 | 403 | public公開権限なし | No |
| ERR_BC007_L3003_OP001_404_01 | 404 | 所有者不存在 | No |
| ERR_BC007_L3003_OP001_404_02 | 404 | メンバー不存在 | No |
| ERR_BC007_L3003_OP001_409 | 409 | 同名ワークスペース存在 | No |
| ERR_BC007_L3003_OP001_413 | 413 | ストレージ容量超過 | No |
| ERR_BC007_L3003_OP001_500 | 500 | システムエラー | Yes |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC007_L3003_OP001_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (2s, 4s, 8s)
- **リトライ不可エラー**: バリデーションエラー（400系）、権限エラー（403）、競合エラー（409）

### WebSocket接続失敗時の処理
1. WebSocket room作成失敗時はロールバック
2. リアルタイム機能を無効化してワークスペース作成継続
3. 管理者に障害通知
4. 自動復旧試行（最大3回、5分間隔）
5. 復旧後にメンバーへ通知

### ストレージ容量管理
1. ワークスペース作成時にQuota予約
2. 実使用量の定期監視（1時間毎）
3. 80%到達時に所有者に警告
4. 100%到達時に書き込み制限
5. 削除・クリーンアップ後に自動解除

### ログ記録要件
- **INFO**: ワークスペース作成成功（workspaceId, ownerId, メンバー数、割り当てストレージ記録）
- **WARN**: ストレージ容量警告、大規模ワークスペース（100人超）、外部連携失敗
- **ERROR**: システムエラー（スタックトレース、入力パラメータ全量記録）、WebSocket room作成失敗
- **監査ログ**: 全ワークスペース作成（成功/失敗問わず）をAuditLogに記録（BC-003経由）

### パフォーマンス監視
- **ワークスペース作成**: < 3秒
- **WebSocket room作成**: < 1秒
- **招待メール配信**: < 5秒
- **リアルタイム同期レイテンシ**: < 100ms
- **同時接続数**: 10,000接続/ワークスペース

### リアルタイム協働の品質保証
- **Operational Transformation**: 99.99%の正確性
- **競合解決**: 100ms以内
- **データ整合性**: CRDTによる最終的一貫性保証
- **Version Control**: 全変更履歴の永続化

---

## 🔗 設計参照

### ドメインモデル
参照: [../../../../domain/README.md](../../../../domain/README.md)

この操作に関連するドメインエンティティ、値オブジェクト、集約の詳細定義は、上記ドメインモデルドキュメントを参照してください。

### API仕様
参照: [../../../../api/README.md](../../../../api/README.md)

この操作を実現するAPIエンドポイント、リクエスト/レスポンス形式、認証・認可要件は、上記API仕様ドキュメントを参照してください。

### データモデル
参照: [../../../../data/README.md](../../../../data/README.md)

この操作が扱うデータ構造、永続化要件、データ整合性制約は、上記データモデルドキュメントを参照してください。

---

## 🎬 UseCases: この操作を実装するユースケース

| UseCase | 説明 | Page | V2移行元 |
|---------|------|------|---------|
| (Phase 4で作成) | - | - | - |

詳細: [usecases/](usecases/)

> **注記**: ユースケースは Phase 4 の実装フェーズで、V2構造から段階的に移行・作成されます。
> 
> **Phase 3 (現在)**: Operation構造とREADME作成
> **Phase 4 (次)**: UseCase定義とページ定義の移行
> **Phase 5**: API実装とテストコード

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: この操作はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/collaboration-facilitation-service/capabilities/provide-collaborative-environment/operations/provide-collaborative-environment/](../../../../../../services/collaboration-facilitation-service/capabilities/provide-collaborative-environment/operations/provide-collaborative-environment/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
