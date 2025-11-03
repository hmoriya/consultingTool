# BC-004: テーブル定義詳細

**ドキュメント**: データ層 - テーブル定義
**最終更新**: 2025-11-03

このドキュメントでは、BC-004の全11テーブルの詳細定義を記載します。

---

## 目次

### 組織管理グループ
1. [organizations](#table-organizations)
2. [organization_units](#table-organization-units)
3. [organization_hierarchies](#table-organization-hierarchies)
4. [organization_members](#table-organization-members)

### チーム管理グループ
5. [teams](#table-teams)
6. [team_members](#table-team-members)
7. [team_leaders](#table-team-leaders)

### ガバナンス管理グループ
8. [governance_policies](#table-governance-policies)
9. [governance_rules](#table-governance-rules)
10. [policy_scopes](#table-policy-scopes)
11. [policy_violations](#table-policy-violations)

### マテリアライズドビュー
12. [mv_user_allocation_summary](#view-user-allocation-summary)
13. [mv_team_statistics](#view-team-statistics)
14. [mv_unit_statistics](#view-unit-statistics)

---

## 組織管理グループ

### 1. organizations {#table-organizations}

組織マスタテーブル。企業、事業部、支社など最上位組織エンティティを管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 組織ID |
| name | VARCHAR(200) | NOT NULL | | 組織名 |
| code | VARCHAR(50) | NOT NULL, UNIQUE | | 組織コード（英数字、一意） |
| type | VARCHAR(50) | NOT NULL | | 組織タイプ |
| description | TEXT | | NULL | 組織説明 |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| root_unit_id | UUID | FK → organization_units | NULL | ルート組織単位ID |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |
| deleted_at | TIMESTAMP | | NULL | 論理削除日時 |

**組織タイプ** (type):
- `headquarters`: 本社
- `branch`: 支社・支店
- `division`: 事業部
- `subsidiary`: 子会社
- `affiliate`: 関連会社

**ステータス** (status):
- `active`: 有効
- `inactive`: 無効
- `suspended`: 一時停止

**ビジネスルール**:
- code は組織内で一意
- 組織作成時に自動的にルート組織単位が作成される
- root_unit_id は組織作成後に設定される（初期はNULL）

**推定データ量**: ~100組織

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 2. organization_units {#table-organization-units}

組織単位テーブル。部署、課、グループなど組織内の単位を階層構造で管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 組織単位ID |
| organization_id | UUID | FK → organizations, NOT NULL | | 所属組織ID |
| name | VARCHAR(200) | NOT NULL | | 組織単位名 |
| parent_unit_id | UUID | FK → organization_units | NULL | 親組織単位ID（ルートはNULL） |
| hierarchy_level | INTEGER | NOT NULL | 0 | 階層レベル（0=ルート） |
| path | VARCHAR(500) | NOT NULL | | 組織パス（例: /本社/営業本部/第一営業部） |
| unit_type | VARCHAR(50) | NOT NULL | | 単位タイプ |
| description | TEXT | | NULL | 説明 |
| member_count | INTEGER | NOT NULL | 0 | 直属メンバー数（キャッシュ） |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |
| deleted_at | TIMESTAMP | | NULL | 論理削除日時 |

**単位タイプ** (unit_type):
- `root`: ルート単位
- `division`: 本部・事業部
- `department`: 部
- `section`: 課
- `team`: チーム・グループ

**ステータス** (status):
- `active`: 有効
- `inactive`: 無効

**ビジネスルール**:
- hierarchy_level は親の階層レベル + 1
- 最大階層深度は10階層
- path は親のpath + '/' + 自単位名
- parent_unit_id が NULL の場合は unit_type = 'root' かつ hierarchy_level = 0
- member_count はトリガーで自動更新

**推定データ量**: ~5,000組織単位

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 3. organization_hierarchies {#table-organization-hierarchies}

組織階層閉包テーブル。組織単位の祖先-子孫関係を高速に検索するための閉包テーブル。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 階層ID |
| ancestor_unit_id | UUID | FK → organization_units, NOT NULL | | 祖先単位ID |
| descendant_unit_id | UUID | FK → organization_units, NOT NULL | | 子孫単位ID |
| depth | INTEGER | NOT NULL | | 階層深度（0=自分自身） |
| path | VARCHAR(500) | | NULL | パス文字列（キャッシュ） |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |

**ユニーク制約**: (ancestor_unit_id, descendant_unit_id)

**ビジネスルール**:
- depth = 0 の場合、ancestor_unit_id = descendant_unit_id（自己参照）
- 組織単位追加時、親の全祖先との関係が自動挿入される
- 組織再編時、階層関係が再構築される

**クエリ例**:

```sql
-- 特定単位の全祖先を取得
SELECT u.*
FROM organization_units u
JOIN organization_hierarchies h ON u.id = h.ancestor_unit_id
WHERE h.descendant_unit_id = $unitId
  AND h.depth > 0
ORDER BY h.depth DESC;

-- 特定単位の全子孫を取得
SELECT u.*
FROM organization_units u
JOIN organization_hierarchies h ON u.id = h.descendant_unit_id
WHERE h.ancestor_unit_id = $unitId
  AND h.depth > 0
ORDER BY h.depth ASC;
```

**推定データ量**: ~50,000階層関係（平均階層深度5、単位数5,000の場合）

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 4. organization_members {#table-organization-members}

組織メンバーテーブル。ユーザーの組織単位への所属を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | メンバーID |
| organization_id | UUID | FK → organizations, NOT NULL | | 組織ID |
| unit_id | UUID | FK → organization_units, NOT NULL | | 所属組織単位ID |
| user_id | UUID | FK → BC-003.users, NOT NULL | | ユーザーID |
| role_in_unit | VARCHAR(100) | | NULL | 単位内ロール |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| joined_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 所属開始日時 |
| left_at | TIMESTAMP | | NULL | 所属終了日時 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**ステータス** (status):
- `active`: 在籍中
- `inactive`: 退職・異動済み

**ロール例** (role_in_unit):
- `manager`: 部門長・課長
- `member`: 一般メンバー
- `deputy`: 副部門長・副課長
- `leader`: リーダー

**ビジネスルール**:
- (organization_id, unit_id, user_id, status='active') の組み合わせは一意
- 1ユーザーは複数の組織単位に所属可能（兼務）
- status='inactive' の場合、left_at は必須
- メンバー追加時、organization_units.member_count をインクリメント

**推定データ量**: ~10,000メンバー所属記録

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

## チーム管理グループ

### 5. teams {#table-teams}

チームマスタテーブル。プロジェクトチーム、常設チーム、タスクフォースを管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | チームID |
| organization_id | UUID | FK → organizations, NOT NULL | | 所属組織ID |
| unit_id | UUID | FK → organization_units, NOT NULL | | 所属組織単位ID |
| name | VARCHAR(200) | NOT NULL | | チーム名 |
| team_type | VARCHAR(50) | NOT NULL | | チームタイプ |
| purpose | TEXT | | NULL | チーム目的・ミッション |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| member_count | INTEGER | NOT NULL | 0 | メンバー数（キャッシュ） |
| leader_count | INTEGER | NOT NULL | 0 | リーダー数（キャッシュ） |
| start_date | DATE | | NULL | 開始日 |
| end_date | DATE | | NULL | 終了予定日 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |
| deleted_at | TIMESTAMP | | NULL | 論理削除日時 |

**チームタイプ** (team_type):
- `permanent`: 常設チーム（恒常的組織）
- `project`: プロジェクトチーム（期間限定）
- `task_force`: タスクフォース（短期集中）

**ステータス** (status):
- `active`: 稼働中
- `inactive`: 解散・終了

**ビジネスルール**:
- team_type='project' または 'task_force' の場合、start_date と end_date は推奨
- status='active' のチームは最低1名のリーダーが必要
- member_count と leader_count はトリガーで自動更新
- (organization_id, name, status='active') の組み合わせは一意

**推定データ量**: ~500チーム

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 6. team_members {#table-team-members}

チームメンバーテーブル。ユーザーのチームへの所属とアロケーション率を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | メンバーID |
| team_id | UUID | FK → teams, NOT NULL | | チームID |
| user_id | UUID | FK → BC-003.users, NOT NULL | | ユーザーID |
| allocation_rate | DECIMAL(4,2) | NOT NULL, CHECK (allocation_rate >= 0.0 AND allocation_rate <= 1.0) | 1.00 | アロケーション率（0.0-1.0） |
| role | VARCHAR(100) | | NULL | チーム内ロール |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| start_date | DATE | | NULL | 参加開始日 |
| end_date | DATE | | NULL | 参加終了予定日 |
| joined_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 参加日時 |
| left_at | TIMESTAMP | | NULL | 離脱日時 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**ステータス** (status):
- `active`: 参加中
- `inactive`: 離脱済み

**ロール例** (role):
- `project_manager`: プロジェクトマネージャー
- `developer`: 開発者
- `designer`: デザイナー
- `consultant`: コンサルタント
- `analyst`: アナリスト

**ビジネスルール**:
- allocation_rate は 0.0（0%）から 1.0（100%）の範囲
- 1ユーザーの全チーム合計アロケーション率は 2.0（200%）以下
- (team_id, user_id, status='active') の組み合わせは一意
- status='inactive' の場合、left_at は必須
- メンバー追加時、teams.member_count をインクリメント
- トリガーでユーザーの総アロケーション率をチェック

**アロケーション率の意味**:
- 1.00 = 100%（フルタイム）
- 0.50 = 50%（半分の時間）
- 0.25 = 25%（1/4の時間）

**推定データ量**: ~2,500チームメンバー記録

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 7. team_leaders {#table-team-leaders}

チームリーダーテーブル。チームのリーダーシップを管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | リーダーID |
| team_id | UUID | FK → teams, NOT NULL | | チームID |
| member_id | UUID | FK → team_members, NOT NULL | | メンバーID |
| user_id | UUID | FK → BC-003.users, NOT NULL | | ユーザーID |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| assigned_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 任命日時 |
| removed_at | TIMESTAMP | | NULL | 解任日時 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |

**ステータス** (status):
- `active`: リーダー中
- `inactive`: 解任済み

**ビジネスルール**:
- リーダーになるには該当チームの active メンバーである必要がある
- (team_id, member_id, status='active') の組み合わせは一意
- 1チームに複数のリーダーが存在可能（共同リーダー）
- status='active' のチームは最低1名のリーダーが必要
- リーダー任命時、teams.leader_count をインクリメント
- 最後のリーダーを解任する場合はエラー

**推定データ量**: ~500リーダー記録

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

## ガバナンス管理グループ

### 8. governance_policies {#table-governance-policies}

ガバナンスポリシーマスタテーブル。組織のガバナンスルールを管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | ポリシーID |
| organization_id | UUID | FK → organizations, NOT NULL | | 組織ID |
| name | VARCHAR(200) | NOT NULL | | ポリシー名 |
| description | TEXT | | NULL | ポリシー説明 |
| policy_type | VARCHAR(50) | NOT NULL | | ポリシータイプ |
| priority | INTEGER | NOT NULL | 100 | 優先度（高いほど優先） |
| enforcement_level | VARCHAR(20) | NOT NULL | 'strict' | 適用レベル |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| effective_from | DATE | NOT NULL | | 有効開始日 |
| effective_until | DATE | | NULL | 有効終了日 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |
| deleted_at | TIMESTAMP | | NULL | 論理削除日時 |

**ポリシータイプ** (policy_type):
- `allocation`: アロケーション制約
- `hierarchy`: 階層構造制約
- `access_control`: アクセス制御
- `approval`: 承認ワークフロー
- `compliance`: コンプライアンス要件

**適用レベル** (enforcement_level):
- `strict`: 厳格（違反は操作をブロック）
- `warning`: 警告（違反を通知するが操作は許可）
- `audit`: 監査（違反をログに記録）

**ステータス** (status):
- `active`: 有効
- `inactive`: 無効
- `draft`: 下書き

**ビジネスルール**:
- priority は評価順序を決定（降順）
- effective_from ≤ 現在日時 ≤ effective_until の期間のみ適用
- (organization_id, name, status='active') の組み合わせは一意

**推定データ量**: ~100ポリシー

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 9. governance_rules {#table-governance-rules}

ポリシールールテーブル。ポリシーの具体的なルール条件を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | ルールID |
| policy_id | UUID | FK → governance_policies, NOT NULL | | ポリシーID |
| name | VARCHAR(200) | NOT NULL | | ルール名 |
| description | TEXT | | NULL | ルール説明 |
| condition | TEXT | NOT NULL | | 条件式 |
| error_message | TEXT | NOT NULL | | 違反時エラーメッセージ |
| severity | VARCHAR(20) | NOT NULL | 'error' | 重要度 |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**重要度** (severity):
- `error`: エラー（操作をブロック）
- `warning`: 警告（通知のみ）
- `info`: 情報（ログ記録のみ）

**ステータス** (status):
- `active`: 有効
- `inactive`: 無効

**条件式** (condition):

条件式は簡易的な評価式で記述します:

```
// 変数
user.totalAllocationRate     // ユーザーの総アロケーション率
user.teamCount                // ユーザーのチーム参加数
team.memberCount              // チームのメンバー数
team.teamType                 // チームタイプ
unit.hierarchyLevel           // 組織単位の階層レベル
organization.unitCount        // 組織の単位数

// 演算子
==, !=, >, >=, <, <=, &&, ||, !

// 例
user.totalAllocationRate <= 2.0
team.teamType == 'project' && team.memberCount >= 3
unit.hierarchyLevel <= 10
```

**ビジネスルール**:
- condition 式は評価エンジンで解析される
- severity は policy.enforcement_level と組み合わせて適用される

**推定データ量**: ~500ルール

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 10. policy_scopes {#table-policy-scopes}

ポリシー適用範囲テーブル。ポリシーの適用対象を管理。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | スコープID |
| policy_id | UUID | FK → governance_policies, NOT NULL | | ポリシーID |
| target_type | VARCHAR(50) | NOT NULL | | 対象タイプ |
| target_id | UUID | NOT NULL | | 対象ID |
| include_descendants | BOOLEAN | NOT NULL | FALSE | 子孫を含むか |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**対象タイプ** (target_type):
- `organization`: 組織全体
- `unit`: 組織単位
- `team`: チーム
- `user`: 個別ユーザー

**ステータス** (status):
- `active`: 有効
- `inactive`: 無効

**ビジネスルール**:
- include_descendants=true の場合、target_type='unit' なら子孫単位も対象
- (policy_id, target_type, target_id) の組み合わせは一意
- ポリシー評価時、organization_hierarchies を使用して子孫を取得

**推定データ量**: ~1,000適用範囲

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

### 11. policy_violations {#table-policy-violations}

ポリシー違反記録テーブル。ガバナンスポリシー違反を記録。

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 違反ID |
| policy_id | UUID | FK → governance_policies, NOT NULL | | ポリシーID |
| rule_id | UUID | FK → governance_rules, NOT NULL | | ルールID |
| target_type | VARCHAR(50) | NOT NULL | | 違反対象タイプ |
| target_id | UUID | NOT NULL | | 違反対象ID |
| severity | VARCHAR(20) | NOT NULL | | 重要度 |
| error_message | TEXT | NOT NULL | | エラーメッセージ |
| context | JSONB | | NULL | 違反時のコンテキスト情報 |
| status | VARCHAR(20) | NOT NULL | 'active' | ステータス |
| detected_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 検知日時 |
| resolved_at | TIMESTAMP | | NULL | 解決日時 |
| resolved_by | UUID | FK → BC-003.users | NULL | 解決者ID |
| resolution | TEXT | | NULL | 解決方法 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |

**重要度** (severity):
- `error`: エラー
- `warning`: 警告
- `info`: 情報

**ステータス** (status):
- `active`: 未解決
- `resolved`: 解決済み
- `dismissed`: 無視

**ビジネスルール**:
- context には違反時の詳細情報（JSON形式）を記録
- status='resolved' の場合、resolved_at と resolved_by は必須
- パーティショニング: detected_at の年単位で分割

**context の例**:
```json
{
  "userId": "user-uuid",
  "userName": "田中次郎",
  "currentValue": 2.10,
  "threshold": 2.00,
  "teams": [
    {"teamId": "team-1", "teamName": "プロジェクトAlpha", "allocationRate": 1.00},
    {"teamId": "team-2", "teamName": "プロジェクトBeta", "allocationRate": 0.80}
  ]
}
```

**推定データ量**: ~10,000+違反記録（年間成長）

**パーティショニング**: 年次パーティション

**インデックス**: [indexes-constraints.md](indexes-constraints.md) 参照

---

## マテリアライズドビュー

### 12. mv_user_allocation_summary {#view-user-allocation-summary}

ユーザー別アロケーション集計ビュー。各ユーザーのチーム参加状況を集計。

```sql
CREATE MATERIALIZED VIEW mv_user_allocation_summary AS
SELECT
  tm.user_id,
  COUNT(DISTINCT tm.team_id) AS team_count,
  SUM(tm.allocation_rate) AS total_allocation_rate,
  ROUND(2.0 - SUM(tm.allocation_rate), 2) AS available_allocation_rate,
  MAX(tm.updated_at) AS last_updated_at
FROM team_members tm
WHERE tm.status = 'active'
GROUP BY tm.user_id;

CREATE UNIQUE INDEX idx_mv_user_allocation_summary_user_id
  ON mv_user_allocation_summary(user_id);
```

**リフレッシュ**: 1時間毎（cron）

**利用用途**:
- ユーザーのアロケーション状況確認
- アロケーション制約チェック
- チーム参加可否判定

---

### 13. mv_team_statistics {#view-team-statistics}

チーム統計ビュー。各チームの統計情報を集計。

```sql
CREATE MATERIALIZED VIEW mv_team_statistics AS
SELECT
  t.id AS team_id,
  t.organization_id,
  t.unit_id,
  t.name AS team_name,
  t.team_type,
  t.status,
  COUNT(DISTINCT tm.id) AS member_count,
  COUNT(DISTINCT tl.id) AS leader_count,
  COALESCE(SUM(tm.allocation_rate), 0.0) AS total_allocation_rate,
  COALESCE(AVG(tm.allocation_rate), 0.0) AS avg_allocation_rate,
  MAX(tm.updated_at) AS last_updated_at
FROM teams t
LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.status = 'active'
LEFT JOIN team_leaders tl ON t.id = tl.team_id AND tl.status = 'active'
GROUP BY t.id, t.organization_id, t.unit_id, t.name, t.team_type, t.status;

CREATE UNIQUE INDEX idx_mv_team_statistics_team_id
  ON mv_team_statistics(team_id);
```

**リフレッシュ**: 1時間毎（cron）

**利用用途**:
- チームダッシュボード
- チーム統計レポート
- リソース配分分析

---

### 14. mv_unit_statistics {#view-unit-statistics}

組織単位統計ビュー。各組織単位の統計情報を集計。

```sql
CREATE MATERIALIZED VIEW mv_unit_statistics AS
SELECT
  u.id AS unit_id,
  u.organization_id,
  u.name AS unit_name,
  u.hierarchy_level,
  u.status,
  COUNT(DISTINCT om.id) AS member_count,
  COUNT(DISTINCT t.id) AS team_count,
  COALESCE(SUM(tm.allocation_rate), 0.0) AS total_allocation_rate,
  MAX(u.updated_at) AS last_updated_at
FROM organization_units u
LEFT JOIN organization_members om ON u.id = om.unit_id AND om.status = 'active'
LEFT JOIN teams t ON u.id = t.unit_id AND t.status = 'active'
LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.status = 'active'
GROUP BY u.id, u.organization_id, u.name, u.hierarchy_level, u.status;

CREATE UNIQUE INDEX idx_mv_unit_statistics_unit_id
  ON mv_unit_statistics(unit_id);
```

**リフレッシュ**: 1日1回（深夜バッチ）

**利用用途**:
- 組織構造ダッシュボード
- 組織単位レポート
- 人員配置分析

---

## 関連ドキュメント

- [README.md](README.md) - データ層概要
- [indexes-constraints.md](indexes-constraints.md) - インデックスと制約
- [query-patterns.md](query-patterns.md) - クエリパターン集
- [backup-operations.md](backup-operations.md) - 運用とバックアップ

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.3 - BC-004 データ層詳細化
