# BC-005: タレント・チーム・スキル管理API

**ドキュメント**: API層 - タレント・チーム・スキル管理
**最終更新**: 2025-11-03

このドキュメントでは、タレント育成、チーム編成、スキル開発のAPIを定義します。

---

## 目次

1. [タレント管理API](#talent-management)
2. [パフォーマンス管理API](#performance-management)
3. [キャリア開発API](#career-development)
4. [スキル管理API](#skill-management)
5. [チーム管理API](#team-management)

---

## タレント管理API {#talent-management}

### タレント詳細取得

```
GET /api/bc-005/talents/{talentId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "talent-uuid",
    "userId": "user-uuid",
    "userName": "山田太郎",
    "email": "yamada@example.com",
    "hireDate": "2020-04-01",
    "currentLevel": "SENIOR",
    "resourceType": "CONSULTANT",
    "performanceSummary": {
      "latestRating": 4.2,
      "latestPeriod": "2025-H1",
      "ratingTrend": "improving",
      "recordCount": 8
    },
    "careerPlan": {
      "fiscalYear": "2025",
      "targetRole": "PRINCIPAL_CONSULTANT",
      "progress": 0.65
    },
    "skills": [
      {
        "skillId": "skill-java-uuid",
        "skillName": "Java",
        "category": "TECHNICAL",
        "level": 4,
        "levelName": "EXPERT",
        "acquiredDate": "2020-06-15"
      }
    ],
    "certifications": [
      {
        "id": "cert-uuid",
        "name": "AWS Solutions Architect",
        "issuedDate": "2023-05-20",
        "expiryDate": "2026-05-20"
      }
    ],
    "createdAt": "2020-04-01T09:00:00Z",
    "updatedAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### タレント情報更新

```
PUT /api/bc-005/talents/{talentId}
```

**リクエスト**:
```json
{
  "currentLevel": "PRINCIPAL",
  "resourceType": "CONSULTANT"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "talent-uuid",
    "currentLevel": "PRINCIPAL",
    "resourceType": "CONSULTANT",
    "updatedAt": "2025-11-03T13:00:00Z"
  }
}
```

---

## パフォーマンス管理API {#performance-management}

### パフォーマンス評価記録

```
POST /api/bc-005/talents/{talentId}/performance
```

**リクエスト**:
```json
{
  "evaluationPeriod": {
    "startDate": "2025-01-01",
    "endDate": "2025-06-30",
    "periodName": "2025-H1"
  },
  "rating": {
    "overallScore": 4.2,
    "dimensions": {
      "technical_skills": 4.5,
      "communication": 4.0,
      "leadership": 4.0,
      "delivery_quality": 4.3,
      "client_satisfaction": 4.2
    }
  },
  "feedback": "優れた技術力で高品質な成果物を提供。リーダーシップスキルのさらなる向上が期待される。",
  "achievements": [
    "Project Alpha を期限内に高品質で完了",
    "新人メンバー3名のメンタリング"
  ],
  "developmentAreas": [
    "プロジェクトマネジメントスキルの強化",
    "プレゼンテーションスキルの向上"
  ]
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "performance-record-uuid",
    "talentId": "talent-uuid",
    "evaluationPeriod": {
      "startDate": "2025-01-01",
      "endDate": "2025-06-30",
      "periodName": "2025-H1"
    },
    "rating": {
      "overallScore": 4.2,
      "ratingCategory": "EXCEEDS_EXPECTATIONS",
      "dimensions": {
        "technical_skills": 4.5,
        "communication": 4.0,
        "leadership": 4.0,
        "delivery_quality": 4.3,
        "client_satisfaction": 4.2
      }
    },
    "evaluatorId": "manager-uuid",
    "evaluatorName": "鈴木マネージャー",
    "status": "DRAFT",
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

**エラー**:
- `BC005_ERR_100`: Talent not found
- `BC005_ERR_101`: Duplicate performance record for period
- `BC005_ERR_102`: Invalid performance rating

**評価カテゴリ**:
- **EXCEPTIONAL** (4.5-5.0): 期待を大きく上回る
- **EXCEEDS_EXPECTATIONS** (3.5-4.4): 期待を上回る
- **MEETS_EXPECTATIONS** (2.5-3.4): 期待通り
- **NEEDS_IMPROVEMENT** (1.5-2.4): 改善が必要
- **UNSATISFACTORY** (1.0-1.4): 不十分

---

### パフォーマンス評価承認

```
PUT /api/bc-005/talents/{talentId}/performance/{recordId}/approve
```

**リクエスト**:
```json
{
  "comments": "評価内容を確認し承認します"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "performance-record-uuid",
    "status": "APPROVED",
    "approvedBy": "hr-manager-uuid",
    "approvedByName": "人事部長",
    "approvedAt": "2025-11-03T14:00:00Z",
    "comments": "評価内容を確認し承認します"
  }
}
```

**エラー**:
- `BC005_ERR_103`: Insufficient permission to approve
- `BC005_ERR_104`: Performance record is not in draft status

---

### パフォーマンス評価履歴取得

```
GET /api/bc-005/talents/{talentId}/performance?limit=10
```

**クエリパラメータ**:
- `status` (optional): DRAFT | APPROVED | REJECTED
- `startDate` (optional): 期間開始日以降
- `endDate` (optional): 期間終了日以前
- `limit` (optional): 取得件数（default: 10）

**レスポンス**:
```json
{
  "data": [
    {
      "id": "performance-record-uuid",
      "evaluationPeriod": {
        "startDate": "2025-01-01",
        "endDate": "2025-06-30",
        "periodName": "2025-H1"
      },
      "rating": {
        "overallScore": 4.2,
        "ratingCategory": "EXCEEDS_EXPECTATIONS"
      },
      "evaluatorId": "manager-uuid",
      "evaluatorName": "鈴木マネージャー",
      "status": "APPROVED",
      "approvedBy": "hr-manager-uuid",
      "approvedAt": "2025-11-03T14:00:00Z",
      "createdAt": "2025-11-03T12:00:00Z"
    }
  ],
  "trend": {
    "direction": "improving",
    "avgScore": 4.0,
    "previousAvgScore": 3.7,
    "change": 0.3
  }
}
```

---

## キャリア開発API {#career-development}

### キャリア計画作成

```
POST /api/bc-005/talents/{talentId}/career-plan
```

**リクエスト**:
```json
{
  "fiscalYear": "2025",
  "targetRole": "PRINCIPAL_CONSULTANT",
  "targetLevel": "PRINCIPAL",
  "targetDate": "2026-04-01",
  "developmentGoals": [
    {
      "category": "TECHNICAL",
      "goal": "AWSアーキテクチャ設計の専門性向上",
      "description": "AWS Solutions Architect Professional 資格取得",
      "measurableCriteria": [
        "資格試験合格",
        "大規模プロジェクトでのアーキテクト担当"
      ],
      "targetDate": "2025-12-31",
      "priority": "HIGH"
    },
    {
      "category": "LEADERSHIP",
      "goal": "プロジェクトマネジメントスキル習得",
      "description": "10名以上のチームリーダー経験",
      "measurableCriteria": [
        "PMOトレーニング完了",
        "プロジェクト成功裏に完了"
      ],
      "targetDate": "2026-03-31",
      "priority": "HIGH"
    }
  ],
  "requiredSkills": [
    {
      "skillId": "skill-aws-architecture-uuid",
      "targetLevel": 4
    },
    {
      "skillId": "skill-project-management-uuid",
      "targetLevel": 3
    }
  ]
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "career-plan-uuid",
    "talentId": "talent-uuid",
    "fiscalYear": "2025",
    "targetRole": "PRINCIPAL_CONSULTANT",
    "targetLevel": "PRINCIPAL",
    "targetDate": "2026-04-01",
    "developmentGoals": [
      {
        "id": "goal-uuid-1",
        "category": "TECHNICAL",
        "goal": "AWSアーキテクチャ設計の専門性向上",
        "status": "IN_PROGRESS",
        "progress": 0.0
      }
    ],
    "status": "ACTIVE",
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

**エラー**:
- `BC005_ERR_105`: Duplicate career plan for fiscal year
- `BC005_ERR_106`: Invalid development goal (not SMART)

---

### キャリア計画取得

```
GET /api/bc-005/talents/{talentId}/career-plan?fiscalYear=2025
```

**レスポンス**:
```json
{
  "data": {
    "id": "career-plan-uuid",
    "talentId": "talent-uuid",
    "fiscalYear": "2025",
    "targetRole": "PRINCIPAL_CONSULTANT",
    "targetLevel": "PRINCIPAL",
    "targetDate": "2026-04-01",
    "developmentGoals": [
      {
        "id": "goal-uuid-1",
        "category": "TECHNICAL",
        "goal": "AWSアーキテクチャ設計の専門性向上",
        "description": "AWS Solutions Architect Professional 資格取得",
        "measurableCriteria": [
          "資格試験合格",
          "大規模プロジェクトでのアーキテクト担当"
        ],
        "status": "IN_PROGRESS",
        "progress": 0.45,
        "targetDate": "2025-12-31",
        "completedCriteria": 0,
        "totalCriteria": 2
      }
    ],
    "requiredSkills": [
      {
        "skillId": "skill-aws-architecture-uuid",
        "skillName": "AWS Architecture",
        "currentLevel": 2,
        "targetLevel": 4,
        "gap": 2
      }
    ],
    "overallProgress": 0.38,
    "status": "ACTIVE",
    "createdAt": "2025-11-03T12:00:00Z",
    "updatedAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### 育成目標進捗更新

```
PUT /api/bc-005/talents/{talentId}/career-plan/{planId}/goals/{goalId}
```

**リクエスト**:
```json
{
  "progress": 0.65,
  "status": "IN_PROGRESS",
  "completedCriteria": [
    "資格試験合格"
  ],
  "notes": "AWS Solutions Architect Professional 資格を取得しました"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "goal-uuid-1",
    "progress": 0.65,
    "status": "IN_PROGRESS",
    "completedCriteria": 1,
    "totalCriteria": 2,
    "updatedAt": "2025-11-03T13:00:00Z"
  }
}
```

---

## スキル管理API {#skill-management}

### スキル定義作成

```
POST /api/bc-005/skills
```

**リクエスト**:
```json
{
  "name": "Java",
  "category": "TECHNICAL",
  "description": "Java プログラミング言語",
  "levels": [
    {
      "level": 1,
      "levelName": "BEGINNER",
      "description": "基本的なJava構文を理解し、簡単なプログラムを作成できる",
      "criteria": [
        "基本的なデータ型とコレクションの使用",
        "クラスとオブジェクトの理解"
      ]
    },
    {
      "level": 2,
      "levelName": "INTERMEDIATE",
      "description": "オブジェクト指向設計を理解し、中規模アプリケーションを開発できる",
      "criteria": [
        "継承、インターフェース、ポリモーフィズムの活用",
        "例外処理とマルチスレッド"
      ]
    },
    {
      "level": 3,
      "levelName": "ADVANCED",
      "description": "高度な設計パターンを適用し、大規模システムの開発ができる",
      "criteria": [
        "デザインパターンの適用",
        "パフォーマンス最適化"
      ]
    },
    {
      "level": 4,
      "levelName": "EXPERT",
      "description": "アーキテクチャ設計とチーム指導ができる",
      "criteria": [
        "システムアーキテクチャ設計",
        "技術選定とベストプラクティス指導"
      ]
    },
    {
      "level": 5,
      "levelName": "MASTER",
      "description": "業界をリードする専門家レベル",
      "criteria": [
        "コミュニティへの貢献",
        "新技術の研究開発"
      ]
    }
  ],
  "prerequisites": [],
  "relatedSkills": ["Spring", "Maven", "Gradle"]
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "skill-uuid",
    "name": "Java",
    "category": "TECHNICAL",
    "description": "Java プログラミング言語",
    "levelCount": 5,
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### スキル一覧取得

```
GET /api/bc-005/skills?category=TECHNICAL&page=1&pageSize=50
```

**クエリパラメータ**:
- `category` (optional): TECHNICAL | BUSINESS | INDUSTRY | SOFT_SKILL | LANGUAGE
- `search` (optional): スキル名検索
- `page` (optional): ページ番号
- `pageSize` (optional): ページサイズ

**レスポンス**:
```json
{
  "data": [
    {
      "id": "skill-uuid",
      "name": "Java",
      "category": "TECHNICAL",
      "description": "Java プログラミング言語",
      "levelCount": 5,
      "talentCount": 45,
      "avgLevel": 2.8
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 120,
    "totalPages": 3
  }
}
```

---

### スキル詳細取得

```
GET /api/bc-005/skills/{skillId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "skill-uuid",
    "name": "Java",
    "category": "TECHNICAL",
    "description": "Java プログラミング言語",
    "levels": [
      {
        "level": 1,
        "levelName": "BEGINNER",
        "description": "基本的なJava構文を理解し、簡単なプログラムを作成できる",
        "criteria": ["..."]
      }
    ],
    "prerequisites": [],
    "relatedSkills": [
      {
        "skillId": "skill-spring-uuid",
        "skillName": "Spring"
      }
    ],
    "statistics": {
      "talentCount": 45,
      "avgLevel": 2.8,
      "distribution": {
        "1": 5,
        "2": 18,
        "3": 15,
        "4": 6,
        "5": 1
      }
    },
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### タレントスキル習得記録

```
POST /api/bc-005/talents/{talentId}/skills
```

**リクエスト**:
```json
{
  "skillId": "skill-java-uuid",
  "level": 2,
  "acquiredDate": "2025-11-01",
  "evidence": "Java中級トレーニング完了、プロジェクトでのJava開発経験3ヶ月"
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "talent-skill-uuid",
    "talentId": "talent-uuid",
    "skillId": "skill-java-uuid",
    "skillName": "Java",
    "level": 2,
    "levelName": "INTERMEDIATE",
    "acquiredDate": "2025-11-01",
    "evidence": "Java中級トレーニング完了、プロジェクトでのJava開発経験3ヶ月",
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

**エラー**:
- `BC005_ERR_200`: Skill not found
- `BC005_ERR_201`: Invalid skill level
- `BC005_ERR_203`: Prerequisite skills not met
- `BC005_ERR_204`: Skill already acquired

---

### スキルレベルアップ

```
PUT /api/bc-005/talents/{talentId}/skills/{talentSkillId}/level-up
```

**リクエスト**:
```json
{
  "newLevel": 3,
  "evidence": "大規模プロジェクトでのJava開発リーダー経験、デザインパターンの実践的適用"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "talent-skill-uuid",
    "skillId": "skill-java-uuid",
    "skillName": "Java",
    "previousLevel": 2,
    "newLevel": 3,
    "levelName": "ADVANCED",
    "acquiredDate": "2025-11-03",
    "evidence": "大規模プロジェクトでのJava開発リーダー経験、デザインパターンの実践的適用",
    "updatedAt": "2025-11-03T13:00:00Z"
  }
}
```

**エラー**:
- `BC005_ERR_202`: Cannot skip skill levels
- `BC005_ERR_205`: Maximum skill level reached (5)

---

### 保有スキル一覧取得

```
GET /api/bc-005/talents/{talentId}/skills
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "talent-skill-uuid",
      "skillId": "skill-java-uuid",
      "skillName": "Java",
      "category": "TECHNICAL",
      "level": 3,
      "levelName": "ADVANCED",
      "acquiredDate": "2025-11-03",
      "experienceYears": 5.5
    }
  ],
  "summary": {
    "totalSkills": 12,
    "byCategory": {
      "TECHNICAL": 8,
      "BUSINESS": 2,
      "SOFT_SKILL": 2
    },
    "avgLevel": 2.9
  }
}
```

---

### スキルギャップ分析

```
GET /api/bc-005/talents/{talentId}/skill-gaps?targetRole=PRINCIPAL_CONSULTANT
```

**クエリパラメータ**:
- `targetRole` (required): 目標ロール
- `projectId` (optional): プロジェクト要件との比較

**レスポンス**:
```json
{
  "data": {
    "talentId": "talent-uuid",
    "talentName": "山田太郎",
    "targetRole": "PRINCIPAL_CONSULTANT",
    "requiredSkills": [
      {
        "skillId": "skill-aws-uuid",
        "skillName": "AWS",
        "category": "TECHNICAL",
        "requiredLevel": 4,
        "currentLevel": 2,
        "gap": 2,
        "status": "GAP",
        "estimatedTimeToAcquire": "6 months",
        "recommendedActions": [
          "AWS Solutions Architect Professional トレーニング受講",
          "大規模AWSプロジェクトへの参加"
        ]
      },
      {
        "skillId": "skill-project-management-uuid",
        "skillName": "Project Management",
        "category": "BUSINESS",
        "requiredLevel": 3,
        "currentLevel": null,
        "gap": 3,
        "status": "MISSING",
        "estimatedTimeToAcquire": "9 months",
        "recommendedActions": [
          "PMOトレーニング受講",
          "プロジェクトリーダー経験"
        ]
      }
    ],
    "summary": {
      "totalRequired": 10,
      "met": 6,
      "gap": 3,
      "missing": 1,
      "matchPercentage": 60.0
    },
    "trainingRecommendations": [
      {
        "trainingId": "training-aws-pro-uuid",
        "trainingName": "AWS Solutions Architect Professional",
        "provider": "BC-006",
        "duration": "3 months",
        "targetSkills": ["AWS"]
      }
    ]
  }
}
```

---

### スキルマトリックス生成

```
POST /api/bc-005/skills/matrix
```

**リクエスト**:
```json
{
  "organizationUnitId": "unit-uuid",
  "skillCategories": ["TECHNICAL", "BUSINESS"],
  "minLevel": 3
}
```

**レスポンス**:
```json
{
  "data": {
    "organizationUnitId": "unit-uuid",
    "organizationUnitName": "技術本部",
    "generatedAt": "2025-11-03T12:00:00Z",
    "matrix": [
      {
        "skillId": "skill-java-uuid",
        "skillName": "Java",
        "category": "TECHNICAL",
        "talentCounts": {
          "1": 5,
          "2": 18,
          "3": 15,
          "4": 6,
          "5": 1
        },
        "totalTalents": 45,
        "avgLevel": 2.8,
        "experts": [
          {
            "talentId": "talent-uuid",
            "talentName": "山田太郎",
            "level": 4
          }
        ]
      }
    ],
    "summary": {
      "totalTalents": 120,
      "totalSkills": 35,
      "avgSkillsPerTalent": 8.5,
      "criticalGaps": [
        {
          "skillId": "skill-kubernetes-uuid",
          "skillName": "Kubernetes",
          "expertsNeeded": 3,
          "currentExperts": 0
        }
      ]
    }
  }
}
```

---

## チーム管理API {#team-management}

### チーム作成

```
POST /api/bc-005/teams
```

**リクエスト**:
```json
{
  "name": "Project Alpha Team",
  "projectId": "project-alpha-uuid",
  "organizationUnitId": "unit-uuid",
  "teamType": "DELIVERY",
  "description": "新製品開発プロジェクトチーム",
  "requiredSkills": [
    {
      "skillId": "skill-java-uuid",
      "minLevel": 3,
      "count": 2
    },
    {
      "skillId": "skill-aws-uuid",
      "minLevel": 2,
      "count": 1
    }
  ]
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "team-uuid",
    "name": "Project Alpha Team",
    "projectId": "project-alpha-uuid",
    "organizationUnitId": "unit-uuid",
    "teamType": "DELIVERY",
    "status": "FORMING",
    "memberCount": 0,
    "leaderCount": 0,
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### チーム詳細取得

```
GET /api/bc-005/teams/{teamId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "team-uuid",
    "name": "Project Alpha Team",
    "projectId": "project-alpha-uuid",
    "projectName": "Project Alpha",
    "organizationUnitId": "unit-uuid",
    "organizationUnitName": "技術本部",
    "teamType": "DELIVERY",
    "status": "ACTIVE",
    "description": "新製品開発プロジェクトチーム",
    "members": [
      {
        "id": "member-uuid",
        "resourceId": "resource-uuid",
        "userName": "山田太郎",
        "role": "TEAM_LEADER",
        "allocationPercentage": 1.0,
        "isLeader": true
      }
    ],
    "memberCount": 5,
    "leaderCount": 1,
    "skillProfile": {
      "skills": [
        {
          "skillId": "skill-java-uuid",
          "skillName": "Java",
          "memberCount": 4,
          "avgLevel": 3.5
        }
      ],
      "coverageScore": 0.92
    },
    "performanceScore": 4.1,
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### チーム一覧取得

```
GET /api/bc-005/teams?status=ACTIVE&projectId=project-alpha-uuid
```

**クエリパラメータ**:
- `status` (optional): FORMING | ACTIVE | SUSPENDED | DISBANDED
- `projectId` (optional): プロジェクトID
- `organizationUnitId` (optional): 組織単位ID
- `teamType` (optional): チームタイプ

**レスポンス**:
```json
{
  "data": [
    {
      "id": "team-uuid",
      "name": "Project Alpha Team",
      "projectId": "project-alpha-uuid",
      "projectName": "Project Alpha",
      "teamType": "DELIVERY",
      "status": "ACTIVE",
      "memberCount": 5,
      "performanceScore": 4.1
    }
  ]
}
```

---

### メンバー追加

```
POST /api/bc-005/teams/{teamId}/members
```

**リクエスト**:
```json
{
  "resourceId": "resource-uuid",
  "role": "DEVELOPER",
  "allocationPercentage": 0.80,
  "isLeader": false
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "member-uuid",
    "teamId": "team-uuid",
    "resourceId": "resource-uuid",
    "userName": "鈴木花子",
    "role": "DEVELOPER",
    "allocationPercentage": 0.80,
    "isLeader": false,
    "joinedAt": "2025-11-03T12:00:00Z"
  }
}
```

**エラー**:
- `BC005_ERR_301`: Team must have at least one leader
- `BC005_ERR_303`: Member already exists in team
- `BC005_ERR_304`: Invalid team member allocation

---

### メンバー削除

```
DELETE /api/bc-005/teams/{teamId}/members/{memberId}
```

**リクエスト**:
```json
{
  "reason": "プロジェクト要員変更"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "member-uuid",
    "status": "removed",
    "leftAt": "2025-11-03T13:00:00Z",
    "reason": "プロジェクト要員変更"
  }
}
```

**エラー**:
- `BC005_ERR_302`: Cannot remove last leader

---

### チームパフォーマンス取得

```
GET /api/bc-005/teams/{teamId}/performance
```

**レスポンス**:
```json
{
  "data": {
    "teamId": "team-uuid",
    "teamName": "Project Alpha Team",
    "performanceScore": 4.1,
    "metrics": {
      "productivity": 0.92,
      "quality": 0.88,
      "collaboration": 0.95,
      "skillMatch": 0.89
    },
    "memberPerformance": [
      {
        "resourceId": "resource-uuid",
        "userName": "山田太郎",
        "role": "TEAM_LEADER",
        "individualScore": 4.3,
        "contribution": 0.25
      }
    ],
    "trend": {
      "direction": "stable",
      "change": 0.05
    }
  }
}
```

---

### チーム最適化提案

```
POST /api/bc-005/teams/{teamId}/optimize
```

**リクエスト**:
```json
{
  "objectives": {
    "maximizeSkillMatch": 0.5,
    "balanceWorkload": 0.3,
    "minimizeCost": 0.2
  }
}
```

**レスポンス**:
```json
{
  "data": {
    "teamId": "team-uuid",
    "currentState": {
      "skillMatchScore": 0.82,
      "workloadBalance": 0.75,
      "avgCost": 14000
    },
    "proposedState": {
      "skillMatchScore": 0.92,
      "workloadBalance": 0.88,
      "avgCost": 13500
    },
    "recommendations": [
      {
        "action": "ADD_MEMBER",
        "resourceId": "resource-candidate-uuid",
        "resourceName": "佐藤三郎",
        "role": "DEVELOPER",
        "allocationPercentage": 0.50,
        "reason": "AWS スキルギャップを埋めるため",
        "impact": {
          "skillMatchIncrease": 0.10,
          "costChange": -500
        }
      }
    ]
  }
}
```

---

### 最適チーム編成

```
POST /api/bc-005/teams/form-optimal
```

**リクエスト**:
```json
{
  "projectId": "project-alpha-uuid",
  "requiredSkills": [
    {
      "skillId": "skill-java-uuid",
      "minLevel": 3,
      "count": 2
    }
  ],
  "teamSize": {
    "min": 4,
    "max": 6
  },
  "budget": {
    "maxCostRate": 100000,
    "currency": "JPY"
  },
  "constraints": {
    "minSkillMatchScore": 0.80,
    "maxAllocationPerResource": 0.80
  }
}
```

**レスポンス**:
```json
{
  "data": {
    "projectId": "project-alpha-uuid",
    "recommendedTeam": {
      "members": [
        {
          "resourceId": "resource-uuid-1",
          "resourceName": "山田太郎",
          "level": "SENIOR",
          "recommendedRole": "TEAM_LEADER",
          "allocationPercentage": 1.0,
          "skillMatchScore": 0.95,
          "costRate": 15000
        }
      ],
      "teamSize": 5,
      "totalCost": 68000,
      "skillMatchScore": 0.89,
      "estimatedPerformance": 4.2
    },
    "alternatives": [
      {
        "members": [...],
        "score": 0.85
      }
    ]
  }
}
```

---

## 関連ドキュメント

- [README.md](README.md) - API概要
- [resource-api.md](resource-api.md) - リソース管理API
- [timesheet-api.md](timesheet-api.md) - タイムシート管理API

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-005 API詳細化
