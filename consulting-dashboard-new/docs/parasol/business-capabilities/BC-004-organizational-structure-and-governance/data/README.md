# BC-004: データ層設計

**BC**: Organizational Structure & Governance [組織構造とガバナンス] [BC_004]
**作成日**: 2025-10-31
**最終更新**: 2025-11-03
**V2移行元**: services/secure-access-service/database-design.md（組織管理テーブルのみ）

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

BC-004のデータ層は、組織構造、チーム管理、ガバナンスポリシーの永続化を担当します。

### 主要機能

- **組織管理**: 組織と組織単位の階層構造管理（最大10階層）
- **チーム管理**: プロジェクトチーム、常設チーム、タスクフォースの管理
- **メンバー管理**: 組織メンバーとチームメンバーの所属管理
- **アロケーション管理**: メンバーのチーム参加率管理（最大200%）
- **ガバナンス管理**: ポリシー、ルール、適用範囲、違反検知

### 技術スタック

- **DBMS**: PostgreSQL 14+
- **主要機能**:
  - 閉包テーブル（Closure Table）による高速階層クエリ
  - トリガーによる階層整合性保証
  - パーティショニングによる大規模データ管理
  - マテリアライズドビューによる統計集計
  - CHECK制約によるデータ整合性保証

---

## アーキテクチャ {#architecture}

### データグループ

BC-004のテーブルは以下の4グループに分類されます:

```
BC-004 Data Layer
├── 組織管理グループ（4テーブル）
│   ├── organizations（組織マスタ）
│   ├── organization_units（組織単位）
│   ├── organization_hierarchies（階層閉包テーブル）
│   └── organization_members（組織メンバー）
│
├── チーム管理グループ（3テーブル）
│   ├── teams（チームマスタ）
│   ├── team_members（チームメンバー・アロケーション）
│   └── team_leaders（チームリーダー）
│
├── ガバナンスグループ（4テーブル）
│   ├── governance_policies（ポリシーマスタ）
│   ├── governance_rules（ポリシールール）
│   ├── policy_scopes（適用範囲）
│   └── policy_violations（違反記録）
│
└── 統計ビュー（3マテリアライズドビュー）
    ├── mv_user_allocation_summary（ユーザーアロケーション集計）
    ├── mv_team_statistics（チーム統計）
    └── mv_unit_statistics（組織単位統計）
```

### BC-003との連携

BC-004はBC-003（Access Control & Security）のユーザー管理機能に依存します:

```
BC-003.users ←→ BC-004.organization_members（組織所属）
BC-003.users ←→ BC-004.team_members（チーム所属）
BC-003.audit_logs ← BC-004（組織変更・ガバナンス違反の監査）
```

---

## テーブル一覧 {#table-list}

### コアテーブル（11テーブル）

| # | テーブル名 | 推定行数 | 説明 | パーティション |
|---|-----------|---------|------|--------------|
| 1 | **organizations** | ~100 | 組織マスタ | なし |
| 2 | **organization_units** | ~5,000 | 組織単位（部署・チーム等） | なし |
| 3 | **organization_hierarchies** | ~50,000 | 組織階層閉包テーブル | なし |
| 4 | **organization_members** | ~10,000 | 組織メンバー所属 | なし |
| 5 | **teams** | ~500 | チームマスタ | なし |
| 6 | **team_members** | ~2,500 | チームメンバー・アロケーション | なし |
| 7 | **team_leaders** | ~500 | チームリーダー | なし |
| 8 | **governance_policies** | ~100 | ガバナンスポリシー | なし |
| 9 | **governance_rules** | ~500 | ポリシールール | なし |
| 10 | **policy_scopes** | ~1,000 | ポリシー適用範囲 | なし |
| 11 | **policy_violations** | ~10,000+ | ポリシー違反記録 | 年次 |

### マテリアライズドビュー（3ビュー）

| # | ビュー名 | リフレッシュ | 説明 |
|---|---------|------------|------|
| 1 | **mv_user_allocation_summary** | 1時間毎 | ユーザー別アロケーション集計 |
| 2 | **mv_team_statistics** | 1時間毎 | チーム統計情報 |
| 3 | **mv_unit_statistics** | 1日1回 | 組織単位統計情報 |

**詳細**: [tables.md](tables.md)

---

## ER図 {#er-diagram}

### 組織管理グループ

```
┌──────────────────┐
│  organizations   │
│  ──────────────  │
│  id (PK)         │◄─┐
│  name            │  │
│  code (UQ)       │  │
│  type            │  │
│  status          │  │
│  root_unit_id    │──┼─────────┐
└──────────────────┘  │         │
                       │         │
                       │         ▼
┌──────────────────┐  │  ┌──────────────────────┐
│organization_     │  │  │organization_units    │◄─┐
│members           │  │  │──────────────────────│  │
│──────────────────│  │  │id (PK)               │  │
│id (PK)           │  │  │organization_id (FK)  │──┘
│organization_id───┼──┘  │name                  │
│unit_id (FK)      │─────┤parent_unit_id (FK)   │──┐
│user_id (FK)──────┼─────┼►hierarchy_level      │  │
│role_in_unit      │     │path                  │  │ 自己参照
│status            │     │unit_type             │  │
│joined_at         │     │member_count          │◄─┘
│left_at           │     └──────────────────────┘
└──────────────────┘              │  ▲
                                  │  │
                                  ▼  │
                         ┌──────────────────────┐
                         │organization_         │
                         │hierarchies           │
                         │──────────────────────│
                         │id (PK)               │
                         │ancestor_unit_id (FK) │
                         │descendant_unit_id(FK)│
                         │depth                 │
                         │path                  │
                         └──────────────────────┘
```

