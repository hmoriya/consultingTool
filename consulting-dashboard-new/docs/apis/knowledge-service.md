# ナレッジサービス API仕様

## 基本情報
- ベースパス: `/api/knowledge`
- 認証方式: JWT Bearer Token
- レート制限: 100リクエスト/分/IP
- バージョン: v1.0.0

## エンドポイント定義

### 1. ナレッジ記事管理

#### GET /api/knowledge/articles
**説明**: ナレッジ記事一覧の取得

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| search | STRING | - | 検索キーワード |
| categoryId | UUID | - | カテゴリIDフィルター |
| tags | ARRAY[STRING] | - | タグフィルター |
| authorId | UUID | - | 著者IDフィルター |
| status | ENUM | - | ステータスフィルター |
| sortBy | ENUM | - | ソート順（views/likes/date） |
| page | INTEGER | - | ページ番号（デフォルト: 1） |
| limit | INTEGER | - | 件数（デフォルト: 20） |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| articles | ARRAY[ARTICLE] | 記事一覧 |
| total | INTEGER | 総件数 |
| page | INTEGER | 現在のページ |
| totalPages | INTEGER | 総ページ数 |

---

#### GET /api/knowledge/articles/:id
**説明**: ナレッジ記事詳細の取得

**認証**: 必要

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | 記事ID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| id | UUID | 記事ID |
| title | STRING_200 | タイトル |
| content | TEXT | 本文（Markdown） |
| summary | STRING_500 | 要約 |
| categoryId | UUID | カテゴリID |
| tags | ARRAY[STRING] | タグ |
| authorId | UUID | 著者ID |
| status | ENUM | ステータス |
| viewCount | INTEGER | 閲覧数 |
| likeCount | INTEGER | いいね数 |
| attachments | ARRAY[ATTACHMENT] | 添付ファイル |
| relatedArticles | ARRAY[UUID] | 関連記事ID |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |
| publishedAt | TIMESTAMP | 公開日時 |

---

#### POST /api/knowledge/articles
**説明**: 新規ナレッジ記事の作成

**認証**: 必要

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| title | STRING_200 | ✓ | タイトル |
| content | TEXT | ✓ | 本文（Markdown） |
| summary | STRING_500 | - | 要約 |
| categoryId | UUID | ✓ | カテゴリID |
| tags | ARRAY[STRING] | - | タグ |
| status | ENUM | - | ステータス（draft/published） |
| attachmentIds | ARRAY[UUID] | - | 添付ファイルID |
| relatedArticleIds | ARRAY[UUID] | - | 関連記事ID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| article | ARTICLE_OBJECT | 作成された記事 |

---

#### PUT /api/knowledge/articles/:id
**説明**: ナレッジ記事の更新

**認証**: 必要（著者本人または管理者）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | 記事ID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| title | STRING_200 | - | タイトル |
| content | TEXT | - | 本文（Markdown） |
| summary | STRING_500 | - | 要約 |
| categoryId | UUID | - | カテゴリID |
| tags | ARRAY[STRING] | - | タグ |
| status | ENUM | - | ステータス |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| article | ARTICLE_OBJECT | 更新された記事 |

---

#### DELETE /api/knowledge/articles/:id
**説明**: ナレッジ記事の削除

**認証**: 必要（著者本人または管理者）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | 記事ID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| deleted | BOOLEAN | 削除成功フラグ |

---

#### POST /api/knowledge/articles/:id/like
**説明**: 記事にいいねする

**認証**: 必要

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | 記事ID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| liked | BOOLEAN | いいね状態 |
| likeCount | INTEGER | 総いいね数 |

---

### 2. 検索機能

#### GET /api/knowledge/search
**説明**: ナレッジの全文検索

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| q | STRING | ✓ | 検索クエリ |
| type | ARRAY[ENUM] | - | 検索対象（article/template/faq） |
| filters | OBJECT | - | 詳細フィルター |
| page | INTEGER | - | ページ番号 |
| limit | INTEGER | - | 件数 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| results | ARRAY[SEARCH_RESULT] | 検索結果 |
| facets | OBJECT | ファセット情報 |
| total | INTEGER | 総件数 |
| suggestions | ARRAY[STRING] | 検索候補 |

---

### 3. カテゴリ管理

#### GET /api/knowledge/categories
**説明**: カテゴリ一覧の取得

**認証**: 必要

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| categories | ARRAY[CATEGORY] | カテゴリ一覧（階層構造） |

---

#### POST /api/knowledge/categories
**説明**: 新規カテゴリの作成

**認証**: 管理者権限

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| name | STRING_100 | ✓ | カテゴリ名 |
| description | TEXT | - | 説明 |
| parentId | UUID | - | 親カテゴリID |
| icon | STRING_50 | - | アイコン |
| order | INTEGER | - | 表示順 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| category | CATEGORY_OBJECT | 作成されたカテゴリ |

---

### 4. テンプレート管理

#### GET /api/knowledge/templates
**説明**: テンプレート一覧の取得

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| categoryId | UUID | - | カテゴリIDフィルター |
| type | ENUM | - | テンプレートタイプ |
| search | STRING | - | 検索キーワード |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| templates | ARRAY[TEMPLATE] | テンプレート一覧 |

---

#### GET /api/knowledge/templates/:id
**説明**: テンプレート詳細の取得

