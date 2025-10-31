# API利用仕様: 知識源を特定する

## 利用するAPI一覧

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| 知識源作成API | POST /api/knowledge-co-creation/knowledge-sources | 新規知識源の登録 | `sourceType`, `location`, `metadata` |
| 知識源一覧・検索API | GET /api/knowledge-co-creation/knowledge-sources | 知識源の検索・フィルタリング | `type`, `category`, `dateRange`, `q` |
| 知識源詳細取得API | GET /api/knowledge-co-creation/knowledge-sources/{id} | 特定知識源の詳細情報取得 | `sourceId`, `includeMetrics` |
| 知識源評価API | POST /api/knowledge-co-creation/knowledge-sources/{id}/evaluate | 知識源の価値・信頼性評価 | `sourceId`, `criteria`, `score` |
| 知識源分類API | POST /api/knowledge-co-creation/processing/classify-sources | 知識源の自動分類・カテゴライズ | `sourceIds`, `classificationModel` |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | ユースケース開始時 | 認証トークン取得・権限確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | 知識源アクセス前 | アクセス権限の確認 |
| project-success-service | UC-PROJECT-05: プロジェクト文脈を取得する | 知識源特定時 | プロジェクト関連情報の取得 |
| collaboration-facilitation-service | UC-COLLAB-10: 専門家セッションを作成する | 複雑な知識源評価時 | 専門家の協調評価セッション |
| secure-access-service | UC-AUTH-03: アクセスログを記録する | 知識源アクセス時 | 監査ログの記録 |

## API呼び出しシーケンス

### 基本フロー: 知識源特定プロセス

1. **事前認証**:
   - `POST /api/auth/usecases/authenticate` (secure-access-service UC-AUTH-01)
   - ユーザー認証とセッション確立

2. **プロジェクト文脈取得**:
   - `GET /api/projects/usecases/get-project-context` (project-success-service UC-PROJECT-05)
   - 現在のプロジェクト要求・制約・目標の取得

3. **知識源検索・発見**:
   - `GET /api/knowledge-co-creation/knowledge-sources` (自サービス)
   - 既存知識源の検索・フィルタリング

4. **アクセス権限確認**:
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - 各知識源へのアクセス権限確認

5. **新規知識源登録** (必要に応じて):
   - `POST /api/knowledge-co-creation/knowledge-sources` (自サービス)
   - 新たに発見した知識源の登録

6. **知識源評価・分類**:
   - `POST /api/knowledge-co-creation/knowledge-sources/{id}/evaluate` (自サービス)
   - `POST /api/knowledge-co-creation/processing/classify-sources` (自サービス)
   - 知識源の価値評価と自動分類

7. **専門家協調評価** (複雑なケース):
   - `POST /api/collaboration/usecases/create-expert-session` (collaboration-facilitation-service UC-COLLAB-10)
   - 専門家による協調評価セッション作成

8. **アクセスログ記録**:
   - `POST /api/auth/usecases/log-access` (secure-access-service UC-AUTH-03)
   - 知識源特定プロセスの監査ログ記録

### 代替フロー: 外部知識源統合

1. **外部ソース接続**: 外部API・データベース・ファイルシステムからの知識源発見
2. **メタデータ抽出**: 自動メタデータ抽出とインデックス化
3. **重複排除**: 既存知識源との重複チェックと統合

## エラーハンドリング

### 認証・認可エラー
- **401 Unauthorized**: 認証失敗時の再認証フロー
- **403 Forbidden**: アクセス権限不足時の権限申請ガイダンス

### 知識源アクセスエラー
- **404 Not Found**: 知識源が存在しない場合の代替検索提案
- **503 Service Unavailable**: 外部知識源アクセス失敗時のフォールバック

### 評価・分類エラー
- **422 Validation Error**: 評価基準不適合時の調整フロー
- **500 Processing Error**: AI分類処理失敗時の手動分類フォールバック

### リトライ戦略
- **知識源検索**: 3回まで自動リトライ（指数バックオフ）
- **外部API呼び出し**: 5回まで自動リトライ（1秒間隔）
- **専門家セッション**: タイムアウト後の非同期処理継続

## パフォーマンス最適化

### 検索最適化
- **インデックス利用**: メタデータ・タグ・分類での高速検索
- **キャッシュ戦略**: 頻繁にアクセスされる知識源情報のキャッシング

### 並行処理
- **バッチ評価**: 複数知識源の並行評価処理
- **非同期分類**: 大量知識源の非同期分類処理

### レスポンス時間目標
- **知識源検索**: 95%ile < 2秒、99%ile < 5秒
- **評価処理**: 95%ile < 10秒、99%ile < 30秒
- **専門家セッション作成**: 95%ile < 5秒