### チーム管理グループ

```
┌──────────────────┐         ┌──────────────────┐
│     teams        │         │   team_members   │
│  ──────────────  │         │  ──────────────  │
│  id (PK)         │◄────────┤  id (PK)         │
│  organization_id │         │  team_id (FK)    │
│  unit_id (FK)    │         │  user_id (FK)────┼──► BC-003.users
│  name            │         │  allocation_rate │
│  team_type       │         │  role            │
│  purpose         │         │  status          │
│  status          │         │  start_date      │
│  start_date      │         │  end_date        │
│  end_date        │         │  joined_at       │
│  member_count    │         │  left_at         │
│  leader_count    │         └──────────────────┘
└──────────────────┘                  │
         │                            │
         │                            ▼
         │                   ┌──────────────────┐
         │                   │  team_leaders    │
         │                   │  ──────────────  │
         └───────────────────┤  id (PK)         │
                             │  team_id (FK)    │
                             │  member_id (FK)  │
                             │  user_id (FK)    │
                             │  status          │
                             │  assigned_at     │
                             │  removed_at      │
                             └──────────────────┘
```

### ガバナンス管理グループ

```
┌──────────────────────┐
│ governance_policies  │
│  ──────────────────  │
│  id (PK)             │◄──┐
│  organization_id (FK)│   │
│  name                │   │
│  policy_type         │   │
│  priority            │   │
│  enforcement_level   │   │
│  status              │   │
└──────────────────────┘   │
         │                 │
         │                 │
    ┌────┼─────┬───────────┤
    ▼    ▼     ▼           │
┌────────────┐ ┌─────────────┐ ┌──────────────────┐
│governance_ │ │policy_scopes│ │policy_violations │
│rules       │ │─────────────│ │──────────────────│
│────────────│ │id (PK)      │ │id (PK)           │
│id (PK)     │ │policy_id(FK)├─┘policy_id (FK)    │
│policy_id(FK)├─┤target_type  │  rule_id (FK)     │
│name        │ │target_id    │  target_type      │
│condition   │ │include_desc │  target_id        │
│error_msg   │ │status       │  severity         │
│severity    │ └─────────────┘  status            │
│status      │                  detected_at       │
└────────────┘                  resolved_at       │
                                └──────────────────┘
```

---

## データフロー {#data-flows}

### 1. 組織作成フロー

```
POST /api/bc-004/organizations
↓
1. organizations テーブルにINSERT
   - id, name, code, type, status='active'
↓
2. ルート組織単位をorganization_units テーブルにINSERT
   - parent_unit_id = NULL
   - hierarchy_level = 0
   - path = '/{name}'
↓
3. organization_hierarchies テーブルに自己参照レコードINSERT
   - ancestor_unit_id = descendant_unit_id = unit.id
   - depth = 0
↓
4. organizations.root_unit_id を更新
↓
5. BC-003.audit_logs にログ記録
↓
6. BC-007 へイベント送信（OrganizationCreated）
```

### 2. 組織単位追加フロー（階層構造構築）

```
POST /api/bc-004/organizations/{orgId}/units
↓
1. 親単位の存在確認（parent_unit_id）
↓
2. 循環参照チェック（トリガーで自動実行）
↓
3. organization_units テーブルにINSERT
   - parent_unit_id, hierarchy_level, path計算
↓
4. organization_hierarchies テーブルに階層レコード挿入
   - 自己参照: (unit_id, unit_id, 0)
   - 親との関係: 親の全祖先 + 新単位の関係を追加
   ↓
   INSERT INTO organization_hierarchies
   SELECT ancestor_unit_id, new_unit_id, depth+1
   FROM organization_hierarchies
   WHERE descendant_unit_id = parent_unit_id
↓
5. organization_units.member_count を初期化（0）
↓
6. BC-003.audit_logs にログ記録
```

### 3. チームメンバー追加フロー（アロケーション管理）

```
POST /api/bc-004/teams/{teamId}/members
↓
1. ユーザー存在確認（BC-003.users）
↓
2. 既存アロケーション率取得
   SELECT SUM(allocation_rate)
   FROM team_members
   WHERE user_id = $1 AND status = 'active'
↓
3. アロケーション制約チェック
   - 新規アロケーション率: 0.0 ≤ rate ≤ 1.0
   - 合計アロケーション率: total ≤ 2.0（200%）
   ↓
   トリガー: check_user_allocation_limit()
↓
4. ガバナンスポリシー評価
   - applicable policies取得
   - ルール評価実行
   - violation検出時はエラー返却 or 警告
↓
5. team_members テーブルにINSERT
↓
6. teams.member_count をインクリメント（トリガー）
↓
7. mv_user_allocation_summary を更新（非同期）
↓
8. BC-003.audit_logs にログ記録
```

