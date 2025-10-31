# BC-006: データ設計

**BC**: Knowledge Management & Organizational Learning
**作成日**: 2025-10-31
**V2移行元**: services/knowledge-co-creation-service/database-design.md

---

## 概要

このドキュメントは、BC-006（ナレッジ管理と組織学習）のデータモデルとデータベース設計を定義します。

---

## 主要テーブル

### knowledge_articles
ナレッジ記事

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 記事ID |
| title | VARCHAR(200) | NOT NULL | タイトル |
| content | TEXT | NOT NULL | 内容 |
| status | VARCHAR(20) | NOT NULL | 状態（draft/review/published/archived） |
| quality_score | DECIMAL(3,2) | DEFAULT 0 | 品質スコア |
| view_count | INTEGER | DEFAULT 0 | 閲覧数 |
| author_id | UUID | FK → users（BC-003）, NOT NULL | 作成者 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |
| published_at | TIMESTAMP | | 公開日時 |

**インデックス**: status, author_id, published_at

---

### tags
タグ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | タグID |
| name | VARCHAR(50) | NOT NULL, UNIQUE | タグ名 |
| usage_count | INTEGER | DEFAULT 0 | 使用頻度 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: name

---

### categories
カテゴリ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | カテゴリID |
| name | VARCHAR(100) | NOT NULL | カテゴリ名 |
| parent_category_id | UUID | FK → categories | 親カテゴリID |
| hierarchy_level | INTEGER | DEFAULT 0 | 階層レベル |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: parent_category_id

---

### article_tags
記事タグ関連

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 関連ID |
| article_id | UUID | FK → knowledge_articles, NOT NULL | 記事ID |
| tag_id | UUID | FK → tags, NOT NULL | タグID |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: article_id, tag_id
**ユニーク制約**: (article_id, tag_id)

---

### article_categories
記事カテゴリ関連

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 関連ID |
| article_id | UUID | FK → knowledge_articles, NOT NULL | 記事ID |
| category_id | UUID | FK → categories, NOT NULL | カテゴリID |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: article_id, category_id

---

### best_practices
ベストプラクティス

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | プラクティスID |
| name | VARCHAR(200) | NOT NULL | プラクティス名 |
| description | TEXT | NOT NULL | 説明 |
| success_story | TEXT | | 成功事例 |
| application_count | INTEGER | DEFAULT 0 | 適用回数 |
| project_id | UUID | FK → projects（BC-001） | 元プロジェクトID |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: project_id, application_count

---

## データフロー

### ナレッジ作成フロー
```
1. knowledge_articles テーブルにINSERT（status = draft）
2. article_tags テーブルにタグ関連INSERT
3. article_categories テーブルにカテゴリ関連INSERT
4. 検証完了後、status = published に更新
5. BC-007 へ公開通知
```

### ナレッジ検索フロー
```
1. knowledge_articles テーブルで全文検索
2. article_tags, article_categories で絞り込み
3. quality_score, view_count でランキング
4. 検索結果返却
5. view_count をインクリメント
```

---

**ステータス**: Phase 0 - 基本構造作成完了
