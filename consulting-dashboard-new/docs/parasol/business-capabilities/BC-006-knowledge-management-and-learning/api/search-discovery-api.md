# BC-006: 検索・発見API詳細 [Search & Discovery API Details]

**BC**: Knowledge Management & Organizational Learning [ナレッジ管理と組織学習] [BC_006]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03
**V2移行元**: services/knowledge-co-creation-service/api/

---

## 目次

1. [概要](#overview)
2. [Knowledge Search API](#knowledge-search-api)
3. [Knowledge Recommendation API](#knowledge-recommendation-api)
4. [Course Recommendation API](#course-recommendation-api)
5. [Knowledge Gap Analysis API](#knowledge-gap-analysis-api)
6. [Usage Tracking API](#usage-tracking-api)
7. [データスキーマ](#data-schemas)
8. [使用例](#usage-examples)

---

## 概要 {#overview}

検索・発見APIは、ナレッジとコースの高度な検索、パーソナライズド推奨、スキルギャップ分析、使用状況追跡の機能を提供します。

### エンドポイント概要

| グループ | エンドポイント数 | 説明 |
|---------|---------------|------|
| Search API | 4 | 全文検索、関連ナレッジ検索 |
| Knowledge Recommendation API | 3 | パーソナライズド推奨 |
| Course Recommendation API | 3 | コース推奨、学習経路提案 |
| Gap Analysis API | 3 | スキルギャップ分析 |
| Usage Tracking API | 2 | 使用状況追跡、分析 |

**合計**: 15エンドポイント

---

## Knowledge Search API {#knowledge-search-api}

### 1. ナレッジ全文検索 [Full Text Search]

ナレッジ記事を全文検索します。

**エンドポイント**:
```
GET /api/v1/bc-006/search/knowledge
```

**権限**: `knowledge:read`

**クエリパラメータ**:
- `q` (string, required): 検索クエリ
- `categoryId` (string, optional): カテゴリID
- `tags` (string[], optional): タグ（カンマ区切り）
- `level` (string, optional): スキルレベル
- `minQualityScore` (number, optional): 最低品質スコア (0-5)
- `status` (string, optional): `published` (default), `all`
- `sort` (string, optional): ソート (`relevance` (default), `viewCount:desc`, `qualityScore:desc`, `publishedAt:desc`)
- `limit` (number, optional): 取得件数 (default: 20, max: 100)
- `offset` (number, optional): オフセット (default: 0)

**レスポンス**: `200 OK`
```json
{
  "query": "TypeScript エラーハンドリング",
  "results": [
    {
      "id": "art-uuid-001",
      "title": "TypeScriptでのエラーハンドリングベストプラクティス",
      "summary": "TypeScriptプロジェクトにおける効果的なエラーハンドリングパターン",
      "categoryId": "cat-uuid-001",
      "categoryName": "プログラミング",
      "authorId": "user-uuid-001",
      "authorName": "山田太郎",
      "tags": ["typescript", "error-handling", "best-practices"],
      "qualityScore": {
        "overall": 4.4
      },
      "viewCount": 1523,
      "likeCount": 89,
      "publishedAt": "2025-11-03T11:00:00.000Z",
      "relevanceScore": 0.95,
      "highlights": {
        "title": "<em>TypeScript</em>での<em>エラーハンドリング</em>ベストプラクティス",
        "content": "...<em>TypeScript</em>の型システムを活用した<em>エラーハンドリング</em>..."
      }
    },
    {
      "id": "art-uuid-002",
      "title": "例外処理の設計パターン",
      "summary": "モダンなアプリケーションにおける例外処理の設計",
      "categoryId": "cat-uuid-002",
      "categoryName": "設計パターン",
      "authorId": "user-uuid-003",
      "authorName": "佐藤花子",
      "tags": ["error-handling", "design-patterns"],
      "qualityScore": {
        "overall": 4.2
      },
      "viewCount": 987,
      "likeCount": 65,
      "publishedAt": "2025-10-15T14:00:00.000Z",
      "relevanceScore": 0.82,
      "highlights": {
        "content": "...<em>エラーハンドリング</em>の一般的なパターン..."
      }
    }
  ],
  "facets": {
    "categories": [
      {
        "id": "cat-uuid-001",
        "name": "プログラミング",
        "count": 45
      },
      {
        "id": "cat-uuid-002",
        "name": "設計パターン",
        "count": 23
      }
    ],
    "tags": [
      {
        "name": "error-handling",
        "count": 68
      },
      {
        "name": "typescript",
        "count": 45
      }
    ]
  },
  "pagination": {
    "total": 68,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  },
  "searchMeta": {
    "took": 45,
    "query": "TypeScript エラーハンドリング",
    "queryTime": "2025-11-04T10:00:00.000Z"
  }
}
```

**使用例** (検索クエリの種類):
```
# 基本検索
GET /api/v1/bc-006/search/knowledge?q=TypeScript

# カテゴリフィルタ
GET /api/v1/bc-006/search/knowledge?q=React&categoryId=cat-uuid-001

# 複数タグフィルタ
GET /api/v1/bc-006/search/knowledge?q=API&tags=rest,graphql

# 品質スコアフィルタ
GET /api/v1/bc-006/search/knowledge?q=セキュリティ&minQualityScore=4.0

# ソート指定
GET /api/v1/bc-006/search/knowledge?q=パフォーマンス&sort=viewCount:desc
```

---

### 2. 関連ナレッジ検索 [Find Related Knowledge]

特定記事の関連ナレッジを検索します。

**エンドポイント**:
```
GET /api/v1/bc-006/search/related/{articleId}
```

**権限**: `knowledge:read`

**クエリパラメータ**:
- `limit` (number, optional): 取得件数 (default: 10, max: 20)
- `algorithm` (string, optional): アルゴリズム (`content_similarity`, `tag_similarity`, `category_match`, `hybrid` (default))

**レスポンス**: `200 OK`
```json
{
  "articleId": "art-uuid-001",
  "articleTitle": "TypeScriptでのエラーハンドリングベストプラクティス",
  "relatedArticles": [
    {
      "id": "art-uuid-010",
      "title": "TypeScriptの型システム徹底解説",
      "summary": "TypeScriptの高度な型機能を理解する",
      "categoryName": "プログラミング",
      "authorName": "田中次郎",
      "tags": ["typescript", "types"],
      "qualityScore": {
        "overall": 4.5
      },
      "viewCount": 2103,
      "publishedAt": "2025-10-20T10:00:00.000Z",
      "relationType": "content_similar",
      "relevanceScore": 0.88,
      "reason": "類似するTypeScriptの概念を扱っています"
    },
    {
      "id": "art-uuid-020",
      "title": "Promiseとasync/awaitのエラーハンドリング",
      "summary": "非同期処理における効果的なエラーハンドリング",
      "categoryName": "プログラミング",
      "authorName": "鈴木花子",
      "tags": ["javascript", "async", "error-handling"],
      "qualityScore": {
        "overall": 4.3
      },
      "viewCount": 1456,
      "publishedAt": "2025-09-15T14:00:00.000Z",
      "relationType": "tag_similar",
      "relevanceScore": 0.75,
      "reason": "同じエラーハンドリングのトピックです"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 10,
    "hasMore": true
  }
}
```

---

### 3. 高度な検索 [Advanced Search]

複雑な検索条件でナレッジを検索します。

**エンドポイント**:
```
POST /api/v1/bc-006/search/knowledge/advanced
```

**権限**: `knowledge:read`

**リクエストボディ**:
```json
{
  "query": {
    "text": "マイクロサービス アーキテクチャ",
    "fields": ["title", "content", "tags"],
    "operator": "AND"
  },
  "filters": {
    "categories": ["cat-uuid-001", "cat-uuid-002"],
    "tags": {
      "include": ["microservices", "architecture"],
      "exclude": ["deprecated"]
    },
    "dateRange": {
      "field": "publishedAt",
      "from": "2024-01-01T00:00:00.000Z",
      "to": "2025-12-31T23:59:59.999Z"
    },
    "qualityScore": {
      "min": 4.0,
      "max": 5.0
    },
    "authors": ["user-uuid-001", "user-uuid-003"]
  },
  "sort": [
    {
      "field": "qualityScore.overall",
      "order": "desc"
    },
    {
      "field": "viewCount",
      "order": "desc"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0
  }
}
```

**レスポンス**: `200 OK` (基本検索と同じ構造)

---

### 4. サジェスト検索 [Search Suggestions]

検索クエリのサジェストを提供します（オートコンプリート）。

**エンドポイント**:
```
GET /api/v1/bc-006/search/suggestions
```

**権限**: `knowledge:read`

**クエリパラメータ**:
- `q` (string, required): 部分クエリ (最低2文字)
- `limit` (number, optional): 提案数 (default: 10)

**レスポンス**: `200 OK`
```json
{
  "query": "Type",
  "suggestions": [
    {
      "text": "TypeScript",
      "type": "query",
      "frequency": 1523,
      "category": null
    },
    {
      "text": "TypeScript エラーハンドリング",
      "type": "query",
      "frequency": 345,
      "category": null
    },
    {
      "text": "TypeScriptでのエラーハンドリングベストプラクティス",
      "type": "article",
      "frequency": null,
      "articleId": "art-uuid-001"
    },
    {
      "text": "型システム",
      "type": "tag",
      "frequency": 678,
      "tagId": "tag-uuid-005"
    }
  ]
}
```

---

## Knowledge Recommendation API {#knowledge-recommendation-api}

### 1. パーソナライズド推奨 [Personalized Recommendations]

ユーザーに最適化されたナレッジを推奨します。

**エンドポイント**:
```
GET /api/v1/bc-006/recommend/knowledge
```

**権限**: `knowledge:read`

**クエリパラメータ**:
- `context` (string, optional): コンテキスト (`onboarding`, `project`, `skill_development`)
- `projectId` (string, optional): プロジェクトID（プロジェクトコンテキスト用）
- `skillIds` (string[], optional): 対象スキルID
- `limit` (number, optional): 推奨数 (default: 10, max: 20)

**レスポンス**: `200 OK`
```json
{
  "userId": "user-uuid-002",
  "context": "skill_development",
  "recommendations": [
    {
      "article": {
        "id": "art-uuid-015",
        "title": "Reactパフォーマンス最適化ガイド",
        "summary": "Reactアプリケーションのパフォーマンスを向上させるテクニック",
        "categoryName": "フロントエンド",
        "authorName": "山田太郎",
        "tags": ["react", "performance", "optimization"],
        "qualityScore": {
          "overall": 4.6
        },
        "viewCount": 2345,
        "publishedAt": "2025-10-01T10:00:00.000Z"
      },
      "recommendationScore": 0.92,
      "reasons": [
        {
          "type": "skill_match",
          "description": "あなたのReactスキルに関連しています",
          "weight": 0.5
        },
        {
          "type": "learning_history",
          "description": "最近閲覧したReact関連記事に基づく推奨",
          "weight": 0.3
        },
        {
          "type": "trending",
          "description": "最近人気が高まっている記事です",
          "weight": 0.2
        }
      ],
      "relevantSkills": [
        {
          "id": "skill-uuid-react",
          "name": "React",
          "currentLevel": "intermediate",
          "targetLevel": "advanced"
        }
      ]
    }
  ],
  "metadata": {
    "algorithm": "hybrid_collaborative_content",
    "generatedAt": "2025-11-04T10:00:00.000Z",
    "basedOn": {
      "viewHistory": 45,
      "likedArticles": 12,
      "skillProfile": true,
      "projectContext": false
    }
  }
}
```

---

### 2. プロジェクトベース推奨 [Project-Based Recommendations]

現在のプロジェクトに関連するナレッジを推奨します。

**エンドポイント**:
```
POST /api/v1/bc-006/recommend/knowledge/by-project
```

**権限**: `knowledge:read`

**リクエストボディ**:
```json
{
  "projectId": "proj-uuid-001",
  "includeRelatedProjects": true,
  "focus": ["technical", "process", "lessons_learned"],
  "limit": 10
}
```

**レスポンス**: `200 OK`
```json
{
  "projectId": "proj-uuid-001",
  "projectName": "次世代コアバンキングシステム",
  "recommendations": [
    {
      "article": {
        "id": "art-uuid-050",
        "title": "金融システムのセキュリティベストプラクティス",
        "summary": "金融業界向けシステム開発のセキュリティ対策",
        "tags": ["security", "finance", "compliance"]
      },
      "recommendationScore": 0.94,
      "reasons": [
        {
          "type": "project_domain_match",
          "description": "金融システムプロジェクトに直接関連",
          "weight": 0.6
        },
        {
          "type": "similar_project_success",
          "description": "類似プロジェクトで活用された記事",
          "similarProjectCount": 3,
          "weight": 0.4
        }
      ],
      "appliedInProjects": [
        {
          "projectId": "proj-uuid-010",
          "projectName": "モバイルバンキング",
          "impact": 0.85
        }
      ]
    }
  ],
  "metadata": {
    "basedOn": {
      "projectTags": ["finance", "microservices", "security"],
      "projectPhase": "design",
      "teamSkills": true,
      "similarProjects": 5
    }
  }
}
```

---

### 3. トレンドナレッジ [Trending Knowledge]

最近人気が高まっているナレッジを取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/recommend/knowledge/trending
```

**権限**: `knowledge:read`

**クエリパラメータ**:
- `period` (string, optional): 期間 (`day`, `week` (default), `month`)
- `categoryId` (string, optional): カテゴリフィルタ
- `limit` (number, optional): 取得件数 (default: 10)

**レスポンス**: `200 OK`
```json
{
  "period": "week",
  "periodStart": "2025-10-28T00:00:00.000Z",
  "periodEnd": "2025-11-04T23:59:59.999Z",
  "trending": [
    {
      "article": {
        "id": "art-uuid-100",
        "title": "AI活用開発の実践ガイド",
        "summary": "AIを活用した開発プロセスの効率化",
        "categoryName": "AI・機械学習",
        "authorName": "高橋太郎",
        "tags": ["ai", "llm", "development"],
        "qualityScore": {
          "overall": 4.7
        },
        "viewCount": 3456,
        "likeCount": 234,
        "publishedAt": "2025-10-25T10:00:00.000Z"
      },
      "trendScore": 0.95,
      "metrics": {
        "viewGrowth": 2.8,
        "likeGrowth": 3.2,
        "shareGrowth": 4.1,
        "commentGrowth": 2.5
      },
      "rank": 1,
      "rankChange": 5
    }
  ]
}
```

---

## Course Recommendation API {#course-recommendation-api}

### 1. パーソナライズドコース推奨 [Personalized Course Recommendations]

ユーザーのスキルプロファイルに基づいてコースを推奨します。

**エンドポイント**:
```
GET /api/v1/bc-006/recommend/courses
```

**権限**: `learning:course:read`

**クエリパラメータ**:
- `targetSkills` (string[], optional): 目標スキルID
- `level` (string, optional): 対象レベル
- `includeEnrolled` (boolean, optional): 登録済みコースも含むか (default: false)
- `limit` (number, optional): 推奨数 (default: 10)

**レスポンス**: `200 OK`
```json
{
  "userId": "user-uuid-002",
  "recommendations": [
    {
      "course": {
        "id": "course-uuid-010",
        "title": "React Hooks完全ガイド",
        "description": "React Hooksを基礎から応用まで学ぶ",
        "level": "intermediate",
        "category": "frontend",
        "instructorName": "山田太郎",
        "estimatedDuration": {
          "minutes": 600,
          "display": "10時間"
        },
        "enrollmentCount": 1234,
        "completionRate": 0.82,
        "averageRating": 4.7
      },
      "recommendationScore": 0.91,
      "reasons": [
        {
          "type": "skill_gap",
          "description": "Reactスキルを intermediate から advanced に向上",
          "skillId": "skill-uuid-react",
          "currentLevel": "intermediate",
          "targetLevel": "advanced",
          "weight": 0.5
        },
        {
          "type": "prerequisite_met",
          "description": "前提条件を満たしています",
          "completedPrerequisites": ["course-uuid-001"],
          "weight": 0.3
        },
        {
          "type": "peer_success",
          "description": "類似プロファイルのユーザーが高評価",
          "peerCompletionRate": 0.88,
          "weight": 0.2
        }
      ],
      "expectedImpact": {
        "skillImprovement": {
          "skillId": "skill-uuid-react",
          "currentLevel": "intermediate",
          "expectedLevel": "advanced"
        },
        "careerRelevance": 0.85
      }
    }
  ],
  "metadata": {
    "basedOn": {
      "currentSkillProfile": true,
      "learningHistory": true,
      "careerGoals": false,
      "peerComparisons": true
    },
    "generatedAt": "2025-11-04T11:00:00.000Z"
  }
}
```

---

### 2. 次のコース推奨 [Next Course Recommendation]

学習経路に基づいて次のコースを推奨します。

**エンドポイント**:
```
GET /api/v1/bc-006/recommend/courses/next
```

**権限**: `learning:course:read`

**クエリパラメータ**:
- `pathId` (string, optional): 学習経路ID（指定された経路に基づく）

**レスポンス**: `200 OK`
```json
{
  "userId": "user-uuid-002",
  "pathId": "path-uuid-001",
  "nextCourse": {
    "course": {
      "id": "course-uuid-015",
      "title": "TypeScript高度な型システム",
      "level": "advanced",
      "estimatedDuration": {
        "minutes": 480,
        "display": "8時間"
      }
    },
    "recommendationScore": 0.93,
    "reason": "TypeScript基礎コースを修了したので、次のステップとして推奨",
    "priority": 95,
    "prerequisites": {
      "met": true,
      "courses": ["course-uuid-001"]
    }
  },
  "alternatives": [
    {
      "courseId": "course-uuid-020",
      "courseTitle": "JavaScript ES2023の新機能",
      "recommendationScore": 0.78,
      "reason": "関連するスキル向上"
    }
  ]
}
```

---

### 3. スキルベースコース検索 [Skill-Based Course Search]

特定スキルのギャップを埋めるコースを検索します。

**エンドポイント**:
```
POST /api/v1/bc-006/recommend/courses/by-skill
```

**権限**: `learning:course:read`

**リクエストボディ**:
```json
{
  "skillId": "skill-uuid-react",
  "currentLevel": "beginner",
  "targetLevel": "intermediate",
  "learningStyle": "hands-on",
  "timeAvailable": {
    "hoursPerWeek": 5
  }
}
```

**レスポンス**: `200 OK`
```json
{
  "skillId": "skill-uuid-react",
  "skillName": "React",
  "currentLevel": "beginner",
  "targetLevel": "intermediate",
  "courses": [
    {
      "course": {
        "id": "course-uuid-005",
        "title": "React基礎から実践まで",
        "level": "beginner",
        "estimatedDuration": {
          "minutes": 720,
          "display": "12時間"
        }
      },
      "matchScore": 0.95,
      "skillCoverage": {
        "concepts": ["components", "hooks", "state", "props"],
        "coveragePercentage": 0.85
      },
      "estimatedCompletionTime": {
        "weeks": 3,
        "basedOnHoursPerWeek": 5
      }
    }
  ],
  "learningPath": {
    "totalCourses": 2,
    "totalDuration": {
      "minutes": 1320,
      "display": "22時間"
    },
    "estimatedWeeks": 5
  }
}
```

---

## Knowledge Gap Analysis API {#knowledge-gap-analysis-api}

### 1. スキルギャップ分析 [Analyze Skill Gaps]

ユーザーのスキルギャップを分析します。

**エンドポイント**:
```
POST /api/v1/bc-006/analyze/knowledge-gaps
```

**権限**: `learning:progress:read`

**リクエストボディ**:
```json
{
  "userId": "user-uuid-002",
  "targetRole": "senior-frontend-engineer",
  "targetSkills": [
    {
      "skillId": "skill-uuid-react",
      "targetLevel": "expert"
    },
    {
      "skillId": "skill-uuid-typescript",
      "targetLevel": "advanced"
    }
  ]
}
```

**レスポンス**: `200 OK`
```json
{
  "userId": "user-uuid-002",
  "userName": "鈴木一郎",
  "targetRole": "senior-frontend-engineer",
  "analysisDate": "2025-11-04T12:00:00.000Z",
  "skillGaps": [
    {
      "skillId": "skill-uuid-react",
      "skillName": "React",
      "currentLevel": "intermediate",
      "targetLevel": "expert",
      "gapSize": 2,
      "priority": "high",
      "recommendedKnowledge": [
        {
          "id": "art-uuid-100",
          "title": "React内部アーキテクチャ解説",
          "type": "article",
          "relevance": 0.92
        },
        {
          "id": "art-uuid-101",
          "title": "Reactパフォーマンス最適化の実践",
          "type": "article",
          "relevance": 0.88
        }
      ],
      "recommendedCourses": [
        {
          "id": "course-uuid-050",
          "title": "React上級者への道",
          "level": "advanced",
          "estimatedDuration": {
            "minutes": 900,
            "display": "15時間"
          },
          "skillCoverage": 0.85
        }
      ],
      "estimatedLearningTime": {
        "minutes": 2400,
        "display": "40時間"
      }
    },
    {
      "skillId": "skill-uuid-testing",
      "skillName": "フロントエンドテスティング",
      "currentLevel": "beginner",
      "targetLevel": "intermediate",
      "gapSize": 1,
      "priority": "medium",
      "recommendedKnowledge": [
        {
          "id": "art-uuid-200",
          "title": "Jest & React Testing Libraryガイド",
          "type": "article",
          "relevance": 0.95
        }
      ],
      "recommendedCourses": [
        {
          "id": "course-uuid-080",
          "title": "フロントエンドテスト実践",
          "level": "intermediate",
          "estimatedDuration": {
            "minutes": 600,
            "display": "10時間"
          },
          "skillCoverage": 0.9
        }
      ],
      "estimatedLearningTime": {
        "minutes": 1200,
        "display": "20時間"
      }
    }
  ],
  "summary": {
    "totalGaps": 2,
    "highPriorityGaps": 1,
    "mediumPriorityGaps": 1,
    "lowPriorityGaps": 0,
    "totalEstimatedLearningTime": {
      "minutes": 3600,
      "display": "60時間"
    },
    "recommendedLearningPath": "path-uuid-010"
  },
  "strengths": [
    {
      "skillId": "skill-uuid-html-css",
      "skillName": "HTML/CSS",
      "level": "expert",
      "note": "業界標準を上回るレベルです"
    }
  ]
}
```

---

### 2. チームスキルギャップ分析 [Team Skill Gap Analysis]

チーム全体のスキルギャップを分析します（マネージャー用）。

**エンドポイント**:
```
POST /api/v1/bc-006/analyze/team-knowledge-gaps
```

**権限**: `team:manage`

**リクエストボディ**:
```json
{
  "teamId": "team-uuid-001",
  "projectId": "proj-uuid-001",
  "requiredSkills": [
    {
      "skillId": "skill-uuid-react",
      "minimumLevel": "intermediate",
      "requiredCount": 3
    },
    {
      "skillId": "skill-uuid-nodejs",
      "minimumLevel": "intermediate",
      "requiredCount": 2
    }
  ]
}
```

**レスポンス**: `200 OK`
```json
{
  "teamId": "team-uuid-001",
  "teamName": "フロントエンドチーム",
  "projectId": "proj-uuid-001",
  "analysisDate": "2025-11-04T13:00:00.000Z",
  "teamSize": 8,
  "skillCoverage": [
    {
      "skillId": "skill-uuid-react",
      "skillName": "React",
      "requiredLevel": "intermediate",
      "requiredCount": 3,
      "currentCoverage": {
        "expert": 1,
        "advanced": 2,
        "intermediate": 3,
        "beginner": 2
      },
      "gap": 0,
      "status": "met",
      "recommendations": []
    },
    {
      "skillId": "skill-uuid-nodejs",
      "skillName": "Node.js",
      "requiredLevel": "intermediate",
      "requiredCount": 2,
      "currentCoverage": {
        "expert": 0,
        "advanced": 1,
        "intermediate": 1,
        "beginner": 3
      },
      "gap": 1,
      "status": "gap",
      "recommendations": [
        {
          "type": "training",
          "targetMembers": ["user-uuid-005", "user-uuid-006"],
          "recommendedCourse": {
            "id": "course-uuid-030",
            "title": "Node.js実践コース",
            "estimatedDuration": {
              "minutes": 720,
              "display": "12時間"
            }
          }
        },
        {
          "type": "hiring",
          "skillLevel": "intermediate",
          "priority": "medium"
        }
      ]
    }
  ],
  "overallReadiness": 0.87,
  "criticalGaps": [
    {
      "skillId": "skill-uuid-nodejs",
      "gap": 1,
      "impact": "medium"
    }
  ],
  "recommendations": {
    "immediate": [
      "Node.jsスキル向上のためのトレーニングプログラム実施"
    ],
    "shortTerm": [
      "中級Node.js開発者の採用検討"
    ],
    "longTerm": [
      "チーム全体のバックエンドスキル強化"
    ]
  }
}
```

---

### 3. ロールベース要件分析 [Role-Based Requirements Analysis]

特定ロールに必要なスキルとギャップを分析します。

**エンドポイント**:
```
POST /api/v1/bc-006/analyze/role-requirements
```

**権限**: `learning:progress:read`

**リクエストボディ**:
```json
{
  "userId": "user-uuid-002",
  "targetRole": "tech-lead"
}
```

**レスポンス**: `200 OK`
```json
{
  "userId": "user-uuid-002",
  "userName": "鈴木一郎",
  "currentRole": "senior-engineer",
  "targetRole": "tech-lead",
  "roleRequirements": {
    "technical": [
      {
        "skillId": "skill-uuid-architecture",
        "skillName": "システムアーキテクチャ設計",
        "requiredLevel": "expert",
        "currentLevel": "intermediate",
        "gap": true
      },
      {
        "skillId": "skill-uuid-performance",
        "skillName": "パフォーマンス最適化",
        "requiredLevel": "advanced",
        "currentLevel": "advanced",
        "gap": false
      }
    ],
    "leadership": [
      {
        "skillId": "skill-uuid-mentoring",
        "skillName": "メンタリング",
        "requiredLevel": "advanced",
        "currentLevel": "beginner",
        "gap": true
      },
      {
        "skillId": "skill-uuid-code-review",
        "skillName": "コードレビュー",
        "requiredLevel": "expert",
        "currentLevel": "intermediate",
        "gap": true
      }
    ],
    "communication": [
      {
        "skillId": "skill-uuid-stakeholder",
        "skillName": "ステークホルダーコミュニケーション",
        "requiredLevel": "advanced",
        "currentLevel": "intermediate",
        "gap": true
      }
    ]
  },
  "gapSummary": {
    "totalSkills": 8,
    "skillsMet": 3,
    "skillsGap": 5,
    "readinessPercentage": 37.5
  },
  "learningPlan": {
    "estimatedTime": {
      "months": 6,
      "hoursPerWeek": 5
    },
    "recommendedPath": {
      "pathId": "path-uuid-020",
      "title": "Tech Leadへのキャリアパス",
      "courses": [
        {
          "courseId": "course-uuid-100",
          "courseTitle": "アーキテクチャ設計実践",
          "priority": 1
        },
        {
          "courseId": "course-uuid-101",
          "courseTitle": "エンジニアリングマネジメント基礎",
          "priority": 2
        }
      ]
    }
  }
}
```

---

## Usage Tracking API {#usage-tracking-api}

### 1. 使用状況記録 [Track Usage]

ナレッジやコースの使用状況を記録します。

**エンドポイント**:
```
POST /api/v1/bc-006/track/usage
```

**権限**: `knowledge:read` or `learning:course:read`

**リクエストボディ**:
```json
{
  "resourceType": "knowledge_article",
  "resourceId": "art-uuid-001",
  "action": "view",
  "context": {
    "projectId": "proj-uuid-001",
    "referrer": "search",
    "searchQuery": "TypeScript エラーハンドリング",
    "deviceType": "desktop",
    "userAgent": "Mozilla/5.0..."
  },
  "metadata": {
    "timeSpent": 300,
    "scrollDepth": 0.85,
    "interacted": true
  }
}
```

**レスポンス**: `200 OK`
```json
{
  "tracked": true,
  "trackingId": "tracking-uuid-001",
  "timestamp": "2025-11-04T14:00:00.000Z"
}
```

---

### 2. 使用状況分析 [Usage Analytics]

ナレッジやコースの使用状況を分析します（著者・管理者用）。

**エンドポイント**:
```
GET /api/v1/bc-006/track/analytics/{resourceType}/{resourceId}
```

**権限**: `knowledge:admin` or `learning:admin`

**パスパラメータ**:
- `resourceType` (string): `knowledge_article`, `course`
- `resourceId` (string): リソースID

**クエリパラメータ**:
- `period` (string, optional): 期間 (`day`, `week`, `month`, `year`)
- `from` (string, optional): 開始日時
- `to` (string, optional): 終了日時

**レスポンス**: `200 OK`
```json
{
  "resourceType": "knowledge_article",
  "resourceId": "art-uuid-001",
  "resourceTitle": "TypeScriptでのエラーハンドリングベストプラクティス",
  "period": {
    "from": "2025-10-04T00:00:00.000Z",
    "to": "2025-11-04T23:59:59.999Z"
  },
  "metrics": {
    "totalViews": 1523,
    "uniqueUsers": 987,
    "totalLikes": 89,
    "totalShares": 45,
    "totalComments": 23,
    "averageTimeSpent": {
      "seconds": 280
    },
    "averageScrollDepth": 0.75,
    "bounceRate": 0.12
  },
  "trends": {
    "viewsOverTime": [
      {
        "date": "2025-10-04",
        "views": 45,
        "uniqueUsers": 38
      },
      {
        "date": "2025-10-05",
        "views": 52,
        "uniqueUsers": 41
      }
    ]
  },
  "demographics": {
    "byRole": [
      {
        "role": "engineer",
        "count": 650,
        "percentage": 0.66
      },
      {
        "role": "architect",
        "count": 200,
        "percentage": 0.20
      }
    ],
    "byLocation": [
      {
        "location": "Tokyo",
        "count": 450
      },
      {
        "location": "Osaka",
        "count": 250
      }
    ]
  },
  "referralSources": {
    "search": 650,
    "direct": 320,
    "recommendation": 280,
    "related_articles": 180,
    "external": 93
  },
  "topSearchQueries": [
    {
      "query": "TypeScript エラーハンドリング",
      "count": 234
    },
    {
      "query": "エラー処理 ベストプラクティス",
      "count": 156
    }
  ]
}
```

---

## データスキーマ {#data-schemas}

### SearchResult Schema

```typescript
interface SearchResult {
  query: string;
  results: SearchResultItem[];
  facets: SearchFacets;
  pagination: Pagination;
  searchMeta: SearchMetadata;
}

interface SearchResultItem {
  id: string;
  title: string;
  summary: string;
  categoryId: string;
  categoryName: string;
  authorId: string;
  authorName: string;
  tags: string[];
  qualityScore: {
    overall: number;
  };
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  relevanceScore: number; // 0.0 - 1.0
  highlights: {
    title?: string;
    content?: string;
  };
}

interface SearchFacets {
  categories: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  tags: Array<{
    name: string;
    count: number;
  }>;
}

interface SearchMetadata {
  took: number; // milliseconds
  query: string;
  queryTime: string;
}
```

---

### Recommendation Schema

```typescript
interface KnowledgeRecommendation {
  article: KnowledgeArticleSummary;
  recommendationScore: number; // 0.0 - 1.0
  reasons: RecommendationReason[];
  relevantSkills?: SkillMatch[];
  appliedInProjects?: ProjectApplication[];
}

interface RecommendationReason {
  type: 'skill_match' | 'learning_history' | 'trending' | 'project_domain_match' | 'similar_project_success' | 'peer_success' | 'skill_gap' | 'prerequisite_met';
  description: string;
  weight: number; // 0.0 - 1.0
  metadata?: Record<string, any>;
}

interface CourseRecommendation {
  course: LearningCourseSummary;
  recommendationScore: number; // 0.0 - 1.0
  reasons: RecommendationReason[];
  expectedImpact?: {
    skillImprovement: {
      skillId: string;
      currentLevel: SkillLevel;
      expectedLevel: SkillLevel;
    };
    careerRelevance: number; // 0.0 - 1.0
  };
}
```

---

### GapAnalysis Schema

```typescript
interface SkillGapAnalysis {
  userId: string;
  userName: string;
  targetRole?: string;
  analysisDate: string;
  skillGaps: SkillGap[];
  summary: GapSummary;
  strengths?: SkillStrength[];
}

interface SkillGap {
  skillId: string;
  skillName: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  gapSize: number; // level difference
  priority: 'low' | 'medium' | 'high';
  recommendedKnowledge: KnowledgeRecommendation[];
  recommendedCourses: CourseRecommendation[];
  estimatedLearningTime: Duration;
}

interface GapSummary {
  totalGaps: number;
  highPriorityGaps: number;
  mediumPriorityGaps: number;
  lowPriorityGaps: number;
  totalEstimatedLearningTime: Duration;
  recommendedLearningPath?: string; // Path ID
}
```

---

### UsageTracking Schema

```typescript
interface UsageEvent {
  trackingId: string;
  userId: string;
  resourceType: 'knowledge_article' | 'course' | 'module' | 'assessment';
  resourceId: string;
  action: 'view' | 'like' | 'share' | 'comment' | 'apply';
  context: {
    projectId?: string;
    referrer?: string;
    searchQuery?: string;
    deviceType?: string;
    userAgent?: string;
  };
  metadata?: {
    timeSpent?: number; // seconds
    scrollDepth?: number; // 0.0 - 1.0
    interacted?: boolean;
  };
  timestamp: string;
}

interface UsageAnalytics {
  resourceType: string;
  resourceId: string;
  resourceTitle: string;
  period: {
    from: string;
    to: string;
  };
  metrics: UsageMetrics;
  trends: UsageTrends;
  demographics: Demographics;
  referralSources: Record<string, number>;
  topSearchQueries: Array<{
    query: string;
    count: number;
  }>;
}

interface UsageMetrics {
  totalViews: number;
  uniqueUsers: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  averageTimeSpent: Duration;
  averageScrollDepth: number; // 0.0 - 1.0
  bounceRate: number; // 0.0 - 1.0
}
```

---

## 使用例 {#usage-examples}

### 例1: 統合検索とフィルタリング

```typescript
// 基本検索
const searchResponse = await fetch(
  '/api/v1/bc-006/search/knowledge?q=TypeScript&minQualityScore=4.0&sort=relevance',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const searchResults = await searchResponse.json();

// ファセットを使ったフィルタリング
const categoryId = searchResults.facets.categories[0].id;

const filteredResponse = await fetch(
  `/api/v1/bc-006/search/knowledge?q=TypeScript&categoryId=${categoryId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

// 関連記事取得
const relatedResponse = await fetch(
  `/api/v1/bc-006/search/related/${searchResults.results[0].id}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
```

---

### 例2: パーソナライズド学習フロー

```typescript
// 1. スキルギャップ分析
const gapAnalysisResponse = await fetch(
  '/api/v1/bc-006/analyze/knowledge-gaps',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: 'user-uuid-002',
      targetRole: 'senior-frontend-engineer',
      targetSkills: [
        {
          skillId: 'skill-uuid-react',
          targetLevel: 'expert'
        }
      ]
    })
  }
);

const gapAnalysis = await gapAnalysisResponse.json();

// 2. ギャップを埋めるナレッジ推奨取得
const knowledgeRecsResponse = await fetch(
  `/api/v1/bc-006/recommend/knowledge?skillIds=${gapAnalysis.skillGaps[0].skillId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const knowledgeRecs = await knowledgeRecsResponse.json();

// 3. 推奨コース取得
const courseRecsResponse = await fetch(
  '/api/v1/bc-006/recommend/courses',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const courseRecs = await courseRecsResponse.json();

// 4. ナレッジ閲覧を追跡
await fetch('/api/v1/bc-006/track/usage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    resourceType: 'knowledge_article',
    resourceId: knowledgeRecs.recommendations[0].article.id,
    action: 'view',
    context: {
      referrer: 'recommendation'
    }
  })
});
```

---

### 例3: チームスキル管理フロー（マネージャー向け）

```typescript
// 1. チームスキルギャップ分析
const teamGapResponse = await fetch(
  '/api/v1/bc-006/analyze/team-knowledge-gaps',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${managerToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      teamId: 'team-uuid-001',
      projectId: 'proj-uuid-001',
      requiredSkills: [
        {
          skillId: 'skill-uuid-react',
          minimumLevel: 'intermediate',
          requiredCount: 3
        }
      ]
    })
  }
);

const teamGap = await teamGapResponse.json();

// 2. ギャップがある場合、トレーニング計画作成
if (teamGap.criticalGaps.length > 0) {
  const criticalSkill = teamGap.criticalGaps[0];

  // 3. スキルベースコース検索
  const trainingResponse = await fetch(
    '/api/v1/bc-006/recommend/courses/by-skill',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${managerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        skillId: criticalSkill.skillId,
        currentLevel: 'beginner',
        targetLevel: 'intermediate',
        timeAvailable: {
          hoursPerWeek: 5
        }
      })
    }
  );

  const trainingPlan = await trainingResponse.json();

  // 4. チームメンバーに推奨コースを割り当て
  const targetMembers = teamGap.skillCoverage
    .find(sc => sc.skillId === criticalSkill.skillId)
    .recommendations.find(r => r.type === 'training')
    .targetMembers;

  for (const memberId of targetMembers) {
    // メンバーに推奨コースを通知（BC-007経由）
    await notifyMember(memberId, trainingPlan.courses[0]);
  }
}
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-006 検索・発見API詳細化