### 4. ガバナンスポリシー評価フロー

```
POST /api/bc-004/governance/policies/evaluate
↓
1. 適用可能ポリシー取得
   - organizationId, unitId, teamIdから対象スコープ特定
   - policy_scopes テーブルでマッチング
   - includeDescendants=trueの場合は階層考慮
↓
2. 各ポリシーのルール評価
   FOR EACH policy IN applicable_policies:
     FOR EACH rule IN policy.rules:
       - condition式を評価（例: user.totalAllocationRate <= 2.0）
       - context情報を変数バインド
       - 評価エンジンで真偽判定
       ↓
       IF rule違反:
         - violation記録作成
         - enforcement_levelに応じた処理:
           * strict: エラー返却（操作をブロック）
           * warning: 警告返却（操作は許可）
           * audit: ログのみ（policy_violations INSERT）
↓
3. 評価結果返却
   - allowed: true/false
   - violations: [...]
   - warnings: [...]
↓
4. policy_violations テーブルにINSERT（必要に応じて）
```

### 5. 組織再編フロー（親単位変更）

```
PUT /api/bc-004/organizations/{orgId}/units/{unitId}/parent
↓
1. 循環参照チェック
   - 新親が対象単位の子孫でないことを確認
   - organization_hierarchies テーブルで確認
   ↓
   SELECT COUNT(*) FROM organization_hierarchies
   WHERE ancestor_unit_id = $unitId
     AND descendant_unit_id = $newParentUnitId
   -- 結果が0であること
↓
2. 最大階層深度チェック（最大10階層）
   - 新親の階層レベル + 対象単位の子孫最大深度 ≤ 10
↓
3. organization_hierarchies テーブル更新
   a. 古い階層関係削除（自己参照以外）
   DELETE FROM organization_hierarchies
   WHERE descendant_unit_id IN (
     SELECT descendant_unit_id
     FROM organization_hierarchies
     WHERE ancestor_unit_id = $unitId
   )
   AND depth > 0

   b. 新しい階層関係挿入
   INSERT INTO organization_hierarchies
   SELECT p.ancestor_unit_id, c.descendant_unit_id, p.depth+c.depth+1
   FROM organization_hierarchies p
   CROSS JOIN organization_hierarchies c
   WHERE p.descendant_unit_id = $newParentUnitId
     AND c.ancestor_unit_id = $unitId
↓
4. organization_units テーブル更新
   - parent_unit_id, hierarchy_level, path更新
   - 子孫単位のpath一括更新
↓
5. 影響を受けた単位数をカウント
↓
6. BC-003.audit_logs にログ記録
   - affectedDescendantCount記録
```

---

## BC間連携 {#bc-integration}

### BC-003（Access Control & Security）

**依存関係**: BC-004 → BC-003

| BC-003テーブル | BC-004での利用 | 説明 |
|---------------|--------------|------|
| `users` | `organization_members.user_id` | 組織メンバー |
| `users` | `team_members.user_id` | チームメンバー |
| `audit_logs` | 全操作 | 監査ログ記録 |

**データフロー**:
```
BC-003.users ──► BC-004.organization_members（組織所属）
BC-003.users ──► BC-004.team_members（チーム所属）
BC-004.* ──► BC-003.audit_logs（監査ログ）
```

### BC-007（Notification Service）

**依存関係**: BC-004 → BC-007

**イベント送信**:
- `OrganizationCreated`: 組織作成時
- `OrganizationUnitCreated`: 組織単位作成時
- `OrganizationRestructured`: 組織再編時
- `TeamCreated`: チーム作成時
- `TeamMemberAdded`: チームメンバー追加時
- `GovernanceViolationDetected`: ガバナンス違反検知時

---

## 詳細ドキュメント {#detailed-docs}

BC-004データ層の詳細は以下のドキュメントを参照してください:

1. **[tables.md](tables.md)** - 全11テーブルの詳細定義
   - カラム定義、制約、ビジネスルール
   - 推定データ量、パーティショニング戦略

2. **[indexes-constraints.md](indexes-constraints.md)** - インデックスと制約
   - 全インデックス定義（80+）
   - トリガー関数（15+）
   - CHECK制約、ユニーク制約

3. **[query-patterns.md](query-patterns.md)** - クエリパターン集
   - 階層クエリ（祖先・子孫取得）
   - アロケーション集計
   - ガバナンスポリシー評価
   - パフォーマンス目標（p95）

4. **[backup-operations.md](backup-operations.md)** - 運用とバックアップ
   - バックアップ戦略
   - リストア手順
   - パーティション管理
   - マテリアライズドビュー更新

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.3 - BC-004 データ層詳細化
