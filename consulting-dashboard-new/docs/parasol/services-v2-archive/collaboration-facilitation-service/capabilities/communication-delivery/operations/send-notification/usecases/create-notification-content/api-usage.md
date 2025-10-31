# API利用仕様: 通知コンテンツを作成する (HOW: 具体的利用方法)

<!--
🎯 このファイルはIssue #146 API仕様WHAT/HOW分離統一化の一環で作成されました
📋 「HOW（どう使うか）」を定義します
👥 対象読者: 実装エンジニア
🔗 配置場所: usecases/create-notification-content/api-usage.md

💡 「WHAT（何ができるか）」は以下で定義:
📄 サービス仕様: services/collaboration-facilitation-service/api/api-specification.md
👥 対象読者: API設計者・サービス連携者
🛠️ テンプレート: templates/dx-api-specification.md
-->

## 利用するAPI一覧

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| 通知コンテンツ作成API | POST /api/notifications/content | 通知コンテンツの作成・保存 | `title`, `body`, `type`, `urgency`, `targetAudience` |
| コンテンツテンプレート取得API | GET /api/notifications/templates | 通知テンプレートの取得 | `category`, `language`, `includeCustom` |
| コンテンツプレビューAPI | POST /api/notifications/content/preview | 作成した通知コンテンツのプレビュー生成 | `contentId`, `targetChannels`, `sampleRecipients` |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | ユースケース開始時 | 認証トークン取得・コンテンツ作成権限確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | コンテンツ作成前 | 通知コンテンツ作成権限の確認 |
| knowledge-co-creation-service | UC-KNOWLEDGE-01: 知識を検索する | テンプレート選択時 | 過去の効果的な通知テンプレート検索 |
| secure-access-service | UC-AUTH-03: アクセスログを記録する | ユースケース完了時 | 通知コンテンツ作成操作の監査ログ記録 |

## API呼び出しシーケンス

### 基本フロー: 通知コンテンツ作成シナリオ

1. **事前認証・権限確認**:
   - `POST /api/auth/usecases/authenticate` (secure-access-service UC-AUTH-01)
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - ユーザー認証と通知コンテンツ作成権限の確認

2. **テンプレート検索・取得**:
   - `GET /api/notifications/templates` (自サービス)
   - `POST /api/knowledge/usecases/search-knowledge` (knowledge-co-creation-service UC-KNOWLEDGE-01)
   - 通知カテゴリに適したテンプレートと過去の効果的なコンテンツを検索

3. **コンテンツ作成**:
   - `POST /api/notifications/content` (自サービス)
   - タイトル、本文、緊急度、対象者を設定して通知コンテンツを作成

4. **コンテンツプレビュー生成**:
   - `POST /api/notifications/content/preview` (自サービス)
   - 作成したコンテンツの各配信チャネル向けプレビューを生成

5. **コンテンツ品質確認**:
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - コンテンツ公開前の最終権限確認

6. **監査ログ記録**:
   - `POST /api/auth/usecases/log-access` (secure-access-service UC-AUTH-03)
   - 通知コンテンツ作成実行の監査記録

### 代替フロー: 緊急通知コンテンツ作成

1. **緊急通知条件**: 緊急度が「Critical」の場合
2. **迅速作成処理**: テンプレート自動選択と簡素化されたフロー
3. **復帰処理**: 基本フロー4（プレビュー生成）に戻る

### WebSocketリアルタイム更新

1. **コンテンツ共同編集**: `wss://api.../ws/notifications/content/collaborative/{contentId}`
2. **プレビュー更新**: `wss://api.../ws/notifications/content/preview/{contentId}`
3. **承認状況更新**: `wss://api.../ws/notifications/content/approval/{contentId}`

## エラーハンドリング

### 認証・権限エラー
- **AUTH_FAILED**: 認証失敗時のトークン再取得処理
- **PERMISSION_DENIED**: コンテンツ作成権限不足時のエラー表示
- **CONTENT_APPROVAL_REQUIRED**: 承認が必要なコンテンツの場合の承認プロセス誘導

### コンテンツ作成エラー
- **CONTENT_VALIDATION_FAILED**: コンテンツ検証失敗時の具体的エラー表示
- **TEMPLATE_NOT_FOUND**: テンプレート不明時のデフォルトテンプレート使用
- **CONTENT_TOO_LONG**: コンテンツ長さ超過時の分割提案

### システムエラー
- **SERVICE_UNAVAILABLE**: サービス停止時のオフライン作成機能
- **STORAGE_FULL**: ストレージ容量不足時の古いコンテンツ削除提案

### リトライ・復旧戦略
- **ネットワークエラー**: 3回まで自動リトライ（指数バックオフ）
- **テンプレート取得失敗**: ローカルキャッシュでの代替テンプレート使用
- **プレビュー生成失敗**: 簡易プレビューでの代替表示

## パフォーマンス最適化

### コンテンツ作成最適化
- **テンプレートキャッシュ**: 頻用テンプレートのメモリキャッシュ
- **インクリメンタル保存**: 編集中の自動保存機能
- **予測入力**: AIによるコンテンツ候補提案

### プレビュー最適化
- **並列生成**: 複数チャネルのプレビュー並列生成
- **キャッシュ活用**: 類似コンテンツのプレビューキャッシュ再利用
- **遅延読み込み**: プレビュー画像の遅延読み込み

### 検索最適化
- **インデックス活用**: テンプレート検索のインデックス最適化
- **結果キャッシュ**: 検索結果の一時キャッシュ

## 品質保証

### コンテンツ品質
- **作成成功率**: 99.8%以上 - 正常時のコンテンツ作成成功率
- **テンプレート適用率**: 95%以上 - 適切なテンプレート選択率
- **検証エラー率**: 2%以下 - コンテンツ検証での不合格率

### パフォーマンス品質
- **レスポンス時間**: 95%ile < 1.5秒 - コンテンツ作成API応答時間
- **プレビュー生成時間**: 95%ile < 3秒 - プレビュー生成完了時間

### レスポンス時間目標
- **コンテンツ作成API**: 95%ile < 1.5秒、99%ile < 3秒
- **テンプレート取得API**: 95%ile < 0.5秒、99%ile < 1秒
- **プレビューAPI**: 95%ile < 3秒、99%ile < 5秒
- **知識検索API**: 95%ile < 2秒、99%ile < 4秒
- **権限確認API**: 95%ile < 0.3秒、99%ile < 0.5秒