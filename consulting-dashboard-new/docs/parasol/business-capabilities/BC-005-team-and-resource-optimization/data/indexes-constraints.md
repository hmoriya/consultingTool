# BC-005: インデックスと制約

**ドキュメント**: データ層 - インデックスと制約
**最終更新**: 2025-11-03

このドキュメントでは、BC-005の全インデックス、制約、トリガー定義を記載します。

---

## 目次

1. [インデックス一覧](#indexes)
2. [ユニーク制約](#unique-constraints)
3. [CHECK制約](#check-constraints)
4. [外部キー制約](#foreign-keys)
5. [トリガー関数](#triggers)

---

## インデックス一覧 {#indexes}

### リソース管理グループ

#### resources

```sql
-- プライマリキー
CREATE INDEX idx_resources_id ON resources(id);

-- ユニーク制約用
CREATE UNIQUE INDEX idx_resources_user_id ON resources(user_id) WHERE deleted_at IS NULL;

-- 検索用
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_resource_type ON resources(resource_type);
CREATE INDEX idx_resources_department ON resources(department);
CREATE INDEX idx_resources_employment_type ON resources(employment_type);

-- 配分検索
CREATE INDEX idx_resources_current_utilization ON resources(current_utilization);
CREATE INDEX idx_resources_status_utilization
  ON resources(status, current_utilization)
  WHERE status IN ('available', 'allocated');

-- 日付範囲検索
CREATE INDEX idx_resources_available_from ON resources(available_from);
CREATE INDEX idx_resources_available_to ON resources(available_to);

-- JSONB検索
CREATE INDEX idx_resources_metadata ON resources USING GIN(metadata);

-- 論理削除考慮
CREATE INDEX idx_resources_active ON resources(status) WHERE deleted_at IS NULL;
```

**インデックス数**: 12

---

#### resource_allocations

```sql
-- プライマリキー
CREATE INDEX idx_resource_allocations_id ON resource_allocations(id);

-- 外部キー
CREATE INDEX idx_resource_allocations_resource_id ON resource_allocations(resource_id);
CREATE INDEX idx_resource_allocations_project_id ON resource_allocations(project_id);

-- ステータス検索
CREATE INDEX idx_resource_allocations_status ON resource_allocations(status);

-- 複合インデックス
CREATE INDEX idx_resource_allocations_resource_status
  ON resource_allocations(resource_id, status);
CREATE INDEX idx_resource_allocations_project_status
  ON resource_allocations(project_id, status);

-- 日付範囲検索（配分期間）
CREATE INDEX idx_resource_allocations_dates
  ON resource_allocations(start_date, end_date);
CREATE INDEX idx_resource_allocations_resource_dates
  ON resource_allocations(resource_id, start_date, end_date)
  WHERE status = 'active';

-- アロケーション率検索
CREATE INDEX idx_resource_allocations_percentage
  ON resource_allocations(allocation_percentage);

-- ロール検索
CREATE INDEX idx_resource_allocations_role ON resource_allocations(role);
```

**インデックス数**: 10

---

#### resource_utilization_history

```sql
-- プライマリキー
CREATE INDEX idx_resource_utilization_history_id ON resource_utilization_history(id);

-- ユニーク制約用
CREATE UNIQUE INDEX idx_resource_utilization_history_unique
  ON resource_utilization_history(resource_id, period_year_month);

-- 外部キー
CREATE INDEX idx_resource_utilization_history_resource_id
  ON resource_utilization_history(resource_id);

-- 期間検索
CREATE INDEX idx_resource_utilization_history_period
  ON resource_utilization_history(period_year_month);

-- 稼働率検索
CREATE INDEX idx_resource_utilization_history_utilization
  ON resource_utilization_history(utilization_rate);
CREATE INDEX idx_resource_utilization_history_billable
  ON resource_utilization_history(billable_rate);

-- 複合インデックス（時系列分析用）
CREATE INDEX idx_resource_utilization_history_resource_period
  ON resource_utilization_history(resource_id, period_year_month DESC);

-- 記録日時
CREATE INDEX idx_resource_utilization_history_recorded_at
  ON resource_utilization_history(recorded_at DESC);
```

**インデックス数**: 8

---

### タレント管理グループ

#### talents

```sql
-- プライマリキー
CREATE INDEX idx_talents_id ON talents(id);

-- ユニーク制約用
CREATE UNIQUE INDEX idx_talents_resource_id ON talents(resource_id);

-- 外部キー
CREATE INDEX idx_talents_manager_id ON talents(manager_id);

-- キャリア検索
CREATE INDEX idx_talents_career_level ON talents(career_level);
CREATE INDEX idx_talents_career_track ON talents(career_track);
CREATE INDEX idx_talents_career_level_track ON talents(career_level, career_track);

-- ポテンシャル・リスク検索
CREATE INDEX idx_talents_potential_rating ON talents(potential_rating DESC)
  WHERE potential_rating IS NOT NULL;
CREATE INDEX idx_talents_risk_of_attrition ON talents(risk_of_attrition);

-- 複合インデックス（タレント分析用）
CREATE INDEX idx_talents_track_level_potential
  ON talents(career_track, career_level, potential_rating DESC);

-- 日付検索
CREATE INDEX idx_talents_hire_date ON talents(hire_date);
CREATE INDEX idx_talents_last_promotion ON talents(last_promotion_date DESC);
```

**インデックス数**: 11

---

#### performance_records

```sql
-- プライマリキー
CREATE INDEX idx_performance_records_id ON performance_records(id);

-- 外部キー
CREATE INDEX idx_performance_records_talent_id ON performance_records(talent_id);
CREATE INDEX idx_performance_records_reviewer_id ON performance_records(reviewer_id);
CREATE INDEX idx_performance_records_approved_by ON performance_records(approved_by);

-- ステータス検索
CREATE INDEX idx_performance_records_status ON performance_records(status);

-- 複合インデックス
CREATE INDEX idx_performance_records_talent_status
  ON performance_records(talent_id, status);
CREATE INDEX idx_performance_records_talent_period
  ON performance_records(talent_id, period_start DESC, period_end DESC);

-- スコア検索
CREATE INDEX idx_performance_records_overall_score
  ON performance_records(overall_score DESC);

-- 期間検索
CREATE INDEX idx_performance_records_period_start ON performance_records(period_start DESC);
CREATE INDEX idx_performance_records_period_end ON performance_records(period_end DESC);

-- 承認日時
CREATE INDEX idx_performance_records_approved_at
  ON performance_records(approved_at DESC) WHERE approved_at IS NOT NULL;

-- JSONB検索
CREATE INDEX idx_performance_records_dimensions
  ON performance_records USING GIN(dimensions);
```

**インデックス数**: 12

---

#### career_plans

```sql
-- プライマリキー
CREATE INDEX idx_career_plans_id ON career_plans(id);

-- 外部キー
CREATE INDEX idx_career_plans_talent_id ON career_plans(talent_id);
CREATE INDEX idx_career_plans_created_by ON career_plans(created_by);
CREATE INDEX idx_career_plans_reviewed_by ON career_plans(reviewed_by);

-- ステータス検索
CREATE INDEX idx_career_plans_status ON career_plans(status);

-- 年度検索
CREATE INDEX idx_career_plans_fiscal_year ON career_plans(fiscal_year DESC);

-- 複合インデックス
CREATE INDEX idx_career_plans_talent_year ON career_plans(talent_id, fiscal_year DESC);

-- ユニーク制約用（active のみ）
CREATE UNIQUE INDEX idx_career_plans_unique_active
  ON career_plans(talent_id, fiscal_year)
  WHERE status = 'active';

-- JSONB検索
CREATE INDEX idx_career_plans_goals ON career_plans USING GIN(goals);
CREATE INDEX idx_career_plans_target_skills ON career_plans USING GIN(target_skills);
```

**インデックス数**: 10

---

#### talent_skills

```sql
-- プライマリキー
CREATE INDEX idx_talent_skills_id ON talent_skills(id);

-- ユニーク制約用
CREATE UNIQUE INDEX idx_talent_skills_unique
  ON talent_skills(resource_id, skill_id);

-- 外部キー
CREATE INDEX idx_talent_skills_resource_id ON talent_skills(resource_id);
CREATE INDEX idx_talent_skills_skill_id ON talent_skills(skill_id);
CREATE INDEX idx_talent_skills_verified_by ON talent_skills(verified_by);

-- レベル検索
CREATE INDEX idx_talent_skills_level ON talent_skills(level);

-- 複合インデックス（スキルマッチング用）
CREATE INDEX idx_talent_skills_skill_level
  ON talent_skills(skill_id, level DESC);
CREATE INDEX idx_talent_skills_resource_level
  ON talent_skills(resource_id, level DESC);

-- 日付検索
CREATE INDEX idx_talent_skills_acquired_date ON talent_skills(acquired_date);
CREATE INDEX idx_talent_skills_verified_at ON talent_skills(verified_at DESC);
```

**インデックス数**: 10

---

### スキル管理グループ

#### skills

```sql
-- プライマリキー
CREATE INDEX idx_skills_id ON skills(id);

-- ユニーク制約用
CREATE UNIQUE INDEX idx_skills_name ON skills(name) WHERE status = 'active';

-- 外部キー
CREATE INDEX idx_skills_category_id ON skills(category_id);

-- ステータス検索
CREATE INDEX idx_skills_status ON skills(status);

-- 市場需要検索
CREATE INDEX idx_skills_market_demand ON skills(market_demand);

-- 複合インデックス
CREATE INDEX idx_skills_category_status ON skills(category_id, status);

-- JSONB検索
CREATE INDEX idx_skills_level_definitions ON skills USING GIN(level_definitions);
CREATE INDEX idx_skills_certification_info ON skills USING GIN(certification_info);

-- テキスト検索
CREATE INDEX idx_skills_name_search
  ON skills USING GIN(to_tsvector('simple', name || ' ' || COALESCE(name_en, '')));
```

**インデックス数**: 9

---

#### skill_categories

```sql
-- プライマリキー
CREATE INDEX idx_skill_categories_id ON skill_categories(id);

-- ユニーク制約用
CREATE UNIQUE INDEX idx_skill_categories_name ON skill_categories(name);

-- 外部キー（階層化用）
CREATE INDEX idx_skill_categories_parent_id ON skill_categories(parent_category_id);

-- 表示順
CREATE INDEX idx_skill_categories_display_order
  ON skill_categories(display_order, name);
```

**インデックス数**: 4

---

#### skill_prerequisites

```sql
-- プライマリキー
CREATE INDEX idx_skill_prerequisites_id ON skill_prerequisites(id);

-- ユニーク制約用
CREATE UNIQUE INDEX idx_skill_prerequisites_unique
  ON skill_prerequisites(skill_id, prerequisite_skill_id);

-- 外部キー
CREATE INDEX idx_skill_prerequisites_skill_id ON skill_prerequisites(skill_id);
CREATE INDEX idx_skill_prerequisites_prerequisite_id
  ON skill_prerequisites(prerequisite_skill_id);

-- 必須フラグ検索
CREATE INDEX idx_skill_prerequisites_mandatory
  ON skill_prerequisites(skill_id, is_mandatory, required_level);
```

**インデックス数**: 5

---

### チーム管理グループ

#### teams

```sql
-- プライマリキー
CREATE INDEX idx_teams_id ON teams(id);

-- 外部キー
CREATE INDEX idx_teams_project_id ON teams(project_id);

-- ステータス検索
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_teams_team_type ON teams(team_type);

-- 複合インデックス
CREATE INDEX idx_teams_type_status ON teams(team_type, status);
CREATE INDEX idx_teams_project_status ON teams(project_id, status)
  WHERE project_id IS NOT NULL;

-- 日付範囲検索
CREATE INDEX idx_teams_start_date ON teams(start_date);
CREATE INDEX idx_teams_end_date ON teams(end_date);
CREATE INDEX idx_teams_dates ON teams(start_date, end_date);

-- JSONB検索
CREATE INDEX idx_teams_skill_requirements ON teams USING GIN(skill_requirements);

-- 論理削除考慮
CREATE INDEX idx_teams_active ON teams(status) WHERE deleted_at IS NULL;
```

**インデックス数**: 11

---

#### team_members

```sql
-- プライマリキー
CREATE INDEX idx_team_members_id ON team_members(id);

-- 外部キー
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_resource_id ON team_members(resource_id);

-- ステータス検索
CREATE INDEX idx_team_members_status ON team_members(status);

-- 複合インデックス
CREATE INDEX idx_team_members_team_status ON team_members(team_id, status);
CREATE INDEX idx_team_members_resource_status ON team_members(resource_id, status);

-- ユニーク制約用（active のみ）
CREATE UNIQUE INDEX idx_team_members_unique_active
  ON team_members(team_id, resource_id) WHERE status = 'active';

-- リーダー検索
CREATE INDEX idx_team_members_is_leader ON team_members(is_leader) WHERE is_leader = true;

-- アロケーション検索
CREATE INDEX idx_team_members_allocation_rate ON team_members(allocation_rate);

-- ロール検索
CREATE INDEX idx_team_members_role ON team_members(role);

-- 日付検索
CREATE INDEX idx_team_members_joined_at ON team_members(joined_at DESC);
```

**インデックス数**: 11

---

#### team_performance_history

```sql
-- プライマリキー
CREATE INDEX idx_team_performance_history_id ON team_performance_history(id);

-- 外部キー
CREATE INDEX idx_team_performance_history_team_id ON team_performance_history(team_id);
CREATE INDEX idx_team_performance_history_recorded_by
  ON team_performance_history(recorded_by);

-- 期間検索
CREATE INDEX idx_team_performance_history_period ON team_performance_history(recorded_period);

-- 複合インデックス
CREATE INDEX idx_team_performance_history_team_period
  ON team_performance_history(team_id, recorded_period DESC);

-- スコア検索
CREATE INDEX idx_team_performance_history_quality
  ON team_performance_history(quality_score DESC) WHERE quality_score IS NOT NULL;
CREATE INDEX idx_team_performance_history_collaboration
  ON team_performance_history(collaboration_score DESC)
  WHERE collaboration_score IS NOT NULL;

-- 記録日時
CREATE INDEX idx_team_performance_history_recorded_at
  ON team_performance_history(recorded_at DESC);
```

**インデックス数**: 8

---

### タイムシート管理グループ

#### timesheets

```sql
-- プライマリキー
CREATE INDEX idx_timesheets_id ON timesheets(id);

-- ユニーク制約用
CREATE UNIQUE INDEX idx_timesheets_unique
  ON timesheets(resource_id, period_start, period_end);

-- 外部キー
CREATE INDEX idx_timesheets_resource_id ON timesheets(resource_id);

-- ステータス検索
CREATE INDEX idx_timesheets_status ON timesheets(status);

-- 複合インデックス
CREATE INDEX idx_timesheets_resource_status ON timesheets(resource_id, status);
CREATE INDEX idx_timesheets_resource_period
  ON timesheets(resource_id, period_start DESC, period_end DESC);

-- 期間検索
CREATE INDEX idx_timesheets_period_start ON timesheets(period_start);
CREATE INDEX idx_timesheets_period_end ON timesheets(period_end);

-- 提出日時検索
CREATE INDEX idx_timesheets_submitted_at
  ON timesheets(submitted_at DESC) WHERE submitted_at IS NOT NULL;

-- ステータス別期間検索（承認待ち一覧用）
CREATE INDEX idx_timesheets_submitted_period
  ON timesheets(period_start DESC)
  WHERE status = 'submitted';
```

**インデックス数**: 10

---

#### timesheet_entries

```sql
-- プライマリキー
CREATE INDEX idx_timesheet_entries_id ON timesheet_entries(id);

-- 外部キー
CREATE INDEX idx_timesheet_entries_timesheet_id ON timesheet_entries(timesheet_id);
CREATE INDEX idx_timesheet_entries_project_id ON timesheet_entries(project_id);

-- 日付検索
CREATE INDEX idx_timesheet_entries_work_date ON timesheet_entries(work_date);

-- 複合インデックス
CREATE INDEX idx_timesheet_entries_timesheet_date
  ON timesheet_entries(timesheet_id, work_date);
CREATE INDEX idx_timesheet_entries_project_date
  ON timesheet_entries(project_id, work_date)
  WHERE project_id IS NOT NULL;

-- タスク種別検索
CREATE INDEX idx_timesheet_entries_task_type ON timesheet_entries(task_type);

-- 請求可能フラグ
CREATE INDEX idx_timesheet_entries_is_billable
  ON timesheet_entries(is_billable, work_date);

-- 残業フラグ
CREATE INDEX idx_timesheet_entries_is_overtime
  ON timesheet_entries(is_overtime) WHERE is_overtime = true;

-- 工数集計用
CREATE INDEX idx_timesheet_entries_project_hours
  ON timesheet_entries(project_id, work_date, hours)
  WHERE is_billable = true;
```

**インデックス数**: 10

---

#### timesheet_approvals

```sql
-- プライマリキー
CREATE INDEX idx_timesheet_approvals_id ON timesheet_approvals(id);

-- 外部キー
CREATE INDEX idx_timesheet_approvals_timesheet_id ON timesheet_approvals(timesheet_id);
CREATE INDEX idx_timesheet_approvals_approver_id ON timesheet_approvals(approver_id);

-- ステータス検索
CREATE INDEX idx_timesheet_approvals_status ON timesheet_approvals(approval_status);

-- 複合インデックス
CREATE INDEX idx_timesheet_approvals_timesheet_status
  ON timesheet_approvals(timesheet_id, approval_status);
CREATE INDEX idx_timesheet_approvals_approver_date
  ON timesheet_approvals(approver_id, approved_at DESC);

-- 承認日時検索
CREATE INDEX idx_timesheet_approvals_approved_at
  ON timesheet_approvals(approved_at DESC);
```

**インデックス数**: 7

---

**合計インデックス数**: 148

---

## ユニーク制約 {#unique-constraints}

### テーブル単位

```sql
-- resources
ALTER TABLE resources
  ADD CONSTRAINT uq_resources_user_id UNIQUE (user_id);

-- resource_allocations (期間重複チェックは制約ではなくトリガーで実装)

-- resource_utilization_history
ALTER TABLE resource_utilization_history
  ADD CONSTRAINT uq_resource_utilization_history_period
  UNIQUE (resource_id, period_year_month);

-- talents
ALTER TABLE talents
  ADD CONSTRAINT uq_talents_resource_id UNIQUE (resource_id);

-- talent_skills
ALTER TABLE talent_skills
  ADD CONSTRAINT uq_talent_skills_resource_skill
  UNIQUE (resource_id, skill_id);

-- skills
ALTER TABLE skills
  ADD CONSTRAINT uq_skills_name UNIQUE (name);

-- skill_categories
ALTER TABLE skill_categories
  ADD CONSTRAINT uq_skill_categories_name UNIQUE (name);

-- skill_prerequisites
ALTER TABLE skill_prerequisites
  ADD CONSTRAINT uq_skill_prerequisites_pair
  UNIQUE (skill_id, prerequisite_skill_id);

-- career_plans (active のみ、インデックスで実装済み)
-- idx_career_plans_unique_active

-- team_members (active のみ、インデックスで実装済み)
-- idx_team_members_unique_active

-- timesheets
ALTER TABLE timesheets
  ADD CONSTRAINT uq_timesheets_period
  UNIQUE (resource_id, period_start, period_end);
```

---

## CHECK制約 {#check-constraints}

### resources

```sql
ALTER TABLE resources
  ADD CONSTRAINT chk_resources_current_utilization
  CHECK (current_utilization >= 0.0 AND current_utilization <= 2.0);

ALTER TABLE resources
  ADD CONSTRAINT chk_resources_available_dates
  CHECK (available_to IS NULL OR available_to >= available_from);

ALTER TABLE resources
  ADD CONSTRAINT chk_resources_cost_per_hour
  CHECK (cost_per_hour IS NULL OR cost_per_hour >= 0);
```

### resource_allocations

```sql
ALTER TABLE resource_allocations
  ADD CONSTRAINT chk_resource_allocations_percentage
  CHECK (allocation_percentage > 0.0 AND allocation_percentage <= 1.0);

ALTER TABLE resource_allocations
  ADD CONSTRAINT chk_resource_allocations_dates
  CHECK (start_date < end_date);

ALTER TABLE resource_allocations
  ADD CONSTRAINT chk_resource_allocations_actual_hours
  CHECK (actual_hours >= 0);
```

### resource_utilization_history

```sql
ALTER TABLE resource_utilization_history
  ADD CONSTRAINT chk_resource_utilization_history_hours
  CHECK (
    total_hours_worked >= 0 AND
    billable_hours >= 0 AND
    non_billable_hours >= 0 AND
    total_hours_worked = billable_hours + non_billable_hours
  );

ALTER TABLE resource_utilization_history
  ADD CONSTRAINT chk_resource_utilization_history_rates
  CHECK (
    utilization_rate >= 0.0 AND utilization_rate <= 2.0 AND
    billable_rate >= 0.0 AND billable_rate <= 1.0
  );

ALTER TABLE resource_utilization_history
  ADD CONSTRAINT chk_resource_utilization_history_overtime
  CHECK (overtime_hours IS NULL OR overtime_hours >= 0);
```

### performance_records

```sql
ALTER TABLE performance_records
  ADD CONSTRAINT chk_performance_records_dates
  CHECK (period_start < period_end);

ALTER TABLE performance_records
  ADD CONSTRAINT chk_performance_records_overall_score
  CHECK (overall_score >= 1.0 AND overall_score <= 5.0);

ALTER TABLE performance_records
  ADD CONSTRAINT chk_performance_records_approved
  CHECK (
    (status = 'approved' AND approved_by IS NOT NULL AND approved_at IS NOT NULL)
    OR
    (status != 'approved' AND (approved_by IS NULL OR approved_at IS NULL))
  );
```

### talents

```sql
ALTER TABLE talents
  ADD CONSTRAINT chk_talents_potential_rating
  CHECK (potential_rating IS NULL OR (potential_rating >= 1.0 AND potential_rating <= 5.0));

ALTER TABLE talents
  ADD CONSTRAINT chk_talents_hire_promotion
  CHECK (
    last_promotion_date IS NULL OR
    hire_date IS NULL OR
    last_promotion_date >= hire_date
  );
```

### talent_skills

```sql
ALTER TABLE talent_skills
  ADD CONSTRAINT chk_talent_skills_level
  CHECK (level >= 1 AND level <= 5);

ALTER TABLE talent_skills
  ADD CONSTRAINT chk_talent_skills_verified
  CHECK (
    (verified_by IS NOT NULL AND verified_at IS NOT NULL)
    OR
    (verified_by IS NULL AND verified_at IS NULL)
  );
```

### skill_prerequisites

```sql
ALTER TABLE skill_prerequisites
  ADD CONSTRAINT chk_skill_prerequisites_required_level
  CHECK (required_level >= 1 AND required_level <= 5);

ALTER TABLE skill_prerequisites
  ADD CONSTRAINT chk_skill_prerequisites_no_self_reference
  CHECK (skill_id != prerequisite_skill_id);
```

### team_members

```sql
ALTER TABLE team_members
  ADD CONSTRAINT chk_team_members_allocation_rate
  CHECK (allocation_rate >= 0.0 AND allocation_rate <= 1.0);

ALTER TABLE team_members
  ADD CONSTRAINT chk_team_members_left_at
  CHECK (
    (status = 'active' AND left_at IS NULL)
    OR
    (status = 'inactive' AND left_at IS NOT NULL)
  );
```

### team_performance_history

```sql
ALTER TABLE team_performance_history
  ADD CONSTRAINT chk_team_performance_history_scores
  CHECK (
    (quality_score IS NULL OR (quality_score >= 1.0 AND quality_score <= 5.0)) AND
    (collaboration_score IS NULL OR (collaboration_score >= 1.0 AND collaboration_score <= 5.0)) AND
    (customer_satisfaction IS NULL OR (customer_satisfaction >= 1.0 AND customer_satisfaction <= 5.0))
  );

ALTER TABLE team_performance_history
  ADD CONSTRAINT chk_team_performance_history_delivery_rate
  CHECK (delivery_on_time_rate IS NULL OR (delivery_on_time_rate >= 0.0 AND delivery_on_time_rate <= 1.0));
```

### teams

```sql
ALTER TABLE teams
  ADD CONSTRAINT chk_teams_dates
  CHECK (end_date IS NULL OR end_date >= start_date);

ALTER TABLE teams
  ADD CONSTRAINT chk_teams_member_counts
  CHECK (member_count >= 0 AND leader_count >= 0 AND leader_count <= member_count);
```

### timesheets

```sql
ALTER TABLE timesheets
  ADD CONSTRAINT chk_timesheets_dates
  CHECK (period_start < period_end);

ALTER TABLE timesheets
  ADD CONSTRAINT chk_timesheets_hours
  CHECK (
    total_hours >= 0 AND
    billable_hours >= 0 AND
    billable_hours <= total_hours
  );

ALTER TABLE timesheets
  ADD CONSTRAINT chk_timesheets_submitted
  CHECK (
    (status IN ('submitted', 'approved', 'rejected') AND submitted_at IS NOT NULL)
    OR
    (status = 'draft' AND submitted_at IS NULL)
  );
```

### timesheet_entries

```sql
ALTER TABLE timesheet_entries
  ADD CONSTRAINT chk_timesheet_entries_hours
  CHECK (hours > 0 AND hours <= 24);
```

---

## 外部キー制約 {#foreign-keys}

### リソース管理グループ

```sql
-- resources
ALTER TABLE resources
  ADD CONSTRAINT fk_resources_user
  FOREIGN KEY (user_id) REFERENCES users(id); -- BC-003

-- resource_allocations
ALTER TABLE resource_allocations
  ADD CONSTRAINT fk_resource_allocations_resource
  FOREIGN KEY (resource_id) REFERENCES resources(id);

ALTER TABLE resource_allocations
  ADD CONSTRAINT fk_resource_allocations_project
  FOREIGN KEY (project_id) REFERENCES projects(id); -- BC-001

-- resource_utilization_history
ALTER TABLE resource_utilization_history
  ADD CONSTRAINT fk_resource_utilization_history_resource
  FOREIGN KEY (resource_id) REFERENCES resources(id);
```

### タレント管理グループ

```sql
-- talents
ALTER TABLE talents
  ADD CONSTRAINT fk_talents_resource
  FOREIGN KEY (resource_id) REFERENCES resources(id);

ALTER TABLE talents
  ADD CONSTRAINT fk_talents_manager
  FOREIGN KEY (manager_id) REFERENCES users(id); -- BC-003

-- performance_records
ALTER TABLE performance_records
  ADD CONSTRAINT fk_performance_records_talent
  FOREIGN KEY (talent_id) REFERENCES talents(id);

ALTER TABLE performance_records
  ADD CONSTRAINT fk_performance_records_reviewer
  FOREIGN KEY (reviewer_id) REFERENCES users(id); -- BC-003

ALTER TABLE performance_records
  ADD CONSTRAINT fk_performance_records_approved_by
  FOREIGN KEY (approved_by) REFERENCES users(id); -- BC-003

-- career_plans
ALTER TABLE career_plans
  ADD CONSTRAINT fk_career_plans_talent
  FOREIGN KEY (talent_id) REFERENCES talents(id);

ALTER TABLE career_plans
  ADD CONSTRAINT fk_career_plans_created_by
  FOREIGN KEY (created_by) REFERENCES users(id); -- BC-003

ALTER TABLE career_plans
  ADD CONSTRAINT fk_career_plans_reviewed_by
  FOREIGN KEY (reviewed_by) REFERENCES users(id); -- BC-003

-- talent_skills
ALTER TABLE talent_skills
  ADD CONSTRAINT fk_talent_skills_resource
  FOREIGN KEY (resource_id) REFERENCES resources(id);

ALTER TABLE talent_skills
  ADD CONSTRAINT fk_talent_skills_skill
  FOREIGN KEY (skill_id) REFERENCES skills(id);

ALTER TABLE talent_skills
  ADD CONSTRAINT fk_talent_skills_verified_by
  FOREIGN KEY (verified_by) REFERENCES users(id); -- BC-003
```

### スキル管理グループ

```sql
-- skills
ALTER TABLE skills
  ADD CONSTRAINT fk_skills_category
  FOREIGN KEY (category_id) REFERENCES skill_categories(id);

-- skill_categories
ALTER TABLE skill_categories
  ADD CONSTRAINT fk_skill_categories_parent
  FOREIGN KEY (parent_category_id) REFERENCES skill_categories(id);

-- skill_prerequisites
ALTER TABLE skill_prerequisites
  ADD CONSTRAINT fk_skill_prerequisites_skill
  FOREIGN KEY (skill_id) REFERENCES skills(id);

ALTER TABLE skill_prerequisites
  ADD CONSTRAINT fk_skill_prerequisites_prerequisite
  FOREIGN KEY (prerequisite_skill_id) REFERENCES skills(id);
```

### チーム管理グループ

```sql
-- teams
ALTER TABLE teams
  ADD CONSTRAINT fk_teams_project
  FOREIGN KEY (project_id) REFERENCES projects(id); -- BC-001

-- team_members
ALTER TABLE team_members
  ADD CONSTRAINT fk_team_members_team
  FOREIGN KEY (team_id) REFERENCES teams(id);

ALTER TABLE team_members
  ADD CONSTRAINT fk_team_members_resource
  FOREIGN KEY (resource_id) REFERENCES resources(id);

-- team_performance_history
ALTER TABLE team_performance_history
  ADD CONSTRAINT fk_team_performance_history_team
  FOREIGN KEY (team_id) REFERENCES teams(id);

ALTER TABLE team_performance_history
  ADD CONSTRAINT fk_team_performance_history_recorded_by
  FOREIGN KEY (recorded_by) REFERENCES users(id); -- BC-003
```

### タイムシート管理グループ

```sql
-- timesheets
ALTER TABLE timesheets
  ADD CONSTRAINT fk_timesheets_resource
  FOREIGN KEY (resource_id) REFERENCES resources(id);

-- timesheet_entries
ALTER TABLE timesheet_entries
  ADD CONSTRAINT fk_timesheet_entries_timesheet
  FOREIGN KEY (timesheet_id) REFERENCES timesheets(id);

ALTER TABLE timesheet_entries
  ADD CONSTRAINT fk_timesheet_entries_project
  FOREIGN KEY (project_id) REFERENCES projects(id); -- BC-001

-- timesheet_approvals
ALTER TABLE timesheet_approvals
  ADD CONSTRAINT fk_timesheet_approvals_timesheet
  FOREIGN KEY (timesheet_id) REFERENCES timesheets(id);

ALTER TABLE timesheet_approvals
  ADD CONSTRAINT fk_timesheet_approvals_approver
  FOREIGN KEY (approver_id) REFERENCES users(id); -- BC-003
```

---

## トリガー関数 {#triggers}

### 1. リソース配分制約チェック

#### 配分率制約チェック（最大200%）

```sql
CREATE OR REPLACE FUNCTION check_resource_allocation_limit()
RETURNS TRIGGER AS $$
DECLARE
  v_total_allocation DECIMAL(4,2);
  v_resource_name VARCHAR(200);
BEGIN
  -- 同一期間の配分率合計を計算
  SELECT COALESCE(SUM(allocation_percentage), 0.0)
  INTO v_total_allocation
  FROM resource_allocations
  WHERE resource_id = NEW.resource_id
    AND status = 'active'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND (start_date, end_date) OVERLAPS (NEW.start_date, NEW.end_date);

  -- 新規配分を含めた合計が200%を超える場合エラー
  IF v_total_allocation + NEW.allocation_percentage > 2.0 THEN
    SELECT u.name INTO v_resource_name
    FROM resources r
    JOIN users u ON r.user_id = u.id
    WHERE r.id = NEW.resource_id;

    RAISE EXCEPTION 'BC005_ERR_003: Allocation exceeds limit (200%%). Resource: %, Current: %, New: %, Total: %',
      v_resource_name,
      v_total_allocation,
      NEW.allocation_percentage,
      v_total_allocation + NEW.allocation_percentage;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resource_allocations_before_insert
BEFORE INSERT ON resource_allocations
FOR EACH ROW
EXECUTE FUNCTION check_resource_allocation_limit();

CREATE TRIGGER trg_resource_allocations_before_update
BEFORE UPDATE ON resource_allocations
FOR EACH ROW
WHEN (
  OLD.resource_id IS DISTINCT FROM NEW.resource_id OR
  OLD.allocation_percentage IS DISTINCT FROM NEW.allocation_percentage OR
  OLD.start_date IS DISTINCT FROM NEW.start_date OR
  OLD.end_date IS DISTINCT FROM NEW.end_date OR
  OLD.status IS DISTINCT FROM NEW.status
)
EXECUTE FUNCTION check_resource_allocation_limit();
```

---

### 2. リソース稼働率自動更新

#### 配分変更時の稼働率更新

```sql
CREATE OR REPLACE FUNCTION update_resource_utilization()
RETURNS TRIGGER AS $$
DECLARE
  v_resource_id UUID;
  v_new_utilization DECIMAL(4,2);
BEGIN
  -- リソースIDを特定
  IF TG_OP = 'DELETE' THEN
    v_resource_id := OLD.resource_id;
  ELSE
    v_resource_id := NEW.resource_id;
  END IF;

  -- 現在の有効配分率を合計
  SELECT COALESCE(SUM(allocation_percentage), 0.0)
  INTO v_new_utilization
  FROM resource_allocations
  WHERE resource_id = v_resource_id
    AND status = 'active'
    AND CURRENT_DATE BETWEEN start_date AND end_date;

  -- resources.current_utilization を更新
  UPDATE resources
  SET current_utilization = v_new_utilization,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = v_resource_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resource_allocations_after_insert
AFTER INSERT ON resource_allocations
FOR EACH ROW
EXECUTE FUNCTION update_resource_utilization();

CREATE TRIGGER trg_resource_allocations_after_update
AFTER UPDATE ON resource_allocations
FOR EACH ROW
WHEN (
  OLD.allocation_percentage IS DISTINCT FROM NEW.allocation_percentage OR
  OLD.status IS DISTINCT FROM NEW.status OR
  OLD.start_date IS DISTINCT FROM NEW.start_date OR
  OLD.end_date IS DISTINCT FROM NEW.end_date
)
EXECUTE FUNCTION update_resource_utilization();

CREATE TRIGGER trg_resource_allocations_after_delete
AFTER DELETE ON resource_allocations
FOR EACH ROW
EXECUTE FUNCTION update_resource_utilization();
```

---

### 3. タイムシート日次工数制約チェック

#### 1日24時間制約チェック

```sql
CREATE OR REPLACE FUNCTION check_timesheet_daily_hours_limit()
RETURNS TRIGGER AS $$
DECLARE
  v_timesheet_id UUID;
  v_work_date DATE;
  v_total_hours DECIMAL(10,2);
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_timesheet_id := OLD.timesheet_id;
    v_work_date := OLD.work_date;
  ELSE
    v_timesheet_id := NEW.timesheet_id;
    v_work_date := NEW.work_date;
  END IF;

  -- 同一日の合計工数を計算
  SELECT COALESCE(SUM(hours), 0.0)
  INTO v_total_hours
  FROM timesheet_entries
  WHERE timesheet_id = v_timesheet_id
    AND work_date = v_work_date
    AND (TG_OP = 'UPDATE' AND id != NEW.id OR TG_OP != 'UPDATE');

  -- 新規・更新の場合、新しい工数を加算
  IF TG_OP != 'DELETE' THEN
    v_total_hours := v_total_hours + NEW.hours;
  END IF;

  -- 24時間を超える場合エラー
  IF v_total_hours > 24.0 THEN
    RAISE EXCEPTION 'BC005_ERR_402: Total hours exceed daily limit (24 hours). Date: %, Total: %',
      v_work_date,
      v_total_hours;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_timesheet_entries_before_insert
BEFORE INSERT ON timesheet_entries
FOR EACH ROW
EXECUTE FUNCTION check_timesheet_daily_hours_limit();

CREATE TRIGGER trg_timesheet_entries_before_update
BEFORE UPDATE ON timesheet_entries
FOR EACH ROW
WHEN (OLD.hours IS DISTINCT FROM NEW.hours OR OLD.work_date IS DISTINCT FROM NEW.work_date)
EXECUTE FUNCTION check_timesheet_daily_hours_limit();
```

---

### 4. タイムシート合計時間自動更新

#### タイムシート合計時間の集計

```sql
CREATE OR REPLACE FUNCTION update_timesheet_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_timesheet_id UUID;
  v_total_hours DECIMAL(10,2);
  v_billable_hours DECIMAL(10,2);
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_timesheet_id := OLD.timesheet_id;
  ELSE
    v_timesheet_id := NEW.timesheet_id;
  END IF;

  -- 合計時間と請求可能時間を集計
  SELECT
    COALESCE(SUM(hours), 0.0),
    COALESCE(SUM(hours) FILTER (WHERE is_billable = true), 0.0)
  INTO v_total_hours, v_billable_hours
  FROM timesheet_entries
  WHERE timesheet_id = v_timesheet_id;

  -- timesheets テーブルを更新
  UPDATE timesheets
  SET total_hours = v_total_hours,
      billable_hours = v_billable_hours,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = v_timesheet_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_timesheet_entries_after_insert
AFTER INSERT ON timesheet_entries
FOR EACH ROW
EXECUTE FUNCTION update_timesheet_totals();

CREATE TRIGGER trg_timesheet_entries_after_update
AFTER UPDATE ON timesheet_entries
FOR EACH ROW
WHEN (OLD.hours IS DISTINCT FROM NEW.hours OR OLD.is_billable IS DISTINCT FROM NEW.is_billable)
EXECUTE FUNCTION update_timesheet_totals();

CREATE TRIGGER trg_timesheet_entries_after_delete
AFTER DELETE ON timesheet_entries
FOR EACH ROW
EXECUTE FUNCTION update_timesheet_totals();
```

---

### 5. スキルレベルアップ制約チェック

#### レベルアップ制約（1段階ずつ、前提条件チェック）

```sql
CREATE OR REPLACE FUNCTION check_skill_level_up()
RETURNS TRIGGER AS $$
DECLARE
  v_prerequisite RECORD;
  v_current_level INTEGER;
  v_skill_name VARCHAR(100);
  v_prerequisite_name VARCHAR(100);
BEGIN
  -- UPDATE時のみチェック
  IF TG_OP = 'UPDATE' AND OLD.level != NEW.level THEN
    -- レベルは1段階ずつのみ
    IF NEW.level != OLD.level + 1 THEN
      RAISE EXCEPTION 'BC005_ERR_202: Cannot skip skill levels. Current: %, Requested: %',
        OLD.level,
        NEW.level;
    END IF;

    -- 前提条件チェック
    FOR v_prerequisite IN
      SELECT
        sp.prerequisite_skill_id,
        sp.required_level,
        sp.is_mandatory,
        s.name AS prerequisite_name
      FROM skill_prerequisites sp
      JOIN skills s ON sp.prerequisite_skill_id = s.id
      WHERE sp.skill_id = NEW.skill_id
        AND sp.is_mandatory = true
    LOOP
      -- 前提スキルの現在レベルを取得
      SELECT level INTO v_current_level
      FROM talent_skills
      WHERE resource_id = NEW.resource_id
        AND skill_id = v_prerequisite.prerequisite_skill_id;

      -- 前提条件を満たさない場合エラー
      IF v_current_level IS NULL OR v_current_level < v_prerequisite.required_level THEN
        SELECT name INTO v_skill_name FROM skills WHERE id = NEW.skill_id;

        RAISE EXCEPTION 'BC005_ERR_203: Prerequisite skills not met. Skill: %, Requires: % (Level %), Current: %',
          v_skill_name,
          v_prerequisite.prerequisite_name,
          v_prerequisite.required_level,
          COALESCE(v_current_level, 0);
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_talent_skills_before_update
BEFORE UPDATE ON talent_skills
FOR EACH ROW
WHEN (OLD.level IS DISTINCT FROM NEW.level)
EXECUTE FUNCTION check_skill_level_up();
```

---

### 6. チームメンバー数自動更新

#### チームメンバー・リーダー数の集計

```sql
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER AS $$
DECLARE
  v_team_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_team_id := OLD.team_id;
  ELSE
    v_team_id := NEW.team_id;
  END IF;

  -- メンバー数とリーダー数を更新
  UPDATE teams
  SET
    member_count = (
      SELECT COUNT(*)
      FROM team_members
      WHERE team_id = v_team_id AND status = 'active'
    ),
    leader_count = (
      SELECT COUNT(*)
      FROM team_members
      WHERE team_id = v_team_id AND status = 'active' AND is_leader = true
    ),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = v_team_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_team_members_after_insert
AFTER INSERT ON team_members
FOR EACH ROW
EXECUTE FUNCTION update_team_member_count();

CREATE TRIGGER trg_team_members_after_update
AFTER UPDATE ON team_members
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status OR OLD.is_leader IS DISTINCT FROM NEW.is_leader)
EXECUTE FUNCTION update_team_member_count();

CREATE TRIGGER trg_team_members_after_delete
AFTER DELETE ON team_members
FOR EACH ROW
EXECUTE FUNCTION update_team_member_count();
```

---

### 7. パフォーマンス評価承認時のポテンシャル評価更新

#### 過去3回の評価平均でポテンシャル評価を更新

```sql
CREATE OR REPLACE FUNCTION update_talent_potential_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_avg_score DECIMAL(3,2);
BEGIN
  -- 承認済みステータスに変更された場合
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- 過去3回の承認済み評価の平均スコアを計算
    SELECT AVG(overall_score)::DECIMAL(3,2)
    INTO v_avg_score
    FROM (
      SELECT overall_score
      FROM performance_records
      WHERE talent_id = NEW.talent_id
        AND status = 'approved'
      ORDER BY period_end DESC
      LIMIT 3
    ) recent_evals;

    -- talents.potential_rating を更新
    IF v_avg_score IS NOT NULL THEN
      UPDATE talents
      SET potential_rating = v_avg_score,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = NEW.talent_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_performance_records_after_update
AFTER UPDATE ON performance_records
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'approved')
EXECUTE FUNCTION update_talent_potential_rating();
```

---

### 8. タイムシート承認時の稼働率履歴更新

#### 承認時に月次稼働率履歴を自動記録

```sql
CREATE OR REPLACE FUNCTION record_resource_utilization_on_approval()
RETURNS TRIGGER AS $$
DECLARE
  v_period_month CHAR(7);
  v_total_hours DECIMAL(10,2);
  v_billable_hours DECIMAL(10,2);
  v_non_billable_hours DECIMAL(10,2);
  v_utilization_rate DECIMAL(5,4);
  v_billable_rate DECIMAL(5,4);
  v_standard_hours DECIMAL(10,2) := 160.0; -- 標準月間労働時間
BEGIN
  -- 承認済みステータスに変更された場合
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- 期間の年月を取得
    v_period_month := TO_CHAR(NEW.period_start, 'YYYY-MM');

    -- 工数を集計
    SELECT
      COALESCE(SUM(hours), 0.0),
      COALESCE(SUM(hours) FILTER (WHERE is_billable = true), 0.0),
      COALESCE(SUM(hours) FILTER (WHERE is_billable = false), 0.0)
    INTO v_total_hours, v_billable_hours, v_non_billable_hours
    FROM timesheet_entries
    WHERE timesheet_id = NEW.id;

    -- 稼働率を計算
    IF v_total_hours > 0 THEN
      v_utilization_rate := v_total_hours / v_standard_hours;
      v_billable_rate := v_billable_hours / v_total_hours;
    ELSE
      v_utilization_rate := 0.0;
      v_billable_rate := 0.0;
    END IF;

    -- resource_utilization_history に INSERT or UPDATE
    INSERT INTO resource_utilization_history (
      resource_id,
      period_year_month,
      total_hours_worked,
      billable_hours,
      non_billable_hours,
      utilization_rate,
      billable_rate
    )
    VALUES (
      NEW.resource_id,
      v_period_month,
      v_total_hours,
      v_billable_hours,
      v_non_billable_hours,
      v_utilization_rate,
      v_billable_rate
    )
    ON CONFLICT (resource_id, period_year_month)
    DO UPDATE SET
      total_hours_worked = resource_utilization_history.total_hours_worked + EXCLUDED.total_hours_worked,
      billable_hours = resource_utilization_history.billable_hours + EXCLUDED.billable_hours,
      non_billable_hours = resource_utilization_history.non_billable_hours + EXCLUDED.non_billable_hours,
      utilization_rate = (resource_utilization_history.total_hours_worked + EXCLUDED.total_hours_worked) / v_standard_hours,
      billable_rate = CASE
        WHEN (resource_utilization_history.total_hours_worked + EXCLUDED.total_hours_worked) > 0
        THEN (resource_utilization_history.billable_hours + EXCLUDED.billable_hours) /
             (resource_utilization_history.total_hours_worked + EXCLUDED.total_hours_worked)
        ELSE 0.0
      END,
      recorded_at = CURRENT_TIMESTAMP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_timesheets_after_update_approved
AFTER UPDATE ON timesheets
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'approved')
EXECUTE FUNCTION record_resource_utilization_on_approval();
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-005 データ層詳細化
