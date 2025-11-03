# BC-005: クエリパターン集

**ドキュメント**: データ層 - クエリパターン
**最終更新**: 2025-11-03

このドキュメントでは、BC-005でよく使用されるクエリパターンとパフォーマンス目標を記載します。

---

## 目次

1. [リソース配分クエリ](#resource-allocation-queries)
2. [タレント・パフォーマンスクエリ](#talent-performance-queries)
3. [スキルマッチングクエリ](#skill-matching-queries)
4. [チーム編成クエリ](#team-formation-queries)
5. [タイムシート・稼働率クエリ](#timesheet-utilization-queries)
6. [統計・分析クエリ](#statistics-queries)

---

## リソース配分クエリ {#resource-allocation-queries}

### 1. 利用可能リソース検索

配分可能なリソースを検索（スキル・稼働率考慮）。

```sql
-- パフォーマンス: p95 < 100ms
SELECT
  r.id,
  r.user_id,
  u.username,
  u.email,
  r.resource_type,
  r.department,
  r.current_utilization,
  2.0 - r.current_utilization AS available_capacity,
  COALESCE(AVG(ts.level), 0) AS avg_skill_level,
  COUNT(DISTINCT ts.skill_id) AS skill_count
FROM resources r
JOIN users u ON r.user_id = u.id
LEFT JOIN talent_skills ts ON r.id = ts.resource_id
WHERE r.status IN ('available', 'allocated')
  AND r.current_utilization < 2.0  -- 配分可能
  AND (r.available_from IS NULL OR r.available_from <= $targetDate)
  AND (r.available_to IS NULL OR r.available_to >= $targetDate)
  AND ($resourceType IS NULL OR r.resource_type = $resourceType)
  AND ($department IS NULL OR r.department = $department)
  AND r.deleted_at IS NULL
GROUP BY r.id, r.user_id, u.username, u.email, r.resource_type,
         r.department, r.current_utilization
HAVING ($minSkillCount IS NULL OR COUNT(DISTINCT ts.skill_id) >= $minSkillCount)
ORDER BY
  available_capacity DESC,
  avg_skill_level DESC
LIMIT $pageSize OFFSET $offset;
```

**利用例**:
- プロジェクトへのリソース配分
- リソース検索画面
- 配分候補者の抽出

---

### 2. リソースの配分状況取得

特定リソースの現在および将来の配分状況を取得。

```sql
-- パフォーマンス: p95 < 50ms
SELECT
  ra.id,
  ra.project_id,
  p.name AS project_name,
  p.code AS project_code,
  ra.allocation_percentage,
  ra.start_date,
  ra.end_date,
  ra.role,
  ra.status,
  ra.actual_hours,
  EXTRACT(DAY FROM ra.end_date - ra.start_date) AS duration_days
FROM resource_allocations ra
JOIN projects p ON ra.project_id = p.id  -- BC-001
WHERE ra.resource_id = $resourceId
  AND ra.status = 'active'
  AND ra.end_date >= CURRENT_DATE
ORDER BY ra.start_date ASC;
```

**利用例**:
- リソースカレンダー表示
- 配分状況の確認
- スケジュール調整

---

### 3. 期間内の配分率合計チェック

新規配分前に期間内の配分率合計を確認。

```sql
-- パフォーマンス: p95 < 10ms
SELECT
  COALESCE(SUM(allocation_percentage), 0.0) AS total_allocation,
  2.0 - COALESCE(SUM(allocation_percentage), 0.0) AS remaining_capacity,
  COUNT(*) AS active_allocations
FROM resource_allocations
WHERE resource_id = $resourceId
  AND status = 'active'
  AND (start_date, end_date) OVERLAPS ($newStartDate, $newEndDate);
```

**利用例**:
- 配分前のバリデーション
- 配分可能率の表示
- 過配分防止

---

### 4. プロジェクトのリソース一覧

プロジェクトに配分されているリソース一覧を取得。

```sql
-- パフォーマンス: p95 < 50ms
SELECT
  ra.id AS allocation_id,
  r.id AS resource_id,
  u.username,
  u.email,
  r.resource_type,
  r.department,
  ra.allocation_percentage,
  ra.role,
  ra.start_date,
  ra.end_date,
  ra.actual_hours,
  r.current_utilization,
  t.career_level,
  COALESCE(AVG(ts.level), 0) AS avg_skill_level
FROM resource_allocations ra
JOIN resources r ON ra.resource_id = r.id
JOIN users u ON r.user_id = u.id
LEFT JOIN talents t ON r.id = t.resource_id
LEFT JOIN talent_skills ts ON r.id = ts.resource_id
WHERE ra.project_id = $projectId
  AND ra.status = 'active'
GROUP BY ra.id, r.id, u.username, u.email, r.resource_type,
         r.department, ra.allocation_percentage, ra.role,
         ra.start_date, ra.end_date, ra.actual_hours,
         r.current_utilization, t.career_level
ORDER BY ra.start_date ASC, ra.allocation_percentage DESC;
```

**利用例**:
- プロジェクトリソース管理画面
- プロジェクトチーム表示
- リソース稼働状況確認

---

### 5. リソース需要予測

プロジェクト要件からリソース需要を予測。

```sql
-- パフォーマンス: p95 < 200ms
WITH project_requirements AS (
  SELECT
    p.id AS project_id,
    p.start_date,
    p.end_date,
    p.required_headcount,
    p.required_skills  -- JSONB
  FROM projects p  -- BC-001
  WHERE p.status IN ('planned', 'in_progress')
    AND p.start_date <= $forecastEndDate
    AND p.end_date >= $forecastStartDate
),
current_allocations AS (
  SELECT
    project_id,
    SUM(allocation_percentage) AS allocated_capacity
  FROM resource_allocations
  WHERE status = 'active'
    AND (start_date, end_date) OVERLAPS ($forecastStartDate, $forecastEndDate)
  GROUP BY project_id
)
SELECT
  pr.project_id,
  p.name AS project_name,
  pr.start_date,
  pr.end_date,
  pr.required_headcount,
  COALESCE(ca.allocated_capacity, 0.0) AS current_allocation,
  pr.required_headcount - COALESCE(ca.allocated_capacity, 0.0) AS shortfall,
  pr.required_skills
FROM project_requirements pr
JOIN projects p ON pr.project_id = p.id
LEFT JOIN current_allocations ca ON pr.project_id = ca.project_id
WHERE pr.required_headcount - COALESCE(ca.allocated_capacity, 0.0) > 0
ORDER BY
  pr.start_date ASC,
  (pr.required_headcount - COALESCE(ca.allocated_capacity, 0.0)) DESC;
```

**利用例**:
- リソース需要予測レポート
- 採用計画立案
- リソース配分計画

---

## タレント・パフォーマンスクエリ {#talent-performance-queries}

### 6. タレントプロファイル取得

タレントの詳細情報をパフォーマンス履歴と共に取得。

```sql
-- パフォーマンス: p95 < 50ms
SELECT
  t.id,
  t.resource_id,
  r.user_id,
  u.username,
  u.email,
  t.career_level,
  t.career_track,
  t.hire_date,
  t.potential_rating,
  t.risk_of_attrition,
  t.last_promotion_date,
  m.username AS manager_name,
  COUNT(DISTINCT pr.id) AS total_evaluations,
  AVG(pr.overall_score) FILTER (WHERE pr.status = 'approved') AS avg_performance_score,
  MAX(pr.period_end) AS last_evaluation_date,
  COUNT(DISTINCT ts.skill_id) AS skill_count,
  AVG(ts.level) AS avg_skill_level
FROM talents t
JOIN resources r ON t.resource_id = r.id
JOIN users u ON r.user_id = u.id
LEFT JOIN users m ON t.manager_id = m.id
LEFT JOIN performance_records pr ON t.id = pr.talent_id
LEFT JOIN talent_skills ts ON r.id = ts.resource_id
WHERE t.id = $talentId
GROUP BY t.id, t.resource_id, r.user_id, u.username, u.email,
         t.career_level, t.career_track, t.hire_date,
         t.potential_rating, t.risk_of_attrition, t.last_promotion_date,
         m.username;
```

**利用例**:
- タレントプロフィール画面
- 人材評価レビュー
- キャリア面談

---

### 7. ハイパフォーマー抽出

高評価タレントを抽出（昇進候補者）。

```sql
-- パフォーマンス: p95 < 100ms
WITH recent_performance AS (
  SELECT
    talent_id,
    AVG(overall_score) AS avg_score,
    COUNT(*) AS evaluation_count
  FROM (
    SELECT talent_id, overall_score
    FROM performance_records
    WHERE status = 'approved'
      AND period_end >= CURRENT_DATE - INTERVAL '2 years'
    ORDER BY period_end DESC
  ) recent
  GROUP BY talent_id
)
SELECT
  t.id,
  r.user_id,
  u.username,
  t.career_level,
  t.career_track,
  t.potential_rating,
  rp.avg_score AS recent_avg_score,
  rp.evaluation_count,
  COALESCE(AVG(ts.level), 0) AS avg_skill_level,
  COUNT(DISTINCT ts.skill_id) AS skill_count,
  t.last_promotion_date,
  EXTRACT(YEAR FROM AGE(CURRENT_DATE, t.last_promotion_date)) AS years_since_promotion
FROM talents t
JOIN resources r ON t.resource_id = r.id
JOIN users u ON r.user_id = u.id
JOIN recent_performance rp ON t.id = rp.talent_id
LEFT JOIN talent_skills ts ON r.id = ts.resource_id
WHERE t.potential_rating >= 4.0  -- ポテンシャル高評価
  AND rp.avg_score >= 4.0       -- 直近パフォーマンス高評価
  AND rp.evaluation_count >= 2  -- 最低2回の評価
  AND (t.last_promotion_date IS NULL
       OR t.last_promotion_date < CURRENT_DATE - INTERVAL '1 year')
GROUP BY t.id, r.user_id, u.username, t.career_level, t.career_track,
         t.potential_rating, rp.avg_score, rp.evaluation_count,
         t.last_promotion_date
ORDER BY
  t.potential_rating DESC,
  rp.avg_score DESC,
  avg_skill_level DESC
LIMIT $limit;
```

**利用例**:
- 昇進候補者リスト
- タレントレビュー会議
- サクセッションプラン

---

### 8. 離職リスク分析

離職リスクが高いタレントを抽出。

```sql
-- パフォーマンス: p95 < 100ms
WITH performance_trend AS (
  SELECT
    talent_id,
    AVG(overall_score) AS avg_score,
    MIN(overall_score) AS min_score,
    STDDEV(overall_score) AS score_variance
  FROM performance_records
  WHERE status = 'approved'
    AND period_end >= CURRENT_DATE - INTERVAL '1 year'
  GROUP BY talent_id
)
SELECT
  t.id,
  r.user_id,
  u.username,
  t.career_level,
  t.career_track,
  t.risk_of_attrition,
  t.potential_rating,
  pt.avg_score AS recent_avg_score,
  pt.score_variance,
  EXTRACT(YEAR FROM AGE(CURRENT_DATE, t.hire_date)) AS years_of_service,
  EXTRACT(YEAR FROM AGE(CURRENT_DATE, t.last_promotion_date)) AS years_since_promotion,
  COALESCE(rc.utilization_rate, 0) AS current_utilization
FROM talents t
JOIN resources r ON t.resource_id = r.id
JOIN users u ON r.user_id = u.id
LEFT JOIN performance_trend pt ON t.id = pt.talent_id
LEFT JOIN LATERAL (
  SELECT utilization_rate
  FROM resource_utilization_history
  WHERE resource_id = r.id
  ORDER BY period_year_month DESC
  LIMIT 1
) rc ON true
WHERE t.risk_of_attrition IN ('medium', 'high')
  OR pt.avg_score < 3.0  -- パフォーマンス低下
  OR (t.last_promotion_date IS NOT NULL
      AND t.last_promotion_date < CURRENT_DATE - INTERVAL '3 years')
ORDER BY
  CASE t.risk_of_attrition
    WHEN 'high' THEN 1
    WHEN 'medium' THEN 2
    ELSE 3
  END,
  pt.avg_score ASC NULLS FIRST
LIMIT $limit;
```

**利用例**:
- リテンション施策
- 離職リスク管理
- エンゲージメント向上

---

### 9. キャリア開発計画進捗

タレントのキャリア開発計画の進捗状況を取得。

```sql
-- パフォーマンス: p95 < 30ms
SELECT
  cp.id,
  cp.talent_id,
  cp.fiscal_year,
  cp.status,
  cp.goals,
  cp.development_activities,
  cp.target_skills,
  cp.achievements,
  cp.created_at,
  cp.reviewed_at,
  rv.username AS reviewer_name,
  -- 目標達成率の計算（JSONBから集計）
  (
    SELECT COUNT(*)
    FROM jsonb_array_elements(cp.goals) AS goal
    WHERE goal->>'status' = 'completed'
  ) AS completed_goals,
  (
    SELECT COUNT(*)
    FROM jsonb_array_elements(cp.goals) AS goal
  ) AS total_goals
FROM career_plans cp
LEFT JOIN users rv ON cp.reviewed_by = rv.id
WHERE cp.talent_id = $talentId
  AND cp.fiscal_year = $fiscalYear
  AND cp.status = 'active';
```

**利用例**:
- キャリア面談
- 目標進捗レビュー
- 育成計画フォローアップ

---

## スキルマッチングクエリ {#skill-matching-queries}

### 10. スキル条件に合致するリソース検索

必要スキルとレベルからリソースをマッチング。

```sql
-- パフォーマンス: p95 < 150ms
WITH required_skills AS (
  SELECT
    unnest($requiredSkillIds::UUID[]) AS skill_id,
    unnest($requiredLevels::INTEGER[]) AS required_level
)
SELECT
  r.id,
  r.user_id,
  u.username,
  r.resource_type,
  r.department,
  r.current_utilization,
  2.0 - r.current_utilization AS available_capacity,
  -- スキルマッチング詳細
  jsonb_agg(
    jsonb_build_object(
      'skill_id', rs.skill_id,
      'skill_name', s.name,
      'required_level', rs.required_level,
      'actual_level', COALESCE(ts.level, 0),
      'meets_requirement', COALESCE(ts.level, 0) >= rs.required_level
    )
  ) AS skill_matching,
  -- マッチングスコア
  SUM(CASE WHEN COALESCE(ts.level, 0) >= rs.required_level THEN 1 ELSE 0 END) AS matched_skills,
  COUNT(rs.skill_id) AS total_required_skills
FROM resources r
JOIN users u ON r.user_id = u.id
CROSS JOIN required_skills rs
LEFT JOIN talent_skills ts ON r.id = ts.resource_id AND rs.skill_id = ts.skill_id
JOIN skills s ON rs.skill_id = s.id
WHERE r.status IN ('available', 'allocated')
  AND r.current_utilization < 2.0
  AND r.deleted_at IS NULL
GROUP BY r.id, r.user_id, u.username, r.resource_type,
         r.department, r.current_utilization
HAVING SUM(CASE WHEN COALESCE(ts.level, 0) >= rs.required_level THEN 1 ELSE 0 END)
       >= $minMatchedSkills
ORDER BY
  matched_skills DESC,
  available_capacity DESC
LIMIT $limit;
```

**利用例**:
- プロジェクトへのスキルマッチング
- 最適リソース候補抽出
- チーム編成

---

### 11. スキルギャップ分析

タレントのスキルギャップを分析。

```sql
-- パフォーマンス: p95 < 100ms
WITH talent_current_skills AS (
  SELECT
    ts.resource_id,
    ts.skill_id,
    ts.level AS current_level
  FROM talent_skills ts
  WHERE ts.resource_id = $resourceId
),
career_level_requirements AS (
  SELECT
    $targetCareerLevel AS target_level,
    unnest($targetSkillIds::UUID[]) AS skill_id,
    unnest($targetLevels::INTEGER[]) AS target_level
)
SELECT
  clr.skill_id,
  s.name AS skill_name,
  sc.name AS category_name,
  clr.target_level AS required_level,
  COALESCE(tcs.current_level, 0) AS current_level,
  clr.target_level - COALESCE(tcs.current_level, 0) AS gap,
  s.market_demand,
  -- トレーニング推奨
  CASE
    WHEN COALESCE(tcs.current_level, 0) = 0 THEN '基礎研修必要'
    WHEN clr.target_level - COALESCE(tcs.current_level, 0) = 1 THEN '実践経験必要'
    WHEN clr.target_level - COALESCE(tcs.current_level, 0) >= 2 THEN '集中トレーニング必要'
    ELSE 'レベル達成'
  END AS recommendation
FROM career_level_requirements clr
JOIN skills s ON clr.skill_id = s.id
JOIN skill_categories sc ON s.category_id = sc.id
LEFT JOIN talent_current_skills tcs ON clr.skill_id = tcs.skill_id
WHERE clr.target_level > COALESCE(tcs.current_level, 0)
ORDER BY
  (clr.target_level - COALESCE(tcs.current_level, 0)) DESC,
  s.market_demand DESC;
```

**利用例**:
- スキル開発計画
- トレーニング推奨
- キャリアパス設計

---

### 12. 組織全体のスキル分布

組織のスキル保有状況を集計。

```sql
-- パフォーマンス: p95 < 200ms
SELECT
  s.id AS skill_id,
  s.name AS skill_name,
  sc.name AS category_name,
  s.market_demand,
  COUNT(DISTINCT ts.resource_id) AS total_holders,
  COUNT(DISTINCT ts.resource_id) FILTER (WHERE ts.level >= 1) AS level1_holders,
  COUNT(DISTINCT ts.resource_id) FILTER (WHERE ts.level >= 2) AS level2_holders,
  COUNT(DISTINCT ts.resource_id) FILTER (WHERE ts.level >= 3) AS level3_holders,
  COUNT(DISTINCT ts.resource_id) FILTER (WHERE ts.level >= 4) AS level4_holders,
  COUNT(DISTINCT ts.resource_id) FILTER (WHERE ts.level >= 5) AS level5_holders,
  AVG(ts.level) AS avg_level,
  -- 需要と供給のギャップ
  COALESCE($demandCount, 0) - COUNT(DISTINCT ts.resource_id) FILTER (WHERE ts.level >= 3) AS advanced_gap
FROM skills s
JOIN skill_categories sc ON s.category_id = sc.id
LEFT JOIN talent_skills ts ON s.id = ts.skill_id
WHERE s.status = 'active'
  AND ($categoryId IS NULL OR s.category_id = $categoryId)
GROUP BY s.id, s.name, sc.name, s.market_demand
ORDER BY
  s.market_demand DESC,
  total_holders ASC;
```

**利用例**:
- スキルポートフォリオ分析
- トレーニング計画策定
- 採用計画立案

---

## チーム編成クエリ {#team-formation-queries}

### 13. 最適チーム編成候補

プロジェクト要件から最適なチーム編成候補を生成。

```sql
-- パフォーマンス: p95 < 300ms
WITH project_skill_requirements AS (
  SELECT
    $projectId AS project_id,
    unnest($requiredSkillIds::UUID[]) AS skill_id,
    unnest($requiredLevels::INTEGER[]) AS required_level,
    unnest($requiredCounts::INTEGER[]) AS required_count
),
candidate_resources AS (
  SELECT
    r.id AS resource_id,
    r.user_id,
    u.username,
    r.resource_type,
    r.current_utilization,
    2.0 - r.current_utilization AS available_capacity,
    ts.skill_id,
    ts.level AS skill_level,
    r.cost_per_hour
  FROM resources r
  JOIN users u ON r.user_id = u.id
  JOIN talent_skills ts ON r.id = ts.resource_id
  WHERE r.status IN ('available', 'allocated')
    AND r.current_utilization < 2.0
    AND r.deleted_at IS NULL
    AND ts.skill_id = ANY($requiredSkillIds::UUID[])
),
resource_skill_scores AS (
  SELECT
    cr.resource_id,
    cr.user_id,
    cr.username,
    cr.resource_type,
    cr.available_capacity,
    cr.cost_per_hour,
    SUM(
      CASE
        WHEN cr.skill_level >= psr.required_level THEN 10
        WHEN cr.skill_level = psr.required_level - 1 THEN 5
        ELSE 0
      END
    ) AS skill_match_score,
    COUNT(DISTINCT cr.skill_id) AS matched_skill_count
  FROM candidate_resources cr
  JOIN project_skill_requirements psr ON cr.skill_id = psr.skill_id
  GROUP BY cr.resource_id, cr.user_id, cr.username,
           cr.resource_type, cr.available_capacity, cr.cost_per_hour
)
SELECT
  rss.resource_id,
  rss.user_id,
  rss.username,
  rss.resource_type,
  rss.available_capacity,
  rss.cost_per_hour,
  rss.skill_match_score,
  rss.matched_skill_count,
  -- 総合スコア（スキルマッチ + 配分可能率 - コスト）
  (rss.skill_match_score * 10 + rss.available_capacity * 5 - rss.cost_per_hour / 10000.0) AS overall_score
FROM resource_skill_scores rss
WHERE rss.matched_skill_count >= $minMatchedSkills
ORDER BY
  overall_score DESC,
  skill_match_score DESC,
  available_capacity DESC
LIMIT $teamSize;
```

**利用例**:
- プロジェクトチーム編成
- 最適リソース配置
- スキルバランス最適化

---

### 14. チームパフォーマンス分析

チームのパフォーマンス履歴と現状を分析。

```sql
-- パフォーマンス: p95 < 100ms
WITH team_latest_performance AS (
  SELECT
    team_id,
    recorded_period,
    velocity,
    quality_score,
    collaboration_score,
    delivery_on_time_rate,
    customer_satisfaction,
    ROW_NUMBER() OVER (PARTITION BY team_id ORDER BY recorded_at DESC) AS rn
  FROM team_performance_history
  WHERE team_id = $teamId
)
SELECT
  t.id,
  t.name,
  t.team_type,
  t.status,
  t.member_count,
  t.leader_count,
  -- 最新パフォーマンス
  tlp.recorded_period AS latest_period,
  tlp.velocity,
  tlp.quality_score,
  tlp.collaboration_score,
  tlp.delivery_on_time_rate,
  tlp.customer_satisfaction,
  -- チームスキル統計
  AVG(ts.level) AS avg_team_skill_level,
  COUNT(DISTINCT ts.skill_id) AS unique_skills,
  COUNT(DISTINCT ts.skill_id) FILTER (WHERE ts.level >= 4) AS expert_skills,
  -- メンバー統計
  AVG(tm.allocation_rate) AS avg_member_allocation,
  COUNT(DISTINCT tm.resource_id) FILTER (WHERE tm.is_leader = true) AS active_leaders
FROM teams t
LEFT JOIN team_latest_performance tlp ON t.id = tlp.team_id AND tlp.rn = 1
LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.status = 'active'
LEFT JOIN talent_skills ts ON tm.resource_id = ts.resource_id
WHERE t.id = $teamId
GROUP BY t.id, t.name, t.team_type, t.status, t.member_count, t.leader_count,
         tlp.recorded_period, tlp.velocity, tlp.quality_score,
         tlp.collaboration_score, tlp.delivery_on_time_rate,
         tlp.customer_satisfaction;
```

**利用例**:
- チームダッシュボード
- パフォーマンスレビュー
- チーム改善施策

---

## タイムシート・稼働率クエリ {#timesheet-utilization-queries}

### 15. リソース稼働率サマリー

リソース別の稼働率サマリーを期間指定で取得。

```sql
-- パフォーマンス: p95 < 100ms
SELECT
  r.id AS resource_id,
  r.user_id,
  u.username,
  r.resource_type,
  r.department,
  -- 期間内の稼働率
  AVG(ruh.utilization_rate) AS avg_utilization_rate,
  AVG(ruh.billable_rate) AS avg_billable_rate,
  SUM(ruh.total_hours_worked) AS total_hours,
  SUM(ruh.billable_hours) AS total_billable_hours,
  SUM(ruh.overtime_hours) AS total_overtime_hours,
  -- 月数
  COUNT(DISTINCT ruh.period_year_month) AS months_count
FROM resources r
JOIN users u ON r.user_id = u.id
LEFT JOIN resource_utilization_history ruh
  ON r.id = ruh.resource_id
  AND ruh.period_year_month BETWEEN $startYearMonth AND $endYearMonth
WHERE r.status != 'unavailable'
  AND ($department IS NULL OR r.department = $department)
  AND ($resourceType IS NULL OR r.resource_type = $resourceType)
  AND r.deleted_at IS NULL
GROUP BY r.id, r.user_id, u.username, r.resource_type, r.department
ORDER BY
  avg_utilization_rate DESC,
  avg_billable_rate DESC
LIMIT $pageSize OFFSET $offset;
```

**利用例**:
- 稼働率レポート
- リソース生産性分析
- 配分計画調整

---

### 16. プロジェクト別工数集計

プロジェクト別の実績工数を集計。

```sql
-- パフォーマンス: p95 < 150ms
SELECT
  te.project_id,
  p.name AS project_name,
  p.code AS project_code,
  -- 工数集計
  COUNT(DISTINCT te.timesheet_id) AS timesheet_count,
  COUNT(DISTINCT r.id) AS resource_count,
  SUM(te.hours) AS total_hours,
  SUM(te.hours) FILTER (WHERE te.is_billable = true) AS billable_hours,
  SUM(te.hours) FILTER (WHERE te.is_billable = false) AS non_billable_hours,
  -- タスク種別内訳
  jsonb_object_agg(
    te.task_type,
    SUM(te.hours)
  ) FILTER (WHERE te.task_type IS NOT NULL) AS hours_by_task_type,
  -- 期間
  MIN(te.work_date) AS first_work_date,
  MAX(te.work_date) AS last_work_date
FROM timesheet_entries te
JOIN timesheets ts ON te.timesheet_id = ts.id
JOIN resources r ON ts.resource_id = r.id
LEFT JOIN projects p ON te.project_id = p.id  -- BC-001
WHERE te.work_date BETWEEN $startDate AND $endDate
  AND ts.status = 'approved'
  AND ($projectId IS NULL OR te.project_id = $projectId)
GROUP BY te.project_id, p.name, p.code
ORDER BY total_hours DESC;
```

**利用例**:
- プロジェクト実績レポート
- コスト集計
- プロジェクト採算分析

---

### 17. 承認待ちタイムシート一覧

承認者別の承認待ちタイムシートを取得。

```sql
-- パフォーマンス: p95 < 50ms
SELECT
  ts.id,
  ts.resource_id,
  r.user_id,
  u.username AS submitter_name,
  u.email AS submitter_email,
  ts.period_start,
  ts.period_end,
  ts.total_hours,
  ts.billable_hours,
  ts.submitted_at,
  EXTRACT(DAY FROM CURRENT_TIMESTAMP - ts.submitted_at) AS days_pending,
  t.manager_id AS expected_approver_id,
  m.username AS expected_approver_name,
  -- エントリサマリー
  COUNT(DISTINCT te.project_id) AS project_count,
  COUNT(te.id) AS entry_count
FROM timesheets ts
JOIN resources r ON ts.resource_id = r.id
JOIN users u ON r.user_id = u.id
LEFT JOIN talents t ON r.id = t.resource_id
LEFT JOIN users m ON t.manager_id = m.id
LEFT JOIN timesheet_entries te ON ts.id = te.timesheet_id
WHERE ts.status = 'submitted'
  AND ($approverId IS NULL OR t.manager_id = $approverId)
GROUP BY ts.id, ts.resource_id, r.user_id, u.username, u.email,
         ts.period_start, ts.period_end, ts.total_hours, ts.billable_hours,
         ts.submitted_at, t.manager_id, m.username
ORDER BY
  ts.submitted_at ASC,
  days_pending DESC
LIMIT $pageSize OFFSET $offset;
```

**利用例**:
- 承認者ダッシュボード
- 承認待ち一覧
- タイムシート承認フロー

---

### 18. タイムシート異常検知

異常なタイムシート（過剰工数・低稼働等）を検知。

```sql
-- パフォーマンス: p95 < 100ms
WITH daily_hours AS (
  SELECT
    te.timesheet_id,
    te.work_date,
    SUM(te.hours) AS daily_total
  FROM timesheet_entries te
  JOIN timesheets ts ON te.timesheet_id = ts.id
  WHERE ts.period_start >= $startDate
    AND ts.period_end <= $endDate
  GROUP BY te.timesheet_id, te.work_date
  HAVING SUM(te.hours) > 12  -- 1日12時間超
),
low_utilization AS (
  SELECT
    ts.id AS timesheet_id
  FROM timesheets ts
  WHERE ts.period_start >= $startDate
    AND ts.period_end <= $endDate
    AND ts.total_hours < 80  -- 週次タイムシートで80時間未満（2週間で）
    AND EXTRACT(DAY FROM ts.period_end - ts.period_start) >= 7
)
SELECT
  ts.id,
  ts.resource_id,
  u.username,
  ts.period_start,
  ts.period_end,
  ts.total_hours,
  ts.status,
  -- 異常種別
  CASE
    WHEN dh.timesheet_id IS NOT NULL THEN 'excessive_daily_hours'
    WHEN lu.timesheet_id IS NOT NULL THEN 'low_utilization'
    ELSE NULL
  END AS anomaly_type,
  dh.work_date AS anomaly_date,
  dh.daily_total AS anomaly_hours
FROM timesheets ts
JOIN resources r ON ts.resource_id = r.id
JOIN users u ON r.user_id = u.id
LEFT JOIN daily_hours dh ON ts.id = dh.timesheet_id
LEFT JOIN low_utilization lu ON ts.id = lu.timesheet_id
WHERE dh.timesheet_id IS NOT NULL OR lu.timesheet_id IS NOT NULL
ORDER BY ts.period_start DESC, anomaly_type;
```

**利用例**:
- タイムシート監査
- 異常検知アラート
- 労務管理

---

## 統計・分析クエリ {#statistics-queries}

### 19. 部門別リソース統計

部門別のリソース・スキル・稼働率統計を取得。

```sql
-- パフォーマンス: p95 < 200ms
SELECT
  r.department,
  -- リソース統計
  COUNT(DISTINCT r.id) AS total_resources,
  COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'available') AS available_resources,
  COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'allocated') AS allocated_resources,
  -- 稼働率統計
  AVG(r.current_utilization) AS avg_utilization,
  AVG(ruh.utilization_rate) FILTER (WHERE ruh.period_year_month = TO_CHAR(CURRENT_DATE, 'YYYY-MM'))
    AS current_month_utilization,
  AVG(ruh.billable_rate) FILTER (WHERE ruh.period_year_month = TO_CHAR(CURRENT_DATE, 'YYYY-MM'))
    AS current_month_billable_rate,
  -- スキル統計
  AVG(skill_stats.avg_skill_level) AS dept_avg_skill_level,
  AVG(skill_stats.skill_count) AS avg_skills_per_resource,
  -- タレント統計
  COUNT(DISTINCT t.id) AS talent_count,
  AVG(t.potential_rating) FILTER (WHERE t.potential_rating IS NOT NULL) AS avg_potential_rating,
  COUNT(DISTINCT t.id) FILTER (WHERE t.risk_of_attrition = 'high') AS high_attrition_risk_count
FROM resources r
LEFT JOIN resource_utilization_history ruh ON r.id = ruh.resource_id
LEFT JOIN talents t ON r.id = t.resource_id
LEFT JOIN LATERAL (
  SELECT
    AVG(ts.level) AS avg_skill_level,
    COUNT(DISTINCT ts.skill_id) AS skill_count
  FROM talent_skills ts
  WHERE ts.resource_id = r.id
) skill_stats ON true
WHERE r.deleted_at IS NULL
  AND ($department IS NULL OR r.department = $department)
GROUP BY r.department
ORDER BY total_resources DESC;
```

**利用例**:
- 部門別ダッシュボード
- リソース配置分析
- 部門間比較

---

### 20. スキル需給バランス分析

スキル別の需要と供給のバランスを分析。

```sql
-- パフォーマンス: p95 < 300ms
WITH skill_supply AS (
  SELECT
    ts.skill_id,
    COUNT(DISTINCT ts.resource_id) AS total_holders,
    COUNT(DISTINCT ts.resource_id) FILTER (WHERE ts.level >= 3) AS advanced_holders,
    AVG(ts.level) AS avg_level
  FROM talent_skills ts
  JOIN resources r ON ts.resource_id = r.id
  WHERE r.status IN ('available', 'allocated')
    AND r.deleted_at IS NULL
  GROUP BY ts.skill_id
),
skill_demand AS (
  -- プロジェクト要件からスキル需要を集計（JSONB展開）
  SELECT
    (req->>'skill_id')::UUID AS skill_id,
    SUM((req->>'count')::INTEGER) AS demand_count
  FROM projects p,
       jsonb_array_elements(p.required_skills) AS req
  WHERE p.status IN ('planned', 'in_progress')
    AND p.start_date <= CURRENT_DATE + INTERVAL '3 months'
  GROUP BY skill_id
)
SELECT
  s.id AS skill_id,
  s.name AS skill_name,
  sc.name AS category_name,
  s.market_demand,
  -- 供給
  COALESCE(ss.total_holders, 0) AS current_supply,
  COALESCE(ss.advanced_holders, 0) AS advanced_supply,
  COALESCE(ss.avg_level, 0) AS avg_skill_level,
  -- 需要
  COALESCE(sd.demand_count, 0) AS projected_demand,
  -- ギャップ
  COALESCE(sd.demand_count, 0) - COALESCE(ss.advanced_holders, 0) AS supply_gap,
  -- 需給バランス
  CASE
    WHEN COALESCE(sd.demand_count, 0) = 0 THEN 'no_demand'
    WHEN COALESCE(ss.advanced_holders, 0) >= COALESCE(sd.demand_count, 0) THEN 'adequate'
    WHEN COALESCE(ss.advanced_holders, 0) >= COALESCE(sd.demand_count, 0) * 0.7 THEN 'tight'
    ELSE 'shortage'
  END AS balance_status
FROM skills s
JOIN skill_categories sc ON s.category_id = sc.id
LEFT JOIN skill_supply ss ON s.id = ss.skill_id
LEFT JOIN skill_demand sd ON s.id = sd.skill_id
WHERE s.status = 'active'
  AND ($categoryId IS NULL OR s.category_id = $categoryId)
ORDER BY
  (COALESCE(sd.demand_count, 0) - COALESCE(ss.advanced_holders, 0)) DESC,
  s.market_demand DESC;
```

**利用例**:
- スキル需給分析
- トレーニング計画
- 採用計画

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-005 データ層詳細化
