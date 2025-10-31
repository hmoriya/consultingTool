# BC-006: API設計

**BC**: Knowledge Management & Organizational Learning
**作成日**: 2025-10-31
**V2移行元**: services/knowledge-co-creation-service/api/

---

## 概要

このディレクトリは、BC-006（ナレッジ管理と組織学習）のAPI設計を定義します。

**重要**: Issue #146対応により、API設計はWHAT（能力定義）とHOW（利用方法）に分離されています。

---

## 主要APIエンドポイント

### Knowledge Article Management API
```
POST   /api/bc-006/knowledge/articles
GET    /api/bc-006/knowledge/articles/{articleId}
PUT    /api/bc-006/knowledge/articles/{articleId}
DELETE /api/bc-006/knowledge/articles/{articleId}
GET    /api/bc-006/knowledge/articles
POST   /api/bc-006/knowledge/articles/{articleId}/publish
POST   /api/bc-006/knowledge/articles/{articleId}/validate
```

### Knowledge Search & Discovery API
```
GET    /api/bc-006/knowledge/search?q={query}&category={category}
GET    /api/bc-006/knowledge/recommend?context={context}
POST   /api/bc-006/knowledge/apply
```

### Tag & Category Management API
```
POST   /api/bc-006/knowledge/tags
GET    /api/bc-006/knowledge/tags
POST   /api/bc-006/knowledge/categories
GET    /api/bc-006/knowledge/categories
GET    /api/bc-006/knowledge/categories/{categoryId}/articles
```

### Best Practice Management API
```
POST   /api/bc-006/knowledge/best-practices
GET    /api/bc-006/knowledge/best-practices/{practiceId}
GET    /api/bc-006/knowledge/best-practices
POST   /api/bc-006/knowledge/best-practices/{practiceId}/apply
```

---

## BC間連携API

### 全BCへのナレッジ検索サービス提供
```
GET /api/bc-006/knowledge/search?q={query}&context={bc-context}
GET /api/bc-006/knowledge/recommend?context={bc-context}
```

### BC-001 (Project) からのナレッジ抽出
```
POST /api/bc-006/knowledge/extract-from-project
Body: { projectId, lessonLearned, bestPractices }
```

---

**ステータス**: Phase 0 - 基本構造作成完了
