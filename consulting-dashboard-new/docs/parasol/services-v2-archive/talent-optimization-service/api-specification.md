# API仕様: タレント最適化サービス

## API概要
**目的**: 組織の人材を最適に配置し、スキル開発を促進し、チームの生産性を最大化するRESTful API
**バージョン**: v1.0.0
**ベースURL**: `https://api.example.com/v1/talent-optimization`

## 認証
**認証方式**: JWT (JSON Web Token)
**ヘッダー**: `Authorization: Bearer {token}`

## 共通仕様

### リクエストヘッダー
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
Accept: application/json
```

### レスポンス形式
```json
{
  "success": boolean,
  "data": object,
  "message": string,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": "詳細情報"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## エンドポイント定義

### Member API

#### GET /members
**概要**: メンバー一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/members`
- **Parameters**:
  - `page` (query, optional): ページ番号 (default: 1)
  - `limit` (query, optional): 件数 (default: 20, max: 100)
  - `department` (query, optional): 部署フィルタ
  - `level` (query, optional): レベルフィルタ (Junior/Middle/Senior/Expert/Principal)
  - `isActive` (query, optional): アクティブフラグ
  - `skills` (query, optional): スキルフィルタ（カンマ区切り）

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "employeeCode": "EMP001",
        "firstName": "太郎",
        "lastName": "山田",
        "email": "yamada@example.com",
        "department": "開発部",
        "position": "シニアエンジニア",
        "level": "Senior",
        "employmentType": "FullTime",
        "joinDate": "2020-04-01",
        "location": "東京",
        "costRate": 8000,
        "availabilityRate": 85,
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

#### POST /members
**概要**: 新規メンバーを登録

**リクエスト**:
```json
{
  "employeeCode": "EMP001",
  "userId": "uuid",
  "firstName": "太郎",
  "lastName": "山田",
  "email": "yamada@example.com",
  "department": "開発部",
  "position": "シニアエンジニア",
  "level": "Senior",
  "employmentType": "FullTime",
  "joinDate": "2020-04-01",
  "location": "東京",
  "timeZone": "Asia/Tokyo",
  "costRate": 8000,
  "availabilityRate": 100
}
```

#### GET /members/{id}
**概要**: メンバー詳細を取得

#### PUT /members/{id}
**概要**: メンバー情報を更新

#### GET /members/{id}/skills
**概要**: メンバーのスキル一覧を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "memberId": "uuid",
    "skills": [
      {
        "id": "uuid",
        "skillId": "uuid",
        "skillName": "Java",
        "category": "Technical",
        "proficiencyLevel": "Expert",
        "yearsOfExperience": 8,
        "lastUsedDate": "2024-01-15",
        "certificationDate": "2022-06-01",
        "validatedBy": "uuid",
        "validatedDate": "2024-01-10"
      }
    ]
  }
}
```

#### POST /members/{id}/skills
**概要**: メンバーにスキルを追加

**リクエスト**:
```json
{
  "skillId": "uuid",
  "proficiencyLevel": "Advanced",
  "yearsOfExperience": 5,
  "certificationDate": "2023-03-15",
  "notes": "実務経験5年、プロジェクトリーダー経験あり"
}
```

#### PUT /members/{id}/skills/{skillId}
**概要**: メンバースキルを更新

#### DELETE /members/{id}/skills/{skillId}
**概要**: メンバースキルを削除

#### GET /members/{id}/utilization
**概要**: メンバーの稼働状況を取得

**Parameters**:
- `startDate` (query, required): 開始日
- `endDate` (query, required): 終了日

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "memberId": "uuid",
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "utilizationRate": 85,
    "allocatedHours": 136,
    "availableHours": 160,
    "assignments": [
      {
        "projectId": "uuid",
        "projectName": "DXプロジェクト",
        "allocationRate": 50,
        "hours": 80
      }
    ]
  }
}
```

### Skill API

#### GET /skills
**概要**: スキル一覧を取得

**Parameters**:
- `category` (query, optional): カテゴリフィルタ
- `isActive` (query, optional): アクティブフラグ
- `search` (query, optional): スキル名検索

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Java",
        "category": "Technical",
        "description": "Javaプログラミング言語",
        "parentSkillId": null,
        "isActive": true,
        "relatedSkills": ["Spring Boot", "Maven", "Gradle"]
      }
    ]
  }
}
```

#### POST /skills
**概要**: 新規スキルを作成

#### GET /skills/{id}
**概要**: スキル詳細を取得

