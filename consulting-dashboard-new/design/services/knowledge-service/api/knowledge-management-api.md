# 知識管理API

**更新日: 2025-01-13**

## 概要

ナレッジ記事、テンプレート、ベストプラクティス、FAQ、エキスパート検索などの知識管理機能を提供するAPI。

## エンドポイント一覧

### ナレッジ記事管理
- `createKnowledgeArticle` - ナレッジ記事作成
- `updateKnowledgeArticle` - ナレッジ記事更新
- `deleteKnowledgeArticle` - ナレッジ記事削除
- `searchKnowledgeArticles` - ナレッジ記事検索
- `getKnowledgeArticleDetails` - ナレッジ記事詳細取得

### テンプレート管理
- `createTemplate` - テンプレート登録
- `updateTemplate` - テンプレート更新
- `getTemplates` - テンプレート一覧取得
- `applyTemplate` - テンプレート適用
- `getTemplateUsage` - テンプレート利用統計

### ベストプラクティス
- `createBestPractice` - ベストプラクティス登録
- `getBestPractices` - ベストプラクティス一覧取得
- `rateBestPractice` - ベストプラクティス評価
- `applyBestPractice` - ベストプラクティス適用記録

### FAQ管理
- `createFAQ` - FAQ登録
- `updateFAQ` - FAQ更新
- `searchFAQ` - FAQ検索
- `recordFAQFeedback` - FAQフィードバック記録

### エキスパート検索
- `searchExperts` - エキスパート検索
- `getExpertProfile` - エキスパートプロフィール取得
- `requestExpertSupport` - エキスパート支援依頼
- `updateExpertise` - 専門性更新

### ナレッジ分析
- `getKnowledgeAnalytics` - ナレッジ分析データ取得
- `getKnowledgeGaps` - ナレッジギャップ分析
- `getKnowledgeContribution` - 貢献度分析

## API詳細

### createKnowledgeArticle

新規ナレッジ記事を作成する。

```typescript
async function createKnowledgeArticle(
  data: CreateKnowledgeArticleInput
): Promise<KnowledgeArticleResponse>
```

#### リクエスト
```typescript
interface CreateKnowledgeArticleInput {
  title: string
  category: 'technical' | 'industry' | 'methodology' | 'tool' | 'process' | 'other'
  tags: string[]
  summary: string
  content: {
    format: 'markdown' | 'html'
    body: string
  }
  relatedProjects?: string[]
  attachments?: {
    name: string
    url: string
    type: string
    size: number
  }[]
  visibility: {
    scope: 'public' | 'department' | 'project' | 'private'
    departments?: string[]
    projects?: string[]
    users?: string[]
  }
  reviewers?: string[]
  metadata?: {
    industry?: string[]
    technology?: string[]
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    timeToRead?: number  // 分
  }
}
```

#### レスポンス
```typescript
interface KnowledgeArticleResponse {
  success: boolean
  data?: {
    id: string
    title: string
    category: string
    status: 'draft' | 'review' | 'approved' | 'published' | 'archived'
    author: {
      id: string
      name: string
      department: string
    }
    createdAt: Date
    updatedAt: Date
    publishedAt?: Date
    version: number
    reviewStatus?: {
      stage: 'content' | 'technical' | 'final'
      reviewers: {
        id: string
        name: string
        status: 'pending' | 'approved' | 'rejected'
        comments?: string
      }[]
    }
    metrics: {
      views: number
      likes: number
      shares: number
      avgRating: number
    }
  }
  error?: string
}
```

---

### searchKnowledgeArticles

ナレッジ記事を検索する。

```typescript
async function searchKnowledgeArticles(
  params: SearchKnowledgeParams
): Promise<KnowledgeSearchResponse>
```

#### リクエスト
```typescript
interface SearchKnowledgeParams {
  query?: string  // 全文検索
  categories?: string[]
  tags?: string[]
  authors?: string[]
  projects?: string[]
  dateRange?: {
    from: Date
    to: Date
  }
  status?: string[]
  sortBy?: 'relevance' | 'date' | 'popularity' | 'rating'
  includeArchived?: boolean
  limit?: number
  offset?: number
}
```

