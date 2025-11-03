# BC-006: データ層設計 [Data Layer Design]

**BC**: Knowledge Management & Organizational Learning [ナレッジ管理と組織学習] [BC_006]
**作成日**: 2025-10-31
**最終更新**: 2025-11-04
**V2移行元**: services/knowledge-co-creation-service/database-design.md

---

## 目次

1. [概要](#overview)
2. [データベースアーキテクチャ](#database-architecture)
3. [主要テーブル](#main-tables)
4. [データモデル図](#data-models)
5. [インデックス戦略](#index-strategy)
6. [パーティショニング戦略](#partitioning-strategy)
7. [データフロー](#data-flows)
8. [パフォーマンス最適化](#performance-optimization)
9. [詳細ドキュメント](#detailed-docs)

---

## 概要 {#overview}

BC-006のデータ層は、ナレッジ管理と組織学習システムのデータを効率的に管理するPostgreSQLデータベース設計です。

### 設計原則

- **正規化**: 第3正規形(3NF)を基本とし、パフォーマンスのために部分的に非正規化
- **スケーラビリティ**: パーティショニングとシャーディングに対応
- **監査可能性**: 全テーブルにタイムスタンプとバージョン管理
- **参照整合性**: 外部キー制約による整合性保証
- **全文検索対応**: PostgreSQL Full Text Searchとベクトル検索の統合

### データベース仕様

- **DBMS**: PostgreSQL 15+
- **文字セット**: UTF-8
- **タイムゾーン**: UTC
- **レプリケーション**: マスター-スレーブ (読み取り分散)
- **バックアップ**: 毎日フル + 継続的アーカイブログ

---

## データベースアーキテクチャ {#database-architecture}

### スキーマ構成

```
bc_006_knowledge_management
├── knowledge_articles (ナレッジ記事)
├── article_versions (記事バージョン履歴)
├── article_reviews (レビュー)
├── article_attachments (添付ファイル)
├── knowledge_categories (カテゴリ)
├── category_hierarchy (カテゴリ階層)
├── tags (タグ)
├── article_tags (記事-タグ関連)
├── best_practices (ベストプラクティス)
├── practice_evidences (エビデンス)
├── practice_applications (適用記録)
├── learning_courses (学習コース)
├── course_modules (コースモジュール)
├── course_materials (教材)
├── course_assessments (評価)
├── assessment_questions (評価問題)
├── learning_progress (学習進捗)
├── module_completions (モジュール完了記録)
├── assessment_results (評価結果)
├── assessment_answers (評価回答)
├── certifications (証明書)
├── learning_paths (学習経路)
├── path_courses (経路-コース関連)
├── knowledge_usage (使用状況追跡)
└── search_index (検索インデックス)
```

### テーブル分類

| 分類 | テーブル数 | 説明 |
|------|-----------|------|
| ナレッジ管理 | 11 | 記事、カテゴリ、タグ、レビュー |
| ベストプラクティス | 3 | BP、エビデンス、適用記録 |
| 学習システム | 9 | コース、進捗、評価、証明書 |
| 学習経路 | 2 | 経路、コース関連 |
| 使用状況 | 2 | 追跡、検索インデックス |

**合計**: 27テーブル

---

## 主要テーブル {#main-tables}

### ナレッジ管理テーブル群

#### knowledge_articles [ナレッジ記事]

ナレッジ記事のマスターテーブル

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 記事ID |
| title | VARCHAR(500) | NOT NULL | タイトル |
| summary | TEXT | NOT NULL | 要約 |
| content | TEXT | NOT NULL | 本文（Markdown） |
| status | VARCHAR(20) | NOT NULL | 状態（draft/review/published/archived） |
| category_id | UUID | FK → categories, NOT NULL | カテゴリID |
| author_id | UUID | FK → users(BC-003), NOT NULL | 著者ID |
| quality_score_accuracy | DECIMAL(3,2) | DEFAULT 3.0 | 正確性スコア（0-5） |
| quality_score_completeness | DECIMAL(3,2) | DEFAULT 3.0 | 完全性スコア（0-5） |
| quality_score_usefulness | DECIMAL(3,2) | DEFAULT 3.0 | 有用性スコア（0-5） |
| quality_score_clarity | DECIMAL(3,2) | DEFAULT 3.0 | 明確性スコア（0-5） |
| quality_score_overall | DECIMAL(3,2) | DEFAULT 3.0 | 総合スコア（0-5） |
| view_count | INTEGER | DEFAULT 0 | 閲覧数 |
| like_count | INTEGER | DEFAULT 0 | いいね数 |
| version | VARCHAR(20) | DEFAULT '0.1.0' | バージョン |
| related_project_id | UUID | FK → projects(BC-001) | 関連プロジェクトID |
| search_vector | TSVECTOR | | 全文検索ベクトル |
| embedding_vector | VECTOR(1536) | | AI埋め込みベクトル |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 更新日時 |
| published_at | TIMESTAMPTZ | | 公開日時 |
| archived_at | TIMESTAMPTZ | | アーカイブ日時 |

**インデックス**:
- `idx_articles_status_published` on (status, published_at DESC) WHERE status = 'published'
- `idx_articles_author` on (author_id, created_at DESC)
- `idx_articles_category` on (category_id, published_at DESC)
- `idx_articles_quality` on (quality_score_overall DESC, view_count DESC)
- `idx_articles_search` GIN on (search_vector)
- `idx_articles_embedding` IVFFLAT on (embedding_vector) WITH (lists=100)

**制約**:
- CHECK (status IN ('draft', 'review', 'published', 'archived'))
- CHECK (quality_score_overall >= 0 AND quality_score_overall <= 5)
- CHECK (view_count >= 0)
- CHECK (like_count >= 0)

**トリガー**:
- `update_search_vector_trigger`: 記事更新時に検索ベクトル自動更新
- `update_updated_at_trigger`: 更新時にupdated_at自動更新

---

#### article_versions [記事バージョン履歴]

記事の全バージョンを保存

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | バージョンID |
| article_id | UUID | FK → knowledge_articles, NOT NULL | 記事ID |
| version | VARCHAR(20) | NOT NULL | バージョン番号（semver） |
| title | VARCHAR(500) | NOT NULL | タイトル |
| content | TEXT | NOT NULL | 本文 |
| author_id | UUID | FK → users(BC-003), NOT NULL | 著者ID |
| change_comment | TEXT | | 変更コメント |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 作成日時 |

**インデックス**:
- `idx_versions_article` on (article_id, created_at DESC)
- `idx_versions_version` on (article_id, version)

**制約**:
- UNIQUE (article_id, version)

---

#### article_reviews [レビュー]

記事のレビュー記録

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | レビューID |
| article_id | UUID | FK → knowledge_articles, NOT NULL | 記事ID |
| reviewer_id | UUID | FK → users(BC-003), NOT NULL | レビュワーID |
| decision | VARCHAR(20) | NOT NULL | 判定（pending/approved/rejected） |
| accuracy_rating | DECIMAL(3,2) | NOT NULL | 正確性評価（0-5） |
| completeness_rating | DECIMAL(3,2) | NOT NULL | 完全性評価（0-5） |
| usefulness_rating | DECIMAL(3,2) | NOT NULL | 有用性評価（0-5） |
| clarity_rating | DECIMAL(3,2) | NOT NULL | 明確性評価（0-5） |
| overall_rating | DECIMAL(3,2) | NOT NULL | 総合評価（0-5） |
| comments | TEXT | | コメント |
| suggestions | JSONB | | 改善提案 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス**:
- `idx_reviews_article` on (article_id, created_at DESC)
- `idx_reviews_reviewer` on (reviewer_id, created_at DESC)
- `idx_reviews_decision` on (decision)

**制約**:
- CHECK (decision IN ('pending', 'approved', 'rejected'))
- CHECK (accuracy_rating >= 0 AND accuracy_rating <= 5)

---

### 学習システムテーブル群

#### learning_courses [学習コース]

学習コースのマスターテーブル

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | コースID |
| title | VARCHAR(500) | NOT NULL | タイトル |
| description | TEXT | NOT NULL | 説明 |
| overview | TEXT | | 概要 |
| status | VARCHAR(20) | NOT NULL | 状態（draft/review/published/archived） |
| level | VARCHAR(20) | NOT NULL | レベル（beginner/intermediate/advanced/expert） |
| category | VARCHAR(100) | NOT NULL | カテゴリ |
| instructor_id | UUID | FK → users(BC-003), NOT NULL | 講師ID |
| estimated_duration_minutes | INTEGER | NOT NULL | 推定学習時間（分） |
| enrollment_count | INTEGER | DEFAULT 0 | 登録者数 |
| completion_count | INTEGER | DEFAULT 0 | 修了者数 |
| average_rating | DECIMAL(3,2) | DEFAULT 0 | 平均評価（0-5） |
| prerequisites | JSONB | DEFAULT '[]' | 前提条件コースID配列 |
| learning_objectives | JSONB | NOT NULL | 学習目標 |
| tags | TEXT[] | DEFAULT '{}' | タグ配列 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 作成日時 |
| published_at | TIMESTAMPTZ | | 公開日時 |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス**:
- `idx_courses_status_published` on (status, published_at DESC)
- `idx_courses_instructor` on (instructor_id, created_at DESC)
- `idx_courses_level_category` on (level, category, average_rating DESC)
- `idx_courses_tags` GIN on (tags)

**制約**:
- CHECK (status IN ('draft', 'review', 'published', 'archived'))
- CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert'))
- CHECK (estimated_duration_minutes > 0)
- CHECK (average_rating >= 0 AND average_rating <= 5)

---

#### learning_progress [学習進捗]

学習者の進捗状況

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 進捗ID |
| user_id | UUID | FK → users(BC-003), NOT NULL | ユーザーID |
| course_id | UUID | FK → learning_courses, NOT NULL | コースID |
| status | VARCHAR(20) | NOT NULL | 状態（not_started/in_progress/completed/failed/expired） |
| enrolled_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 登録日時 |
| started_at | TIMESTAMPTZ | | 開始日時 |
| completed_at | TIMESTAMPTZ | | 完了日時 |
| last_accessed_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 最終アクセス日時 |
| completed_modules_count | INTEGER | DEFAULT 0 | 完了モジュール数 |
| total_modules_count | INTEGER | NOT NULL | 総モジュール数 |
| progress_percentage | DECIMAL(5,2) | DEFAULT 0 | 進捗率（0-100） |
| total_score | DECIMAL(5,2) | DEFAULT 0 | 総合スコア |
| certificate_id | UUID | FK → certifications | 証明書ID |
| expires_at | TIMESTAMPTZ | | 有効期限 |

**インデックス**:
- `idx_progress_user_course` UNIQUE on (user_id, course_id)
- `idx_progress_user_status` on (user_id, status, last_accessed_at DESC)
- `idx_progress_course` on (course_id, status)

**制約**:
- CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed', 'expired'))
- CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
- CHECK (completed_modules_count <= total_modules_count)

---

詳細なテーブル定義は [tables.md](tables.md) を参照してください。

---

## データモデル図 {#data-models}

### ナレッジ管理ERD

```
┌──────────────────────┐
│ knowledge_articles   │
│ - id (PK)           │
│ - title             │◄────────┐
│ - content           │         │
│ - status            │         │
│ - category_id (FK)  │         │
│ - author_id (FK)    │         │
│ - quality_scores    │         │
└──────────────────────┘         │
         │                       │
         │ 1:N                   │
         │                       │
         ▼                       │
┌──────────────────────┐         │
│ article_versions     │         │
│ - id (PK)           │         │
│ - article_id (FK)   │         │
│ - version           │         │
│ - content           │         │
└──────────────────────┘         │
                                │
┌──────────────────────┐         │
│ article_reviews      │         │
│ - id (PK)           │         │
│ - article_id (FK)   │─────────┘
│ - reviewer_id (FK)  │
│ - ratings           │
└──────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│ article_tags         │   N:M   │ tags                │
│ - article_id (FK)   │◄────────►│ - id (PK)           │
│ - tag_id (FK)       │         │ - name              │
└──────────────────────┘         └──────────────────────┘

┌──────────────────────┐
│ knowledge_categories │
│ - id (PK)           │
│ - name              │◄────┐
│ - parent_id (FK)    │─────┘ (Self-reference)
│ - hierarchy_level   │
└──────────────────────┘
```

### 学習システムERD

```
┌──────────────────────┐
│ learning_courses     │
│ - id (PK)           │◄────────┐
│ - title             │         │
│ - instructor_id     │         │
│ - level             │         │
└──────────────────────┘         │
         │                       │
         │ 1:N                   │
         │                       │
         ▼                       │
┌──────────────────────┐         │
│ course_modules       │         │
│ - id (PK)           │         │
│ - course_id (FK)    │         │
│ - order             │         │
└──────────────────────┘         │
         │                       │
         │ 1:N                   │
         │                       │
         ▼                       │
┌──────────────────────┐         │
│ course_materials     │         │
│ - id (PK)           │         │
│ - module_id (FK)    │         │
│ - type              │         │
└──────────────────────┘         │
                                │
┌──────────────────────┐         │
│ learning_progress    │         │
│ - id (PK)           │         │
│ - user_id (FK)      │         │
│ - course_id (FK)    │─────────┘
│ - status            │
│ - progress_pct      │
└──────────────────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────────┐
│ module_completions   │
│ - id (PK)           │
│ - progress_id (FK)  │
│ - module_id (FK)    │
│ - completed_at      │
└──────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│ learning_progress    │   1:1   │ certifications       │
│ - certificate_id    │────────►│ - id (PK)           │
└──────────────────────┘         │ - cert_number       │
                                │ - issue_date        │
                                └──────────────────────┘
```

---

## インデックス戦略 {#index-strategy}

### B-Tree インデックス

**用途**: 等価検索、範囲検索、ソート

```sql
-- 記事検索の最適化
CREATE INDEX idx_articles_status_published
  ON knowledge_articles(status, published_at DESC)
  WHERE status = 'published';

-- ユーザーの学習進捗検索
CREATE INDEX idx_progress_user_status
  ON learning_progress(user_id, status, last_accessed_at DESC);
```

### GIN インデックス

**用途**: 全文検索、JSONB検索、配列検索

```sql
-- 全文検索
CREATE INDEX idx_articles_search
  ON knowledge_articles
  USING GIN(search_vector);

-- タグ検索
CREATE INDEX idx_courses_tags
  ON learning_courses
  USING GIN(tags);
```

### IVFFlat インデックス（pgvector）

**用途**: ベクトル類似検索（AI埋め込み）

```sql
-- AI推奨のためのベクトル検索
CREATE INDEX idx_articles_embedding
  ON knowledge_articles
  USING ivfflat(embedding_vector vector_cosine_ops)
  WITH (lists = 100);
```

詳細は [indexes-constraints.md](indexes-constraints.md) を参照してください。

---

## パーティショニング戦略 {#partitioning-strategy}

### 時系列パーティショニング

大量データの効率的な管理

#### knowledge_usage（使用状況追跡）

月次パーティショニング

```sql
CREATE TABLE knowledge_usage (
  id UUID,
  user_id UUID,
  resource_type VARCHAR(50),
  resource_id UUID,
  action VARCHAR(50),
  tracked_at TIMESTAMPTZ NOT NULL,
  ...
) PARTITION BY RANGE (tracked_at);

-- 月次パーティション作成
CREATE TABLE knowledge_usage_2025_11
  PARTITION OF knowledge_usage
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
```

**パーティション管理**:
- 自動作成: 毎月1日に次月パーティション作成
- 保持期間: 24ヶ月（2年間）
- アーカイブ: 2年経過したパーティションをS3に移行

---

## データフロー {#data-flows}

### 1. ナレッジ記事公開フロー

```
1. INSERT into knowledge_articles (status='draft')
   ├─ トリガー: search_vector自動生成
   └─ トリガー: embedding_vector生成ジョブ投入

2. INSERT into article_tags (記事-タグ関連)

3. INSERT into article_reviews (レビュー依頼)
   └─ 通知: BC-007経由でレビュワーに通知

4. UPDATE article_reviews (レビュー完了)
   └─ トリガー: quality_score再計算

5. UPDATE knowledge_articles (status='review')

6. UPDATE knowledge_articles (status='published')
   ├─ INSERT into article_versions (バージョン保存)
   └─ 通知: BC-007経由で購読者に通知

7. INSERT into knowledge_usage (閲覧記録)
   └─ UPDATE view_count (インクリメント)
```

### 2. コース受講フロー

```
1. INSERT into learning_progress (enrollment)
   └─ UPDATE learning_courses.enrollment_count

2. UPDATE learning_progress (status='in_progress', started_at)

3. For each module:
   ├─ INSERT into module_completions
   └─ UPDATE learning_progress (progress_percentage)

4. For each assessment:
   ├─ INSERT into assessment_results
   └─ UPDATE learning_progress (total_score)

5. IF all modules completed AND all assessments passed:
   ├─ UPDATE learning_progress (status='completed')
   ├─ INSERT into certifications (証明書発行)
   └─ UPDATE learning_courses.completion_count

6. INSERT into knowledge_usage (学習活動記録)
```

詳細なクエリパターンは [query-patterns.md](query-patterns.md) を参照してください。

---

## パフォーマンス最適化 {#performance-optimization}

### クエリ最適化

#### 1. N+1問題の回避

```sql
-- Bad: N+1問題
SELECT * FROM knowledge_articles WHERE status = 'published';
-- 各記事ごとにタグを取得（N回のクエリ）

-- Good: JOIN使用
SELECT
  a.*,
  array_agg(t.name) as tags
FROM knowledge_articles a
LEFT JOIN article_tags at ON a.id = at.article_id
LEFT JOIN tags t ON at.tag_id = t.id
WHERE a.status = 'published'
GROUP BY a.id;
```

#### 2. カバリングインデックス

```sql
-- 頻繁に使用されるクエリ用
CREATE INDEX idx_articles_list_covering
  ON knowledge_articles(status, published_at DESC)
  INCLUDE (id, title, summary, quality_score_overall, view_count);
```

#### 3. パーティションプルーニング

```sql
-- パーティションを限定して検索
SELECT * FROM knowledge_usage
WHERE tracked_at >= '2025-11-01'
  AND tracked_at < '2025-12-01';
-- → knowledge_usage_2025_11 パーティションのみスキャン
```

### キャッシュ戦略

| データ種別 | キャッシュ層 | TTL | 更新戦略 |
|-----------|-----------|-----|---------|
| 公開記事 | Redis | 5分 | Write-through |
| カテゴリ階層 | Redis | 1時間 | Lazy loading |
| コース一覧 | Redis | 10分 | Write-through |
| 学習進捗 | なし | - | 常に最新を取得 |

---

## 詳細ドキュメント {#detailed-docs}

BC-006データ層の詳細は以下のドキュメントを参照してください:

1. **[tables.md](tables.md)** - テーブル定義詳細
   - 全27テーブルの詳細スキーマ
   - カラム定義、型、制約
   - リレーションシップ

2. **[indexes-constraints.md](indexes-constraints.md)** - インデックスと制約
   - インデックス一覧と設計根拠
   - 制約定義（FK、CHECK、UNIQUE）
   - パフォーマンス考察

3. **[query-patterns.md](query-patterns.md)** - クエリパターン集
   - 頻出クエリのベストプラクティス
   - 複雑な集計クエリ
   - パフォーマンスチューニング例

4. **[backup-operations.md](backup-operations.md)** - バックアップと運用
   - バックアップ戦略
   - リストア手順
   - パーティション管理
   - モニタリング

---

## データ容量見積もり

### 想定規模（3年後）

| テーブル | レコード数 | 平均サイズ | 合計容量 |
|---------|-----------|----------|---------|
| knowledge_articles | 50,000 | 50KB | 2.5GB |
| article_versions | 150,000 | 50KB | 7.5GB |
| learning_courses | 1,000 | 30KB | 30MB |
| learning_progress | 500,000 | 5KB | 2.5GB |
| module_completions | 5,000,000 | 1KB | 5GB |
| knowledge_usage | 100,000,000 | 500B | 50GB |
| **合計** | - | - | **~70GB** |

### ストレージ要件

- **データベース**: 100GB（成長余裕込み）
- **インデックス**: 50GB（データの50%）
- **バックアップ**: 300GB（7日分フル + アーカイブログ）
- **合計**: 450GB

---

**最終更新**: 2025-11-04
**ステータス**: Phase 2.4 - BC-006 データ層詳細化