#### PUT /skills/{id}
**概要**: スキルを更新

#### GET /skills/{id}/members
**概要**: スキルを保有するメンバー一覧を取得

**Parameters**:
- `minProficiency` (query, optional): 最小習熟度

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "skillId": "uuid",
    "skillName": "Java",
    "members": [
      {
        "memberId": "uuid",
        "memberName": "山田太郎",
        "proficiencyLevel": "Expert",
        "yearsOfExperience": 8,
        "availability": true
      }
    ]
  }
}
```

### Team API

#### GET /teams
**概要**: チーム一覧を取得

**Parameters**:
- `type` (query, optional): チームタイプフィルタ
- `status` (query, optional): ステータスフィルタ
- `leaderId` (query, optional): リーダーフィルタ

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "code": "TEAM-001",
        "name": "DX推進チーム",
        "type": "Project",
        "leaderId": "uuid",
        "purpose": "全社DX推進",
        "startDate": "2024-01-01",
        "status": "Active",
        "currentSize": 8,
        "maxSize": 10
      }
    ]
  }
}
```

#### POST /teams
**概要**: 新規チームを作成

**リクエスト**:
```json
{
  "code": "TEAM-001",
  "name": "DX推進チーム",
  "description": "全社的なDX推進を担当",
  "type": "Project",
  "leaderId": "uuid",
  "purpose": "ビジネスオペレーションのデジタル化",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "maxSize": 10,
  "requiredSkills": ["プロジェクト管理", "DX知識", "変革推進"]
}
```

#### GET /teams/{id}
**概要**: チーム詳細を取得

#### PUT /teams/{id}
**概要**: チーム情報を更新

#### GET /teams/{id}/members
**概要**: チームメンバー一覧を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "teamId": "uuid",
    "members": [
      {
        "id": "uuid",
        "memberId": "uuid",
        "memberName": "山田太郎",
        "role": "Leader",
        "allocationRate": 100,
        "startDate": "2024-01-01",
        "endDate": null,
        "isActive": true
      }
    ]
  }
}
```

#### POST /teams/{id}/members
**概要**: チームにメンバーを追加

**リクエスト**:
```json
{
  "memberId": "uuid",
  "role": "CoreMember",
  "allocationRate": 50,
  "startDate": "2024-02-01",
  "endDate": "2024-12-31",
  "responsibilities": "開発リーダー"
}
```

#### PUT /teams/{id}/members/{memberId}
**概要**: チームメンバー情報を更新

#### DELETE /teams/{id}/members/{memberId}
**概要**: チームからメンバーを削除

### Assignment API

#### GET /assignments
**概要**: アサインメント一覧を取得

**Parameters**:
- `memberId` (query, optional): メンバーフィルタ
- `projectId` (query, optional): プロジェクトフィルタ
- `status` (query, optional): ステータスフィルタ
- `startDate` (query, optional): 開始日フィルタ
- `endDate` (query, optional): 終了日フィルタ

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "memberId": "uuid",
        "memberName": "山田太郎",
        "projectId": "uuid",
        "projectName": "DXプロジェクト",
        "role": "開発リーダー",
        "allocationRate": 50,
        "startDate": "2024-01-01",
        "endDate": "2024-12-31",
        "status": "Active",
        "billable": true
      }
    ]
  }
}
```

#### POST /assignments
**概要**: 新規アサインメントを作成

**リクエスト**:
```json
{
  "memberId": "uuid",
  "projectId": "uuid",
  "taskId": "uuid",
  "role": "開発リーダー",
  "allocationRate": 50,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "billable": true,
  "requestedBy": "uuid"
}
```

#### GET /assignments/{id}
**概要**: アサインメント詳細を取得

#### PUT /assignments/{id}
**概要**: アサインメントを更新

#### DELETE /assignments/{id}
**概要**: アサインメントを削除

#### PUT /assignments/{id}/approve
**概要**: アサインメントを承認

**リクエスト**:
```json
{
  "approvedBy": "uuid",
  "approvedDate": "2024-01-05",
  "comment": "承認します"
}
```

### SkillDevelopment API

#### GET /skill-developments
**概要**: スキル開発計画一覧を取得