#### レスポンス
```typescript
interface KnowledgeSearchResponse {
  success: boolean
  data?: {
    articles: {
      id: string
      title: string
      summary: string
      category: string
      tags: string[]
      author: {
        id: string
        name: string
      }
      relevanceScore?: number
      createdAt: Date
      metrics: {
        views: number
        avgRating: number
      }
      highlight?: {  // 検索結果のハイライト
        title?: string
        content?: string[]
      }
    }[]
    facets: {
      categories: Record<string, number>
      tags: Record<string, number>
      authors: Record<string, number>
    }
    suggestions?: string[]  // 検索候補
    relatedArticles?: {
      id: string
      title: string
      similarity: number
    }[]
    pagination: {
      total: number
      limit: number
      offset: number
    }
  }
  error?: string
}
```

---

### createTemplate

テンプレートを登録する。

```typescript
async function createTemplate(
  data: CreateTemplateInput
): Promise<TemplateResponse>
```

#### リクエスト
```typescript
interface CreateTemplateInput {
  name: string
  category: 'proposal' | 'report' | 'presentation' | 'specification' | 'contract' | 'other'
  description: string
  useCase: string  // 使用場面の説明
  file: {
    name: string
    url: string
    format: string  // docx, xlsx, pptx, etc.
    size: number
  }
  variables?: {
    name: string
    description: string
    type: 'text' | 'date' | 'number' | 'select'
    required: boolean
    default?: any
    options?: string[]  // select型の場合
  }[]
  instructions?: string  // 使用方法
  examples?: {
    name: string
    url: string
  }[]
  tags: string[]
  approval?: {
    required: boolean
    approvers: string[]
  }
}
```

#### レスポンス
```typescript
interface TemplateResponse {
  success: boolean
  data?: {
    id: string
    name: string
    category: string
    version: string
    status: 'draft' | 'active' | 'deprecated'
    createdBy: {
      id: string
      name: string
    }
    createdAt: Date
    lastModified: Date
    usage: {
      count: number
      lastUsed?: Date
      rating: number
    }
    downloadUrl: string
  }
  error?: string
}
```

---

### createBestPractice

ベストプラクティスを登録する。

```typescript
async function createBestPractice(
  data: CreateBestPracticeInput
): Promise<BestPracticeResponse>
```

#### リクエスト
```typescript
interface CreateBestPracticeInput {
  title: string
  context: {
    background: string
    challenge: string
    constraints?: string[]
  }
  implementation: {
    approach: string
    steps: {
      order: number
      action: string
      details?: string
    }[]
    timeline?: string
    resources?: string[]
  }
  results: {
    outcomes: string[]
    metrics?: {
      name: string
      before: string
      after: string
      improvement: string
    }[]
    clientFeedback?: string
  }
  successFactors: string[]
  lessonsLearned?: {
    positive: string[]
    negative: string[]
  }
  applicability: {
    projectTypes: string[]
    industries?: string[]
    teamSize?: string
    conditions: string[]
  }
  evidence?: {
    type: 'document' | 'metric' | 'testimonial'
    url: string
    description: string
  }[]
}
```

---

### searchExperts

専門知識を持つエキスパートを検索する。

```typescript
async function searchExperts(
  params: SearchExpertsParams
): Promise<ExpertSearchResponse>
```

#### リクエスト
```typescript
interface SearchExpertsParams {
  skills: {
    skill: string
    level?: 'basic' | 'intermediate' | 'advanced' | 'expert'
    required: boolean
  }[]
  industry?: string[]
  availability?: {
    from: Date
    to: Date
    minAvailability: number  // パーセンテージ
  }
  languages?: string[]
  certifications?: string[]
  projectExperience?: {
    type?: string
    minProjects?: number
  }
  location?: string  // リモート可能性も考慮
}
```

#### レスポンス
```typescript
interface ExpertSearchResponse {
  success: boolean
  data?: {
    experts: {
      id: string
      name: string
      title: string
      department: string
      matchScore: number  // マッチ度
      skills: {
        name: string
        level: string
        verified: boolean
        endorsements: number
      }[]
      experience: {
        totalYears: number
        relevantProjects: number
        industries: string[]
      }
      availability: {
        current: number  // 現在の稼働率
        nextAvailable?: Date
      }
      ratings: {
        overall: number
        technical: number
        communication: number
        reviews: number
      }
      recentProjects?: {
        name: string
        role: string
        duration: string
      }[]
    }[]
    filters: {
      skills: string[]
      departments: string[]
      availability: number[]
    }
  }
  error?: string
}
```

