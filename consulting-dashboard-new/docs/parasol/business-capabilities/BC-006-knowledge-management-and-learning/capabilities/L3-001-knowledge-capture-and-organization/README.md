# L3-001: Knowledge Capture & Organization

**作成日**: 2025-10-31
**所属BC**: BC-006: Knowledge Management & Organizational Learning
**V2移行元**: knowledge-management (作成フェーズ)

---

## 📋 What: この能力の定義

### 能力の概要
組織の知識を捕捉し体系的に整理する能力。知識の記録、整理、検証を通じて、組織知識ベースを構築します。

### 実現できること
- 暗黙知の明示化
- 知識の体系的な整理
- 知識品質の検証
- タグ・カテゴリによる分類
- メタデータの付与

### 必要な知識
- 知識管理手法（SECI モデル）
- 分類体系設計
- メタデータ管理
- 情報アーキテクチャ
- 品質管理手法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: KnowledgeArticleAggregate ([../../domain/README.md](../../domain/README.md#knowledge-article-aggregate))
- **Entities**: KnowledgeArticle, Category, Tag, KnowledgeVersion
- **Value Objects**: KnowledgeStatus, QualityScore, ArticleType

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/knowledge/articles - 知識記録
  - PUT /api/knowledge/articles/{id}/organize - 知識整理
  - POST /api/knowledge/articles/{id}/validate - 品質検証

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: knowledge_articles, categories, tags, article_tags, knowledge_versions

詳細: [../../data/README.md](../../data/README.md)

---

## 🛠️ 実装アプローチ

### アーキテクチャパターン
- **知識記録**: イベントソーシングによる編集履歴管理
- **分類体系**: 階層構造カテゴリ + フラットタグのハイブリッド
- **品質管理**: レビューワークフローによる承認プロセス
- **バージョン管理**: 差分管理による変更追跡

### 主要技術スタック
- **全文検索エンジン**: 全文検索機能
  - 知識記事の全文インデックス
  - 多言語対応の形態素解析
  - ファセット検索によるカテゴリフィルタ
- **ベクトル検索**:
  - ベクトル検索機能
  - セマンティック検索による類似知識発見
  - 自動タグ提案
- **NLP処理**:
  - キーワード自動抽出（TF-IDF、YAKE）
  - 自動要約生成（抽出型・生成型）
  - カテゴリ自動推奨（分類モデル）
- **データベース設計**:
  - リレーショナルデータベース: メタデータ・関係管理
  - ドキュメントストア: 記事本体・バージョン履歴
  - グラフデータベース (optional): カテゴリ階層・タグ関連性

### 実装パターン

#### 知識記録フロー
```
1. 記事作成 → Draft状態で保存
2. 自動処理:
   - キーワード抽出
   - カテゴリ推奨
   - 類似記事検出
3. 著者による整理:
   - カテゴリ選択
   - タグ付与
   - メタデータ入力
4. レビュー申請 → Review状態へ遷移
5. レビュワー承認 → Published状態へ遷移
```

#### 品質スコア算出
```typescript
QualityScore = {
  completeness: メタデータ充足度 (0-100),
  accuracy: レビュー評価平均 (0-100),
  usefulness: 閲覧数・活用度 (0-100),
  freshness: 最終更新からの経過 (0-100),
  overall: weighted_average(上記4指標)
}
```

### パフォーマンス最適化
- **キャッシュ戦略**: キャッシュ機構によるカテゴリ階層・人気記事キャッシュ
- **インデックス最適化**: 全文検索エンジンの複合インデックス
- **非同期処理**: メッセージング機構による NLP 処理
- **CDN配信**: 静的コンテンツ・添付ファイルの配信最適化

---

## ⚠️ 前提条件と制約

### 技術的前提条件
- **インフラ要件**:
  - 全文検索エンジン（3ノード以上推奨）
  - リレーショナルデータベース 14+ (JSON型サポート)
  - キャッシュ機構 6+ (キャッシュ・セッション管理)
  - メッセージング機構
- **外部サービス**:
  - AI API（オプション: 高度なNLP機能）
  - オブジェクトストレージサービス
- **リソース要件**:
  - 最低: 8GB RAM, 4 vCPU
  - 推奨: 16GB RAM, 8 vCPU（本番環境）

### ビジネス制約
- **品質基準**:
  - 公開前に最低1名のレビュー承認必須
  - 品質スコア3.0以上で公開可能
  - 必須項目: タイトル、カテゴリ、本文（200文字以上）
- **バージョン管理**:
  - 公開済み記事の編集は新バージョンとして保存
  - 過去バージョンは無期限保持（監査対応）
  - メジャー変更時のバージョン番号ルール
- **アクセス制御**:
  - Draft: 作成者のみ閲覧・編集可能
  - Review: レビュワーも閲覧可能
  - Published: 権限に応じた閲覧制御

### データ制約
- **記事サイズ**: 最大10MB（本文+添付ファイル）
- **添付ファイル**: 最大5個、合計5MB
- **タグ数**: 1記事あたり最大20個
- **カテゴリ階層**: 最大5階層

### 運用制約
- **レビュー期限**: 申請後7日以内に完了（SLA）
- **検索レスポンス**: 95パーセンタイル < 500ms
- **同時編集**: 同一記事の同時編集は不可（楽観的ロック）

---

## 🔗 BC設計との統合

### ドメインモデル統合
- **Aggregate Root**: `KnowledgeArticleAggregate`
  - 集約エンティティ: KnowledgeArticle, Category, Tag, KnowledgeVersion
  - 不変条件: 状態遷移ルール（draft → review → published → archived）
  - ビジネスルール: 品質基準、レビュー承認プロセス

### BC間連携

#### BC-001 (Project Delivery) との連携
- **プロジェクト完了時の知識抽出**:
  - イベント: `ProjectCompletedEvent`
  - アクション: プロジェクトからLessons Learnedを抽出し、知識記事テンプレート生成
  - API: `POST /api/knowledge/articles/from-project/{projectId}`

#### BC-005 (Team & Resource) との連携
- **トレーニングコンテンツ作成**:
  - イベント: `SkillGapIdentifiedEvent`
  - アクション: スキルギャップに対応する知識記事を推奨
  - API: `GET /api/knowledge/articles/by-skill/{skillId}`

#### BC-007 (Communication) との連携
- **知識共有通知**:
  - イベント: `KnowledgeArticlePublishedEvent`
  - アクション: 関連カテゴリの購読者に通知配信
  - API: BC-007 `POST /api/notifications/send`（ユースケース利用型）

### API設計統合
- **RESTful API**: `/api/knowledge/articles`, `/api/knowledge/categories`, `/api/knowledge/tags`
- **GraphQL API** (optional): 複雑なクエリに対応
- **詳細**: [../../api/README.md](../../api/README.md)

### データ層統合
- **テーブル設計**:
  - `knowledge_articles`: 記事メタデータ
  - `categories`: カテゴリマスタ（階層構造）
  - `tags`: タグマスタ
  - `article_tags`: 記事-タグ関連
  - `knowledge_versions`: バージョン履歴
- **詳細**: [../../data/README.md](../../data/README.md)

### イベント駆動統合
- **発行イベント**:
  - `ArticleCreatedEvent`: 記事作成時
  - `ArticlePublishedEvent`: 記事公開時
  - `ArticleUpdatedEvent`: 記事更新時
  - `ReviewRequestedEvent`: レビュー申請時
- **購読イベント**:
  - BC-001 `ProjectCompletedEvent`
  - BC-005 `SkillGapIdentifiedEvent`
  - BC-007 `UserMentionedEvent`

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 知識を記録する | 暗黙知の文書化 | 2-3個 | capture-knowledge |
| **OP-002**: 知識を整理する | 分類・タグ付け | 2個 | organize-knowledge |
| **OP-003**: 知識を検証する | 品質チェックと承認 | 2個 | validate-knowledge |

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
> - [services/knowledge-co-creation-service/capabilities/knowledge-management/](../../../../services/knowledge-co-creation-service/capabilities/knowledge-management/) (capture/organize/validate部分)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-001 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
