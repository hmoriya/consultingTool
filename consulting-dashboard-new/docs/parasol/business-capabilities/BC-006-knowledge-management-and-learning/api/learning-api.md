# BC-006: 学習システムAPI詳細 [Learning System API Details]

**BC**: Knowledge Management & Organizational Learning [ナレッジ管理と組織学習] [BC_006]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03
**V2移行元**: services/knowledge-co-creation-service/api/

---

## 目次

1. [概要](#overview)
2. [Learning Course API](#learning-course-api)
3. [Enrollment API](#enrollment-api)
4. [Progress Tracking API](#progress-tracking-api)
5. [Assessment API](#assessment-api)
6. [Certification API](#certification-api)
7. [Learning Path API](#learning-path-api)
8. [データスキーマ](#data-schemas)
9. [使用例](#usage-examples)

---

## 概要 {#overview}

学習システムAPIは、コース管理、学習進捗追跡、評価、認定証発行、学習経路設計の機能を提供します。

### エンドポイント概要

| グループ | エンドポイント数 | 説明 |
|---------|---------------|------|
| Course API | 8 | コースCRUD、モジュール管理 |
| Enrollment API | 4 | コース登録、登録解除 |
| Progress API | 6 | 進捗追跡、モジュール完了 |
| Assessment API | 6 | 評価受験、結果取得 |
| Certification API | 4 | 証明書発行、検証 |
| Learning Path API | 6 | 学習経路設計、推奨 |

**合計**: 34エンドポイント

---

## Learning Course API {#learning-course-api}

### 1. コース作成 [Create Course]

新しい学習コースを作成します。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/courses
```

**権限**: `learning:course:create`

**リクエストボディ**:
```json
{
  "title": "TypeScript基礎コース",
  "description": "TypeScriptの基本から応用まで学ぶ総合コース",
  "overview": "TypeScriptの型システム、ジェネリクス、デコレータなどを段階的に学習します",
  "level": "beginner",
  "category": "programming",
  "learningObjectives": [
    {
      "description": "TypeScriptの基本構文を理解する",
      "measurableOutcome": "基本的な型定義ができる",
      "level": "understand"
    },
    {
      "description": "ジェネリクスを活用できる",
      "measurableOutcome": "再利用可能な型安全なコードを書ける",
      "level": "apply"
    }
  ],
  "estimatedDuration": 480,
  "prerequisites": [],
  "tags": ["typescript", "programming", "frontend"]
}
```

**レスポンス**: `201 Created`
```json
{
  "id": "course-uuid-001",
  "title": "TypeScript基礎コース",
  "description": "TypeScriptの基本から応用まで学ぶ総合コース",
  "status": "draft",
  "level": "beginner",
  "category": "programming",
  "instructorId": "user-uuid-001",
  "instructor": {
    "id": "user-uuid-001",
    "name": "山田太郎",
    "email": "yamada@example.com"
  },
  "learningObjectives": [
    {
      "description": "TypeScriptの基本構文を理解する",
      "measurableOutcome": "基本的な型定義ができる",
      "level": "understand"
    }
  ],
  "estimatedDuration": {
    "minutes": 480,
    "display": "8時間"
  },
  "modules": [],
  "enrollmentCount": 0,
  "completionRate": 0,
  "averageRating": 0,
  "createdAt": "2025-11-03T10:00:00.000Z",
  "updatedAt": "2025-11-03T10:00:00.000Z"
}
```

---

### 2. コース取得 [Get Course]

指定IDのコースを取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/courses/{courseId}
```

**権限**: `learning:course:read`

**クエリパラメータ**:
- `includeModules` (boolean, optional): モジュール情報を含むか (default: true)
- `includeAssessments` (boolean, optional): 評価情報を含むか (default: false)

**レスポンス**: `200 OK`
```json
{
  "id": "course-uuid-001",
  "title": "TypeScript基礎コース",
  "description": "TypeScriptの基本から応用まで学ぶ総合コース",
  "overview": "TypeScriptの型システム、ジェネリクス、デコレータなどを段階的に学習します",
  "status": "published",
  "level": "beginner",
  "category": "programming",
  "instructorId": "user-uuid-001",
  "instructor": {
    "id": "user-uuid-001",
    "name": "山田太郎",
    "title": "シニアエンジニア",
    "bio": "10年以上のフロントエンド開発経験"
  },
  "modules": [
    {
      "id": "module-uuid-001",
      "title": "TypeScript入門",
      "description": "TypeScriptの基本概念と環境構築",
      "order": 1,
      "estimatedDuration": {
        "minutes": 60,
        "display": "1時間"
      },
      "materialsCount": 5,
      "completionCriteria": {
        "type": "view_all_materials"
      }
    },
    {
      "id": "module-uuid-002",
      "title": "型システム",
      "description": "TypeScriptの型システムを深く理解する",
      "order": 2,
      "estimatedDuration": {
        "minutes": 120,
        "display": "2時間"
      },
      "materialsCount": 8,
      "completionCriteria": {
        "type": "pass_assessment"
      }
    }
  ],
  "assessments": [
    {
      "id": "assessment-uuid-001",
      "title": "最終試験",
      "type": "exam",
      "passingScore": 70,
      "maxScore": 100,
      "timeLimit": {
        "minutes": 60
      },
      "attemptsAllowed": 3,
      "isRequired": true
    }
  ],
  "learningObjectives": [
    {
      "description": "TypeScriptの基本構文を理解する",
      "measurableOutcome": "基本的な型定義ができる",
      "level": "understand"
    }
  ],
  "prerequisites": [],
  "tags": ["typescript", "programming", "frontend"],
  "estimatedDuration": {
    "minutes": 480,
    "display": "8時間"
  },
  "enrollmentCount": 1234,
  "completionRate": 0.78,
  "averageRating": 4.6,
  "createdAt": "2025-11-03T10:00:00.000Z",
  "publishedAt": "2025-11-03T14:00:00.000Z",
  "updatedAt": "2025-11-03T15:00:00.000Z"
}
```

---

### 3. コース一覧取得 [List Courses]

コースの一覧を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/courses
```

**権限**: `learning:course:read`

**クエリパラメータ**:
- `status` (string, optional): フィルタ (`draft`, `published`, `archived`)
- `level` (string, optional): スキルレベル (`beginner`, `intermediate`, `advanced`, `expert`)
- `category` (string, optional): カテゴリ
- `instructorId` (string, optional): 講師ID
- `tags` (string[], optional): タグ
- `sort` (string, optional): ソート (`enrollmentCount:desc`, `averageRating:desc`, `publishedAt:desc`)
- `limit` (number, optional): 取得件数 (default: 20)
- `offset` (number, optional): オフセット (default: 0)

**レスポンス**: `200 OK`
```json
{
  "items": [
    {
      "id": "course-uuid-001",
      "title": "TypeScript基礎コース",
      "description": "TypeScriptの基本から応用まで学ぶ総合コース",
      "status": "published",
      "level": "beginner",
      "category": "programming",
      "instructorId": "user-uuid-001",
      "instructorName": "山田太郎",
      "estimatedDuration": {
        "minutes": 480,
        "display": "8時間"
      },
      "enrollmentCount": 1234,
      "completionRate": 0.78,
      "averageRating": 4.6,
      "tags": ["typescript", "programming"],
      "publishedAt": "2025-11-03T14:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 87,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 4. コース更新 [Update Course]

コース情報を更新します。

**エンドポイント**:
```
PUT /api/v1/bc-006/learning/courses/{courseId}
```

**権限**: `learning:course:update` (自分のコース) / `learning:admin`

**リクエストボディ**:
```json
{
  "title": "TypeScript基礎コース (2025年版)",
  "description": "TypeScript 5.x対応の総合コース",
  "estimatedDuration": 540
}
```

**レスポンス**: `200 OK`

---

### 5. コース削除 [Delete Course]

コースを削除（論理削除）します。

**エンドポイント**:
```
DELETE /api/v1/bc-006/learning/courses/{courseId}
```

**権限**: `learning:course:delete` / `learning:admin`

**レスポンス**: `204 No Content`

**エラーレスポンス** (受講者がいる場合):
```json
{
  "error": {
    "code": "LEARNING_006",
    "message": "Cannot delete course with active enrollments",
    "details": "Course has 15 active enrollments. Archive instead."
  }
}
```

---

### 6. モジュール追加 [Add Module]

コースにモジュールを追加します。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/courses/{courseId}/modules
```

**権限**: `learning:course:update`

**リクエストボディ**:
```json
{
  "title": "ジェネリクス",
  "description": "TypeScriptのジェネリクスを深く理解する",
  "order": 3,
  "estimatedDuration": 90,
  "learningObjectives": [
    "ジェネリクスの基本概念を理解する",
    "型パラメータを活用できる"
  ],
  "materials": [
    {
      "title": "ジェネリクス入門",
      "type": "video",
      "url": "https://videos.example.com/generics-intro.mp4",
      "duration": 15,
      "order": 1,
      "isRequired": true
    },
    {
      "title": "ジェネリクス実践",
      "type": "document",
      "url": "https://docs.example.com/generics-practice.pdf",
      "order": 2,
      "isRequired": true
    },
    {
      "title": "コード例",
      "type": "code_example",
      "content": "function identity<T>(arg: T): T { return arg; }",
      "order": 3,
      "isRequired": false
    }
  ],
  "completionCriteria": {
    "type": "view_all_materials"
  }
}
```

**レスポンス**: `201 Created`
```json
{
  "id": "module-uuid-003",
  "courseId": "course-uuid-001",
  "title": "ジェネリクス",
  "description": "TypeScriptのジェネリクスを深く理解する",
  "order": 3,
  "estimatedDuration": {
    "minutes": 90,
    "display": "1時間30分"
  },
  "materials": [
    {
      "id": "material-uuid-001",
      "title": "ジェネリクス入門",
      "type": "video",
      "url": "https://videos.example.com/generics-intro.mp4",
      "duration": {
        "minutes": 15
      },
      "order": 1,
      "isRequired": true
    }
  ],
  "completionCriteria": {
    "type": "view_all_materials"
  },
  "createdAt": "2025-11-03T16:00:00.000Z"
}
```

---

### 7. コース公開 [Publish Course]

レビュー済みのコースを公開します。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/courses/{courseId}/publish
```

**権限**: `learning:course:publish`

**レスポンス**: `200 OK`
```json
{
  "id": "course-uuid-001",
  "status": "published",
  "publishedAt": "2025-11-03T17:00:00.000Z"
}
```

**エラーレスポンス** (モジュールなし):
```json
{
  "error": {
    "code": "LEARNING_007",
    "message": "Cannot publish course without modules",
    "details": "At least one module is required"
  }
}
```

---

### 8. コースアーカイブ [Archive Course]

公開済みコースをアーカイブします。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/courses/{courseId}/archive
```

**権限**: `learning:admin`

**リクエストボディ**:
```json
{
  "reason": "内容が古くなったため"
}
```

**レスポンス**: `200 OK`

---

## Enrollment API {#enrollment-api}

### 1. コース登録 [Enroll Course]

学習者がコースに登録します。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/courses/{courseId}/enroll
```

**権限**: `learning:enroll`

**レスポンス**: `201 Created`
```json
{
  "progressId": "progress-uuid-001",
  "courseId": "course-uuid-001",
  "userId": "user-uuid-002",
  "status": "not_started",
  "enrolledAt": "2025-11-03T18:00:00.000Z",
  "progressRate": {
    "completedCount": 0,
    "totalCount": 8,
    "percentage": 0
  }
}
```

**エラーレスポンス** (既に登録済み):
```json
{
  "error": {
    "code": "LEARNING_002",
    "message": "Already enrolled",
    "details": "User is already enrolled in this course"
  }
}
```

**エラーレスポンス** (前提条件未達):
```json
{
  "error": {
    "code": "LEARNING_003",
    "message": "Prerequisites not met",
    "details": "Must complete 'JavaScript基礎' before enrolling",
    "missingPrerequisites": ["course-uuid-000"]
  }
}
```

---

### 2. 登録解除 [Unenroll Course]

コース登録を解除します。

**エンドポイント**:
```
DELETE /api/v1/bc-006/learning/courses/{courseId}/enroll
```

**権限**: `learning:enroll`

**レスポンス**: `204 No Content`

---

### 3. 自分の登録コース一覧 [My Enrollments]

ログインユーザーの登録コース一覧を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/my-enrollments
```

**権限**: `learning:enroll`

**クエリパラメータ**:
- `status` (string, optional): `not_started`, `in_progress`, `completed`, `failed`

**レスポンス**: `200 OK`
```json
{
  "enrollments": [
    {
      "progressId": "progress-uuid-001",
      "course": {
        "id": "course-uuid-001",
        "title": "TypeScript基礎コース",
        "instructorName": "山田太郎"
      },
      "status": "in_progress",
      "enrolledAt": "2025-11-03T18:00:00.000Z",
      "startedAt": "2025-11-03T19:00:00.000Z",
      "progressRate": {
        "completedCount": 3,
        "totalCount": 8,
        "percentage": 37.5
      },
      "lastAccessedAt": "2025-11-04T10:00:00.000Z"
    }
  ]
}
```

---

### 4. 登録統計 [Enrollment Statistics]

コースの登録統計を取得します（講師・管理者用）。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/courses/{courseId}/enrollment-stats
```

**権限**: `learning:course:read` (自分のコース) / `learning:admin`

**レスポンス**: `200 OK`
```json
{
  "courseId": "course-uuid-001",
  "totalEnrollments": 1234,
  "activeEnrollments": 890,
  "completedEnrollments": 320,
  "failedEnrollments": 24,
  "completionRate": 0.78,
  "averageCompletionTime": {
    "minutes": 520,
    "display": "8時間40分"
  },
  "enrollmentTrend": [
    {
      "date": "2025-11-01",
      "enrollments": 45
    },
    {
      "date": "2025-11-02",
      "enrollments": 52
    }
  ]
}
```

---

## Progress Tracking API {#progress-tracking-api}

### 1. 進捗取得 [Get Progress]

学習進捗を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/progress/{progressId}
```

**権限**: `learning:progress:read` (自分の進捗) / `learning:admin`

**レスポンス**: `200 OK`
```json
{
  "id": "progress-uuid-001",
  "userId": "user-uuid-002",
  "courseId": "course-uuid-001",
  "course": {
    "id": "course-uuid-001",
    "title": "TypeScript基礎コース"
  },
  "status": "in_progress",
  "enrolledAt": "2025-11-03T18:00:00.000Z",
  "startedAt": "2025-11-03T19:00:00.000Z",
  "lastAccessedAt": "2025-11-04T10:00:00.000Z",
  "progressRate": {
    "completedCount": 3,
    "totalCount": 8,
    "percentage": 37.5
  },
  "moduleCompletions": [
    {
      "moduleId": "module-uuid-001",
      "moduleTitle": "TypeScript入門",
      "completedAt": "2025-11-03T20:00:00.000Z",
      "timeSpent": {
        "minutes": 65
      },
      "materialsViewed": ["material-uuid-001", "material-uuid-002"]
    }
  ],
  "assessmentResults": [
    {
      "assessmentId": "assessment-uuid-001",
      "assessmentTitle": "最終試験",
      "score": 85,
      "maxScore": 100,
      "passed": true,
      "attemptNumber": 1,
      "submittedAt": "2025-11-04T10:00:00.000Z"
    }
  ],
  "totalScore": 85,
  "certificateId": null,
  "expiresAt": null
}
```

---

### 2. コース開始 [Start Course]

コースの学習を開始します。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/progress/{progressId}/start
```

**権限**: `learning:progress:update`

**レスポンス**: `200 OK`
```json
{
  "id": "progress-uuid-001",
  "status": "in_progress",
  "startedAt": "2025-11-03T19:00:00.000Z"
}
```

---

### 3. モジュール完了 [Complete Module]

モジュールを完了します。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/progress/{progressId}/modules/{moduleId}/complete
```

**権限**: `learning:progress:update`

**リクエストボディ**:
```json
{
  "timeSpent": 70,
  "materialsViewed": [
    "material-uuid-001",
    "material-uuid-002",
    "material-uuid-003"
  ]
}
```

**レスポンス**: `200 OK`
```json
{
  "progressId": "progress-uuid-001",
  "moduleId": "module-uuid-002",
  "completedAt": "2025-11-04T11:00:00.000Z",
  "timeSpent": {
    "minutes": 70,
    "display": "1時間10分"
  },
  "progressRate": {
    "completedCount": 4,
    "totalCount": 8,
    "percentage": 50
  }
}
```

---

### 4. 教材閲覧記録 [Record Material View]

教材の閲覧を記録します。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/progress/{progressId}/materials/{materialId}/view
```

**権限**: `learning:progress:update`

**リクエストボディ**:
```json
{
  "timeSpent": 15,
  "completed": true
}
```

**レスポンス**: `200 OK`

---

### 5. 進捗サマリー [Progress Summary]

ユーザーの全体的な学習進捗サマリーを取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/progress/summary
```

**権限**: `learning:progress:read`

**レスポンス**: `200 OK`
```json
{
  "userId": "user-uuid-002",
  "totalCourses": 5,
  "inProgressCourses": 2,
  "completedCourses": 3,
  "failedCourses": 0,
  "totalLearningTime": {
    "minutes": 1840,
    "display": "30時間40分"
  },
  "certificationsEarned": 3,
  "averageScore": 87.5,
  "recentActivities": [
    {
      "type": "module_completed",
      "courseTitle": "TypeScript基礎コース",
      "moduleTitle": "型システム",
      "timestamp": "2025-11-04T11:00:00.000Z"
    }
  ]
}
```

---

### 6. アクセス記録 [Record Access]

コースへのアクセスを記録します（自動呼び出し）。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/progress/{progressId}/access
```

**権限**: `learning:progress:update`

**レスポンス**: `200 OK`

---

## Assessment API {#assessment-api}

### 1. 評価取得 [Get Assessment]

評価（テスト/試験）の詳細を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/assessments/{assessmentId}
```

**権限**: `learning:assessment:read`

**レスポンス**: `200 OK`
```json
{
  "id": "assessment-uuid-001",
  "courseId": "course-uuid-001",
  "moduleId": null,
  "title": "最終試験",
  "type": "exam",
  "description": "TypeScript基礎コースの総合評価",
  "passingScore": 70,
  "maxScore": 100,
  "timeLimit": {
    "minutes": 60,
    "display": "1時間"
  },
  "attemptsAllowed": 3,
  "weight": 1.0,
  "isRequired": true,
  "questionCount": 20,
  "createdAt": "2025-11-03T10:00:00.000Z"
}
```

---

### 2. 評価開始 [Start Assessment]

評価を開始します（問題取得）。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/assessments/{assessmentId}/start
```

**権限**: `learning:assessment:take`

**レスポンス**: `200 OK`
```json
{
  "sessionId": "session-uuid-001",
  "assessmentId": "assessment-uuid-001",
  "attemptNumber": 1,
  "startedAt": "2025-11-04T12:00:00.000Z",
  "expiresAt": "2025-11-04T13:00:00.000Z",
  "timeLimit": {
    "minutes": 60
  },
  "questions": [
    {
      "id": "question-uuid-001",
      "type": "multiple_choice",
      "question": "TypeScriptの型アノテーションとして正しいものはどれですか？",
      "options": [
        {
          "id": "opt-001",
          "text": "let x: number = 5;"
        },
        {
          "id": "opt-002",
          "text": "let x = number: 5;"
        },
        {
          "id": "opt-003",
          "text": "let x(number) = 5;"
        },
        {
          "id": "opt-004",
          "text": "let x as number = 5;"
        }
      ],
      "points": 5
    },
    {
      "id": "question-uuid-002",
      "type": "code_completion",
      "question": "以下のコードの空欄を埋めてください",
      "codeTemplate": "function identity<____>(arg: ____): ____ { return arg; }",
      "points": 10
    }
  ]
}
```

---

### 3. 評価提出 [Submit Assessment]

評価の回答を提出します。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/assessments/{assessmentId}/submit
```

**権限**: `learning:assessment:take`

**リクエストボディ**:
```json
{
  "sessionId": "session-uuid-001",
  "answers": {
    "question-uuid-001": {
      "selectedOption": "opt-001"
    },
    "question-uuid-002": {
      "answer": "T, T, T"
    }
  },
  "submittedAt": "2025-11-04T12:45:00.000Z"
}
```

**レスポンス**: `200 OK`
```json
{
  "resultId": "result-uuid-001",
  "assessmentId": "assessment-uuid-001",
  "progressId": "progress-uuid-001",
  "score": 85,
  "maxScore": 100,
  "normalizedScore": 85,
  "passed": true,
  "passingScore": 70,
  "attemptNumber": 1,
  "attemptsRemaining": 2,
  "submittedAt": "2025-11-04T12:45:00.000Z",
  "gradedAt": "2025-11-04T12:45:05.000Z",
  "feedback": {
    "overall": "よくできました！",
    "strengths": ["型システムの理解が excellent"],
    "improvements": ["ジェネリクスの応用問題で一部不正解"]
  }
}
```

---

### 4. 評価結果取得 [Get Result]

評価結果の詳細を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/assessments/{assessmentId}/results/{resultId}
```

**権限**: `learning:assessment:read` (自分の結果) / `learning:admin`

**レスポンス**: `200 OK`
```json
{
  "id": "result-uuid-001",
  "assessmentId": "assessment-uuid-001",
  "assessmentTitle": "最終試験",
  "userId": "user-uuid-002",
  "progressId": "progress-uuid-001",
  "score": 85,
  "maxScore": 100,
  "normalizedScore": 85,
  "passed": true,
  "passingScore": 70,
  "attemptNumber": 1,
  "submittedAt": "2025-11-04T12:45:00.000Z",
  "gradedAt": "2025-11-04T12:45:05.000Z",
  "timeSpent": {
    "minutes": 45
  },
  "answers": [
    {
      "questionId": "question-uuid-001",
      "question": "TypeScriptの型アノテーションとして正しいものはどれですか？",
      "yourAnswer": "opt-001",
      "correctAnswer": "opt-001",
      "isCorrect": true,
      "points": 5,
      "earnedPoints": 5
    },
    {
      "questionId": "question-uuid-002",
      "question": "以下のコードの空欄を埋めてください",
      "yourAnswer": "T, T, T",
      "correctAnswer": "T, T, T",
      "isCorrect": true,
      "points": 10,
      "earnedPoints": 10
    }
  ],
  "feedback": {
    "overall": "よくできました！",
    "strengths": ["型システムの理解が excellent"],
    "improvements": ["ジェネリクスの応用問題で一部不正解"]
  }
}
```

---

### 5. 評価履歴 [Assessment History]

ユーザーの評価受験履歴を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/assessments/{assessmentId}/my-history
```

**権限**: `learning:assessment:read`

**レスポンス**: `200 OK`
```json
{
  "assessmentId": "assessment-uuid-001",
  "assessmentTitle": "最終試験",
  "attemptsAllowed": 3,
  "attempts": [
    {
      "attemptNumber": 1,
      "score": 85,
      "maxScore": 100,
      "passed": true,
      "submittedAt": "2025-11-04T12:45:00.000Z"
    }
  ],
  "bestScore": 85,
  "averageScore": 85,
  "canRetake": true,
  "attemptsRemaining": 2
}
```

---

### 6. 評価統計 [Assessment Statistics]

評価の統計情報を取得します（講師・管理者用）。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/assessments/{assessmentId}/statistics
```

**権限**: `learning:course:read` (自分のコース) / `learning:admin`

**レスポンス**: `200 OK`
```json
{
  "assessmentId": "assessment-uuid-001",
  "assessmentTitle": "最終試験",
  "totalAttempts": 1500,
  "uniqueStudents": 890,
  "passRate": 0.82,
  "averageScore": 78.5,
  "medianScore": 80,
  "scoreDistribution": {
    "0-20": 12,
    "21-40": 45,
    "41-60": 120,
    "61-80": 380,
    "81-100": 433
  },
  "averageTimeSpent": {
    "minutes": 48
  },
  "difficultQuestions": [
    {
      "questionId": "question-uuid-010",
      "question": "高度なジェネリクス問題...",
      "correctRate": 0.42
    }
  ]
}
```

---

## Certification API {#certification-api}

### 1. 証明書発行 [Issue Certification]

コース修了証明書を発行します（システムが自動的に呼び出し）。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/certifications/issue
```

**権限**: `learning:system` (内部API)

**リクエストボディ**:
```json
{
  "userId": "user-uuid-002",
  "courseId": "course-uuid-001",
  "progressId": "progress-uuid-001",
  "score": 85,
  "expiryDate": null
}
```

**レスポンス**: `201 Created`
```json
{
  "id": "cert-uuid-001",
  "certificateNumber": "CERT-20251104-A1B2C3",
  "userId": "user-uuid-002",
  "userName": "鈴木一郎",
  "courseId": "course-uuid-001",
  "courseTitle": "TypeScript基礎コース",
  "instructorName": "山田太郎",
  "score": 85,
  "issueDate": "2025-11-04T13:00:00.000Z",
  "expiryDate": null,
  "status": "active",
  "credentialUrl": "/certificates/CERT-20251104-A1B2C3/verify",
  "verificationCode": "VER-A1B2C3D4E5F6",
  "metadata": {
    "courseName": "TypeScript基礎コース",
    "instructorName": "山田太郎"
  }
}
```

---

### 2. 証明書取得 [Get Certification]

証明書の詳細を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/certifications/{certificationId}
```

**権限**: `learning:certification:read` (自分の証明書) / `learning:admin`

**レスポンス**: `200 OK` (発行時と同じ構造)

---

### 3. 自分の証明書一覧 [My Certifications]

ログインユーザーの証明書一覧を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/my-certifications
```

**権限**: `learning:certification:read`

**クエリパラメータ**:
- `status` (string, optional): `active`, `expired`, `revoked`

**レスポンス**: `200 OK`
```json
{
  "certifications": [
    {
      "id": "cert-uuid-001",
      "certificateNumber": "CERT-20251104-A1B2C3",
      "courseTitle": "TypeScript基礎コース",
      "instructorName": "山田太郎",
      "score": 85,
      "issueDate": "2025-11-04T13:00:00.000Z",
      "expiryDate": null,
      "status": "active"
    }
  ]
}
```

---

### 4. 証明書検証 [Verify Certification]

証明書の真正性を検証します（公開API、認証不要）。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/certifications/verify/{certificateNumber}
```

**権限**: なし（公開）

**クエリパラメータ**:
- `verificationCode` (string, required): 検証コード

**レスポンス**: `200 OK`
```json
{
  "valid": true,
  "certificateNumber": "CERT-20251104-A1B2C3",
  "userName": "鈴木一郎",
  "courseTitle": "TypeScript基礎コース",
  "issueDate": "2025-11-04T13:00:00.000Z",
  "expiryDate": null,
  "status": "active"
}
```

**エラーレスポンス** (無効な証明書):
```json
{
  "valid": false,
  "reason": "Certificate not found or verification code mismatch"
}
```

---

## Learning Path API {#learning-path-api}

### 1. 学習経路作成 [Create Learning Path]

ユーザーの目標スキルに基づいて学習経路を作成します。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/paths
```

**権限**: `learning:path:create`

**リクエストボディ**:
```json
{
  "title": "フルスタックエンジニアへの道",
  "targetSkills": [
    "skill-uuid-001",
    "skill-uuid-002",
    "skill-uuid-003"
  ],
  "targetLevel": "intermediate"
}
```

**レスポンス**: `201 Created`
```json
{
  "id": "path-uuid-001",
  "userId": "user-uuid-002",
  "title": "フルスタックエンジニアへの道",
  "targetSkills": [
    {
      "id": "skill-uuid-001",
      "name": "TypeScript",
      "currentLevel": "beginner",
      "targetLevel": "intermediate"
    }
  ],
  "recommendedCourses": [
    {
      "courseId": "course-uuid-001",
      "courseTitle": "TypeScript基礎コース",
      "priority": 95,
      "reason": "Skill gap: TypeScript",
      "order": 1,
      "estimatedDuration": {
        "minutes": 480
      }
    },
    {
      "courseId": "course-uuid-002",
      "courseTitle": "React入門",
      "priority": 90,
      "reason": "Next in learning path",
      "order": 2,
      "estimatedDuration": {
        "minutes": 600
      }
    }
  ],
  "estimatedDuration": {
    "minutes": 2160,
    "display": "36時間"
  },
  "progressPercentage": 0,
  "createdAt": "2025-11-04T14:00:00.000Z"
}
```

---

### 2. 学習経路取得 [Get Learning Path]

学習経路の詳細を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/paths/{pathId}
```

**権限**: `learning:path:read` (自分の経路) / `learning:admin`

**レスポンス**: `200 OK` (作成時と同じ構造 + 進捗情報)

---

### 3. 自分の学習経路一覧 [My Learning Paths]

ログインユーザーの学習経路一覧を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/my-paths
```

**権限**: `learning:path:read`

**レスポンス**: `200 OK`
```json
{
  "paths": [
    {
      "id": "path-uuid-001",
      "title": "フルスタックエンジニアへの道",
      "progressPercentage": 37.5,
      "completedCourses": 3,
      "totalCourses": 8,
      "estimatedRemainingTime": {
        "minutes": 1350,
        "display": "22時間30分"
      },
      "createdAt": "2025-11-04T14:00:00.000Z"
    }
  ]
}
```

---

### 4. 次のコース推奨 [Recommend Next Course]

学習経路に基づいて次に受講すべきコースを推奨します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/paths/{pathId}/next-course
```

**権限**: `learning:path:read`

**レスポンス**: `200 OK`
```json
{
  "pathId": "path-uuid-001",
  "nextCourse": {
    "courseId": "course-uuid-002",
    "courseTitle": "React入門",
    "reason": "Next in your learning path after completing TypeScript基礎",
    "priority": 90,
    "estimatedDuration": {
      "minutes": 600,
      "display": "10時間"
    }
  }
}
```

---

### 5. 学習経路更新 [Update Learning Path]

進捗に基づいて学習経路を自動調整します。

**エンドポイント**:
```
POST /api/v1/bc-006/learning/paths/{pathId}/adjust
```

**権限**: `learning:path:update`

**リクエストボディ**:
```json
{
  "completedCourseId": "course-uuid-001",
  "performanceScore": 85
}
```

**レスポンス**: `200 OK`
```json
{
  "pathId": "path-uuid-001",
  "adjusted": true,
  "changes": [
    {
      "type": "course_added",
      "courseId": "course-uuid-005",
      "reason": "Recommended based on high performance in TypeScript"
    },
    {
      "type": "priority_updated",
      "courseId": "course-uuid-003",
      "oldPriority": 80,
      "newPriority": 85
    }
  ],
  "progressPercentage": 37.5
}
```

---

### 6. 完了時間見積もり [Estimate Completion Time]

学習経路の完了までの推定時間を計算します。

**エンドポイント**:
```
GET /api/v1/bc-006/learning/paths/{pathId}/estimate
```

**権限**: `learning:path:read`

**レスポンス**: `200 OK`
```json
{
  "pathId": "path-uuid-001",
  "totalEstimatedTime": {
    "minutes": 2160,
    "display": "36時間"
  },
  "remainingEstimatedTime": {
    "minutes": 1350,
    "display": "22時間30分"
  },
  "projectedCompletionDate": "2025-12-15T00:00:00.000Z",
  "assumptions": {
    "hoursPerWeek": 5,
    "weeklyConsistency": 0.8
  }
}
```

---

## データスキーマ {#data-schemas}

### LearningCourse Schema

```typescript
interface LearningCourse {
  id: string;
  title: string;
  description: string;
  overview: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  instructorId: string;
  instructor?: Instructor;
  modules: CourseModule[];
  assessments: CourseAssessment[];
  learningObjectives: LearningObjective[];
  prerequisites: string[]; // Course IDs
  tags: string[];
  estimatedDuration: Duration;
  enrollmentCount: number;
  completionRate: number; // 0.0 - 1.0
  averageRating: number; // 0.0 - 5.0
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
}

interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  estimatedDuration: Duration;
  materials: CourseMaterial[];
  learningObjectives: string[];
  completionCriteria: CompletionCriteria;
  createdAt: string;
  updatedAt: string;
}

interface CourseMaterial {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'document' | 'slide' | 'code_example' | 'interactive_exercise' | 'knowledge_article';
  url?: string;
  content?: string;
  duration?: Duration;
  order: number;
  isRequired: boolean;
}
```

---

### LearningProgress Schema

```typescript
interface LearningProgress {
  id: string;
  userId: string;
  courseId: string;
  course?: LearningCourse;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'expired';
  enrolledAt: string;
  startedAt?: string;
  completedAt?: string;
  lastAccessedAt: string;
  progressRate: ProgressRate;
  moduleCompletions: ModuleCompletion[];
  assessmentResults: AssessmentResult[];
  totalScore: number;
  certificateId?: string;
  expiresAt?: string;
}

interface ModuleCompletion {
  moduleId: string;
  moduleTitle: string;
  completedAt: string;
  timeSpent: Duration;
  materialsViewed: string[];
}

interface AssessmentResult {
  assessmentId: string;
  assessmentTitle: string;
  score: number;
  maxScore: number;
  normalizedScore: number; // 100-point scale
  passed: boolean;
  attemptNumber: number;
  submittedAt: string;
  gradedAt: string;
  feedback?: AssessmentFeedback;
}

interface ProgressRate {
  completedCount: number;
  totalCount: number;
  percentage: number; // 0 - 100
}
```

---

### Certification Schema

```typescript
interface Certification {
  id: string;
  certificateNumber: string; // e.g., "CERT-20251104-A1B2C3"
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  progressId: string;
  score: number;
  issueDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'revoked';
  credentialUrl: string;
  verificationCode: string;
  metadata: CertificationMetadata;
}

interface CertificationMetadata {
  courseName: string;
  instructorName: string;
  revocationReason?: string;
}
```

---

### LearningPath Schema

```typescript
interface LearningPath {
  id: string;
  userId: string;
  title: string;
  targetSkills: SkillTarget[];
  currentSkillLevel: SkillProfile;
  targetSkillLevel: SkillProfile;
  recommendedCourses: CourseRecommendation[];
  completedCourses: string[];
  estimatedDuration: Duration;
  progressPercentage: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface CourseRecommendation {
  courseId: string;
  courseTitle?: string;
  priority: number; // 0 - 100
  reason: string;
  order: number;
  estimatedDuration?: Duration;
}

interface SkillTarget {
  id: string;
  name: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
}
```

---

## 使用例 {#usage-examples}

### 例1: コース作成から公開までのフロー

```typescript
// 1. コース作成
const courseResponse = await fetch('/api/v1/bc-006/learning/courses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${instructorToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'React Hooks完全ガイド',
    description: 'React Hooksを基礎から応用まで学ぶ',
    level: 'intermediate',
    category: 'frontend',
    estimatedDuration: 600
  })
});

const course = await courseResponse.json();
const courseId = course.id;

// 2. モジュール追加
const moduleResponse = await fetch(`/api/v1/bc-006/learning/courses/${courseId}/modules`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${instructorToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'useState入門',
    description: 'useStateフックの基本',
    order: 1,
    estimatedDuration: 60,
    materials: [
      {
        title: 'useState解説動画',
        type: 'video',
        url: 'https://videos.example.com/usestate.mp4',
        duration: 15,
        order: 1,
        isRequired: true
      }
    ]
  })
});

// 3. 評価追加
const assessmentResponse = await fetch(`/api/v1/bc-006/learning/courses/${courseId}/assessments`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${instructorToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: '最終試験',
    type: 'exam',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 60,
    attemptsAllowed: 3,
    isRequired: true
  })
});

// 4. 公開
await fetch(`/api/v1/bc-006/learning/courses/${courseId}/publish`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${instructorToken}`
  }
});
```

---

### 例2: 学習者の受講フロー

```typescript
// 1. コース検索
const searchResponse = await fetch('/api/v1/bc-006/learning/courses?category=frontend&level=intermediate', {
  headers: {
    'Authorization': `Bearer ${learnerToken}`
  }
});

const { items: courses } = await searchResponse.json();

// 2. コース登録
const enrollResponse = await fetch(`/api/v1/bc-006/learning/courses/${courseId}/enroll`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${learnerToken}`
  }
});

const { progressId } = await enrollResponse.json();

// 3. コース開始
await fetch(`/api/v1/bc-006/learning/progress/${progressId}/start`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${learnerToken}`
  }
});

// 4. モジュール学習
await fetch(`/api/v1/bc-006/learning/progress/${progressId}/materials/${materialId}/view`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${learnerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    timeSpent: 15,
    completed: true
  })
});

// 5. モジュール完了
await fetch(`/api/v1/bc-006/learning/progress/${progressId}/modules/${moduleId}/complete`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${learnerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    timeSpent: 65,
    materialsViewed: [materialId1, materialId2]
  })
});

// 6. 評価受験
const assessmentStartResponse = await fetch(`/api/v1/bc-006/learning/assessments/${assessmentId}/start`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${learnerToken}`
  }
});

const { sessionId, questions } = await assessmentStartResponse.json();

// 7. 評価提出
const submitResponse = await fetch(`/api/v1/bc-006/learning/assessments/${assessmentId}/submit`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${learnerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sessionId,
    answers: {
      [questions[0].id]: { selectedOption: 'opt-001' }
    }
  })
});

const result = await submitResponse.json();

// 8. コース完了 → 自動的に証明書発行
if (result.passed) {
  const certsResponse = await fetch('/api/v1/bc-006/learning/my-certifications', {
    headers: {
      'Authorization': `Bearer ${learnerToken}`
    }
  });

  const { certifications } = await certsResponse.json();
  console.log('証明書:', certifications[0].certificateNumber);
}
```

---

### 例3: 学習経路の作成と活用

```typescript
// 1. 学習経路作成
const pathResponse = await fetch('/api/v1/bc-006/learning/paths', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${learnerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'フロントエンドマスターへの道',
    targetSkills: ['skill-uuid-react', 'skill-uuid-typescript'],
    targetLevel: 'advanced'
  })
});

const path = await pathResponse.json();

// 2. 次のコース推奨取得
const nextCourseResponse = await fetch(`/api/v1/bc-006/learning/paths/${path.id}/next-course`, {
  headers: {
    'Authorization': `Bearer ${learnerToken}`
  }
});

const { nextCourse } = await nextCourseResponse.json();

// 3. 推奨コースに登録
await fetch(`/api/v1/bc-006/learning/courses/${nextCourse.courseId}/enroll`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${learnerToken}`
  }
});

// 4. コース完了後、学習経路を調整
await fetch(`/api/v1/bc-006/learning/paths/${path.id}/adjust`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${learnerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    completedCourseId: nextCourse.courseId,
    performanceScore: 92
  })
});
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-006 学習システムAPI詳細化