---

### createFAQ

FAQを登録する。

```typescript
async function createFAQ(
  data: CreateFAQInput
): Promise<FAQResponse>
```

#### リクエスト
```typescript
interface CreateFAQInput {
  question: string
  answer: string
  category: string
  tags: string[]
  relatedTo?: {
    type: 'feature' | 'process' | 'policy' | 'technical'
    id: string
  }
  variants?: string[]  // 同じ質問の別の表現
  attachments?: Attachment[]
  internalNotes?: string  // 管理者用メモ
}
```

---

### getKnowledgeAnalytics

ナレッジの利用状況を分析する。

```typescript
async function getKnowledgeAnalytics(
  params: KnowledgeAnalyticsParams
): Promise<KnowledgeAnalyticsResponse>
```

#### リクエスト
```typescript
interface KnowledgeAnalyticsParams {
  period: {
    from: Date
    to: Date
  }
  groupBy?: 'category' | 'department' | 'author' | 'project'
  metrics?: ('views' | 'contributions' | 'searches' | 'ratings' | 'gaps')[]
}
```

#### レスポンス
```typescript
interface KnowledgeAnalyticsResponse {
  success: boolean
  data?: {
    summary: {
      totalArticles: number
      newArticles: number
      totalViews: number
      uniqueViewers: number
      avgRating: number
      activeContributors: number
    }
    trends: {
      period: string[]
      views: number[]
      contributions: number[]
      searches: number[]
    }
    topContent: {
      mostViewed: ContentMetric[]
      highestRated: ContentMetric[]
      mostShared: ContentMetric[]
    }
    searchAnalytics: {
      topKeywords: {
        keyword: string
        count: number
        resultsFound: number
      }[]
      noResultsKeywords: string[]
      avgSearchTime: number
    }
    contributions: {
      topContributors: {
        id: string
        name: string
        articles: number
        totalViews: number
        avgRating: number
      }[]
      departmentBreakdown: Record<string, number>
    }
    gaps: {
      requestedTopics: {
        topic: string
        requests: number
      }[]
      outdatedContent: {
        id: string
        title: string
        lastUpdated: Date
        views: number
      }[]
      lowRatedContent: ContentMetric[]
    }
    recommendations: {
      type: 'create' | 'update' | 'archive'
      reason: string
      target: string
    }[]
  }
  error?: string
}

interface ContentMetric {
  id: string
  title: string
  value: number
  trend: 'up' | 'down' | 'stable'
}
```

---

### requestExpertSupport

エキスパートに支援を依頼する。

```typescript
async function requestExpertSupport(
  data: ExpertSupportRequestInput
): Promise<ExpertSupportResponse>
```

#### リクエスト
```typescript
interface ExpertSupportRequestInput {
  expertId: string
  projectId?: string
  type: 'consultation' | 'review' | 'mentoring' | 'collaboration'
  title: string
  description: string
  expectedOutcome: string
  duration: {
    estimatedHours: number
    deadline?: Date
  }
  preferredFormat: 'meeting' | 'async' | 'mixed'
  urgency: 'high' | 'medium' | 'low'
}
```

## エラーハンドリング

### 共通エラー
- `KNOWLEDGE_NOT_FOUND`: ナレッジが見つかりません
- `TEMPLATE_NOT_FOUND`: テンプレートが見つかりません
- `EXPERT_NOT_AVAILABLE`: エキスパートが利用できません
- `INSUFFICIENT_PERMISSIONS`: 権限が不足しています

### ナレッジ固有エラー
- `DUPLICATE_ARTICLE`: 重複する記事が存在します
- `REVIEW_REQUIRED`: レビューが必要です
- `INVALID_TEMPLATE_FORMAT`: テンプレート形式が無効です

## パフォーマンス最適化

### 検索最適化
- Elasticsearchによる全文検索
- ベクトル検索による類似記事検出
- ファセット検索の事前集計

### キャッシュ戦略
- 人気記事: CDNキャッシュ
- 検索結果: 1時間キャッシュ
- エキスパートプロフィール: 日次更新

### インデックス
- タイトル、本文での全文検索インデックス
- カテゴリ、タグでの複合インデックス
- 作成日、更新日でのソートインデックス