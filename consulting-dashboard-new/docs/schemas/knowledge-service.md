# ナレッジサービス データベーススキーマ仕様

## 基本情報
- データベース: SQLite
- ファイルパス: `prisma/knowledge-service/data/knowledge.db`
- 文字エンコーディング: UTF-8
- タイムゾーン: UTC

## パラソルドメイン言語型システム
```
UUID: 36文字の一意識別子
STRING_N: 最大N文字の可変長文字列
TEXT: 長文テキスト（制限なし）
TIMESTAMP: ISO 8601形式の日時
BOOLEAN: 真偽値
ENUM: 列挙型
JSON: JSON形式のデータ
INTEGER: 32ビット整数
DECIMAL: 小数点数値
URL: URL形式の文字列
```

## テーブル定義

### 1. Articles（ナレッジ記事）

**説明**: ナレッジベース記事

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | 記事ID |
| title | STRING_200 | NOT NULL | タイトル |
| slug | STRING_100 | UNIQUE, NOT NULL | URLスラグ |
| content | TEXT | NOT NULL | 本文（Markdown） |
| summary | TEXT | NULL | 要約 |
| authorId | UUID | NOT NULL | 作成者ID |
| categoryId | UUID | NOT NULL | カテゴリID |
| status | ENUM | NOT NULL DEFAULT 'Draft' | ステータス |
| publishedAt | TIMESTAMP | NULL | 公開日時 |
| viewCount | INTEGER | DEFAULT 0 | 閲覧数 |
| likeCount | INTEGER | DEFAULT 0 | いいね数 |
| tags | JSON | NULL | タグリスト |
| metadata | JSON | NULL | メタデータ |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_articles_slug` (slug) - UNIQUE
- `idx_articles_authorId` (authorId)
- `idx_articles_categoryId` (categoryId)
- `idx_articles_status` (status)
- `idx_articles_publishedAt` (publishedAt)

**ENUM定義**:
- `status`: Draft, Review, Published, Archived

---

### 2. Categories（カテゴリ）

**説明**: 記事カテゴリ

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | カテゴリID |
| name | STRING_100 | UNIQUE, NOT NULL | カテゴリ名 |
| slug | STRING_100 | UNIQUE, NOT NULL | URLスラグ |
| description | TEXT | NULL | 説明 |
| parentId | UUID | NULL | 親カテゴリID |
| displayOrder | INTEGER | DEFAULT 0 | 表示順 |
| isActive | BOOLEAN | DEFAULT true | 有効フラグ |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_categories_slug` (slug) - UNIQUE
- `idx_categories_parentId` (parentId)
- `idx_categories_displayOrder` (displayOrder)

**外部キー**:
- `parentId` → `Categories.id` (SET NULL)

---

### 3. Templates（テンプレート）

**説明**: ドキュメントテンプレート

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | テンプレートID |
| name | STRING_200 | NOT NULL | テンプレート名 |
| type | ENUM | NOT NULL | テンプレートタイプ |
| description | TEXT | NULL | 説明 |
| content | TEXT | NOT NULL | テンプレート内容 |
| variables | JSON | NULL | 変数定義 |
| categoryId | UUID | NULL | カテゴリID |
| usageCount | INTEGER | DEFAULT 0 | 使用回数 |
| isPublic | BOOLEAN | DEFAULT true | 公開フラグ |
| createdBy | UUID | NOT NULL | 作成者ID |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_templates_type` (type)
- `idx_templates_categoryId` (categoryId)
- `idx_templates_createdBy` (createdBy)

**外部キー**:
- `categoryId` → `Categories.id` (SET NULL)

**ENUM定義**:
- `type`: Proposal, Report, Presentation, Contract, Specification, Other

---

### 4. FAQs（よくある質問）

**説明**: FAQ管理

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | FAQ ID |
| question | TEXT | NOT NULL | 質問 |
| answer | TEXT | NOT NULL | 回答 |
| categoryId | UUID | NULL | カテゴリID |
| displayOrder | INTEGER | DEFAULT 0 | 表示順 |
| isPublished | BOOLEAN | DEFAULT false | 公開フラグ |
| viewCount | INTEGER | DEFAULT 0 | 閲覧数 |
| helpfulCount | INTEGER | DEFAULT 0 | 役立った数 |
| tags | JSON | NULL | タグリスト |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_faqs_categoryId` (categoryId)
- `idx_faqs_displayOrder` (displayOrder)
- `idx_faqs_isPublished` (isPublished)

**外部キー**:
- `categoryId` → `Categories.id` (SET NULL)

---

### 5. Experts（エキスパート）