**認証**: 必要

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | テンプレートID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| id | UUID | テンプレートID |
| name | STRING_200 | テンプレート名 |
| description | TEXT | 説明 |
| content | TEXT | テンプレート内容 |
| categoryId | UUID | カテゴリID |
| type | ENUM | テンプレートタイプ |
| variables | ARRAY[VARIABLE] | 変数定義 |
| usageCount | INTEGER | 使用回数 |
| createdBy | UUID | 作成者ID |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |

---

#### POST /api/knowledge/templates
**説明**: 新規テンプレートの作成

**認証**: 必要

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| name | STRING_200 | ✓ | テンプレート名 |
| description | TEXT | - | 説明 |
| content | TEXT | ✓ | テンプレート内容 |
| categoryId | UUID | ✓ | カテゴリID |
| type | ENUM | ✓ | テンプレートタイプ |
| variables | ARRAY[VARIABLE] | - | 変数定義 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| template | TEMPLATE_OBJECT | 作成されたテンプレート |

---

#### POST /api/knowledge/templates/:id/use
**説明**: テンプレートの使用（インスタンス化）

**認証**: 必要

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | テンプレートID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| variables | OBJECT | - | 変数値のマッピング |
| targetProjectId | UUID | - | 対象プロジェクトID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| content | TEXT | 生成されたコンテンツ |
| documentId | UUID | 作成されたドキュメントID |

---

### 5. FAQ管理

#### GET /api/knowledge/faqs
**説明**: FAQ一覧の取得

**認証**: 不要（公開）

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| categoryId | UUID | - | カテゴリIDフィルター |
| search | STRING | - | 検索キーワード |
| popular | BOOLEAN | - | 人気順表示 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| faqs | ARRAY[FAQ] | FAQ一覧 |

---

#### POST /api/knowledge/faqs
**説明**: 新規FAQの作成

**認証**: 管理者権限

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| question | TEXT | ✓ | 質問 |
| answer | TEXT | ✓ | 回答 |
| categoryId | UUID | ✓ | カテゴリID |
| tags | ARRAY[STRING] | - | タグ |
| order | INTEGER | - | 表示順 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| faq | FAQ_OBJECT | 作成されたFAQ |

---

### 6. エキスパート検索

#### GET /api/knowledge/experts
**説明**: エキスパート検索

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| skillIds | ARRAY[UUID] | - | スキルIDフィルター |
| domain | STRING | - | 専門領域 |
| availability | BOOLEAN | - | 稼働可能フラグ |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| experts | ARRAY[EXPERT] | エキスパート一覧 |

---

#### GET /api/knowledge/experts/:id
**説明**: エキスパート詳細の取得

**認証**: 必要

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | エキスパートID（ユーザーID） |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| userId | UUID | ユーザーID |
| name | STRING_100 | 氏名 |
| title | STRING_100 | 役職 |
| expertise | ARRAY[EXPERTISE] | 専門分野 |
| contributions | ARRAY[CONTRIBUTION] | 貢献実績 |
| availability | ENUM | 稼働状況 |
| rating | DECIMAL | 評価 |
| consultationCount | INTEGER | 相談回数 |

---

## 型定義

### ARTICLE_OBJECT
```
{
  id: UUID,
  title: STRING_200,
  content: TEXT,
  summary: STRING_500,
  categoryId: UUID,
  tags: ARRAY[STRING],
  authorId: UUID,
  status: ENUM[Draft|Published|Archived],
  viewCount: INTEGER,
  likeCount: INTEGER
}
```

### TEMPLATE_OBJECT
```
{
  id: UUID,
  name: STRING_200,
  description: TEXT,
  content: TEXT,
  categoryId: UUID,
  type: ENUM[Document|Report|Proposal|Checklist],
  variables: ARRAY[VARIABLE],
  usageCount: INTEGER
}
```

### FAQ_OBJECT
```
{
  id: UUID,
  question: TEXT,
  answer: TEXT,
  categoryId: UUID,
  tags: ARRAY[STRING],
  viewCount: INTEGER,
  helpfulCount: INTEGER,
  order: INTEGER
}
```

### CATEGORY_OBJECT
```
{
  id: UUID,
  name: STRING_100,
  description: TEXT,
  parentId: UUID,
  icon: STRING_50,
  order: INTEGER,
  articleCount: INTEGER,
  children: ARRAY[CATEGORY_OBJECT]
}
```

### SEARCH_RESULT
```
{
  id: UUID,
  type: ENUM[Article|Template|FAQ],
  title: STRING,
  excerpt: TEXT,
  score: DECIMAL,
  highlights: ARRAY[STRING]
}
```

### VARIABLE
```
{
  name: STRING_50,
  type: ENUM[String|Number|Date|Boolean|List],
  required: BOOLEAN,
  defaultValue: ANY,
  description: STRING
}
```

## エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| ARTICLE_NOT_FOUND | 404 | 記事が存在しない |
| TEMPLATE_NOT_FOUND | 404 | テンプレートが存在しない |
| FAQ_NOT_FOUND | 404 | FAQが存在しない |
| CATEGORY_NOT_FOUND | 404 | カテゴリが存在しない |
| EXPERT_NOT_FOUND | 404 | エキスパートが存在しない |
| UNAUTHORIZED_EDIT | 403 | 編集権限なし |
| INVALID_TEMPLATE_VARS | 400 | テンプレート変数エラー |
| SEARCH_QUERY_TOO_SHORT | 400 | 検索クエリが短すぎる |