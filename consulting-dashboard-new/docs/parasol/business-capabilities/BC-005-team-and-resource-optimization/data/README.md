# BC-005: データ層設計

**BC**: Team & Resource Optimization [チームとリソースの最適化] [BC_005]
**作成日**: 2025-10-31
**最終更新**: 2025-11-03
**V2移行元**: services/talent-optimization-service/database-design.md + services/productivity-visualization-service/database-design.md

---

## 目次

1. [概要](#overview)
2. [アーキテクチャ](#architecture)
3. [テーブル一覧](#table-list)
4. [ER図](#er-diagram)
5. [データフロー](#data-flows)
6. [BC間連携](#bc-integration)
7. [詳細ドキュメント](#detailed-docs)

---

## 概要 {#overview}

BC-005のデータ層は、リソース管理、タレント育成、チーム最適化、タイムシート管理の永続化を担当します。

### 主要機能

- **リソース管理**: リソース登録、プロジェクト配分（最大200%）、稼働率追跡
- **タレント管理**: パフォーマンス評価、キャリア開発計画、スキル習得履歴
- **チーム管理**: チーム編成、メンバー管理、パフォーマンス追跡
- **タイムシート管理**: 工数記録、承認ワークフロー、稼働率分析
- **スキル管理**: スキル定義、レベル管理、前提条件、スキルギャップ分析

### 技術スタック

- **DBMS**: PostgreSQL 14+
- **主要機能**:
  - トリガーによる配分率制約保証（最大200%）
  - CHECK制約によるデータ整合性保証
  - パーティショニングによる大規模タイムシートデータ管理
  - マテリアライズドビューによる稼働率・パフォーマンス集計
  - JSON型によるフレキシブルなメタデータ管理

---

## 🔄 Parasol型マッピング定義

このBCで使用するParasol Domain Language型とPostgreSQL型の対応表。

### 基本型マッピング

| Parasol型 | PostgreSQL型 | 制約例 | 説明 |
|-----------|-------------|--------|------|
| UUID | UUID | PRIMARY KEY, NOT NULL | UUID v4形式の一意識別子 |
| STRING_20 | VARCHAR(20) | NOT NULL, CHECK(length(...) <= 20) | 最大20文字の文字列 |
| STRING_50 | VARCHAR(50) | NOT NULL, CHECK(length(...) <= 50) | 最大50文字の文字列 |
| STRING_100 | VARCHAR(100) | NOT NULL, CHECK(length(...) <= 100) | 最大100文字の文字列 |
| STRING_200 | VARCHAR(200) | NOT NULL, CHECK(length(...) <= 200) | 最大200文字の文字列 |
| STRING_255 | VARCHAR(255) | NOT NULL, CHECK(length(...) <= 255) | 最大255文字の文字列 |
| TEXT | TEXT | - | 長文（制限なし） |
| INTEGER | INTEGER | CHECK(value > 0) | 整数 |
| DECIMAL | NUMERIC | CHECK(value >= 0) | 小数（金額、工数等） |
| PERCENTAGE | NUMERIC(5,2) | CHECK(value BETWEEN 0 AND 100) | パーセンテージ（0-100） |
| BOOLEAN | BOOLEAN | NOT NULL DEFAULT false | 真偽値 |
| DATE | DATE | NOT NULL | YYYY-MM-DD形式の日付 |
| TIMESTAMP | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ISO8601形式のタイムスタンプ |
| EMAIL | VARCHAR(255) | CHECK(email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z\|a-z]{2,}$') | RFC5322準拠メールアドレス |
| URL | TEXT | CHECK(url ~* '^https?://') | RFC3986準拠URL |
| MONEY | JSONB or (NUMERIC + VARCHAR(3)) | CHECK(amount >= 0), CHECK(currency ~ '^[A-Z]{3}$') | 金額（通貨付き） |
| JSON | JSONB | - | JSON形式データ |
| BINARY | BYTEA | - | バイナリデータ |

### 実装ガイドライン

1. **NOT NULL制約**: Parasol型の必須フィールドは`NOT NULL`制約を付与
2. **CHECK制約**: 長さ制約、範囲制約を`CHECK`で実装
3. **インデックス**: 検索頻度の高いカラムには適切なインデックスを作成
4. **デフォルト値**: `TIMESTAMP`は`DEFAULT CURRENT_TIMESTAMP`を推奨
5. **列挙型**: Parasol型の`STRING_XX` (enum値) は`VARCHAR + CHECK`または`ENUM`型で実装

### BC固有の型定義

**リソース配分型**:
- `ALLOCATION_PERCENTAGE`: プロジェクト配分率 → `NUMERIC(3,2) CHECK (allocation_percentage BETWEEN 0.0 AND 2.0)` (最大200%)
- `UTILIZATION_RATE`: 稼働率 → `NUMERIC(5,2) CHECK (utilization_rate BETWEEN 0 AND 100)`

**工数型**:
- `HOURS`: 工数（時間） → `NUMERIC(8,2) CHECK (hours >= 0 AND hours <= 24)` (1日最大24時間)
- `WORK_DATE`: 作業日 → `DATE NOT NULL`

**スキル型**:
- `SKILL_LEVEL`: スキルレベル → `INTEGER CHECK (level BETWEEN 1 AND 5)`
- `SKILL_CATEGORY`: スキルカテゴリ → `VARCHAR(100)`

**パフォーマンス評価型**:
- `RATING`: 評価点 → `NUMERIC(3,2) CHECK (rating BETWEEN 0 AND 5)`
- `PERFORMANCE_PERIOD`: 評価期間 → `(period_start DATE, period_end DATE) CHECK (period_end >= period_start)`

---

## アーキテクチャ {#architecture}

### データグループ

BC-005のテーブルは以下の5グループに分類されます:

```
BC-005 Data Layer
├── リソース管理グループ（3テーブル）
│   ├── resources（リソースマスタ）
│   ├── resource_allocations（プロジェクト配分）
│   └── resource_utilization_history（稼働率履歴）
│
├── タレント管理グループ（4テーブル）
│   ├── talents（タレントプロファイル）
│   ├── performance_records（パフォーマンス評価）
│   ├── career_plans（キャリア開発計画）
│   └── talent_skills（タレントスキル）
│
├── スキル管理グループ（3テーブル）
│   ├── skills（スキルマスタ）
│   ├── skill_categories（スキルカテゴリ）
│   └── skill_prerequisites（スキル前提条件）
│
├── チーム管理グループ（3テーブル）
│   ├── teams（チームマスタ）
│   ├── team_members（チームメンバー）
│   └── team_performance_history（チームパフォーマンス履歴）
│
├── タイムシート管理グループ（3テーブル）
│   ├── timesheets（タイムシートマスタ）
│   ├── timesheet_entries（タイムシート明細）
│   └── timesheet_approvals（承認履歴）
│
└── 統計ビュー（4マテリアライズドビュー）
    ├── mv_resource_utilization_summary（リソース稼働率集計）
    ├── mv_talent_performance_summary（タレントパフォーマンス集計）
    ├── mv_team_statistics（チーム統計）
    └── mv_skill_distribution（スキル分布）
```

### BC間連携

BC-005は複数のBCと連携します:

```
BC-001.projects ←→ BC-005.resource_allocations（リソース配分）
BC-001.projects ←→ BC-005.timesheet_entries（工数記録）
BC-003.users ←→ BC-005.resources（リソース基本情報）
BC-003.users ←→ BC-005.talents（タレント情報）
BC-004.teams ←→ BC-005.teams（チーム情報連携）
BC-005 → BC-002.resource_costs（コスト情報送信）
BC-005 → BC-006.training_recommendations（スキルギャップ連携）
BC-005 → BC-007.notifications（評価完了・承認依頼通知）
```

---

## テーブル一覧 {#table-list}

### コアテーブル（16テーブル）

| # | テーブル名 | 推定行数 | 説明 | パーティション |
|---|-----------|---------|------|--------------|
| 1 | **resources** | ~10,000 | リソースマスタ | なし |
| 2 | **resource_allocations** | ~50,000 | プロジェクト配分履歴 | なし |
| 3 | **resource_utilization_history** | ~120,000+ | 稼働率履歴（月次） | 年次 |
| 4 | **talents** | ~10,000 | タレントプロファイル | なし |
| 5 | **performance_records** | ~40,000 | パフォーマンス評価記録 | なし |
| 6 | **career_plans** | ~20,000 | キャリア開発計画 | なし |
| 7 | **talent_skills** | ~100,000 | タレントスキル習得記録 | なし |
| 8 | **skills** | ~500 | スキルマスタ | なし |
| 9 | **skill_categories** | ~50 | スキルカテゴリ | なし |
| 10 | **skill_prerequisites** | ~1,000 | スキル前提条件 | なし |
| 11 | **teams** | ~500 | チームマスタ | なし |
| 12 | **team_members** | ~5,000 | チームメンバー | なし |
| 13 | **team_performance_history** | ~6,000+ | チームパフォーマンス履歴 | なし |
| 14 | **timesheets** | ~120,000+ | タイムシートマスタ | 年次 |
| 15 | **timesheet_entries** | ~2,400,000+ | タイムシート明細 | 年次 |
| 16 | **timesheet_approvals** | ~120,000+ | タイムシート承認履歴 | 年次 |

### マテリアライズドビュー（4ビュー）

| # | ビュー名 | リフレッシュ | 説明 |
|---|---------|------------|------|
| 1 | **mv_resource_utilization_summary** | 1時間毎 | リソース別稼働率集計 |
| 2 | **mv_talent_performance_summary** | 1日1回 | タレント別パフォーマンス集計 |
| 3 | **mv_team_statistics** | 1時間毎 | チーム統計情報 |
| 4 | **mv_skill_distribution** | 1日1回 | スキル分布・保有状況 |

**詳細**: [tables.md](tables.md)

---

## ER図 {#er-diagram}

### リソース管理グループ

```
┌──────────────────────┐
│     resources        │
│  ──────────────────  │
│  id (PK)             │◄─┐
│  user_id (FK)────────┼──┼──► BC-003.users
│  resource_type       │  │
│  employment_type     │  │
│  department          │  │
│  cost_per_hour       │  │
│  status              │  │
│  available_from      │  │
│  available_to        │  │
│  current_utilization │  │
│  metadata (JSON)     │  │
│  created_at          │  │
│  updated_at          │  │
└──────────────────────┘  │
         │                │
         │                │
    ┌────┼────────────────┘
    ▼    ▼
┌──────────────────────┐  ┌─────────────────────────┐
│resource_allocations  │  │resource_utilization_    │
│──────────────────────│  │history                  │
│id (PK)               │  │─────────────────────────│
│resource_id (FK)──────┤  │id (PK)                  │
│project_id (FK)───────┼──┼►resource_id (FK)        │
│allocation_percentage │  │ period_year_month       │
│start_date            │  │ total_hours_worked      │
│end_date              │  │ billable_hours          │
│role                  │  │ utilization_rate        │
│status                │  │ billable_rate           │
│actual_hours          │  │ recorded_at             │
│created_at            │  └─────────────────────────┘
│updated_at            │          (年次パーティション)
└──────────────────────┘
```

### タレント管理グループ

```
┌──────────────────────┐
│      talents         │
│  ──────────────────  │
│  id (PK)             │◄─┐
│  resource_id (FK)────┼──┼──► resources
│  career_level        │  │
│  career_track        │  │
│  hire_date           │  │
│  manager_id (FK)─────┼──┼──► BC-003.users
│  potential_rating    │  │
│  risk_of_attrition   │  │
│  last_promotion_date │  │
│  created_at          │  │
│  updated_at          │  │
└──────────────────────┘  │
         │                │
         │                │
    ┌────┼────┬───────────┤
    ▼    ▼    ▼           │
┌────────────┐ ┌──────────────┐ ┌────────────────┐
│performance_│ │career_plans  │ │talent_skills   │
│records     │ │──────────────│ │────────────────│
│────────────│ │id (PK)       │ │id (PK)         │
│id (PK)     │ │talent_id (FK)├─┘resource_id (FK)│
│talent_id(FK)├─┤fiscal_year   │  skill_id (FK)──┼─► skills
│period_start│ │goals (JSON)  │  level (1-5)    │
│period_end  │ │achievements  │  acquired_date  │
│rating      │ │status        │  verified_by    │
│feedback    │ │created_at    │  verified_at    │
│reviewer_id │ │updated_at    │  evidence       │
│status      │ └──────────────┘  updated_at     │
│approved_at │                 └────────────────┘
└────────────┘
```

### スキル管理グループ

```
┌──────────────────────┐
│  skill_categories    │
│  ──────────────────  │
│  id (PK)             │◄─┐
│  name                │  │
│  description         │  │
│  display_order       │  │
│  created_at          │  │
└──────────────────────┘  │
                          │
        ┌─────────────────┘
        │
        ▼
┌──────────────────────┐         ┌─────────────────────┐
│      skills          │         │skill_prerequisites  │
│  ──────────────────  │         │─────────────────────│
│  id (PK)             │◄────────┤id (PK)              │
│  category_id (FK)────┤         │skill_id (FK)        │
│  name (UQ)           │         │prerequisite_id (FK) │──┐
│  description         │         │required_level       │  │
│  level_definitions   │◄────────┤created_at           │  │
│  (JSON)              │         └─────────────────────┘  │
│  certification_info  │                                  │
│  status              │                                  │
│  created_at          │◄─────────────────────────────────┘
│  updated_at          │                      自己参照
└──────────────────────┘
```

### チーム管理グループ

```
┌──────────────────────┐
│       teams          │
│  ──────────────────  │
│  id (PK)             │◄─┐
│  name                │  │
│  project_id (FK)─────┼──┼──► BC-001.projects
│  team_type           │  │
│  purpose             │  │
│  skill_requirements  │  │
│  (JSON)              │  │
│  status              │  │
│  start_date          │  │
│  end_date            │  │
│  member_count        │  │
│  created_at          │  │
│  updated_at          │  │
└──────────────────────┘  │
         │                │
         │                │
    ┌────┼────────────────┘
    ▼    ▼
┌──────────────────────┐  ┌─────────────────────────┐
│   team_members       │  │team_performance_history │
│  ──────────────────  │  │─────────────────────────│
│  id (PK)             │  │id (PK)                  │
│  team_id (FK)────────┤  │team_id (FK)─────────────┤
│  resource_id (FK)────┼──┼►recorded_period         │
│  role                │  │ velocity                │
│  allocation_rate     │  │ quality_score           │
│  is_leader           │  │ collaboration_score     │
│  status              │  │ recorded_by             │
│  joined_at           │  │ recorded_at             │
│  left_at             │  └─────────────────────────┘
│  created_at          │
└──────────────────────┘
```

### タイムシート管理グループ

```
┌──────────────────────┐
│    timesheets        │
│  ──────────────────  │
│  id (PK)             │◄─┐
│  resource_id (FK)────┼──┼──► resources
│  period_start (DATE) │  │
│  period_end (DATE)   │  │
│  total_hours         │  │
│  billable_hours      │  │
│  status              │  │
│  submitted_at        │  │
│  created_at          │  │
│  updated_at          │  │
└──────────────────────┘  │
  (年次パーティション)     │
         │                │
    ┌────┼────────────────┘
    ▼    ▼
┌──────────────────────┐  ┌─────────────────────────┐
│ timesheet_entries    │  │timesheet_approvals      │
│  ──────────────────  │  │─────────────────────────│
│  id (PK)             │  │id (PK)                  │
│  timesheet_id (FK)───┤  │timesheet_id (FK)────────┤
│  project_id (FK)─────┼──┼►approver_id (FK)────────┼──► BC-003.users
│  task_type           │  │ approval_status         │
│  work_date (DATE)    │  │ comments                │
│  hours (DECIMAL)     │  │ approved_at             │
│  description         │  │ created_at              │
│  is_billable         │  └─────────────────────────┘
│  created_at          │    (年次パーティション)
│  updated_at          │
└──────────────────────┘
  (年次パーティション)
```

---

## データフロー {#data-flows}

### 1. リソース配分フロー

```
POST /api/bc-005/resources/{resourceId}/allocate
↓
1. リソース存在確認（resources）
   - status = 'available' または 'allocated'
↓
2. 配分率制約チェック
   SELECT SUM(allocation_percentage)
   FROM resource_allocations
   WHERE resource_id = $1
     AND status = 'active'
     AND (start_date, end_date) OVERLAPS ($2, $3)
   ↓
   合計配分率 ≤ 2.0（200%）を確認
   トリガー: check_allocation_limit()
↓
3. プロジェクト存在確認（BC-001.projects）
↓
4. resource_allocations テーブルにINSERT
   - allocation_percentage
   - start_date, end_date
   - role, status='active'
↓
5. resources.current_utilization を更新（トリガー）
   UPDATE resources
   SET current_utilization = (
     SELECT SUM(allocation_percentage)
     FROM resource_allocations
     WHERE resource_id = $1 AND status = 'active'
   )
↓
6. BC-001 へリソース割当通知
   POST /api/bc-001/projects/{projectId}/resources
↓
7. BC-007 へイベント送信（ResourceAllocated）
```

### 2. パフォーマンス評価フロー

```
POST /api/bc-005/talents/{talentId}/performance
↓
1. タレント存在確認（talents）
↓
2. 重複評価チェック
   SELECT COUNT(*)
   FROM performance_records
   WHERE talent_id = $1
     AND period_start = $2
     AND status != 'cancelled'
   -- 同一期間の評価が存在しないことを確認
↓
3. 評価者権限チェック（BC-003）
   - reviewer_id が manager_id またはHR_MANAGER権限
↓
4. performance_records テーブルにINSERT
   - period_start, period_end
   - rating: overall_score, dimensions (JSON)
   - feedback, reviewer_id
   - status = 'draft'
↓
5. talents.potential_rating を更新（承認後）
   - 過去3回の評価平均を計算
↓
6. BC-007 へイベント送信（PerformanceRecordCreated）
```

### 3. スキルレベルアップフロー

```
PUT /api/bc-005/talents/{talentId}/skills/{talentSkillId}/level-up
↓
1. 現在のスキルレベル取得（talent_skills）
↓
2. レベルアップ制約チェック
   a. レベルは1段階ずつのみ（1→2, 2→3, ...）
   b. 最大レベル5を超えない
   c. CHECK制約: level BETWEEN 1 AND 5
↓
3. 前提条件チェック（skill_prerequisites）
   SELECT prerequisite_id, required_level
   FROM skill_prerequisites
   WHERE skill_id = $skillId
   ↓
   FOR EACH prerequisite:
     現在のtalent_skillsでrequired_levelを満たすか確認
     満たさない場合はエラー
↓
4. talent_skills テーブルを更新
   UPDATE talent_skills
   SET level = level + 1,
       verified_by = $verifierId,
       verified_at = NOW(),
       evidence = $evidence
   WHERE id = $talentSkillId
↓
5. BC-006 へスキル習得通知
   POST /api/bc-006/learning/skill-acquired
↓
6. BC-007 へイベント送信（SkillLevelUp）
```

### 4. チーム編成最適化フロー

```
POST /api/bc-005/teams/form-optimal
↓
1. プロジェクト要件取得（BC-001）
   - 必要スキルセット
   - チーム規模
   - 開始・終了日
↓
2. 利用可能リソース検索
   SELECT r.*
   FROM resources r
   LEFT JOIN resource_allocations ra
     ON r.id = ra.resource_id
     AND ra.status = 'active'
     AND (ra.start_date, ra.end_date) OVERLAPS ($startDate, $endDate)
   WHERE r.status = 'available'
     OR (r.status = 'allocated'
         AND COALESCE(SUM(ra.allocation_percentage), 0) < 2.0)
   GROUP BY r.id
↓
3. スキルマッチングスコア計算
   FOR EACH required_skill IN project_requirements:
     FOR EACH resource:
       score += talent_skills.level WHERE skill_id = required_skill.id
↓
4. チーム編成最適化アルゴリズム実行
   - スキルバランス最適化
   - 配分率制約考慮
   - コスト最適化
↓
5. 最適チーム候補を返却
   {
     "recommendedTeam": {
       "members": [...],
       "skillCoverage": 0.95,
       "totalCost": 15000000,
       "averageUtilization": 0.78
     }
   }
```

### 5. タイムシート承認フロー

```
POST /api/bc-005/timesheets/{timesheetId}/submit
↓
1. タイムシート存在確認（timesheets）
   - status = 'draft'
↓
2. 日次工数制約チェック（トリガー）
   SELECT work_date, SUM(hours)
   FROM timesheet_entries
   WHERE timesheet_id = $1
   GROUP BY work_date
   HAVING SUM(hours) > 24.0
   ↓
   1日の合計工数が24時間を超えないことを確認
↓
3. タイムシート提出
   UPDATE timesheets
   SET status = 'submitted',
       submitted_at = NOW()
   WHERE id = $1
↓
4. 承認者へ通知（BC-007）
   - manager_idへ承認依頼送信
↓
【承認時】
POST /api/bc-005/timesheets/{timesheetId}/approve
↓
5. 承認者権限チェック（BC-003）
   - approver_id が resource.manager_id または MANAGER権限
↓
6. timesheet_approvals テーブルにINSERT
   - approval_status = 'approved'
   - approver_id, approved_at
↓
7. timesheets テーブルを更新
   UPDATE timesheets
   SET status = 'approved'
   WHERE id = $1
↓
8. resource_utilization_history に集計データINSERT
   INSERT INTO resource_utilization_history
   SELECT
     resource_id,
     TO_CHAR(period_start, 'YYYY-MM'),
     SUM(hours),
     SUM(hours) FILTER (WHERE is_billable = true),
     ...
   FROM timesheet_entries
   WHERE timesheet_id = $1
↓
9. BC-002 へコスト情報送信
   POST /api/bc-002/resource-costs
   - リソースコスト = SUM(hours) * cost_per_hour
↓
10. BC-007 へイベント送信（TimesheetApproved）
```

### 6. 稼働率分析フロー

```
GET /api/bc-005/timesheets/analyze-utilization
  ?startDate=2025-11-01&endDate=2025-11-30
↓
1. mv_resource_utilization_summary から集計データ取得
   SELECT
     resource_id,
     period_year_month,
     total_hours_worked,
     billable_hours,
     utilization_rate,
     billable_rate
   FROM mv_resource_utilization_summary
   WHERE period_year_month BETWEEN $1 AND $2
↓
2. 追加集計計算
   - 平均稼働率
   - 部門別稼働率
   - プロジェクト別工数配分
↓
3. レスポンス返却
   {
     "summary": {
       "totalHours": 24000.0,
       "billableHours": 20400.0,
       "avgUtilizationRate": 0.78
     },
     "byResource": [...],
     "byDepartment": [...]
   }
```

---

## BC間連携 {#bc-integration}

### BC-001（Project Delivery）

**依存関係**: BC-005 ←→ BC-001

| BC-001テーブル | BC-005での利用 | 説明 |
|---------------|--------------|------|
| `projects` | `resource_allocations.project_id` | リソース配分先 |
| `projects` | `timesheet_entries.project_id` | 工数記録先 |

**データフロー**:
```
BC-005 → BC-001.projects/resources（リソース配分通知）
BC-001.projects ← BC-005.resources（リソース要件取得）
```

### BC-002（Financial Health）

**依存関係**: BC-005 → BC-002

**データフロー**:
```
BC-005.resource_utilization_history → BC-002.resource_costs（コスト情報）
BC-005.timesheets → BC-002.actual_costs（実績コスト）
```

### BC-003（Access Control & Security）

**依存関係**: BC-005 → BC-003

| BC-003テーブル | BC-005での利用 | 説明 |
|---------------|--------------|------|
| `users` | `resources.user_id` | リソース基本情報 |
| `users` | `talents.manager_id` | マネージャー |
| `users` | `timesheet_approvals.approver_id` | 承認者 |
| `audit_logs` | 全操作 | 監査ログ記録 |

### BC-004（Organizational Structure）

**依存関係**: BC-005 ←→ BC-004

**データフロー**:
```
BC-004.teams ←→ BC-005.teams（チーム情報連携）
BC-004.organization_units → BC-005.resources（部門情報）
```

### BC-006（Knowledge Management）

**依存関係**: BC-005 ←→ BC-006

**データフロー**:
```
BC-005.talent_skills（スキルギャップ） → BC-006.training_recommendations
BC-006.learning_records → BC-005.talent_skills（学習完了によるスキル習得）
```

### BC-007（Communication & Collaboration）

**依存関係**: BC-005 → BC-007

**イベント送信**:
- `ResourceAllocated`: リソース配分時
- `PerformanceRecordCreated`: パフォーマンス評価作成時
- `PerformanceRecordApproved`: 評価承認時
- `SkillLevelUp`: スキルレベルアップ時
- `TimesheetSubmitted`: タイムシート提出時
- `TimesheetApproved`: タイムシート承認時
- `TeamFormed`: チーム編成時

---

## 詳細ドキュメント {#detailed-docs}

BC-005データ層の詳細は以下のドキュメントを参照してください:

1. **[tables.md](tables.md)** - 全16テーブルの詳細定義
   - カラム定義、制約、ビジネスルール
   - 推定データ量、パーティショニング戦略

2. **[indexes-constraints.md](indexes-constraints.md)** - インデックスと制約
   - 全インデックス定義（100+）
   - トリガー関数（配分率制約、工数制約等）
   - CHECK制約、ユニーク制約

3. **[query-patterns.md](query-patterns.md)** - クエリパターン集
   - リソース配分クエリ
   - 稼働率集計クエリ
   - スキルマッチングクエリ
   - パフォーマンス目標（p95）

4. **[backup-operations.md](backup-operations.md)** - 運用とバックアップ
   - バックアップ戦略
   - リストア手順
   - パーティション管理
   - マテリアライズドビュー更新

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-005 データ層詳細化
