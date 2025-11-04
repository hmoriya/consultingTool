# L3-002: Team Formation & Composition

**作成日**: 2025-10-31
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: form-and-optimize-teams

---

## 📋 What: この能力の定義

### 能力の概要
効果的なチームを編成・最適化する能力。チーム編成、構成最適化、パフォーマンス監視を通じて、高パフォーマンスチームを実現します。

### 実現できること
- プロジェクトに最適なチーム編成
- チーム構成の継続的最適化
- チームパフォーマンスの監視
- チームダイナミクスの分析
- チーム間のシナジー創出

### 必要な知識
- チームビルディング理論
- チームダイナミクス
- パフォーマンス管理
- 多様性管理
- チーム最適化手法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: TeamAggregate ([../../domain/README.md](../../domain/README.md#team-aggregate))
- **Entities**: Team, TeamMember, TeamRole, TeamPerformance
- **Value Objects**: TeamComposition, TeamSize, PerformanceScore, TeamDynamics

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/teams - チーム作成
  - PUT /api/teams/{id}/optimize - 構成最適化
  - GET /api/teams/{id}/performance - パフォーマンス監視

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: teams, team_members, team_roles, team_performance_metrics

詳細: [../../data/README.md](../../data/README.md)

---

## 🛠️ 実装アプローチ

### 技術的実現方法

#### アルゴリズム・パターン
- **チーム最適化**: 遺伝的アルゴリズム（Genetic Algorithm）- スキルバランスの最適化
- **スキルマッチング**: コサイン類似度 - メンバースキルとプロジェクト要件のマッチング
- **チームシナジー分析**: グラフ理論 - メンバー間の協働性評価
- **デザインパターン**:
  - Builder Pattern（チーム構築の段階的構成）
  - Strategy Pattern（チーム編成戦略の切り替え）
  - Observer Pattern（チーム変更イベント通知）

#### 推奨ライブラリ・フレームワーク
- **最適化計算**: [Google OR-Tools](https://developers.google.com/optimization) - チーム編成最適化
- **スキル分析**: [TensorFlow.js](https://www.tensorflow.org/js) - スキルマッチングAI
- **ネットワーク分析**: [vis.js](https://visjs.org/) - チーム関係性の可視化
- **可視化**: [D3.js](https://d3js.org/) - チームスキルマトリックス、組織図

### パフォーマンス考慮事項

#### スケーラビリティ
- **チーム編成計算**: 100リソース × 10プロジェクト の最適配置を30秒以内
- **スキルマッチング**: 1,000スキル × 10,000メンバー の検索を5秒以内
- **パフォーマンス集計**: 100チーム の総合評価を10秒以内

#### キャッシュ戦略
- **チーム構成**: Redis cache（TTL: 30分、メンバー変更時に無効化）
- **スキルマトリックス**: Redis cache（TTL: 1時間、スキル更新時に無効化）
- **パフォーマンスメトリクス**: 日次バッチで事前計算、Redis保存

#### 最適化ポイント
- **バッチ最適化**: チーム編成候補を事前計算して保存
- **インデックス活用**: `team_members(team_id, user_id)`, `team_performance_metrics(team_id, period)`
- **非正規化**: チームスキルサマリーをteamsテーブルに保存

---

## ⚠️ 前提条件と制約

### BC間連携

#### 依存BC
- **BC-001: Project Delivery & Quality** - プロジェクト要件、必要スキル
  - 使用API: `GET /api/bc-001/projects/{projectId}` - プロジェクト詳細
  - 使用API: `GET /api/bc-001/projects/{projectId}/required-skills` - 必要スキルセット
- **BC-004: Organizational Structure & Governance** - 組織階層、配置制約
  - 使用API: `GET /api/bc-004/organizations/{orgId}/hierarchy` - 組織構造
- **BC-005-L3-001: Resource Planning & Allocation** - リソース可用性
  - 使用API: `GET /api/bc-005/resources/availability` - リソース可用性
- **BC-003: Access Control & Security** - チーム操作権限
  - 使用API: `POST /api/bc-003/authorize` - チーム編成権限チェック

#### 提供API（他BCから利用）
- **BC-001**: チーム編成情報を提供
  - `GET /api/bc-005/teams?projectId={projectId}` - プロジェクトチーム
  - `GET /api/bc-005/teams/{teamId}/members` - チームメンバー一覧
  - `GET /api/bc-005/teams/{teamId}/skills` - チームスキルプロファイル

### データ整合性要件

#### トランザクション境界
- **チーム作成**: Team + 初期TeamMember + TeamRole を1トランザクションで作成
- **チーム最適化**: メンバー変更 + パフォーマンス再計算を原子的に実行
- **整合性レベル**: 強整合性（ACID準拠）

#### データ制約
- チーム名の一意性（プロジェクト内で一意）
- 1チームあたり最小2名、最大20名
- チームリーダーは必須（1名以上）
- チームメンバーのロール重複禁止（同一メンバーは1ロールのみ）

### セキュリティ要件

#### 認証・認可
- **認証**: JWT Bearer Token（BC-003認証機能）
- **必要権限**:
  - チーム作成: `team:create`
  - チーム編成: `team:compose`
  - パフォーマンス閲覧: `team:performance:read`

#### データ保護
- **機密度**: チーム情報はInternal、パフォーマンスデータはConfidential
- **監査ログ**: 全てのチーム編成変更・パフォーマンス評価を記録
- **アクセス制御**: チームリーダー・PM・上位管理者のみ編集可能

### スケーラビリティ制約

#### 最大同時処理
- **チーム作成**: 50リクエスト/秒
- **チーム最適化**: 10リクエスト/秒（計算負荷大）
- **パフォーマンス取得**: 200リクエスト/秒（キャッシュ活用）

#### データ量上限
- **アクティブチーム数**: 5,000チーム
- **チームメンバー総数**: 100,000件（過去3年分）
- **パフォーマンスメトリクス**: 1,000万件（全履歴）

---

## 🔗 BC設計との統合

### 使用ドメインオブジェクト

#### Aggregates
- **Team Aggregate** ([../../domain/README.md#team-aggregate](../../domain/README.md#team-aggregate))
  - Team（集約ルート）: チームライフサイクル管理
  - TeamMember: チームメンバー
  - TeamRole: チーム内役割
  - TeamPerformance: パフォーマンス評価

#### Value Objects
- **TeamComposition**: チーム構成（スキル分布、経験レベル分布）
- **PerformanceScore**: パフォーマンススコア（0.0-1.0）
- **TeamDynamics**: チームダイナミクス（協働性、モチベーション指標）

### 呼び出すAPI例

#### チーム作成
```http
POST /api/v1/bc-005/teams
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "新製品開発チーム",
  "projectId": "project-uuid",
  "description": "新製品のフルスタック開発チーム",
  "members": [
    {
      "userId": "user-uuid-1",
      "role": "team_leader",
      "allocationPercentage": 1.0
    },
    {
      "userId": "user-uuid-2",
      "role": "member",
      "allocationPercentage": 0.8
    }
  ]
}

Response:
{
  "teamId": "team-uuid",
  "name": "新製品開発チーム",
  "projectId": "project-uuid",
  "memberCount": 2,
  "createdAt": "2025-11-03T10:00:00Z"
}
```

#### チーム最適化提案
```http
POST /api/v1/bc-005/teams/{teamId}/optimize
Content-Type: application/json

{
  "optimizationGoal": "skill_balance",
  "constraints": {
    "minMembers": 5,
    "maxMembers": 8,
    "requiredSkills": ["typescript", "react", "postgresql"]
  }
}

Response:
{
  "teamId": "team-uuid",
  "currentComposition": {
    "memberCount": 6,
    "skillCoverage": 0.7,
    "avgExperience": 4.2
  },
  "optimizedComposition": {
    "recommendedChanges": [
      {
        "action": "add",
        "userId": "user-uuid-3",
        "reason": "PostgreSQLスキル不足を補完",
        "expectedImprovement": "+15%"
      }
    ],
    "projectedSkillCoverage": 0.85,
    "projectedAvgExperience": 4.5
  }
}
```

#### チームパフォーマンス取得
```http
GET /api/v1/bc-005/teams/{teamId}/performance?startDate=2025-10-01&endDate=2025-10-31

Response:
{
  "teamId": "team-uuid",
  "period": {
    "startDate": "2025-10-01",
    "endDate": "2025-10-31"
  },
  "performanceMetrics": {
    "velocityScore": 0.85,
    "qualityScore": 0.92,
    "collaborationScore": 0.88,
    "overallScore": 0.88
  },
  "memberPerformances": [
    {
      "userId": "user-uuid-1",
      "role": "team_leader",
      "individualScore": 0.90,
      "contributions": {
        "tasksCompleted": 25,
        "codeReviewCount": 48
      }
    }
  ]
}
```

#### チームスキルプロファイル取得
```http
GET /api/v1/bc-005/teams/{teamId}/skills

Response:
{
  "teamId": "team-uuid",
  "skillProfile": {
    "technicalSkills": [
      {"skill": "TypeScript", "avgLevel": 4.2, "coverage": 1.0},
      {"skill": "React", "avgLevel": 4.0, "coverage": 0.8},
      {"skill": "PostgreSQL", "avgLevel": 3.5, "coverage": 0.6}
    ],
    "softSkills": [
      {"skill": "コミュニケーション", "avgLevel": 4.5},
      {"skill": "リーダーシップ", "avgLevel": 3.8}
    ],
    "skillGaps": [
      {
        "skill": "Kubernetes",
        "requiredLevel": 3,
        "currentLevel": 0,
        "priority": "high"
      }
    ]
  }
}
```

### データアクセスパターン

#### 読み取り
- **teams テーブル**:
  - インデックス: `idx_teams_project_id`（プロジェクト別チーム）
  - インデックス: `idx_teams_status`（アクティブチーム）
- **team_members テーブル**:
  - インデックス: `idx_team_members_team_id`（チーム別メンバー）
  - インデックス: `idx_team_members_user_id`（ユーザー別チーム配属）
- **team_performance_metrics テーブル**:
  - インデックス: `idx_performance_team_id_period`（チーム別期間検索）
  - パーティション: 年月別パーティション

#### 書き込み
- **チーム作成トランザクション**:
  ```sql
  BEGIN;
  INSERT INTO teams (...) VALUES (...);
  INSERT INTO team_members (...) VALUES (...), (...);
  INSERT INTO team_roles (...) VALUES (...);
  COMMIT;
  ```
- **チーム最適化トランザクション**:
  ```sql
  BEGIN;
  -- 既存メンバー削除
  DELETE FROM team_members WHERE team_id = ? AND user_id IN (...);
  -- 新規メンバー追加
  INSERT INTO team_members (...) VALUES (...);
  -- パフォーマンス予測更新
  UPDATE teams SET projected_performance = ? WHERE id = ?;
  -- キャッシュ無効化
  DELETE FROM cache WHERE key = 'team:' || team_id || ':*';
  COMMIT;
  ```

#### キャッシュアクセス
- **チーム構成キャッシュ**:
  ```
  Key: `team:{teamId}:composition`
  Value: JSON（メンバー + ロール + スキル）
  TTL: 1800秒（30分）
  ```
- **パフォーマンスキャッシュ**:
  ```
  Key: `team:{teamId}:performance:{year_month}`
  Value: パフォーマンスメトリクス
  TTL: 日次バッチで更新
  ```

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: チームを編成する | 新規チームの構築 | 2-3個 | form-teams |
| **OP-002**: チーム構成を最適化する | メンバー構成の改善 | 2-3個 | optimize-team-composition |
| **OP-003**: チームパフォーマンスを監視する | 継続的なパフォーマンス追跡 | 2-3個 | monitor-team-performance |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 6-9個
- **V2からの移行**: そのまま移行

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/talent-optimization-service/capabilities/form-and-optimize-teams/](../../../../services/talent-optimization-service/capabilities/form-and-optimize-teams/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-002 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
