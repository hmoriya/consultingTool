# L3-004: Capability & Skill Development

**作成日**: 2025-10-31
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: visualize-and-develop-skills, execute-skill-development

---

## 📋 What: この能力の定義

### 能力の概要
組織のスキルを可視化・育成する能力。スキルギャップ分析、スキルマトリックス作成、スキル開発プログラムの実施を通じて、組織能力を強化します。

### 実現できること
- スキルギャップの識別
- スキルマトリックスの作成と可視化
- スキル開発プログラムの計画と実施
- スキル習得状況の追跡
- 組織全体のスキルポートフォリオ管理

### 必要な知識
- スキルマネジメント手法
- ギャップ分析技法
- 人材開発プログラム設計
- 学習効果測定
- コンピテンシーモデル

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: SkillAggregate ([../../domain/README.md](../../domain/README.md#skill-aggregate))
- **Entities**: Skill, SkillCategory, SkillMatrix, SkillDevelopmentProgram
- **Value Objects**: SkillLevel, ProficiencyScore, SkillGap, LearningProgress

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - GET /api/skills/gaps - ギャップ分析
  - POST /api/skills/matrix - マトリックス作成
  - POST /api/skills/develop - スキル開発実施

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: skills, skill_categories, skill_matrices, user_skills, skill_development_programs

詳細: [../../data/README.md](../../data/README.md)

---

## 🛠️ 実装アプローチ

### 技術的実現方法

#### アルゴリズム・パターン
- **スキルギャップ分析**: ギャップスコア計算（Required Level - Current Level）
- **学習経路推薦**: グラフベース経路探索（A*アルゴリズム）
- **スキルマトリックス生成**: ヒートマップ生成アルゴリズム
- **学習効果測定**: 事前事後比較統計分析
- **デザインパターン**:
  - Strategy Pattern（スキル評価戦略の切り替え）
  - Composite Pattern（スキルカテゴリの階層構造）
  - Memento Pattern（スキル習得履歴の保存）

#### 推奨ライブラリ・フレームワーク
- **スキル分析**: [scikit-learn](https://scikit-learn.org/)（Python） - クラスタリング、推薦
- **可視化**: [D3.js](https://d3js.org/) - スキルマトリックス、スキルツリー
- **学習管理**: [Moodle API](https://moodle.org/) - 研修プログラム連携
- **グラフ分析**: [Neo4j](https://neo4j.com/) - スキル依存関係のグラフDB

### パフォーマンス考慮事項

#### スケーラビリティ
- **ギャップ分析**: 10,000メンバー × 1,000スキル の分析を60秒以内
- **マトリックス生成**: 100チーム × 500スキル のマトリックスを30秒以内
- **学習推薦**: 1,000学習パス × 100スキルパターン のマッチングを10秒以内

#### キャッシュ戦略
- **スキルマスタ**: アプリケーションメモリ（起動時ロード、日次更新）
- **ユーザースキル**: Redis cache（TTL: 1時間、スキル更新時に無効化）
- **スキルマトリックス**: Redis cache（TTL: 6時間、組織変更時に無効化）

#### 最適化ポイント
- **バッチ計算**: スキルギャップ分析を夜間バッチで事前計算
- **インデックス活用**: `user_skills(user_id, skill_id)`, `skill_development_programs(skill_id, status)`
- **マテリアライズドビュー**: 組織別スキル集計をマテリアライズドビューで高速化

---

## ⚠️ 前提条件と制約

### BC間連携

#### 依存BC
- **BC-006: Knowledge Management & Learning** - 学習コンテンツ、研修プログラム
  - 使用API: `GET /api/bc-006/learning/courses` - 研修コース一覧
  - 使用API: `POST /api/bc-006/learning/enroll` - 研修申込
  - 使用API: `GET /api/bc-006/learning/{userId}/progress` - 学習進捗
- **BC-005-L3-003: Talent Development & Performance** - パフォーマンス評価との連携
  - 使用API: `GET /api/bc-005/members/{memberId}/performance` - パフォーマンス実績
- **BC-001: Project Delivery & Quality** - プロジェクト必要スキル
  - 使用API: `GET /api/bc-001/projects/{projectId}/required-skills` - プロジェクト必要スキル
- **BC-003: Access Control & Security** - スキル情報アクセス権限
  - 使用API: `POST /api/bc-003/authorize` - スキル閲覧権限チェック

#### 提供API（他BCから利用）
- **BC-001, BC-005-L3-001**: スキル情報を提供
  - `GET /api/bc-005/skills/gaps?organizationId={orgId}` - 組織スキルギャップ
  - `GET /api/bc-005/skills/matrix?teamId={teamId}` - チームスキルマトリックス
  - `GET /api/bc-005/users/{userId}/skills` - ユーザースキルプロファイル

### データ整合性要件

#### トランザクション境界
- **スキル登録**: Skill + SkillCategory の紐付けを1トランザクションで実行
- **スキル開発プログラム実施**: SkillDevelopmentProgram + UserSkill 更新を原子的に実行
- **整合性レベル**: 強整合性（ACID準拠）

#### データ制約
- スキル名の一意性（カテゴリ内で一意）
- スキルレベルは1-5の範囲
- 習得日は評価日以降
- スキル開発プログラムの期間は開始日 ≤ 終了日

### セキュリティ要件

#### 認証・認可
- **認証**: JWT Bearer Token（BC-003認証機能）
- **必要権限**:
  - スキル定義: `skill:define`（スキル管理者のみ）
  - スキル評価: `skill:assess`（本人・上司・評価者）
  - スキルマトリックス閲覧: `skill:matrix:read`（マネージャー以上）

#### データ保護
- **機密度**: 個人スキルデータはConfidential
- **監査ログ**: スキル評価・スキルプログラム実施を記録
- **アクセス制御**:
  - 本人: 自分のスキルのみ閲覧・更新可能
  - 上司: 直属部下のスキルを閲覧可能
  - スキル管理者: 全スキルデータを管理可能

### スケーラビリティ制約

#### 最大同時処理
- **スキルギャップ分析**: 20リクエスト/秒
- **スキルマトリックス生成**: 10リクエスト/秒（計算負荷大）
- **ユーザースキル取得**: 500リクエスト/秒（キャッシュ活用）

#### データ量上限
- **スキルマスタ**: 5,000スキル
- **ユーザースキルレコード**: 5,000万件（10,000ユーザー × 5,000スキル）
- **スキル開発プログラム**: 10,000プログラム/年

---

## 🔗 BC設計との統合

### 使用ドメインオブジェクト

#### Aggregates
- **Skill Aggregate** ([../../domain/README.md#skill-aggregate](../../domain/README.md#skill-aggregate))
  - Skill（集約ルート）: スキル定義
  - SkillCategory: スキルカテゴリ
  - UserSkill: ユーザースキル習得状況
  - SkillDevelopmentProgram: スキル開発プログラム

#### Value Objects
- **SkillLevel**: スキルレベル（1-5: Beginner/Intermediate/Advanced/Expert/Master）
- **ProficiencyScore**: 習熟度スコア（0.0-1.0）
- **SkillGap**: スキルギャップ（必要レベル - 現在レベル）
- **LearningProgress**: 学習進捗（0-100%）

### 呼び出すAPI例

#### スキルギャップ分析
```http
GET /api/v1/bc-005/skills/gaps?userId=user-uuid&projectId=project-uuid

Response:
{
  "userId": "user-uuid",
  "projectId": "project-uuid",
  "analysisDate": "2025-11-03",
  "gaps": [
    {
      "skillId": "skill-uuid-1",
      "skillName": "Kubernetes",
      "category": "Infrastructure",
      "requiredLevel": 4,
      "currentLevel": 2,
      "gapScore": 2,
      "priority": "high",
      "recommendedActions": [
        {
          "type": "training",
          "programId": "program-uuid-1",
          "programName": "Kubernetes実践トレーニング",
          "duration": "3日間"
        },
        {
          "type": "on_the_job",
          "description": "Kubernetesプロジェクトへのアサイン",
          "estimatedDuration": "3ヶ月"
        }
      ]
    }
  ],
  "overallGapScore": 1.5,
  "coveragePercentage": 0.65
}
```

#### スキルマトリックス作成
```http
POST /api/v1/bc-005/skills/matrix
Content-Type: application/json
Authorization: Bearer {token}

{
  "scope": "team",
  "targetId": "team-uuid",
  "skillCategories": ["technical", "soft_skills"],
  "displayFormat": "heatmap"
}

Response:
{
  "matrixId": "matrix-uuid",
  "scope": "team",
  "targetId": "team-uuid",
  "generatedAt": "2025-11-03T10:00:00Z",
  "matrix": {
    "members": [
      {
        "userId": "user-uuid-1",
        "name": "山田太郎",
        "skills": [
          {"skillId": "skill-1", "skillName": "TypeScript", "level": 5},
          {"skillId": "skill-2", "skillName": "React", "level": 4},
          {"skillId": "skill-3", "skillName": "PostgreSQL", "level": 3}
        ]
      }
    ],
    "aggregates": {
      "avgSkillLevel": 3.8,
      "skillCoverage": 0.75,
      "criticalGaps": [
        {"skill": "Kubernetes", "coverage": 0.2}
      ]
    }
  }
}
```

#### スキル開発プログラム実施
```http
POST /api/v1/bc-005/skills/develop
Content-Type: application/json

{
  "programType": "training",
  "targetSkillId": "skill-uuid",
  "participants": ["user-uuid-1", "user-uuid-2"],
  "programName": "AWS認定ソリューションアーキテクト対策講座",
  "startDate": "2025-12-01",
  "endDate": "2025-12-15",
  "targetLevel": 4,
  "deliveryMethod": "online",
  "trainer": "external-trainer-uuid"
}

Response:
{
  "programId": "program-uuid",
  "programName": "AWS認定ソリューションアーキテクト対策講座",
  "participantCount": 2,
  "status": "scheduled",
  "startDate": "2025-12-01",
  "endDate": "2025-12-15",
  "createdAt": "2025-11-03T10:00:00Z"
}
```

#### ユーザースキルプロファイル取得
```http
GET /api/v1/bc-005/users/{userId}/skills?includeHistory=true

Response:
{
  "userId": "user-uuid",
  "profileGeneratedAt": "2025-11-03T10:00:00Z",
  "skills": {
    "technical": [
      {
        "skillId": "skill-uuid-1",
        "skillName": "TypeScript",
        "category": "Programming",
        "currentLevel": 5,
        "assessedDate": "2025-10-15",
        "certifications": ["TypeScript Advanced Certification"],
        "levelHistory": [
          {"level": 3, "assessedDate": "2024-01-15"},
          {"level": 4, "assessedDate": "2024-06-15"},
          {"level": 5, "assessedDate": "2025-10-15"}
        ]
      }
    ],
    "softSkills": [
      {
        "skillId": "skill-uuid-10",
        "skillName": "リーダーシップ",
        "category": "Management",
        "currentLevel": 4,
        "assessedDate": "2025-09-30"
      }
    ]
  },
  "summary": {
    "totalSkills": 25,
    "avgTechnicalLevel": 4.2,
    "avgSoftSkillLevel": 3.8,
    "certificationCount": 5
  }
}
```

#### スキル開発進捗記録
```http
PUT /api/v1/bc-005/skills/programs/{programId}/progress
Content-Type: application/json

{
  "userId": "user-uuid",
  "progressPercentage": 75,
  "completedModules": ["module-1", "module-2", "module-3"],
  "assessmentScores": {
    "quiz1": 85,
    "quiz2": 90,
    "finalExam": 88
  },
  "notes": "順調に進んでいます"
}

Response:
{
  "programId": "program-uuid",
  "userId": "user-uuid",
  "progressPercentage": 75,
  "estimatedCompletionDate": "2025-12-12",
  "currentSkillLevel": 3.5,
  "targetSkillLevel": 4,
  "updatedAt": "2025-11-03T10:00:00Z"
}
```

### データアクセスパターン

#### 読み取り
- **skills テーブル**:
  - インデックス: `idx_skills_category_id`（カテゴリ別スキル）
  - インデックス: `idx_skills_name`（スキル名検索）
- **user_skills テーブル**:
  - インデックス: `idx_user_skills_user_id`（ユーザー別スキル）
  - インデックス: `idx_user_skills_skill_id`（スキル別ユーザー）
  - インデックス: `idx_user_skills_user_id_level`（レベル別フィルタ）
- **skill_development_programs テーブル**:
  - インデックス: `idx_programs_skill_id_status`（スキル別アクティブプログラム）
  - インデックス: `idx_programs_start_date`（開始日順）

#### 書き込み
- **スキルギャップ分析トランザクション**:
  ```sql
  BEGIN;
  -- プロジェクト必要スキル取得
  SELECT skill_id, required_level FROM project_required_skills WHERE project_id = ?;
  -- ユーザー現在スキル取得
  SELECT skill_id, current_level FROM user_skills WHERE user_id = ?;
  -- ギャップ計算結果保存
  INSERT INTO skill_gap_analyses (...) VALUES (...);
  COMMIT;
  ```
- **スキル開発プログラム実施トランザクション**:
  ```sql
  BEGIN;
  INSERT INTO skill_development_programs (...) VALUES (...);
  INSERT INTO program_participants (program_id, user_id) VALUES (?, ?), (?, ?);
  -- 通知送信
  INSERT INTO notifications (user_id, type, content) VALUES (?, 'skill_program_enrolled', 'スキル開発プログラムに登録されました');
  COMMIT;
  ```

#### キャッシュアクセス
- **スキルマスタキャッシュ**:
  ```
  Key: `skills:all`
  Value: JSON配列（全スキル定義）
  TTL: 永続（日次バッチで更新）
  ```
- **ユーザースキルキャッシュ**:
  ```
  Key: `user:{userId}:skills`
  Value: JSON（スキルプロファイル）
  TTL: 3600秒（1時間）
  ```
- **スキルマトリックスキャッシュ**:
  ```
  Key: `team:{teamId}:skill-matrix`
  Value: JSON（マトリックスデータ）
  TTL: 21600秒（6時間）
  ```

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: スキルギャップを分析する | 必要スキルと現状の差分 | 2-3個 | analyze-skill-gaps |
| **OP-002**: スキルマトリックスを作成する | 組織スキルの可視化 | 2個 | create-skill-matrix |
| **OP-003**: スキル開発を実施する | 研修・OJTの実施 | 2-3個 | execute-skill-development (統合) |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 6-8個
- **V2からの移行**: execute-skill-development を統合（重複解消）

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/talent-optimization-service/capabilities/visualize-and-develop-skills/](../../../../services/talent-optimization-service/capabilities/visualize-and-develop-skills/)
> - [services/talent-optimization-service/capabilities/execute-skill-development/](../../../../services/talent-optimization-service/capabilities/execute-skill-development/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-004 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