**Parameters**:
- `memberId` (query, optional): メンバーフィルタ
- `status` (query, optional): ステータスフィルタ

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "memberId": "uuid",
        "memberName": "山田太郎",
        "targetSkillId": "uuid",
        "targetSkillName": "React",
        "currentLevel": "Intermediate",
        "targetLevel": "Advanced",
        "startDate": "2024-01-01",
        "targetDate": "2024-06-30",
        "status": "InProgress",
        "progress": 60
      }
    ]
  }
}
```

#### POST /skill-developments
**概要**: スキル開発計画を作成

**リクエスト**:
```json
{
  "memberId": "uuid",
  "targetSkillId": "uuid",
  "currentLevel": "Intermediate",
  "targetLevel": "Advanced",
  "startDate": "2024-01-01",
  "targetDate": "2024-06-30",
  "developmentPlan": "オンライン学習とプロジェクト実践",
  "budget": 100000,
  "mentorId": "uuid"
}
```

#### PUT /skill-developments/{id}/progress
**概要**: スキル開発進捗を更新

**リクエスト**:
```json
{
  "progress": 75,
  "currentLevel": "Advanced",
  "notes": "順調に進捗中"
}
```

### Performance API

#### GET /members/{memberId}/performance
**概要**: メンバーのパフォーマンス評価を取得

**Parameters**:
- `period` (query, optional): 評価期間 (Q1/Q2/Q3/Q4/Annual)
- `year` (query, required): 年

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "memberId": "uuid",
    "period": "Q1",
    "year": 2024,
    "overallRating": 4.5,
    "ratings": {
      "technicalSkills": 5.0,
      "productivity": 4.5,
      "collaboration": 4.0,
      "leadership": 4.5
    },
    "achievements": [
      "DXプロジェクト成功",
      "新技術導入"
    ],
    "areasForImprovement": [
      "コミュニケーションスキル向上"
    ]
  }
}
```

#### POST /members/{memberId}/performance
**概要**: パフォーマンス評価を記録

### Resource Allocation API

#### POST /resource-allocations/suggest
**概要**: リソース配分を最適化提案

**リクエスト**:
```json
{
  "projectId": "uuid",
  "requiredSkills": ["Java", "React", "AWS"],
  "requiredMembers": 5,
  "startDate": "2024-02-01",
  "endDate": "2024-12-31",
  "allocationRates": [100, 80, 80, 50, 50]
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "memberId": "uuid",
        "memberName": "山田太郎",
        "matchScore": 95,
        "skills": ["Java", "Spring Boot", "AWS"],
        "availability": 50,
        "costRate": 8000,
        "reason": "スキルマッチ度95%、経験豊富"
      }
    ],
    "teamComposition": {
      "skillCoverage": 100,
      "estimatedCost": 40000000,
      "riskLevel": "Low"
    }
  }
}
```

#### GET /resource-allocations/conflicts
**概要**: リソース配分の競合を検出

**Parameters**:
- `startDate` (query, required): 開始日
- `endDate` (query, required): 終了日

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "conflicts": [
      {
        "memberId": "uuid",
        "memberName": "山田太郎",
        "totalAllocation": 120,
        "assignments": [
          {
            "projectId": "uuid1",
            "allocationRate": 70
          },
          {
            "projectId": "uuid2",
            "allocationRate": 50
          }
        ]
      }
    ]
  }
}
```

## エラーコード

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| INVALID_REQUEST | 400 | リクエストが不正 |
| UNAUTHORIZED | 401 | 認証が必要 |
| FORBIDDEN | 403 | アクセス権限なし |
| NOT_FOUND | 404 | リソースが見つからない |
| CONFLICT | 409 | リソースの競合 |
| VALIDATION_ERROR | 422 | バリデーションエラー |
| BUSINESS_RULE_VIOLATION | 422 | ビジネスルール違反 |
| INTERNAL_ERROR | 500 | サーバー内部エラー |

### ビジネスルール違反の詳細エラーコード

| コード | 説明 |
|--------|------|
| EMPLOYEE_CODE_DUPLICATE | 社員番号が重複 |
| OVERALLOCATION | リソースの過剰配分 |
| SKILL_NOT_VALIDATED | スキルが未検証 |
| TEAM_SIZE_EXCEEDED | チーム最大人数超過 |
| ASSIGNMENT_OVERLAP | アサインメント期間の重複 |
| CERTIFICATION_EXPIRED | 認定有効期限切れ |

## レート制限
- **一般API**: 1000リクエスト/時間
- **重い処理（最適化提案）**: 100リクエスト/時間
- **制限時のレスポンス**: 429 Too Many Requests

## バージョン管理
- **現在**: v1.0.0
- **サポート**: v1.x系をサポート
- **廃止予定**: なし
