# API利用仕様: 知識を分類・タグ付けする

## 利用するAPI一覧

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| 分類・タグ付け開始API | POST /api/knowledge-co-creation/processing/classify | AI支援による知識の自動分類・タグ付け開始 | `knowledgeId`, `classificationModel`, `tagGenerationMode` |
| 分類進捗監視API | GET /api/knowledge-co-creation/processing/{jobId}/progress | 分類・タグ付け処理の進捗確認 | `jobId`, `includeIntermediate` |
| 分類結果取得API | GET /api/knowledge-co-creation/processing/{jobId}/results | 分類結果とタグ提案の取得 | `jobId`, `includeConfidence`, `includeSuggestions` |
| 分類体系取得API | GET /api/knowledge-co-creation/classification/taxonomies | 利用可能な分類体系の取得 | `domain`, `language`, `includeHierarchy` |
| タグ管理API | POST /api/knowledge-co-creation/tags | 新規タグの作成・既存タグの管理 | `tagName`, `category`, `metadata`, `synonyms` |
| 分類・タグ適用API | PUT /api/knowledge-co-creation/knowledge/{id}/classification | 知識への分類・タグの適用 | `knowledgeId`, `classifications`, `tags`, `confidence` |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | 分類プロセス開始時 | 認証トークン取得・分類権限確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | 知識分類・更新前 | classify/update権限の確認 |
| collaboration-facilitation-service | UC-COLLAB-10: 専門家セッションを作成する | 複雑な分類判定時 | 専門家による協調分類評価 |
| collaboration-facilitation-service | UC-COLLAB-04: 通知を配信する | 分類完了・不整合検出時 | 関係者への分類状況通知 |
| project-success-service | UC-PROJECT-05: プロジェクト文脈を取得する | プロジェクト固有分類時 | プロジェクト分類基準の取得 |
| secure-access-service | UC-AUTH-03: アクセスログを記録する | 分類・タグ付け完了時 | 分類変更の監査ログ記録 |

## API呼び出しシーケンス

### 基本フロー: AI支援自動分類・タグ付け

1. **事前認証・権限確認**:
   - `POST /api/auth/usecases/authenticate` (secure-access-service UC-AUTH-01)
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - ユーザー認証と分類権限の確認

2. **分類体系・文脈取得**:
   - `GET /api/knowledge-co-creation/classification/taxonomies` (自サービス)
   - `GET /api/projects/usecases/get-project-context` (project-success-service UC-PROJECT-05)
   - 利用可能な分類体系とプロジェクト固有分類基準の取得

3. **AI分類・タグ付け開始**:
   - `POST /api/knowledge-co-creation/processing/classify` (自サービス)
   - AI支援による自動分類・タグ付けプロセスの開始

4. **分類進捗監視**:
   - `GET /api/knowledge-co-creation/processing/{jobId}/progress` (自サービス)
   - リアルタイム分類進捗の監視（WebSocket接続）

5. **分類結果取得・評価**:
   - `GET /api/knowledge-co-creation/processing/{jobId}/results` (自サービス)
   - AI分類結果と信頼度スコアの取得

6. **専門家協調評価** (複雑・重要なケース):
   - `POST /api/collaboration/usecases/create-expert-session` (collaboration-facilitation-service UC-COLLAB-10)
   - 専門家による分類妥当性の協調評価

7. **新規タグ作成** (必要に応じて):
   - `POST /api/knowledge-co-creation/tags` (自サービス)
   - 新しい概念・領域に対する新規タグの作成

8. **分類・タグ適用**:
   - `PUT /api/knowledge-co-creation/knowledge/{id}/classification` (自サービス)
   - 確定した分類・タグの知識への適用

9. **分類完了通知**:
   - `POST /api/collaboration/usecases/send-notification` (collaboration-facilitation-service UC-COLLAB-04)
   - 関係者への分類完了・変更通知

10. **監査ログ記録**:
    - `POST /api/auth/usecases/log-access` (secure-access-service UC-AUTH-03)
    - 分類・タグ付け変更の監査記録

### 代替フロー: 段階的分類改善

1. **既存分類分析**: 類似知識の分類パターン分析
2. **分類体系進化**: 新しい知識領域に基づく分類体系拡張
3. **タグ最適化**: 利用パターンに基づくタグ体系最適化

### WebSocketリアルタイム更新

