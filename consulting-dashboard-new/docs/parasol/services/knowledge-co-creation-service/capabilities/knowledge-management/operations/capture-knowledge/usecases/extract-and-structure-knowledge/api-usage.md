# API利用仕様: 知識を抽出・構造化する

## 利用するAPI一覧

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| 知識抽出開始API | POST /api/knowledge-co-creation/processing/extract | AI支援による知識抽出プロセス開始 | `sourceId`, `extractionType`, `aiModel` |
| 抽出進捗監視API | GET /api/knowledge-co-creation/processing/{jobId}/progress | 知識抽出処理の進捗確認 | `jobId`, `includeIntermediate` |
| 抽出結果取得API | GET /api/knowledge-co-creation/processing/{jobId}/results | 抽出された知識の取得 | `jobId`, `format`, `includeMetadata` |
| 知識構造化API | POST /api/knowledge-co-creation/processing/structure | 抽出知識の構造化・体系化 | `extractedData`, `structureTemplate`, `ontology` |
| 知識作成API | POST /api/knowledge-co-creation/knowledge | 構造化された知識の保存 | `title`, `content`, `metadata`, `authorInfo` |
| 知識更新API | PUT /api/knowledge-co-creation/knowledge/{id} | 既存知識の更新・改良 | `knowledgeId`, `content`, `updateInfo` |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | ユースケース開始時 | 認証トークン取得・操作権限確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | 知識抽出・編集前 | create/extract権限の確認 |
| collaboration-facilitation-service | UC-COLLAB-06: 協調空間を作成する | 複雑な構造化作業時 | リアルタイム協調編集環境 |
| collaboration-facilitation-service | UC-COLLAB-10: 専門家セッションを作成する | 専門知識の構造化時 | 専門家による構造化支援 |
| project-success-service | UC-PROJECT-09: 知識をプロジェクトに関連付ける | 知識保存時 | プロジェクト知識の関連付け |
| secure-access-service | UC-AUTH-03: アクセスログを記録する | 抽出・構造化完了時 | 知識作成の監査ログ記録 |

## API呼び出しシーケンス

### 基本フロー: AI支援知識抽出・構造化

1. **事前認証・権限確認**:
   - `POST /api/auth/usecases/authenticate` (secure-access-service UC-AUTH-01)
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - ユーザー認証と知識抽出権限の確認

2. **AI知識抽出開始**:
   - `POST /api/knowledge-co-creation/processing/extract` (自サービス)
   - 対象ソースからのAI支援知識抽出プロセス開始

3. **抽出進捗監視**:
   - `GET /api/knowledge-co-creation/processing/{jobId}/progress` (自サービス)
   - リアルタイム進捗状況の監視（WebSocket接続）

4. **抽出結果取得・確認**:
   - `GET /api/knowledge-co-creation/processing/{jobId}/results` (自サービス)
   - 抽出された生データの取得と品質確認

5. **協調構造化セッション作成** (複雑なケース):
   - `POST /api/collaboration/usecases/create-collaboration-space` (collaboration-facilitation-service UC-COLLAB-06)
   - `POST /api/collaboration/usecases/create-expert-session` (collaboration-facilitation-service UC-COLLAB-10)
   - 複数人での協調構造化作業環境の構築

6. **知識構造化処理**:
   - `POST /api/knowledge-co-creation/processing/structure` (自サービス)
   - AI+人間協調による知識の体系化・構造化

7. **構造化知識保存**:
   - `POST /api/knowledge-co-creation/knowledge` (自サービス)
   - 構造化完了知識の知識ベースへの保存

8. **プロジェクト関連付け**:
   - `POST /api/projects/usecases/link-knowledge-to-project` (project-success-service UC-PROJECT-09)
   - 作成知識の関連プロジェクトとの紐付け

9. **監査ログ記録**:
   - `POST /api/auth/usecases/log-access` (secure-access-service UC-AUTH-03)
   - 知識抽出・構造化プロセスの完全記録

### 代替フロー: 段階的構造化

1. **部分抽出**: 大量データの段階的抽出処理
2. **インクリメンタル構造化**: 段階的な構造化と品質向上
3. **反復改善**: フィードバックに基づく構造の反復改善

### WebSocketリアルタイム更新

1. **抽出進捗**: `wss://api.../ws/knowledge-co-creation/extract-progress/{sessionId}`
2. **協調編集**: `wss://api.../ws/knowledge-co-creation/collaboration/{sessionId}`
3. **構造化状況**: `wss://api.../ws/knowledge-co-creation/structure-updates/{sessionId}`

## エラーハンドリング

### AI処理エラー
- **AI_EXTRACTION_FAILED**: AI抽出失敗時の手動抽出フォールバック
- **INSUFFICIENT_SOURCE_QUALITY**: ソース品質不足時の前処理提案
- **EXTRACTION_TIMEOUT**: 抽出タイムアウト時のバッチ処理移行

### 構造化エラー
- **STRUCTURE_VALIDATION_FAILED**: 構造検証失敗時の手動調整フロー
- **ONTOLOGY_CONFLICT**: オントロジー競合時の代替構造提案
- **COLLABORATION_SYNC_ERROR**: 協調編集同期エラー時の競合解決

### データ保存エラー
- **KNOWLEDGE_DUPLICATE**: 重複知識検出時の統合・更新提案
- **STORAGE_QUOTA_EXCEEDED**: 容量制限時の最適化提案
- **METADATA_VALIDATION_ERROR**: メタデータ検証エラー時の修正ガイド

### リトライ・復旧戦略
- **AI処理**: 3回まで自動リトライ（モデル切り替え含む）
- **協調同期**: 5秒間隔で10回まで再接続試行
- **データ保存**: トランザクション失敗時の自動ロールバック

## パフォーマンス最適化

### 抽出処理最適化
- **並行処理**: 複数ソースの並行抽出（最大8並行）
- **チャンク処理**: 大容量ファイルの分割処理
- **GPU活用**: 深層学習モデルのGPU並列処理

### 構造化最適化
- **テンプレート活用**: 事前定義構造テンプレートの活用
- **増分構造化**: 既存構造への増分追加処理
- **キャッシュ活用**: 構造化パターンのキャッシング

### 協調最適化
- **差分同期**: 変更差分のみの同期処理
- **競合予測**: AI予測による競合事前回避
- **帯域最適化**: ネットワーク帯域に応じた更新頻度調整

## 品質保証

### AI抽出品質
- **精度閾値**: 抽出精度85%以上での自動承認
- **信頼度スコア**: 各抽出項目の信頼度定量評価
- **検証ルール**: ドメイン固有検証ルールの適用

### 構造化品質
- **整合性チェック**: 論理的整合性の自動検証
- **完全性評価**: 構造化の完全性スコア算出
- **専門家レビュー**: 重要知識の専門家品質レビュー

### レスポンス時間目標
- **抽出開始**: 95%ile < 5秒（非同期開始）
- **小規模抽出（<10MB）**: 95%ile < 2分、99%ile < 5分
- **大規模抽出（>100MB）**: 95%ile < 20分、99%ile < 60分
- **構造化処理**: 95%ile < 10分、99%ile < 30分
- **知識保存**: 95%ile < 10秒、99%ile < 30秒