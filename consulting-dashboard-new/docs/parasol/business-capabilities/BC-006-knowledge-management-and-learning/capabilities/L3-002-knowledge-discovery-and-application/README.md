# L3-002: Knowledge Discovery & Application

**作成日**: 2025-10-31
**所属BC**: BC-006: Knowledge Management & Organizational Learning
**V2移行元**: knowledge-management (活用フェーズ)

---

## 📋 What: この能力の定義

### 能力の概要
組織の知識を発見し実務に活用する能力。知識検索、活用促進、共有を通じて、組織学習を加速します。

### 実現できること
- 効率的な知識検索
- 関連知識の推薦
- 知識の実務適用
- 知識共有の促進
- 知識活用状況の可視化

### 必要な知識
- 情報検索技術
- レコメンデーションシステム
- ナレッジマネジメント
- 組織学習理論
- 活用促進手法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: KnowledgeDiscoveryAggregate ([../../domain/README.md](../../domain/README.md#knowledge-discovery-aggregate))
- **Entities**: SearchQuery, KnowledgeRecommendation, KnowledgeUsage, SharedKnowledge
- **Value Objects**: RelevanceScore, UsageFrequency, ShareScope

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - GET /api/knowledge/search - 知識検索
  - POST /api/knowledge/apply - 知識活用
  - POST /api/knowledge/share - 知識共有

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: search_queries, knowledge_recommendations, knowledge_usage, shared_knowledge

詳細: [../../data/README.md](../../data/README.md)

---

## 🛠️ 実装アプローチ

### アーキテクチャパターン
- **検索エンジン**: ハイブリッド検索（キーワード + セマンティック）
- **推奨システム**: コンテンツベース + 協調フィルタリング
- **知識グラフ**: グラフデータベースによる関連性管理
- **活用追跡**: イベントソーシングによる利用履歴管理

### 主要技術スタック
- **検索基盤**: 全文検索機能
  - BM25スコアリングによるキーワード検索
  - Vector検索による意味的類似性検索
  - ハイブリッドスコア統合（RRF: Reciprocal Rank Fusion）
  - ファセット検索・フィルタリング
- **ベクトル検索・埋め込み**:
  - ベクトル埋め込み機能
  - ベクトルデータベース
  - 多言語対応埋め込みモデル
- **知識グラフ**: グラフデータベース
  - エンティティ関連性の可視化
  - 関連知識の探索的発見
  - パス検索による知識連鎖
- **推奨エンジン**:
  - コンテンツベース推奨（類似記事）
  - 協調フィルタリング（閲覧履歴ベース）
  - ハイブリッド推奨（両者の統合）
- **NLP高度機能**:
  - 質問応答システム（Q&A）
  - 自動要約生成
  - キーフレーズ抽出

### 実装パターン

#### ハイブリッド検索フロー
```typescript
// 1. キーワード検索（BM25）
const keywordResults = await searchEngine.search({
  query: userQuery,
  fields: ['title^3', 'content', 'tags^2'],
  size: 100
})

// 2. セマンティック検索（Vector）
const queryEmbedding = await embeddingService.create(userQuery)
const vectorResults = await vectorDb.search({
  vector: queryEmbedding,
  topK: 100
})

// 3. ハイブリッドスコア統合（RRF）
const hybridResults = reciprocalRankFusion(
  keywordResults,
  vectorResults,
  k: 60 // RRFパラメータ
)
```

#### 知識推奨アルゴリズム
```typescript
// ユーザーコンテキストに基づく推奨
recommendKnowledge(userId, context) {
  // 1. コンテンツベース推奨
  const similarArticles = findSimilarByContent(context.currentArticle)

  // 2. 協調フィルタリング
  const userBasedRecommendations = findByUserSimilarity(userId)

  // 3. スキルギャップベース推奨
  const skillGapArticles = findBySkillGap(userId)

  // 4. 統合スコアリング
  return mergeRecommendations([
    { articles: similarArticles, weight: 0.4 },
    { articles: userBasedRecommendations, weight: 0.3 },
    { articles: skillGapArticles, weight: 0.3 }
  ])
}
```

### パフォーマンス最適化
- **キャッシュ戦略**:
  - キャッシュ機構: 人気検索クエリ結果キャッシュ（TTL: 1時間）
  - CDN: 頻繁アクセス記事の配信
- **検索最適化**:
  - 全文検索エンジン シャーディング・レプリケーション
  - インデックス最適化（分析器チューニング）
- **推奨生成**:
  - バッチ処理: 推奨リストの事前計算（日次）
  - リアルタイム補正: ユーザー行動による動的調整
- **スケーリング**:
  - 読み取り負荷分散（レプリカ増設）
  - 非同期処理（メッセージング機構）

---

## ⚠️ 前提条件と制約

### 技術的前提条件
- **インフラ要件**:
  - 全文検索エンジン（検索用: 3ノード以上）
  - ベクトルデータベース
  - グラフデータベース（知識グラフ用: オプション）
  - キャッシュ機構（キャッシュ・セッション: 必須）
- **外部サービス**:
  - AI API（埋め込み生成）
  - ML推論サーバー（推奨モデルホスティング）
- **リソース要件**:
  - 最低: 16GB RAM, 8 vCPU（検索+推奨）
  - 推奨: 32GB RAM, 16 vCPU（本番環境）

### ビジネス制約
- **検索品質**:
  - 再現率（Recall）: 90%以上
  - 適合率（Precision）: 80%以上
  - 平均検索時間: < 500ms（95パーセンタイル）
- **推奨品質**:
  - クリックスルー率（CTR）: 15%以上
  - セレンディピティ: 推奨10件中2件は意外な発見
  - 多様性: 同じカテゴリからの推奨は最大3件
- **プライバシー**:
  - 検索履歴の匿名化（90日後）
  - 個人推奨データの暗号化保存
  - GDPR準拠（削除権・移植権）

### データ制約
- **検索対象**: 公開済み記事のみ
- **検索履歴**: 最大1000件/ユーザー
- **推奨更新頻度**: 日次バッチ + リアルタイム補正
- **ベクトル次元数**: 768次元（Sentence-BERT） or 1536次元（OpenAI）

### 運用制約
- **検索可用性**: 99.9%以上
- **推奨生成時間**: < 100ms（キャッシュヒット時）
- **インデックス更新**: 5分以内（新規記事公開時）
- **A/Bテスト**: 推奨アルゴリズムの継続的改善

---

## 🔗 BC設計との統合

### ドメインモデル統合
- **Aggregate Root**: `KnowledgeDiscoveryAggregate`
  - 集約エンティティ: SearchQuery, KnowledgeRecommendation, KnowledgeUsage, SharedKnowledge
  - 不変条件: 検索結果の関連性スコア範囲、推奨品質基準
  - ビジネスルール: 検索フィルタ、推奨アルゴリズム選択

### BC間連携

#### BC-001 (Project Delivery) との連携
- **プロジェクト関連知識検索**:
  - イベント: `ProjectStartedEvent`
  - アクション: プロジェクトタイプに応じた関連知識を自動推奨
  - API: `GET /api/knowledge/search?projectType={type}&phase={phase}`

#### BC-005 (Team & Resource) との連携
- **スキルギャップ解消知識推奨**:
  - イベント: `SkillGapIdentifiedEvent`
  - アクション: スキル向上に必要な知識記事・学習パスを推奨
  - API: `GET /api/knowledge/recommendations/by-skill/{skillId}`
- **エキスパート検索**:
  - イベント: `ExpertiseNeededEvent`
  - アクション: 特定知識領域のエキスパートを検索・推奨
  - API: `GET /api/knowledge/experts?domain={domain}`

#### BC-007 (Communication) との連携
- **知識活用通知**:
  - イベント: `KnowledgeAppliedEvent`
  - アクション: 知識著者への活用フィードバック通知
  - API: BC-007 `POST /api/notifications/send`
- **知識共有促進**:
  - イベント: `KnowledgeSharedEvent`
  - アクション: チーム・組織への知識共有通知
  - API: BC-007 `POST /api/messages/send-to-channel`

### API設計統合
- **検索API**: `GET /api/knowledge/search?q={query}&filters={...}`
- **推奨API**: `GET /api/knowledge/recommendations?userId={id}&context={...}`
- **活用API**: `POST /api/knowledge/apply`, `POST /api/knowledge/share`
- **詳細**: [../../api/README.md](../../api/README.md)

### データ層統合
- **テーブル設計**:
  - `search_queries`: 検索クエリ履歴
  - `knowledge_recommendations`: 推奨リスト（事前計算）
  - `knowledge_usage`: 知識活用記録
  - `shared_knowledge`: 共有履歴
  - `knowledge_graph_edges`: 知識間の関連性（オプション）
- **詳細**: [../../data/README.md](../../data/README.md)

### イベント駆動統合
- **発行イベント**:
  - `KnowledgeSearchedEvent`: 検索実行時
  - `KnowledgeViewedEvent`: 記事閲覧時
  - `KnowledgeAppliedEvent`: 知識適用時
  - `KnowledgeSharedEvent`: 知識共有時
- **購読イベント**:
  - BC-001 `ProjectStartedEvent`, `ProjectCompletedEvent`
  - BC-005 `SkillGapIdentifiedEvent`, `TrainingCompletedEvent`
  - BC-006 L3-001 `KnowledgeArticlePublishedEvent`

### 機械学習統合
- **推奨モデル**: 協調フィルタリング（ALS, Matrix Factorization）
- **検索ランキング**: Learning to Rank（LambdaMART, RankNet）
- **クエリ理解**: BERT / GPT による意図理解
- **モデル更新**: 週次リトレーニング（ユーザーフィードバック反映）

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 知識を検索する | 全文検索・フィルタリング | 2-3個 | search-knowledge |
| **OP-002**: 知識を活用する | 実務への適用 | 2個 | apply-knowledge |
| **OP-003**: 知識を共有する | チーム・組織への展開 | 2個 | share-knowledge |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 6個
- **V2からの移行**: 単一capabilityを作成フェーズと活用フェーズに分割

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/knowledge-co-creation-service/capabilities/knowledge-management/](../../../../services/knowledge-co-creation-service/capabilities/knowledge-management/) (search/apply/share部分)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-002 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
