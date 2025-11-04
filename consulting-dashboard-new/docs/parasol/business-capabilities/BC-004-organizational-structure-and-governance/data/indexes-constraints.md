# BC-004: インデックスと制約

**ドキュメント**: データ層 - インデックスと制約
**最終更新**: 2025-11-03

このドキュメントでは、BC-004の全インデックス、制約、トリガー定義を記載します。

---

## 目次

1. [インデックス一覧](#indexes)
2. [ユニーク制約](#unique-constraints)
3. [CHECK制約](#check-constraints)
4. [外部キー制約](#foreign-keys)
5. [トリガー関数](#triggers)

---

## インデックス一覧 {#indexes}

### 組織管理グループ

#### organizations

```sql
-- プライマリキー
CREATE INDEX idx_organizations_id ON organizations(id);

-- ユニーク制約用
CREATE UNIQUE INDEX idx_organizations_code ON organizations(code) WHERE deleted_at IS NULL;

-- 検索用
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organizations_created_at ON organizations(created_at DESC);

-- 論理削除考慮
CREATE INDEX idx_organizations_active ON organizations(status) WHERE deleted_at IS NULL;
```

**インデックス数**: 6

---

#### organization_units

```sql
-- プライマリキー
CREATE INDEX idx_organization_units_id ON organization_units(id);

-- 外部キー
CREATE INDEX idx_organization_units_org_id ON organization_units(organization_id);
CREATE INDEX idx_organization_units_parent_id ON organization_units(parent_unit_id);

-- 階層検索
CREATE INDEX idx_organization_units_hierarchy_level ON organization_units(hierarchy_level);
CREATE INDEX idx_organization_units_path ON organization_units USING GIN(to_tsvector('simple', path));

-- 複合インデックス
CREATE INDEX idx_organization_units_org_status ON organization_units(organization_id, status);
CREATE INDEX idx_organization_units_org_hierarchy ON organization_units(organization_id, hierarchy_level);

-- 組織内名前検索
CREATE INDEX idx_organization_units_name_search
  ON organization_units(organization_id, name) WHERE deleted_at IS NULL;

-- 論理削除考慮
CREATE INDEX idx_organization_units_active
  ON organization_units(organization_id, status) WHERE deleted_at IS NULL;
```

**インデックス数**: 9

---

#### organization_hierarchies

```sql
-- プライマリキー
CREATE INDEX idx_organization_hierarchies_id ON organization_hierarchies(id);

-- ユニーク制約用
CREATE UNIQUE INDEX idx_organization_hierarchies_unique
  ON organization_hierarchies(ancestor_unit_id, descendant_unit_id);

-- 祖先検索（子から親へ）
CREATE INDEX idx_organization_hierarchies_descendant
  ON organization_hierarchies(descendant_unit_id, depth);

-- 子孫検索（親から子へ）
CREATE INDEX idx_organization_hierarchies_ancestor
  ON organization_hierarchies(ancestor_unit_id, depth);

-- 複合検索
CREATE INDEX idx_organization_hierarchies_ancestor_desc_depth
  ON organization_hierarchies(ancestor_unit_id, descendant_unit_id, depth);

-- 深度範囲検索
CREATE INDEX idx_organization_hierarchies_depth ON organization_hierarchies(depth);
```

**インデックス数**: 6

---

#### organization_members

```sql
-- プライマリキー
CREATE INDEX idx_organization_members_id ON organization_members(id);

-- 外部キー
CREATE INDEX idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_organization_members_unit_id ON organization_members(unit_id);
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);

-- 複合インデックス
CREATE INDEX idx_organization_members_org_unit
  ON organization_members(organization_id, unit_id, status);

CREATE INDEX idx_organization_members_user_status
  ON organization_members(user_id, status);

-- ユニーク制約用（active のみ）
CREATE UNIQUE INDEX idx_organization_members_unique_active
  ON organization_members(organization_id, unit_id, user_id)
  WHERE status = 'active';

-- 日付範囲検索
CREATE INDEX idx_organization_members_joined_at ON organization_members(joined_at DESC);
CREATE INDEX idx_organization_members_left_at ON organization_members(left_at DESC);
```

**インデックス数**: 9

---

### チーム管理グループ

#### teams

```sql
-- プライマリキー
CREATE INDEX idx_teams_id ON teams(id);

-- 外部キー
CREATE INDEX idx_teams_org_id ON teams(organization_id);
CREATE INDEX idx_teams_unit_id ON teams(unit_id);

-- 検索用
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_teams_team_type ON teams(team_type);
CREATE INDEX idx_teams_created_at ON teams(created_at DESC);

-- 複合インデックス
CREATE INDEX idx_teams_org_status ON teams(organization_id, status);
CREATE INDEX idx_teams_org_unit_status ON teams(organization_id, unit_id, status);
CREATE INDEX idx_teams_type_status ON teams(team_type, status);

-- ユニーク制約用（active のみ）
CREATE UNIQUE INDEX idx_teams_unique_name
  ON teams(organization_id, name)
  WHERE status = 'active' AND deleted_at IS NULL;

-- 日付範囲検索
CREATE INDEX idx_teams_start_date ON teams(start_date);
CREATE INDEX idx_teams_end_date ON teams(end_date);
```

**インデックス数**: 12

---

#### team_members

```sql
-- プライマリキー
CREATE INDEX idx_team_members_id ON team_members(id);

-- 外部キー
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- 複合インデックス
CREATE INDEX idx_team_members_team_status ON team_members(team_id, status);
CREATE INDEX idx_team_members_user_status ON team_members(user_id, status);

-- ユニーク制約用（active のみ）
CREATE UNIQUE INDEX idx_team_members_unique_active
  ON team_members(team_id, user_id)
  WHERE status = 'active';

-- アロケーション検索
CREATE INDEX idx_team_members_allocation_rate
  ON team_members(user_id, allocation_rate)
  WHERE status = 'active';

-- 日付範囲検索
CREATE INDEX idx_team_members_joined_at ON team_members(joined_at DESC);
CREATE INDEX idx_team_members_start_end_date
  ON team_members(start_date, end_date)
  WHERE status = 'active';
```

**インデックス数**: 9

---

#### team_leaders

```sql
-- プライマリキー
CREATE INDEX idx_team_leaders_id ON team_leaders(id);

-- 外部キー
CREATE INDEX idx_team_leaders_team_id ON team_leaders(team_id);
CREATE INDEX idx_team_leaders_member_id ON team_leaders(member_id);
CREATE INDEX idx_team_leaders_user_id ON team_leaders(user_id);

-- 複合インデックス
CREATE INDEX idx_team_leaders_team_status ON team_leaders(team_id, status);

-- ユニーク制約用（active のみ）
CREATE UNIQUE INDEX idx_team_leaders_unique_active
  ON team_leaders(team_id, member_id)
  WHERE status = 'active';

-- 日付検索
CREATE INDEX idx_team_leaders_assigned_at ON team_leaders(assigned_at DESC);
```

**インデックス数**: 7

---

### ガバナンス管理グループ

#### governance_policies

```sql
-- プライマリキー
CREATE INDEX idx_governance_policies_id ON governance_policies(id);

-- 外部キー
CREATE INDEX idx_governance_policies_org_id ON governance_policies(organization_id);

-- 検索用
CREATE INDEX idx_governance_policies_status ON governance_policies(status);
CREATE INDEX idx_governance_policies_type ON governance_policies(policy_type);
CREATE INDEX idx_governance_policies_priority ON governance_policies(priority DESC);

-- 複合インデックス
CREATE INDEX idx_governance_policies_org_status
  ON governance_policies(organization_id, status);
CREATE INDEX idx_governance_policies_org_type_status
  ON governance_policies(organization_id, policy_type, status);

-- ユニーク制約用（active のみ）
CREATE UNIQUE INDEX idx_governance_policies_unique_name
  ON governance_policies(organization_id, name)
  WHERE status = 'active' AND deleted_at IS NULL;

-- 有効期間検索
CREATE INDEX idx_governance_policies_effective
  ON governance_policies(effective_from, effective_until, status);
```

**インデックス数**: 9

---

#### governance_rules

```sql
-- プライマリキー
CREATE INDEX idx_governance_rules_id ON governance_rules(id);

-- 外部キー
CREATE INDEX idx_governance_rules_policy_id ON governance_rules(policy_id);

-- 検索用
CREATE INDEX idx_governance_rules_status ON governance_rules(status);
CREATE INDEX idx_governance_rules_severity ON governance_rules(severity);

-- 複合インデックス
CREATE INDEX idx_governance_rules_policy_status
  ON governance_rules(policy_id, status);
```

**インデックス数**: 5

---

#### policy_scopes

```sql
-- プライマリキー
CREATE INDEX idx_policy_scopes_id ON policy_scopes(id);

-- 外部キー
CREATE INDEX idx_policy_scopes_policy_id ON policy_scopes(policy_id);

-- 検索用
CREATE INDEX idx_policy_scopes_target ON policy_scopes(target_type, target_id);
CREATE INDEX idx_policy_scopes_status ON policy_scopes(status);

-- 複合インデックス
CREATE INDEX idx_policy_scopes_policy_status
  ON policy_scopes(policy_id, status);

-- ユニーク制約用
CREATE UNIQUE INDEX idx_policy_scopes_unique
  ON policy_scopes(policy_id, target_type, target_id);
```

**インデックス数**: 6

---

#### policy_violations

```sql
-- プライマリキー
CREATE INDEX idx_policy_violations_id ON policy_violations(id);

-- 外部キー
CREATE INDEX idx_policy_violations_policy_id ON policy_violations(policy_id);
CREATE INDEX idx_policy_violations_rule_id ON policy_violations(rule_id);

-- 検索用
CREATE INDEX idx_policy_violations_target ON policy_violations(target_type, target_id);
CREATE INDEX idx_policy_violations_status ON policy_violations(status);
CREATE INDEX idx_policy_violations_severity ON policy_violations(severity);

-- 複合インデックス
CREATE INDEX idx_policy_violations_policy_status
  ON policy_violations(policy_id, status);
CREATE INDEX idx_policy_violations_target_status
  ON policy_violations(target_type, target_id, status);

-- 日付検索
CREATE INDEX idx_policy_violations_detected_at
  ON policy_violations(detected_at DESC);
CREATE INDEX idx_policy_violations_resolved_at
  ON policy_violations(resolved_at DESC);

-- JSONB検索
CREATE INDEX idx_policy_violations_context
  ON policy_violations USING GIN(context);
```

**インデックス数**: 11

---

**合計インデックス数**: 89

---

## ユニーク制約 {#unique-constraints}

### テーブル単位

```sql
-- organizations
ALTER TABLE organizations
  ADD CONSTRAINT uq_organizations_code UNIQUE (code);

-- organization_hierarchies
ALTER TABLE organization_hierarchies
  ADD CONSTRAINT uq_organization_hierarchies_pair
  UNIQUE (ancestor_unit_id, descendant_unit_id);

-- organization_members (active のみ、インデックスで実装済み)
-- idx_organization_members_unique_active

-- teams (active のみ、インデックスで実装済み)
-- idx_teams_unique_name

-- team_members (active のみ、インデックスで実装済み)
-- idx_team_members_unique_active

-- team_leaders (active のみ、インデックスで実装済み)
-- idx_team_leaders_unique_active

-- governance_policies (active のみ、インデックスで実装済み)
-- idx_governance_policies_unique_name

-- policy_scopes
ALTER TABLE policy_scopes
  ADD CONSTRAINT uq_policy_scopes_target
  UNIQUE (policy_id, target_type, target_id);
```

---

## CHECK制約 {#check-constraints}

### organization_units

```sql
ALTER TABLE organization_units
  ADD CONSTRAINT chk_organization_units_hierarchy_level
  CHECK (hierarchy_level >= 0 AND hierarchy_level <= 10);

ALTER TABLE organization_units
  ADD CONSTRAINT chk_organization_units_root_parent
  CHECK (
    (hierarchy_level = 0 AND parent_unit_id IS NULL)
    OR
    (hierarchy_level > 0 AND parent_unit_id IS NOT NULL)
  );
```

### organization_hierarchies

```sql
ALTER TABLE organization_hierarchies
  ADD CONSTRAINT chk_organization_hierarchies_depth
  CHECK (depth >= 0 AND depth <= 10);

ALTER TABLE organization_hierarchies
  ADD CONSTRAINT chk_organization_hierarchies_self_reference
  CHECK (
    (depth = 0 AND ancestor_unit_id = descendant_unit_id)
    OR
    (depth > 0 AND ancestor_unit_id != descendant_unit_id)
  );
```

### team_members

```sql
ALTER TABLE team_members
  ADD CONSTRAINT chk_team_members_allocation_rate
  CHECK (allocation_rate >= 0.0 AND allocation_rate <= 1.0);

ALTER TABLE team_members
  ADD CONSTRAINT chk_team_members_dates
  CHECK (end_date IS NULL OR end_date >= start_date);

ALTER TABLE team_members
  ADD CONSTRAINT chk_team_members_left_at
  CHECK (
    (status = 'active' AND left_at IS NULL)
    OR
    (status = 'inactive' AND left_at IS NOT NULL)
  );
```

### teams

```sql
ALTER TABLE teams
  ADD CONSTRAINT chk_teams_dates
  CHECK (end_date IS NULL OR end_date >= start_date);
```

### governance_policies

```sql
ALTER TABLE governance_policies
  ADD CONSTRAINT chk_governance_policies_priority
  CHECK (priority >= 0 AND priority <= 1000);

ALTER TABLE governance_policies
  ADD CONSTRAINT chk_governance_policies_dates
  CHECK (effective_until IS NULL OR effective_until >= effective_from);
```

### policy_violations

```sql
ALTER TABLE policy_violations
  ADD CONSTRAINT chk_policy_violations_resolved
  CHECK (
    (status = 'active' AND resolved_at IS NULL AND resolved_by IS NULL)
    OR
    (status != 'active' AND resolved_at IS NOT NULL)
  );
```

---

## 外部キー制約 {#foreign-keys}

### 組織管理グループ

```sql
-- organization_units
ALTER TABLE organization_units
  ADD CONSTRAINT fk_organization_units_organization
  FOREIGN KEY (organization_id) REFERENCES organizations(id);

ALTER TABLE organization_units
  ADD CONSTRAINT fk_organization_units_parent
  FOREIGN KEY (parent_unit_id) REFERENCES organization_units(id);

-- organization_hierarchies
ALTER TABLE organization_hierarchies
  ADD CONSTRAINT fk_organization_hierarchies_ancestor
  FOREIGN KEY (ancestor_unit_id) REFERENCES organization_units(id);

ALTER TABLE organization_hierarchies
  ADD CONSTRAINT fk_organization_hierarchies_descendant
  FOREIGN KEY (descendant_unit_id) REFERENCES organization_units(id);

-- organization_members
ALTER TABLE organization_members
  ADD CONSTRAINT fk_organization_members_organization
  FOREIGN KEY (organization_id) REFERENCES organizations(id);

ALTER TABLE organization_members
  ADD CONSTRAINT fk_organization_members_unit
  FOREIGN KEY (unit_id) REFERENCES organization_units(id);

ALTER TABLE organization_members
  ADD CONSTRAINT fk_organization_members_user
  FOREIGN KEY (user_id) REFERENCES users(id); -- BC-003
```

### チーム管理グループ

```sql
-- teams
ALTER TABLE teams
  ADD CONSTRAINT fk_teams_organization
  FOREIGN KEY (organization_id) REFERENCES organizations(id);

ALTER TABLE teams
  ADD CONSTRAINT fk_teams_unit
  FOREIGN KEY (unit_id) REFERENCES organization_units(id);

-- team_members
ALTER TABLE team_members
  ADD CONSTRAINT fk_team_members_team
  FOREIGN KEY (team_id) REFERENCES teams(id);

ALTER TABLE team_members
  ADD CONSTRAINT fk_team_members_user
  FOREIGN KEY (user_id) REFERENCES users(id); -- BC-003

-- team_leaders
ALTER TABLE team_leaders
  ADD CONSTRAINT fk_team_leaders_team
  FOREIGN KEY (team_id) REFERENCES teams(id);

ALTER TABLE team_leaders
  ADD CONSTRAINT fk_team_leaders_member
  FOREIGN KEY (member_id) REFERENCES team_members(id);

ALTER TABLE team_leaders
  ADD CONSTRAINT fk_team_leaders_user
  FOREIGN KEY (user_id) REFERENCES users(id); -- BC-003
```

### ガバナンス管理グループ

```sql
-- governance_policies
ALTER TABLE governance_policies
  ADD CONSTRAINT fk_governance_policies_organization
  FOREIGN KEY (organization_id) REFERENCES organizations(id);

-- governance_rules
ALTER TABLE governance_rules
  ADD CONSTRAINT fk_governance_rules_policy
  FOREIGN KEY (policy_id) REFERENCES governance_policies(id);

-- policy_scopes
ALTER TABLE policy_scopes
  ADD CONSTRAINT fk_policy_scopes_policy
  FOREIGN KEY (policy_id) REFERENCES governance_policies(id);

-- policy_violations
ALTER TABLE policy_violations
  ADD CONSTRAINT fk_policy_violations_policy
  FOREIGN KEY (policy_id) REFERENCES governance_policies(id);

ALTER TABLE policy_violations
  ADD CONSTRAINT fk_policy_violations_rule
  FOREIGN KEY (rule_id) REFERENCES governance_rules(id);

ALTER TABLE policy_violations
  ADD CONSTRAINT fk_policy_violations_resolved_by
  FOREIGN KEY (resolved_by) REFERENCES users(id); -- BC-003
```

---

## トリガー関数 {#triggers}

### 1. 組織単位階層管理

#### 組織単位追加時の階層構築

```sql
CREATE OR REPLACE FUNCTION build_organization_hierarchy()
RETURNS TRIGGER AS $$
BEGIN
  -- 自己参照挿入
  INSERT INTO organization_hierarchies (ancestor_unit_id, descendant_unit_id, depth)
  VALUES (NEW.id, NEW.id, 0);

  -- 親単位が存在する場合、親の全祖先との関係を挿入
  IF NEW.parent_unit_id IS NOT NULL THEN
    INSERT INTO organization_hierarchies (ancestor_unit_id, descendant_unit_id, depth, path)
    SELECT
      h.ancestor_unit_id,
      NEW.id,
      h.depth + 1,
      h.path || '/' || NEW.name
    FROM organization_hierarchies h
    WHERE h.descendant_unit_id = NEW.parent_unit_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organization_units_after_insert
AFTER INSERT ON organization_units
FOR EACH ROW
EXECUTE FUNCTION build_organization_hierarchy();
```

#### 組織再編時の階層再構築

```sql
CREATE OR REPLACE FUNCTION rebuild_organization_hierarchy()
RETURNS TRIGGER AS $$
BEGIN
  -- 親単位が変更された場合
  IF OLD.parent_unit_id IS DISTINCT FROM NEW.parent_unit_id THEN
    -- 循環参照チェック
    IF EXISTS (
      SELECT 1 FROM organization_hierarchies
      WHERE ancestor_unit_id = NEW.id
        AND descendant_unit_id = NEW.parent_unit_id
    ) THEN
      RAISE EXCEPTION 'Circular reference detected: unit % cannot be parent of its ancestor', NEW.parent_unit_id;
    END IF;

    -- 最大階層深度チェック
    IF (
      SELECT MAX(depth) FROM organization_hierarchies
      WHERE descendant_unit_id = NEW.id
    ) + (
      SELECT hierarchy_level FROM organization_units
      WHERE id = NEW.parent_unit_id
    ) + 1 > 10 THEN
      RAISE EXCEPTION 'Maximum hierarchy depth (10) exceeded';
    END IF;

    -- 古い階層関係削除（自己参照以外）
    DELETE FROM organization_hierarchies
    WHERE descendant_unit_id IN (
      SELECT descendant_unit_id
      FROM organization_hierarchies
      WHERE ancestor_unit_id = NEW.id
    )
    AND depth > 0;

    -- 新しい階層関係挿入
    INSERT INTO organization_hierarchies (ancestor_unit_id, descendant_unit_id, depth)
    SELECT p.ancestor_unit_id, c.descendant_unit_id, p.depth + c.depth + 1
    FROM organization_hierarchies p
    CROSS JOIN organization_hierarchies c
    WHERE p.descendant_unit_id = NEW.parent_unit_id
      AND c.ancestor_unit_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organization_units_after_update
AFTER UPDATE ON organization_units
FOR EACH ROW
WHEN (OLD.parent_unit_id IS DISTINCT FROM NEW.parent_unit_id)
EXECUTE FUNCTION rebuild_organization_hierarchy();
```

---

### 2. メンバー数管理

#### 組織単位メンバー数更新

```sql
CREATE OR REPLACE FUNCTION update_organization_unit_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE organization_units
    SET member_count = member_count + 1
    WHERE id = NEW.unit_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'active' AND NEW.status = 'inactive' THEN
      UPDATE organization_units
      SET member_count = member_count - 1
      WHERE id = NEW.unit_id;
    ELSIF OLD.status = 'inactive' AND NEW.status = 'active' THEN
      UPDATE organization_units
      SET member_count = member_count + 1
      WHERE id = NEW.unit_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE organization_units
    SET member_count = member_count - 1
    WHERE id = OLD.unit_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organization_members_count
AFTER INSERT OR UPDATE OR DELETE ON organization_members
FOR EACH ROW
EXECUTE FUNCTION update_organization_unit_member_count();
```

#### チームメンバー数更新

```sql
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE teams
    SET member_count = member_count + 1
    WHERE id = NEW.team_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'active' AND NEW.status = 'inactive' THEN
      UPDATE teams
      SET member_count = member_count - 1
      WHERE id = NEW.team_id;
    ELSIF OLD.status = 'inactive' AND NEW.status = 'active' THEN
      UPDATE teams
      SET member_count = member_count + 1
      WHERE id = NEW.team_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE teams
    SET member_count = member_count - 1
    WHERE id = OLD.team_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_team_members_count
AFTER INSERT OR UPDATE OR DELETE ON team_members
FOR EACH ROW
EXECUTE FUNCTION update_team_member_count();
```

#### チームリーダー数更新

```sql
CREATE OR REPLACE FUNCTION update_team_leader_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE teams
    SET leader_count = leader_count + 1
    WHERE id = NEW.team_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'active' AND NEW.status = 'inactive' THEN
      UPDATE teams
      SET leader_count = leader_count - 1
      WHERE id = NEW.team_id;
    ELSIF OLD.status = 'inactive' AND NEW.status = 'active' THEN
      UPDATE teams
      SET leader_count = leader_count + 1
      WHERE id = NEW.team_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE teams
    SET leader_count = leader_count - 1
    WHERE id = OLD.team_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_team_leaders_count
AFTER INSERT OR UPDATE OR DELETE ON team_leaders
FOR EACH ROW
EXECUTE FUNCTION update_team_leader_count();
```

---

### 3. アロケーション制約チェック

```sql
CREATE OR REPLACE FUNCTION check_user_allocation_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_total DECIMAL(4,2);
BEGIN
  -- 現在の合計アロケーション率を取得
  SELECT COALESCE(SUM(allocation_rate), 0.0)
  INTO current_total
  FROM team_members
  WHERE user_id = NEW.user_id
    AND status = 'active'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);

  -- 新規アロケーションを加算
  current_total := current_total + NEW.allocation_rate;

  -- 制限チェック（200%まで）
  IF current_total > 2.0 THEN
    RAISE EXCEPTION 'User allocation rate exceeds limit: current=%, limit=2.0', current_total;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_team_members_check_allocation
BEFORE INSERT OR UPDATE ON team_members
FOR EACH ROW
WHEN (NEW.status = 'active')
EXECUTE FUNCTION check_user_allocation_limit();
```

---

### 4. リーダー制約チェック

```sql
CREATE OR REPLACE FUNCTION check_team_leader_requirements()
RETURNS TRIGGER AS $$
DECLARE
  remaining_leaders INTEGER;
  team_status VARCHAR(20);
BEGIN
  -- チームのステータスを取得
  SELECT status INTO team_status
  FROM teams
  WHERE id = OLD.team_id;

  -- activeなチームの場合、最後のリーダーは削除不可
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.status = 'inactive') THEN
    IF team_status = 'active' THEN
      SELECT COUNT(*) INTO remaining_leaders
      FROM team_leaders
      WHERE team_id = OLD.team_id
        AND status = 'active'
        AND id != OLD.id;

      IF remaining_leaders = 0 THEN
        RAISE EXCEPTION 'Cannot remove last leader from active team';
      END IF;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_team_leaders_check_requirements
BEFORE UPDATE OR DELETE ON team_leaders
FOR EACH ROW
EXECUTE FUNCTION check_team_leader_requirements();
```

---

### 5. 更新日時自動更新

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 全テーブルに適用
CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_organization_units_updated_at
BEFORE UPDATE ON organization_units
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_organization_members_updated_at
BEFORE UPDATE ON organization_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_teams_updated_at
BEFORE UPDATE ON teams
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_team_members_updated_at
BEFORE UPDATE ON team_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_governance_policies_updated_at
BEFORE UPDATE ON governance_policies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_governance_rules_updated_at
BEFORE UPDATE ON governance_rules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_policy_scopes_updated_at
BEFORE UPDATE ON policy_scopes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

---

### トリガー関数一覧

| # | 関数名 | 説明 | 対象テーブル |
|---|--------|------|------------|
| 1 | build_organization_hierarchy() | 組織単位追加時の階層構築 | organization_units |
| 2 | rebuild_organization_hierarchy() | 組織再編時の階層再構築 | organization_units |
| 3 | update_organization_unit_member_count() | 組織単位メンバー数更新 | organization_members |
| 4 | update_team_member_count() | チームメンバー数更新 | team_members |
| 5 | update_team_leader_count() | チームリーダー数更新 | team_leaders |
| 6 | check_user_allocation_limit() | アロケーション制約チェック | team_members |
| 7 | check_team_leader_requirements() | リーダー制約チェック | team_leaders |
| 8 | update_updated_at() | 更新日時自動更新 | 全テーブル |

**合計トリガー数**: 16個（8関数 × 適用箇所）

---

## 関連ドキュメント

- [README.md](README.md) - データ層概要
- [tables.md](tables.md) - テーブル定義詳細
- [query-patterns.md](query-patterns.md) - クエリパターン集
- [backup-operations.md](backup-operations.md) - 運用とバックアップ

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.3 - BC-004 データ層詳細化
