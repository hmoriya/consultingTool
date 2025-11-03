# BC-004: クエリパターン集

**ドキュメント**: データ層 - クエリパターン
**最終更新**: 2025-11-03

このドキュメントでは、BC-004でよく使用されるクエリパターンとパフォーマンス目標を記載します。

---

## 目次

1. [組織階層クエリ](#hierarchy-queries)
2. [組織メンバークエリ](#organization-member-queries)
3. [チームクエリ](#team-queries)
4. [アロケーションクエリ](#allocation-queries)
5. [ガバナンスクエリ](#governance-queries)
6. [統計クエリ](#statistics-queries)

---

## 組織階層クエリ {#hierarchy-queries}

### 1. 特定組織単位の全祖先を取得

組織単位から上位階層（親、祖父、...、ルート）までを取得。

```sql
-- パフォーマンス: p95 < 10ms
SELECT
  u.id,
  u.name,
  u.unit_type,
  u.hierarchy_level,
  h.depth
FROM organization_units u
JOIN organization_hierarchies h ON u.id = h.ancestor_unit_id
WHERE h.descendant_unit_id = $unitId
  AND h.depth > 0
ORDER BY h.depth DESC;
```

**利用例**:
- パンくずナビゲーション表示
- 権限継承の計算
- 組織パス表示

---

### 2. 特定組織単位の全子孫を取得

組織単位から下位階層（子、孫、...）までを取得。

```sql
-- パフォーマンス: p95 < 50ms
-- 最大深度指定
SELECT
  u.id,
  u.name,
  u.unit_type,
  u.hierarchy_level,
  h.depth,
  u.path
FROM organization_units u
JOIN organization_hierarchies h ON u.id = h.descendant_unit_id
WHERE h.ancestor_unit_id = $unitId
  AND h.depth > 0
  AND h.depth <= $maxDepth  -- 例: 2階層まで
ORDER BY h.depth ASC, u.name ASC;
```

**利用例**:
- 組織ツリー表示
- 配下の全単位取得
- 集計範囲の特定

---

### 3. 特定組織単位の直下の子のみ取得

1階層下の直下の子組織単位のみを取得。

```sql
-- パフォーマンス: p95 < 5ms
SELECT
  id,
  name,
  unit_type,
  hierarchy_level,
  member_count,
  status
FROM organization_units
WHERE parent_unit_id = $unitId
  AND deleted_at IS NULL
ORDER BY name ASC;
```

**利用例**:
- 組織ツリーの遅延ロード
- 次階層のみ表示

---

### 4. 組織全体の階層構造取得

組織のルートから全階層構造を取得（ネストJSON形式）。

```sql
-- パフォーマンス: p95 < 100ms
WITH RECURSIVE org_tree AS (
  -- ルート単位
  SELECT
    id,
    organization_id,
    name,
    parent_unit_id,
    hierarchy_level,
    member_count,
    ARRAY[id] AS path_array,
    0 AS depth
  FROM organization_units
  WHERE parent_unit_id IS NULL
    AND organization_id = $organizationId
    AND deleted_at IS NULL

  UNION ALL

  -- 子単位
  SELECT
    u.id,
    u.organization_id,
    u.name,
    u.parent_unit_id,
    u.hierarchy_level,
    u.member_count,
    tree.path_array || u.id,
    tree.depth + 1
  FROM organization_units u
  JOIN org_tree tree ON u.parent_unit_id = tree.id
  WHERE u.deleted_at IS NULL
    AND tree.depth < 10  -- 無限ループ防止
)
SELECT * FROM org_tree
ORDER BY path_array;
```

**利用例**:
- 組織全体のツリー構築
- 組織図生成

---

### 5. 循環参照チェック

組織再編時に循環参照が発生しないかチェック。

```sql
-- パフォーマンス: p95 < 5ms
SELECT EXISTS (
  SELECT 1
  FROM organization_hierarchies
  WHERE ancestor_unit_id = $childUnitId
    AND descendant_unit_id = $newParentUnitId
) AS has_circular_reference;
```

**利用例**:
- 親単位変更時のバリデーション
- 組織再編の事前チェック

---

## 組織メンバークエリ {#organization-member-queries}

### 6. 組織単位のメンバー一覧取得

特定組織単位の直属メンバーを取得。

```sql
-- パフォーマンス: p95 < 20ms
SELECT
  om.id,
  om.user_id,
  u.username,
  u.email,
  om.role_in_unit,
  om.status,
  om.joined_at
FROM organization_members om
JOIN users u ON om.user_id = u.id
WHERE om.unit_id = $unitId
  AND om.status = 'active'
ORDER BY om.joined_at DESC;
```

**利用例**:
- 部門メンバー一覧表示
- メンバー管理画面

---

### 7. ユーザーの所属組織単位一覧

特定ユーザーが所属する全組織単位を取得。

```sql
-- パフォーマンス: p95 < 10ms
SELECT
  om.id,
  om.organization_id,
  o.name AS organization_name,
  om.unit_id,
  u.name AS unit_name,
  u.path,
  om.role_in_unit,
  om.status,
  om.joined_at
FROM organization_members om
JOIN organizations o ON om.organization_id = o.id
JOIN organization_units u ON om.unit_id = u.id
WHERE om.user_id = $userId
  AND om.status = 'active'
ORDER BY om.joined_at DESC;
```

**利用例**:
- ユーザープロフィール表示
- 所属情報の確認

---

## チームクエリ {#team-queries}

### 8. チーム一覧取得

組織のチーム一覧を条件付きで取得。

```sql
-- パフォーマンス: p95 < 30ms
SELECT
  t.id,
  t.name,
  t.team_type,
  t.purpose,
  t.status,
  t.member_count,
  t.leader_count,
  t.start_date,
  t.end_date,
  u.name AS unit_name,
  o.name AS organization_name
FROM teams t
JOIN organization_units u ON t.unit_id = u.id
JOIN organizations o ON t.organization_id = o.id
WHERE t.organization_id = $organizationId
  AND t.status = $status  -- 'active' or 'inactive'
  AND ($teamType IS NULL OR t.team_type = $teamType)
ORDER BY t.created_at DESC
LIMIT $pageSize OFFSET $offset;
```

**利用例**:
- チーム一覧画面
- チーム検索

---

### 9. チームメンバー一覧取得

特定チームのメンバーとアロケーション情報を取得。

```sql
-- パフォーマンス: p95 < 20ms
SELECT
  tm.id,
  tm.user_id,
  u.username,
  u.email,
  tm.allocation_rate,
  tm.role,
  tm.status,
  tm.start_date,
  tm.end_date,
  tm.joined_at,
  CASE WHEN tl.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_leader,
  tl.assigned_at AS leader_assigned_at
FROM team_members tm
JOIN users u ON tm.user_id = u.id
LEFT JOIN team_leaders tl ON tm.id = tl.member_id AND tl.status = 'active'
WHERE tm.team_id = $teamId
  AND tm.status = 'active'
ORDER BY
  CASE WHEN tl.id IS NOT NULL THEN 0 ELSE 1 END,  -- リーダー優先
  tm.joined_at ASC;
```

**利用例**:
- チームメンバー管理画面
- チーム構成表示

---

### 10. ユーザーの参加チーム一覧

特定ユーザーが参加している全チームを取得。

```sql
-- パフォーマンス: p95 < 20ms
SELECT
  tm.id AS member_id,
  t.id AS team_id,
  t.name AS team_name,
  t.team_type,
  t.status AS team_status,
  tm.allocation_rate,
  tm.role,
  tm.status AS member_status,
  tm.start_date,
  tm.end_date,
  CASE WHEN tl.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_leader,
  u.name AS unit_name,
  o.name AS organization_name
FROM team_members tm
JOIN teams t ON tm.team_id = t.id
JOIN organization_units u ON t.unit_id = u.id
JOIN organizations o ON t.organization_id = o.id
LEFT JOIN team_leaders tl ON tm.id = tl.member_id AND tl.status = 'active'
WHERE tm.user_id = $userId
  AND tm.status = 'active'
ORDER BY tm.allocation_rate DESC, tm.joined_at DESC;
```

**利用例**:
- ユーザープロフィール
- マイチーム一覧

---

## アロケーションクエリ {#allocation-queries}

### 11. ユーザーのアロケーション状況取得

特定ユーザーのアロケーション状況を集計。

```sql
-- パフォーマンス: p95 < 15ms
SELECT
  tm.user_id,
  u.username,
  u.email,
  COUNT(DISTINCT tm.team_id) AS team_count,
  SUM(tm.allocation_rate) AS total_allocation_rate,
  ROUND(2.0 - SUM(tm.allocation_rate), 2) AS available_allocation_rate,
  ARRAY_AGG(
    JSON_BUILD_OBJECT(
      'teamId', t.id,
      'teamName', t.name,
      'allocationRate', tm.allocation_rate,
      'role', tm.role
    )
  ) AS teams
FROM team_members tm
JOIN users u ON tm.user_id = u.id
JOIN teams t ON tm.team_id = t.id
WHERE tm.user_id = $userId
  AND tm.status = 'active'
GROUP BY tm.user_id, u.username, u.email;
```

**利用例**:
- アロケーション状況確認
- チーム参加可否判定

---

### 12. アロケーション制約チェック

新規チーム参加時にアロケーション制約をチェック。

```sql
-- パフォーマンス: p95 < 10ms
WITH user_allocation AS (
  SELECT COALESCE(SUM(allocation_rate), 0.0) AS current_total
  FROM team_members
  WHERE user_id = $userId
    AND status = 'active'
)
SELECT
  current_total,
  current_total + $newAllocationRate AS new_total,
  CASE
    WHEN current_total + $newAllocationRate <= 2.0 THEN TRUE
    ELSE FALSE
  END AS is_allowed
FROM user_allocation;
```

**利用例**:
- チームメンバー追加のバリデーション
- アロケーション率変更の妥当性チェック

---

### 13. 過剰アロケーションユーザー検出

アロケーション率が200%を超えているユーザーを検出。

```sql
-- パフォーマンス: p95 < 100ms
SELECT
  tm.user_id,
  u.username,
  u.email,
  COUNT(DISTINCT tm.team_id) AS team_count,
  SUM(tm.allocation_rate) AS total_allocation_rate,
  SUM(tm.allocation_rate) - 2.0 AS over_allocation
FROM team_members tm
JOIN users u ON tm.user_id = u.id
WHERE tm.status = 'active'
GROUP BY tm.user_id, u.username, u.email
HAVING SUM(tm.allocation_rate) > 2.0
ORDER BY total_allocation_rate DESC;
```

**利用例**:
- アロケーション監視
- ガバナンス違反検知

---

## ガバナンスクエリ {#governance-queries}

### 14. 適用可能ポリシー取得

特定のコンテキスト（組織、単位、チーム）に適用されるポリシーを取得。

```sql
-- パフォーマンス: p95 < 30ms
SELECT DISTINCT
  p.id AS policy_id,
  p.name AS policy_name,
  p.policy_type,
  p.priority,
  p.enforcement_level,
  p.status
FROM governance_policies p
JOIN policy_scopes ps ON p.id = ps.policy_id
WHERE p.organization_id = $organizationId
  AND p.status = 'active'
  AND ps.status = 'active'
  AND p.effective_from <= CURRENT_DATE
  AND (p.effective_until IS NULL OR p.effective_until >= CURRENT_DATE)
  AND (
    -- 組織全体に適用
    (ps.target_type = 'organization' AND ps.target_id = $organizationId)
    OR
    -- 組織単位に適用
    (ps.target_type = 'unit' AND (
      ps.target_id = $unitId
      OR (
        ps.include_descendants = TRUE
        AND EXISTS (
          SELECT 1 FROM organization_hierarchies h
          WHERE h.ancestor_unit_id = ps.target_id
            AND h.descendant_unit_id = $unitId
        )
      )
    ))
    OR
    -- チームに適用
    (ps.target_type = 'team' AND ps.target_id = $teamId)
  )
ORDER BY p.priority DESC;
```

**利用例**:
- ポリシー評価
- ガバナンスチェック

---

### 15. ポリシールール取得

特定ポリシーの全ルールを取得。

```sql
-- パフォーマンス: p95 < 10ms
SELECT
  r.id,
  r.name,
  r.description,
  r.condition,
  r.error_message,
  r.severity,
  r.status
FROM governance_rules r
WHERE r.policy_id = $policyId
  AND r.status = 'active'
ORDER BY r.created_at ASC;
```

**利用例**:
- ポリシー詳細表示
- ルール評価

---

### 16. 違反記録取得

特定期間のポリシー違反を取得。

```sql
-- パフォーマンス: p95 < 50ms
SELECT
  v.id,
  v.policy_id,
  p.name AS policy_name,
  v.rule_id,
  r.name AS rule_name,
  v.target_type,
  v.target_id,
  v.severity,
  v.error_message,
  v.context,
  v.status,
  v.detected_at,
  v.resolved_at,
  v.resolved_by,
  u.username AS resolved_by_username
FROM policy_violations v
JOIN governance_policies p ON v.policy_id = p.id
JOIN governance_rules r ON v.rule_id = r.id
LEFT JOIN users u ON v.resolved_by = u.id
WHERE v.detected_at BETWEEN $startDate AND $endDate
  AND ($status IS NULL OR v.status = $status)
  AND ($severity IS NULL OR v.severity = $severity)
ORDER BY v.detected_at DESC
LIMIT $pageSize OFFSET $offset;
```

**利用例**:
- 違反レポート
- コンプライアンス監視

---

## 統計クエリ {#statistics-queries}

### 17. 組織単位統計

特定組織単位の統計情報を取得。

```sql
-- パフォーマンス: p95 < 30ms
SELECT
  u.id,
  u.name,
  u.hierarchy_level,
  u.path,
  u.member_count AS direct_member_count,
  (
    SELECT COUNT(DISTINCT om.user_id)
    FROM organization_members om
    JOIN organization_hierarchies h ON om.unit_id = h.descendant_unit_id
    WHERE h.ancestor_unit_id = u.id
      AND om.status = 'active'
  ) AS total_member_count,
  (
    SELECT COUNT(*)
    FROM teams t
    WHERE t.unit_id = u.id
      AND t.status = 'active'
  ) AS team_count,
  (
    SELECT COALESCE(SUM(tm.allocation_rate), 0.0)
    FROM team_members tm
    JOIN teams t ON tm.team_id = t.id
    WHERE t.unit_id = u.id
      AND tm.status = 'active'
      AND t.status = 'active'
  ) AS total_allocation_rate
FROM organization_units u
WHERE u.id = $unitId;
```

**利用例**:
- 組織単位ダッシュボード
- 人員配置分析

---

### 18. チーム統計

特定チームの統計情報を取得。

```sql
-- パフォーマンス: p95 < 20ms
SELECT
  t.id,
  t.name,
  t.team_type,
  t.status,
  t.member_count,
  t.leader_count,
  COALESCE(SUM(tm.allocation_rate), 0.0) AS total_allocation_rate,
  COALESCE(AVG(tm.allocation_rate), 0.0) AS avg_allocation_rate,
  COALESCE(MAX(tm.allocation_rate), 0.0) AS max_allocation_rate,
  COALESCE(MIN(tm.allocation_rate), 0.0) AS min_allocation_rate,
  COUNT(DISTINCT tm.role) AS role_count,
  ARRAY_AGG(DISTINCT tm.role) AS roles
FROM teams t
LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.status = 'active'
WHERE t.id = $teamId
GROUP BY t.id, t.name, t.team_type, t.status, t.member_count, t.leader_count;
```

**利用例**:
- チームダッシュボード
- チーム分析

---

### 19. 組織全体のアロケーション分析

組織全体のアロケーション状況を分析。

```sql
-- パフォーマンス: p95 < 200ms
WITH user_allocations AS (
  SELECT
    tm.user_id,
    SUM(tm.allocation_rate) AS total_allocation_rate
  FROM team_members tm
  JOIN teams t ON tm.team_id = t.id
  WHERE t.organization_id = $organizationId
    AND tm.status = 'active'
    AND t.status = 'active'
  GROUP BY tm.user_id
)
SELECT
  COUNT(*) AS total_users,
  COUNT(CASE WHEN total_allocation_rate < 0.5 THEN 1 END) AS under_allocated,
  COUNT(CASE WHEN total_allocation_rate >= 0.5 AND total_allocation_rate <= 1.5 THEN 1 END) AS normal_allocated,
  COUNT(CASE WHEN total_allocation_rate > 1.5 THEN 1 END) AS over_allocated,
  COALESCE(AVG(total_allocation_rate), 0.0) AS avg_allocation_rate,
  COALESCE(MAX(total_allocation_rate), 0.0) AS max_allocation_rate,
  COALESCE(MIN(total_allocation_rate), 0.0) AS min_allocation_rate
FROM user_allocations;
```

**利用例**:
- 組織アロケーションレポート
- リソース配分分析

---

### 20. ガバナンスコンプライアンススコア

組織のガバナンスコンプライアンススコアを計算。

```sql
-- パフォーマンス: p95 < 100ms
WITH policy_stats AS (
  SELECT
    COUNT(*) AS total_policies,
    COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_policies
  FROM governance_policies
  WHERE organization_id = $organizationId
),
violation_stats AS (
  SELECT
    COUNT(*) AS total_violations,
    COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_violations,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) AS resolved_violations
  FROM policy_violations v
  JOIN governance_policies p ON v.policy_id = p.id
  WHERE p.organization_id = $organizationId
    AND v.detected_at >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT
  ps.total_policies,
  ps.active_policies,
  vs.total_violations,
  vs.active_violations,
  vs.resolved_violations,
  CASE
    WHEN vs.total_violations = 0 THEN 100.0
    ELSE ROUND(
      (100.0 * vs.resolved_violations / vs.total_violations), 1
    )
  END AS resolution_rate,
  CASE
    WHEN vs.total_violations = 0 THEN 100.0
    ELSE ROUND(
      (100.0 - (100.0 * vs.active_violations / vs.total_violations)), 1
    )
  END AS compliance_score
FROM policy_stats ps
CROSS JOIN violation_stats vs;
```

**利用例**:
- コンプライアンスダッシュボード
- ガバナンス評価

---

## パフォーマンス目標

| クエリカテゴリ | p50 | p95 | p99 |
|--------------|-----|-----|-----|
| 階層クエリ（浅い） | <5ms | <10ms | <20ms |
| 階層クエリ（深い） | <20ms | <50ms | <100ms |
| メンバークエリ | <10ms | <20ms | <50ms |
| チームクエリ | <10ms | <30ms | <100ms |
| アロケーションクエリ | <10ms | <20ms | <50ms |
| ガバナンスクエリ | <20ms | <50ms | <150ms |
| 統計クエリ | <50ms | <200ms | <500ms |

---

## 関連ドキュメント

- [README.md](README.md) - データ層概要
- [tables.md](tables.md) - テーブル定義詳細
- [indexes-constraints.md](indexes-constraints.md) - インデックスと制約
- [backup-operations.md](backup-operations.md) - 運用とバックアップ

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.3 - BC-004 データ層詳細化