1. **分類進捗**: `wss://api.../ws/knowledge-co-creation/classification-updates/{sessionId}`
2. **専門家セッション**: `wss://api.../ws/knowledge-co-creation/expert-classification/{sessionId}`
3. **タグ生成**: `wss://api.../ws/knowledge-co-creation/tag-generation/{sessionId}`

## エラーハンドリング

### AI分類エラー
- **CLASSIFICATION_MODEL_ERROR**: AI分類モデル失敗時の代替モデル切り替え
- **AMBIGUOUS_CONTENT**: 曖昧な内容での複数分類提案
- **CLASSIFICATION_TIMEOUT**: 分類タイムアウト時の簡易分類フォールバック

### 分類体系エラー
- **TAXONOMY_NOT_FOUND**: 分類体系不在時の汎用分類適用
- **HIERARCHY_CONFLICT**: 階層分類競合時の専門家判定要求
- **OUTDATED_TAXONOMY**: 分類体系古い時の更新提案

### タグ管理エラー
- **TAG_CONFLICT**: タグ競合時の類似タグ統合提案
- **TAG_CREATION_FAILED**: タグ作成失敗時の既存タグ利用提案
- **SYNONYM_CONFLICT**: 類語競合時の優先タグ選択

### リトライ・復旧戦略
- **AI分類**: 3回まで自動リトライ（異なる分類モデル使用）
- **専門家評価**: 48時間以内の専門家再評価
- **タグ適用**: 失敗時の段階的タグ適用・部分的更新

## 分類・タグ付け体系

### 分類次元
1. **ドメイン分類**: 業界・領域別の専門分類
2. **機能分類**: 目的・用途に基づく機能分類
3. **品質分類**: 信頼性・重要度に基づく品質分類
4. **時系列分類**: 作成時期・適用期間による時系列分類

### タグ階層
```json
{
  "domain": {
    "technology": ["AI", "blockchain", "cloud", "cybersecurity"],
    "business": ["strategy", "operations", "finance", "marketing"],
    "industry": ["healthcare", "finance", "manufacturing", "retail"]
  },
  "function": {
    "analysis": ["data-analysis", "market-research", "competitive-analysis"],
    "implementation": ["best-practices", "methodologies", "frameworks"],
    "evaluation": ["metrics", "KPIs", "benchmarks"]
  },
  "quality": {
    "maturity": ["draft", "reviewed", "validated", "certified"],
    "confidence": ["high", "medium", "low"],
    "evidence": ["empirical", "theoretical", "anecdotal"]
  }
}
```

### 自動分類ルール
- **内容解析**: NLP+機械学習による内容自動分類
- **メタデータ活用**: 作成者・プロジェクト情報による推論
- **利用パターン**: アクセス・活用パターンによる分類
- **関連性分析**: 既存知識との関連性による分類推論

## 品質保証

### 分類精度管理
- **信頼度閾値**: 分類信頼度80%以上で自動適用
- **専門家確認**: 信頼度60-79%での専門家確認
- **手動分類**: 信頼度60%未満での手動分類

### タグ品質管理
- **一貫性チェック**: タグ適用の一貫性自動検証
- **重複排除**: 類似・重複タグの自動統合
- **利用分析**: タグ利用パターンの分析・最適化

### 分類体系管理
- **体系進化**: 新しい知識領域に基づく体系拡張
- **階層最適化**: 利用パターンに基づく階層構造最適化
- **国際標準準拠**: 業界標準分類体系との整合性維持

## パフォーマンス最適化

### 分類処理最適化
- **バッチ分類**: 複数知識の一括分類処理
- **インクリメンタル学習**: 分類精度の継続的改善
- **キャッシュ活用**: 類似内容の分類結果キャッシュ

### タグ処理最適化
- **タグ推論**: AI予測による関連タグ自動推論
- **タグクラスタリング**: 類似タグの自動グループ化
- **検索最適化**: タグベース検索の高速化

### リアルタイム処理
- **差分分類**: 知識更新時の差分分類処理
- **プリディクティブ分類**: 入力時のリアルタイム分類提案
- **適応学習**: 分類パターンの継続学習・改善

## レスポンス時間目標
- **基本分類処理**: 95%ile < 10秒、99%ile < 30秒
- **詳細分類分析**: 95%ile < 1分、99%ile < 3分
- **専門家セッション開始**: 95%ile < 5秒
- **タグ生成・適用**: 95%ile < 5秒、99%ile < 15秒
- **分類体系取得**: 95%ile < 2秒、99%ile < 5秒