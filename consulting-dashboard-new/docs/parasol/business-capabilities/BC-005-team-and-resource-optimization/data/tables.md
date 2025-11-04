# BC-005: テーブル定義詳細

**ドキュメント**: データ層 - テーブル定義
**最終更新**: 2025-11-03

このドキュメントでは、BC-005の全16テーブルの詳細定義を記載します。

---

## 目次

### リソース管理グループ
1. [resources](#table-resources)
2. [resource_allocations](#table-resource-allocations)
3. [resource_utilization_history](#table-resource-utilization-history)

### タレント管理グループ
4. [talents](#table-talents)
5. [performance_records](#table-performance-records)
6. [career_plans](#table-career-plans)
7. [talent_skills](#table-talent-skills)

### スキル管理グループ
8. [skills](#table-skills)
9. [skill_categories](#table-skill-categories)
10. [skill_prerequisites](#table-skill-prerequisites)

### チーム管理グループ
11. [teams](#table-teams)
12. [team_members](#table-team-members)
13. [team_performance_history](#table-team-performance-history)

### タイムシート管理グループ
14. [timesheets](#table-timesheets)
15. [timesheet_entries](#table-timesheet-entries)
16. [timesheet_approvals](#table-timesheet-approvals)

### マテリアライズドビュー
17. [mv_resource_utilization_summary](#view-resource-utilization-summary)
18. [mv_talent_performance_summary](#view-talent-performance-summary)
19. [mv_team_statistics](#view-team-statistics)
20. [mv_skill_distribution](#view-skill-distribution)

---

## リソース管理グループ

### 1. resources {#table-resources}

リソースマスタテーブル。コンサルタント、開発者、デザイナーなどの人的リソースを管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | リソースID |
| user_id | UUID | FK → BC-003.users, NOT NULL, UNIQUE | | ユーザーID |
| resource_type | VARCHAR(50) | NOT NULL | | リソースタイプ |
| employment_type | VARCHAR(50) | NOT NULL | | 雇用形態 |
| department | VARCHAR(100) | | NULL | 所属部門 |
| job_title | VARCHAR(100) | | NULL | 職位 |
| cost_per_hour | DECIMAL(10,2) | | NULL | 時間単価（JPY） |
| status | VARCHAR(20) | NOT NULL | 'available' | ステータス |
| available_from | DATE | | NULL | 利用可能開始日 |
| available_to | DATE | | NULL | 利用可能終了日 |
| current_utilization | DECIMAL(4,2) | NOT NULL | 0.00 | 現在の稼働率（0.0-2.0） |
| metadata | JSONB | | NULL | メタデータ（柔軟な拡張） |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |
| deleted_at | TIMESTAMP | | NULL | 論理削除日時 |

**リソースタイプ** (resource_type):
- `consultant`: コンサルタント
- `developer`: 開発者
- `designer`: デザイナー
- `analyst`: アナリスト
- `manager`: マネージャー
- `specialist`: スペシャリスト

**雇用形態** (employment_type):
- `full_time`: 正社員
- `contract`: 契約社員
- `part_time`: パートタイム
- `freelance`: フリーランス

**ステータス** (status):
- `available`: 配分可能
- `allocated`: 配分済み
- `unavailable`: 配分不可
- `on_leave`: 休暇中

**ビジネスルール**:
- user_id は一意（1ユーザー = 1リソース）
- current_utilization は 0.0（0%）から 2.0（200%）の範囲
- current_utilization はトリガーで自動更新
- status='unavailable' の場合、新規配分不可
- cost_per_hour は非公開情報（アクセス制限）

**推定データ量**: ~10,000リソース

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 2. resource_allocations {#table-resource-allocations}

リソース配分テーブル。プロジェクトへのリソース配分を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 配分ID |
| resource_id | UUID | FK → resources, NOT NULL | | リソースID |
| project_id | UUID | FK → BC-001.projects, NOT NULL | | プロジェクトID |
| allocation_percentage | DECIMAL(4,2) | NOT NULL, CHECK (allocation_percentage > 0.0 AND allocation_percentage <= 1.0) | | 配分率（0.0-1.0） |
| start_date | DATE | NOT NULL | | 配分開始日 |
| end_date | DATE | NOT NULL | | 配分終了日 |
| role | VARCHAR(100) | | NULL | プロジェクト内ロール |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| actual_hours | DECIMAL(10,2) | | 0.00 | 実績工数（時間） |
| notes | TEXT | | NULL | 備考 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**CHECK制約**: start_date < end_date

**ステータス** (status):
- `active`: 有効
- `completed`: 完了
- `cancelled`: キャンセル

**ロール例** (role):
- `project_lead`: プロジェクトリーダー
- `senior_consultant`: シニアコンサルタント
- `consultant`: コンサルタント
- `analyst`: アナリスト
- `specialist`: スペシャリスト

**ビジネスルール**:
- allocation_percentage は 0.0（0%）超 1.0（100%）以下
- 1リソースの同一期間内の配分率合計は 2.0（200%）以下
- (resource_id, project_id, start_date, end_date) の重複配分は警告
- トリガーで配分率制約チェック
- actual_hours はタイムシートから自動集計

**配分率の意味**:
- 1.00 = 100%（フルタイム配分）
- 0.50 = 50%（半分の時間）
- 0.25 = 25%（1/4の時間）

**推定データ量**: ~50,000配分記録

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 3. resource_utilization_history {#table-resource-utilization-history}

リソース稼働率履歴テーブル。月次の稼働率実績を記録。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 履歴ID |
| resource_id | UUID | FK → resources, NOT NULL | | リソースID |
| period_year_month | CHAR(7) | NOT NULL | | 対象年月（YYYY-MM） |
| total_hours_worked | DECIMAL(10,2) | NOT NULL | 0.00 | 総実働時間 |
| billable_hours | DECIMAL(10,2) | NOT NULL | 0.00 | 請求可能時間 |
| non_billable_hours | DECIMAL(10,2) | NOT NULL | 0.00 | 非請求時間 |
| utilization_rate | DECIMAL(5,4) | NOT NULL | 0.0000 | 稼働率（0.0-1.0） |
| billable_rate | DECIMAL(5,4) | NOT NULL | 0.0000 | 請求可能率（0.0-1.0） |
| overtime_hours | DECIMAL(10,2) | | 0.00 | 残業時間 |
| recorded_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 記録日時 |

**ユニーク制約**: (resource_id, period_year_month)

**ビジネスルール**:
- period_year_month 形式: 'YYYY-MM' (例: '2025-11')
- total_hours_worked = billable_hours + non_billable_hours
- utilization_rate = total_hours_worked / 標準労働時間（例: 160時間/月）
- billable_rate = billable_hours / total_hours_worked
- タイムシート承認時に自動集計
- パーティショニング: 年次（YYYY）

**稼働率計算例**:
- 標準労働時間: 160時間/月（8時間 × 20日）
- 実働時間: 140時間
- 稼働率: 140 / 160 = 0.8750（87.5%）

**推定データ量**: ~120,000+記録（10,000リソース × 12ヶ月）

**パーティション**: 年次（period_year_month）

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

## タレント管理グループ

### 4. talents {#table-talents}

タレントプロファイルテーブル。リソースのキャリア、育成情報を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | タレントID |
| resource_id | UUID | FK → resources, NOT NULL, UNIQUE | | リソースID |
| career_level | VARCHAR(50) | NOT NULL | | キャリアレベル |
| career_track | VARCHAR(50) | NOT NULL | | キャリアトラック |
| hire_date | DATE | | NULL | 入社日 |
| manager_id | UUID | FK → BC-003.users | NULL | マネージャーID |
| potential_rating | DECIMAL(3,2) | CHECK (potential_rating >= 1.0 AND potential_rating <= 5.0) | NULL | ポテンシャル評価（1.0-5.0） |
| risk_of_attrition | VARCHAR(20) | | 'low' | 離職リスク |
| last_promotion_date | DATE | | NULL | 最終昇進日 |
| development_focus | TEXT | | NULL | 育成注力領域 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**キャリアレベル** (career_level):
- `junior`: ジュニア（1-2年）
- `intermediate`: 中堅（3-5年）
- `senior`: シニア（6-10年）
- `expert`: エキスパート（10年以上）
- `principal`: プリンシパル（最上級）

**キャリアトラック** (career_track):
- `technical`: テクニカルトラック
- `management`: マネジメントトラック
- `specialist`: スペシャリストトラック
- `consulting`: コンサルティングトラック

**離職リスク** (risk_of_attrition):
- `low`: 低リスク
- `medium`: 中リスク
- `high`: 高リスク

**ビジネスルール**:
- resource_id は一意（1リソース = 1タレントプロファイル）
- potential_rating は過去3回のパフォーマンス評価から自動計算
- manager_id は BC-003 の users.id かつ MANAGER権限保有者
- last_promotion_date はキャリアレベル変更時に自動更新

**推定データ量**: ~10,000タレント

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 5. performance_records {#table-performance-records}

パフォーマンス評価記録テーブル。定期評価の記録を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 評価記録ID |
| talent_id | UUID | FK → talents, NOT NULL | | タレントID |
| period_start | DATE | NOT NULL | | 評価期間開始日 |
| period_end | DATE | NOT NULL | | 評価期間終了日 |
| period_name | VARCHAR(50) | | NULL | 評価期間名（例: 2025-H1） |
| overall_score | DECIMAL(3,2) | NOT NULL, CHECK (overall_score >= 1.0 AND overall_score <= 5.0) | | 総合評価スコア（1.0-5.0） |
| dimensions | JSONB | | NULL | 評価項目別スコア |
| strengths | TEXT | | NULL | 強み |
| areas_for_improvement | TEXT | | NULL | 改善領域 |
| feedback | TEXT | | NULL | フィードバック |
| reviewer_id | UUID | FK → BC-003.users, NOT NULL | | 評価者ID |
| status | VARCHAR(20) | NOT NULL | 'draft' | ステータス |
| approved_by | UUID | FK → BC-003.users | NULL | 承認者ID |
| approved_at | TIMESTAMP | | NULL | 承認日時 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**CHECK制約**: period_start < period_end

**ステータス** (status):
- `draft`: 下書き
- `submitted`: 提出済み
- `approved`: 承認済み
- `cancelled`: キャンセル

**評価項目例** (dimensions JSONBフィールド):
```json
{
  "technical_skills": 4.5,
  "communication": 4.0,
  "leadership": 4.0,
  "problem_solving": 4.5,
  "collaboration": 4.2,
  "customer_focus": 4.3
}
```

**ビジネスルール**:
- overall_score は 1.0（最低）から 5.0（最高）の範囲
- 同一タレント・同一期間の評価は1つのみ（重複不可）
- reviewer_id は通常 manager_id と同一
- status='approved' の場合、approved_by と approved_at は必須
- 承認済み評価は過去3回分を talents.potential_rating 計算に使用

**評価スコアの意味**:
- 5.0: 卓越した成果（Outstanding）
- 4.0: 期待以上の成果（Exceeds Expectations）
- 3.0: 期待通りの成果（Meets Expectations）
- 2.0: 改善必要（Needs Improvement）
- 1.0: 大幅な改善必要（Unsatisfactory）

**推定データ量**: ~40,000評価記録（年2回評価 × 10,000タレント × 2年）

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 6. career_plans {#table-career-plans}

キャリア開発計画テーブル。年度ごとのキャリア目標と開発計画を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 計画ID |
| talent_id | UUID | FK → talents, NOT NULL | | タレントID |
| fiscal_year | INTEGER | NOT NULL | | 対象年度（例: 2025） |
| goals | JSONB | | NULL | キャリア目標（SMART） |
| development_activities | JSONB | | NULL | 育成活動リスト |
| target_skills | JSONB | | NULL | 習得目標スキル |
| achievements | TEXT | | NULL | 達成事項 |
| status | VARCHAR(20) | NOT NULL | 'draft' | ステータス |
| created_by | UUID | FK → BC-003.users, NOT NULL | | 作成者ID |
| reviewed_by | UUID | FK → BC-003.users | NULL | レビュー者ID |
| reviewed_at | TIMESTAMP | | NULL | レビュー日時 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**ユニーク制約**: (talent_id, fiscal_year, status='active')

**ステータス** (status):
- `draft`: 下書き
- `active`: 有効
- `completed`: 完了
- `cancelled`: キャンセル

**キャリア目標例** (goals JSONBフィールド):
```json
[
  {
    "id": "goal-1",
    "description": "シニアコンサルタントへの昇進",
    "category": "promotion",
    "target_date": "2025-12-31",
    "status": "in_progress"
  },
  {
    "id": "goal-2",
    "description": "Java上級スキル習得",
    "category": "skill_development",
    "target_date": "2025-06-30",
    "status": "completed"
  }
]
```

**育成活動例** (development_activities JSONBフィールド):
```json
[
  {
    "activity": "Java認定資格取得",
    "type": "certification",
    "status": "in_progress",
    "completion_date": null
  },
  {
    "activity": "リーダーシップ研修受講",
    "type": "training",
    "status": "completed",
    "completion_date": "2025-05-15"
  }
]
```

**ビジネスルール**:
- 同一タレント・同一年度の有効な計画は1つのみ
- goals はSMART形式（Specific, Measurable, Achievable, Relevant, Time-bound）
- created_by は通常タレント本人または manager_id
- reviewed_by は通常 manager_id

**推定データ量**: ~20,000計画（10,000タレント × 2年）

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 7. talent_skills {#table-talent-skills}

タレントスキルテーブル。タレントのスキル習得状況とレベルを管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | ID |
| resource_id | UUID | FK → resources, NOT NULL | | リソースID |
| skill_id | UUID | FK → skills, NOT NULL | | スキルID |
| level | INTEGER | NOT NULL, CHECK (level >= 1 AND level <= 5) | 1 | レベル（1-5） |
| acquired_date | DATE | | NULL | 習得日 |
| verified_by | UUID | FK → BC-003.users | NULL | 認定者ID |
| verified_at | TIMESTAMP | | NULL | 認定日時 |
| evidence | TEXT | | NULL | 習得エビデンス |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**ユニーク制約**: (resource_id, skill_id)

**スキルレベル定義**:
- **Level 1 (基礎)**: 基本的な知識があり、指導下で作業可能
- **Level 2 (初級)**: 基本的な作業を独力で実行可能
- **Level 3 (中級)**: 複雑な作業を独力で実行可能
- **Level 4 (上級)**: 専門家として他者を指導可能
- **Level 5 (エキスパート)**: 業界トップレベルの専門知識と実績

**ビジネスルール**:
- level は 1 から 5 までの整数
- 同一リソース・同一スキルの組み合わせは一意
- レベルアップは1段階ずつのみ（1→2, 2→3, ...）
- スキル前提条件をチェック（skill_prerequisites）
- verified_by は通常 manager_id または HR_MANAGER
- evidence にはプロジェクト実績、資格証明等を記録

**推定データ量**: ~100,000スキル記録（10,000タレント × 平均10スキル）

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

## スキル管理グループ

### 8. skills {#table-skills}

スキルマスタテーブル。技術スキル、ビジネススキル等の定義を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | スキルID |
| category_id | UUID | FK → skill_categories, NOT NULL | | カテゴリID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | | スキル名 |
| name_en | VARCHAR(100) | | NULL | スキル名（英語） |
| description | TEXT | | NULL | スキル説明 |
| level_definitions | JSONB | | NULL | レベル別定義 |
| certification_info | JSONB | | NULL | 関連資格情報 |
| market_demand | VARCHAR(20) | | 'medium' | 市場需要 |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**市場需要** (market_demand):
- `very_high`: 非常に高い
- `high`: 高い
- `medium`: 中程度
- `low`: 低い

**ステータス** (status):
- `active`: 有効
- `deprecated`: 非推奨
- `inactive`: 無効

**レベル定義例** (level_definitions JSONBフィールド):
```json
{
  "1": {
    "name": "基礎",
    "description": "基本的な知識があり、指導下で作業可能"
  },
  "2": {
    "name": "初級",
    "description": "基本的な作業を独力で実行可能"
  },
  "3": {
    "name": "中級",
    "description": "複雑な作業を独力で実行可能"
  },
  "4": {
    "name": "上級",
    "description": "専門家として他者を指導可能"
  },
  "5": {
    "name": "エキスパート",
    "description": "業界トップレベルの専門知識と実績"
  }
}
```

**関連資格例** (certification_info JSONBフィールド):
```json
{
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "level": "Professional",
      "url": "https://aws.amazon.com/certification/"
    },
    {
      "name": "Oracle Certified Java Programmer",
      "level": "Gold",
      "url": "https://education.oracle.com/java-certifications"
    }
  ]
}
```

**ビジネスルール**:
- name は一意（重複不可）
- status='deprecated' のスキルは新規習得不可
- market_demand は四半期ごとに見直し

**推定データ量**: ~500スキル

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 9. skill_categories {#table-skill-categories}

スキルカテゴリマスタテーブル。スキルの分類を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | カテゴリID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | | カテゴリ名 |
| name_en | VARCHAR(100) | | NULL | カテゴリ名（英語） |
| description | TEXT | | NULL | カテゴリ説明 |
| parent_category_id | UUID | FK → skill_categories | NULL | 親カテゴリID（階層化） |
| display_order | INTEGER | | 0 | 表示順 |
| icon | VARCHAR(50) | | NULL | アイコン識別子 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**カテゴリ例**:
- **プログラミング言語**: Java, Python, JavaScript, Go, Rust
- **フレームワーク**: Spring, React, Angular, Vue.js
- **データベース**: PostgreSQL, MySQL, MongoDB, Redis
- **クラウド**: AWS, Azure, GCP
- **ビジネススキル**: プロジェクトマネジメント, リーダーシップ, コミュニケーション
- **ドメインスキル**: 金融, 医療, 製造, 小売

**ビジネスルール**:
- name は一意（重複不可）
- parent_category_id による階層化をサポート（最大2階層）
- display_order で表示順を制御

**推定データ量**: ~50カテゴリ

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 10. skill_prerequisites {#table-skill-prerequisites}

スキル前提条件テーブル。スキル習得の前提条件を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | ID |
| skill_id | UUID | FK → skills, NOT NULL | | スキルID |
| prerequisite_skill_id | UUID | FK → skills, NOT NULL | | 前提スキルID |
| required_level | INTEGER | NOT NULL, CHECK (required_level >= 1 AND required_level <= 5) | | 必要レベル（1-5） |
| is_mandatory | BOOLEAN | NOT NULL | true | 必須フラグ |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |

**ユニーク制約**: (skill_id, prerequisite_skill_id)

**前提条件例**:

| スキル | 前提スキル | 必要レベル | 必須 |
|--------|-----------|----------|------|
| Spring Boot | Java | 3 (中級) | 必須 |
| React Native | React | 3 (中級) | 必須 |
| Kubernetes | Docker | 3 (中級) | 必須 |
| AWS Solutions Architect | AWS基礎 | 2 (初級) | 必須 |
| プロジェクトマネジメント | リーダーシップ | 2 (初級) | 推奨 |

**ビジネスルール**:
- skill_id と prerequisite_skill_id は異なる必要あり（自己参照禁止）
- 循環参照は禁止（A→B→A）
- is_mandatory=true の場合、前提条件を満たさないとレベルアップ不可
- is_mandatory=false の場合、推奨事項として扱う

**推定データ量**: ~1,000前提条件

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

## チーム管理グループ

### 11. teams {#table-teams}

チームマスタテーブル。プロジェクトチーム、ワーキンググループ等を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | チームID |
| name | VARCHAR(200) | NOT NULL | | チーム名 |
| project_id | UUID | FK → BC-001.projects | NULL | プロジェクトID |
| team_type | VARCHAR(50) | NOT NULL | | チームタイプ |
| purpose | TEXT | | NULL | チーム目的 |
| skill_requirements | JSONB | | NULL | 必要スキル |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| start_date | DATE | | NULL | 開始日 |
| end_date | DATE | | NULL | 終了予定日 |
| member_count | INTEGER | NOT NULL | 0 | メンバー数（キャッシュ） |
| leader_count | INTEGER | NOT NULL | 0 | リーダー数（キャッシュ） |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |
| deleted_at | TIMESTAMP | | NULL | 論理削除日時 |

**チームタイプ** (team_type):
- `project`: プロジェクトチーム
- `workgroup`: ワーキンググループ
- `task_force`: タスクフォース
- `community`: コミュニティ

**ステータス** (status):
- `active`: 稼働中
- `completed`: 完了
- `suspended`: 一時停止
- `disbanded`: 解散

**必要スキル例** (skill_requirements JSONBフィールド):
```json
{
  "required": [
    {"skill_id": "skill-uuid-1", "skill_name": "Java", "min_level": 3, "count": 2},
    {"skill_id": "skill-uuid-2", "skill_name": "AWS", "min_level": 3, "count": 1}
  ],
  "preferred": [
    {"skill_id": "skill-uuid-3", "skill_name": "React", "min_level": 2, "count": 1}
  ]
}
```

**ビジネスルール**:
- team_type='project' の場合、project_id は必須
- status='active' のチームは最低1名のリーダーが必要
- member_count と leader_count はトリガーで自動更新
- skill_requirements は最適チーム編成時に使用

**推定データ量**: ~500チーム

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 12. team_members {#table-team-members}

チームメンバーテーブル。チームへのメンバー参加を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | メンバーID |
| team_id | UUID | FK → teams, NOT NULL | | チームID |
| resource_id | UUID | FK → resources, NOT NULL | | リソースID |
| role | VARCHAR(100) | | NULL | チーム内ロール |
| allocation_rate | DECIMAL(4,2) | NOT NULL, CHECK (allocation_rate >= 0.0 AND allocation_rate <= 1.0) | 1.00 | 配分率（0.0-1.0） |
| is_leader | BOOLEAN | NOT NULL | false | リーダーフラグ |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| joined_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 参加日時 |
| left_at | TIMESTAMP | | NULL | 離脱日時 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**ステータス** (status):
- `active`: 参加中
- `inactive`: 離脱済み

**ロール例** (role):
- `team_lead`: チームリーダー
- `sub_lead`: サブリーダー
- `member`: メンバー
- `advisor`: アドバイザー

**ビジネスルール**:
- (team_id, resource_id, status='active') の組み合わせは一意
- allocation_rate は 0.0（0%）から 1.0（100%）の範囲
- is_leader=true の場合、通常 role='team_lead' または 'sub_lead'
- メンバー追加時、teams.member_count をインクリメント
- is_leader=true のメンバー追加時、teams.leader_count をインクリメント

**推定データ量**: ~5,000チームメンバー記録

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 13. team_performance_history {#table-team-performance-history}

チームパフォーマンス履歴テーブル。チームの定期的なパフォーマンス記録を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 履歴ID |
| team_id | UUID | FK → teams, NOT NULL | | チームID |
| recorded_period | VARCHAR(50) | NOT NULL | | 記録期間（例: 2025-Q1） |
| velocity | DECIMAL(10,2) | | NULL | ベロシティ（生産性指標） |
| quality_score | DECIMAL(3,2) | CHECK (quality_score >= 1.0 AND quality_score <= 5.0) | NULL | 品質スコア（1.0-5.0） |
| collaboration_score | DECIMAL(3,2) | CHECK (collaboration_score >= 1.0 AND collaboration_score <= 5.0) | NULL | 協働スコア（1.0-5.0） |
| delivery_on_time_rate | DECIMAL(5,4) | | NULL | 期限内完了率（0.0-1.0） |
| customer_satisfaction | DECIMAL(3,2) | CHECK (customer_satisfaction >= 1.0 AND customer_satisfaction <= 5.0) | NULL | 顧客満足度（1.0-5.0） |
| notes | TEXT | | NULL | 備考 |
| recorded_by | UUID | FK → BC-003.users | NULL | 記録者ID |
| recorded_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 記録日時 |

**記録期間形式** (recorded_period):
- 四半期: `YYYY-Q1`, `YYYY-Q2`, `YYYY-Q3`, `YYYY-Q4`
- 月次: `YYYY-MM`
- スプリント: `YYYY-Sprint-NN`

**ビジネスルール**:
- 同一チーム・同一期間の記録は1つのみ
- velocity はチーム独自の生産性指標（ストーリーポイント等）
- quality_score, collaboration_score, customer_satisfaction は 1.0 から 5.0
- delivery_on_time_rate は 0.0（0%）から 1.0（100%）

**推定データ量**: ~6,000+記録（500チーム × 四半期 × 3年）

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

## タイムシート管理グループ

### 14. timesheets {#table-timesheets}

タイムシートマスタテーブル。週次・月次の工数記録を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | タイムシートID |
| resource_id | UUID | FK → resources, NOT NULL | | リソースID |
| period_start | DATE | NOT NULL | | 期間開始日 |
| period_end | DATE | NOT NULL | | 期間終了日 |
| total_hours | DECIMAL(10,2) | NOT NULL | 0.00 | 合計時間 |
| billable_hours | DECIMAL(10,2) | NOT NULL | 0.00 | 請求可能時間 |
| status | VARCHAR(20) | NOT NULL | 'draft' | ステータス |
| submitted_at | TIMESTAMP | | NULL | 提出日時 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**CHECK制約**: period_start < period_end

**ユニーク制約**: (resource_id, period_start, period_end)

**ステータス** (status):
- `draft`: 下書き
- `submitted`: 提出済み
- `approved`: 承認済み
- `rejected`: 却下

**ビジネスルール**:
- 同一リソース・同一期間のタイムシートは一意
- total_hours と billable_hours は timesheet_entries から自動集計
- status='draft' の場合のみ編集可能
- status='approved' の場合、編集不可
- パーティショニング: 年次（period_start）

**推定データ量**: ~120,000+タイムシート（10,000リソース × 週次 × 1年）

**パーティション**: 年次（period_start）

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 15. timesheet_entries {#table-timesheet-entries}

タイムシート明細テーブル。日次・プロジェクト別の工数明細を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | エントリID |
| timesheet_id | UUID | FK → timesheets, NOT NULL | | タイムシートID |
| project_id | UUID | FK → BC-001.projects | NULL | プロジェクトID |
| task_type | VARCHAR(50) | | NULL | タスク種別 |
| work_date | DATE | NOT NULL | | 作業日 |
| hours | DECIMAL(4,2) | NOT NULL, CHECK (hours > 0 AND hours <= 24) | | 時間（0.25単位） |
| description | TEXT | | NULL | 作業内容 |
| is_billable | BOOLEAN | NOT NULL | true | 請求可能フラグ |
| is_overtime | BOOLEAN | NOT NULL | false | 残業フラグ |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**タスク種別例** (task_type):
- `development`: 開発
- `design`: 設計
- `testing`: テスト
- `meeting`: 会議
- `documentation`: ドキュメント作成
- `review`: レビュー
- `training`: 研修
- `other`: その他

**ビジネスルール**:
- hours は 0 超 24 以下（1日の上限）
- 1日の同一リソースの合計時間は 24時間以下
- work_date は timesheet の period_start と period_end の範囲内
- is_billable=false の場合、内部作業・研修等
- パーティショニング: 年次（work_date）

**時間単位**:
- 0.25時間（15分）単位で記録
- 例: 2.50時間 = 2時間30分

**推定データ量**: ~2,400,000+エントリ（10,000リソース × 週5日 × 52週 × 約5エントリ/日）

**パーティション**: 年次（work_date）

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 16. timesheet_approvals {#table-timesheet-approvals}

タイムシート承認履歴テーブル。承認・却下の履歴を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 承認ID |
| timesheet_id | UUID | FK → timesheets, NOT NULL | | タイムシートID |
| approver_id | UUID | FK → BC-003.users, NOT NULL | | 承認者ID |
| approval_status | VARCHAR(20) | NOT NULL | | 承認ステータス |
| comments | TEXT | | NULL | コメント |
| approved_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 承認日時 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |

**承認ステータス** (approval_status):
- `approved`: 承認
- `rejected`: 却下
- `returned`: 差し戻し

**ビジネスルール**:
- approver_id は MANAGER権限またはリソースの manager_id
- approval_status='approved' の場合、timesheets.status を 'approved' に更新
- approval_status='rejected' の場合、timesheets.status を 'rejected' に更新
- comments は approval_status='rejected' の場合、理由記載を推奨
- パーティショニング: 年次（approved_at）

**推定データ量**: ~120,000+承認記録

**パーティション**: 年次（approved_at）

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

## マテリアライズドビュー

### 17. mv_resource_utilization_summary {#view-resource-utilization-summary}

リソース稼働率集計ビュー。リソース別の稼働率サマリーを提供。

**リフレッシュ**: 1時間毎

**定義**:
```sql
CREATE MATERIALIZED VIEW mv_resource_utilization_summary AS
SELECT
  r.id AS resource_id,
  r.user_id,
  r.resource_type,
  r.department,
  ruh.period_year_month,
  ruh.total_hours_worked,
  ruh.billable_hours,
  ruh.utilization_rate,
  ruh.billable_rate,
  COUNT(DISTINCT ra.project_id) AS active_projects,
  r.current_utilization,
  r.status
FROM resources r
LEFT JOIN resource_utilization_history ruh ON r.id = ruh.resource_id
LEFT JOIN resource_allocations ra ON r.id = ra.resource_id
  AND ra.status = 'active'
  AND CURRENT_DATE BETWEEN ra.start_date AND ra.end_date
GROUP BY
  r.id, r.user_id, r.resource_type, r.department,
  ruh.period_year_month, ruh.total_hours_worked, ruh.billable_hours,
  ruh.utilization_rate, ruh.billable_rate, r.current_utilization, r.status;
```

**用途**:
- リソース稼働率レポート
- 部門別稼働率分析
- プロジェクト配分状況確認

---

### 18. mv_talent_performance_summary {#view-talent-performance-summary}

タレントパフォーマンス集計ビュー。タレント別のパフォーマンスサマリーを提供。

**リフレッシュ**: 1日1回

**定義**:
```sql
CREATE MATERIALIZED VIEW mv_talent_performance_summary AS
SELECT
  t.id AS talent_id,
  t.resource_id,
  t.career_level,
  t.career_track,
  t.potential_rating,
  t.risk_of_attrition,
  COUNT(pr.id) AS total_evaluations,
  AVG(pr.overall_score) AS avg_performance_score,
  MAX(pr.period_end) AS last_evaluation_date,
  COUNT(ts.id) AS skill_count,
  AVG(ts.level) AS avg_skill_level
FROM talents t
LEFT JOIN performance_records pr ON t.id = pr.talent_id
  AND pr.status = 'approved'
LEFT JOIN talent_skills ts ON t.resource_id = ts.resource_id
GROUP BY
  t.id, t.resource_id, t.career_level, t.career_track,
  t.potential_rating, t.risk_of_attrition;
```

**用途**:
- タレントポートフォリオ分析
- ハイパフォーマー特定
- 離職リスク管理

---

### 19. mv_team_statistics {#view-team-statistics}

チーム統計ビュー。チーム別の統計情報を提供。

**リフレッシュ**: 1時間毎

**定義**:
```sql
CREATE MATERIALIZED VIEW mv_team_statistics AS
SELECT
  tm.id AS team_id,
  tm.name AS team_name,
  tm.team_type,
  tm.status,
  tm.member_count,
  tm.leader_count,
  AVG(ts.level) AS avg_team_skill_level,
  COUNT(DISTINCT ts.skill_id) AS unique_skills,
  AVG(tph.quality_score) AS avg_quality_score,
  AVG(tph.collaboration_score) AS avg_collaboration_score
FROM teams tm
LEFT JOIN team_members tmem ON tm.id = tmem.team_id AND tmem.status = 'active'
LEFT JOIN talent_skills ts ON tmem.resource_id = ts.resource_id
LEFT JOIN team_performance_history tph ON tm.id = tph.team_id
GROUP BY
  tm.id, tm.name, tm.team_type, tm.status, tm.member_count, tm.leader_count;
```

**用途**:
- チーム編成最適化
- チームパフォーマンス比較
- スキルバランス分析

---

### 20. mv_skill_distribution {#view-skill-distribution}

スキル分布ビュー。組織全体のスキル保有状況を提供。

**リフレッシュ**: 1日1回

**定義**:
```sql
CREATE MATERIALIZED VIEW mv_skill_distribution AS
SELECT
  s.id AS skill_id,
  s.name AS skill_name,
  sc.name AS category_name,
  s.market_demand,
  COUNT(ts.id) AS total_holders,
  COUNT(CASE WHEN ts.level >= 3 THEN 1 END) AS advanced_holders,
  COUNT(CASE WHEN ts.level >= 4 THEN 1 END) AS expert_holders,
  AVG(ts.level) AS avg_level,
  MAX(ts.updated_at) AS last_updated
FROM skills s
LEFT JOIN skill_categories sc ON s.category_id = sc.id
LEFT JOIN talent_skills ts ON s.id = ts.skill_id
WHERE s.status = 'active'
GROUP BY
  s.id, s.name, sc.name, s.market_demand;
```

**用途**:
- スキルギャップ分析
- トレーニング計画策定
- 採用計画立案

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-005 データ層詳細化