**説明**: 専門家プロフィール

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | エキスパートID |
| userId | UUID | UNIQUE, NOT NULL | ユーザーID |
| title | STRING_100 | NOT NULL | 肩書き |
| bio | TEXT | NULL | 経歴 |
| expertise | JSON | NOT NULL | 専門分野リスト |
| availability | ENUM | NOT NULL | 利用可能状態 |
| consultationRate | DECIMAL | NULL | 相談料/時 |
| languages | JSON | NULL | 対応言語 |
| certifications | JSON | NULL | 資格情報 |
| rating | DECIMAL | DEFAULT 0 | 評価 |
| consultationCount | INTEGER | DEFAULT 0 | 相談回数 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_experts_userId` (userId) - UNIQUE
- `idx_experts_availability` (availability)
- `idx_experts_rating` (rating)

**ENUM定義**:
- `availability`: Available, Busy, Away, Offline

---

### 6. SearchHistory（検索履歴）

**説明**: ユーザー検索履歴

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | 履歴ID |
| userId | UUID | NOT NULL | ユーザーID |
| query | TEXT | NOT NULL | 検索クエリ |
| filters | JSON | NULL | 検索フィルタ |
| resultCount | INTEGER | DEFAULT 0 | 検索結果数 |
| clickedResults | JSON | NULL | クリックした結果 |
| searchedAt | TIMESTAMP | NOT NULL | 検索日時 |

**インデックス**:
- `idx_search_history_userId` (userId)
- `idx_search_history_searchedAt` (searchedAt)

---

### 7. ArticleVersions（記事バージョン）

**説明**: 記事の編集履歴

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | バージョンID |
| articleId | UUID | NOT NULL | 記事ID |
| version | INTEGER | NOT NULL | バージョン番号 |
| title | STRING_200 | NOT NULL | タイトル |
| content | TEXT | NOT NULL | 本文 |
| summary | TEXT | NULL | 要約 |
| editorId | UUID | NOT NULL | 編集者ID |
| changeNotes | TEXT | NULL | 変更内容 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**:
- `idx_article_versions_composite` (articleId, version) - UNIQUE
- `idx_article_versions_articleId` (articleId)
- `idx_article_versions_editorId` (editorId)

**外部キー**:
- `articleId` → `Articles.id` (CASCADE DELETE)

---

### 8. ArticleReactions（記事リアクション）

**説明**: 記事への反応（いいね、ブックマーク等）

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | リアクションID |
| articleId | UUID | NOT NULL | 記事ID |
| userId | UUID | NOT NULL | ユーザーID |
| type | ENUM | NOT NULL | リアクションタイプ |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**:
- `idx_article_reactions_composite` (articleId, userId, type) - UNIQUE
- `idx_article_reactions_articleId` (articleId)
- `idx_article_reactions_userId` (userId)

**外部キー**:
- `articleId` → `Articles.id` (CASCADE DELETE)

**ENUM定義**:
- `type`: Like, Bookmark, Share, Report

---

### 9. Comments（コメント）

**説明**: 記事コメント

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | コメントID |
| articleId | UUID | NOT NULL | 記事ID |
| userId | UUID | NOT NULL | ユーザーID |
| parentId | UUID | NULL | 親コメントID |
| content | TEXT | NOT NULL | コメント内容 |
| isEdited | BOOLEAN | DEFAULT false | 編集済みフラグ |
| editedAt | TIMESTAMP | NULL | 編集日時 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**:
- `idx_comments_articleId` (articleId)
- `idx_comments_userId` (userId)
- `idx_comments_parentId` (parentId)

**外部キー**:
- `articleId` → `Articles.id` (CASCADE DELETE)
- `parentId` → `Comments.id` (CASCADE DELETE)

---

## リレーション図

```
Articles
  ├─ Categories (N:1)
  ├─ ArticleVersions (1:N)
  ├─ ArticleReactions (1:N)
  └─ Comments (1:N)

Categories
  ├─ Categories (self-reference for hierarchy)
  ├─ Articles (1:N)
  ├─ Templates (1:N)
  └─ FAQs (1:N)

Templates
  └─ Categories (N:1)

Comments
  └─ Comments (self-reference for replies)

Experts
  └─ Users (1:1)
```

## データ保持ポリシー

| テーブル | 保持期間 | 削除条件 |
|---------|---------|----------|
| SearchHistory | 90日 | searchedAtから90日経過 |
| ArticleVersions | 無期限 | 記事削除時のみ |
| ArticleReactions | 無期限 | 記事削除時のみ |
| Comments | 無期限 | 記事削除時のみ |

## パフォーマンス考慮事項

1. **全文検索**: 記事とFAQに全文検索インデックスを設定
2. **キャッシュ**: 人気記事、FAQ、カテゴリツリーのRedisキャッシュ
3. **非同期処理**: 検索インデックス更新、推薦計算のバックグラウンド処理
4. **CDN**: 画像、添付ファイルのCDN配信