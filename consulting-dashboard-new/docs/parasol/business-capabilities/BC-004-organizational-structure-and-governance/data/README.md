# BC-004: データ設計

**BC**: Organizational Structure & Governance
**作成日**: 2025-10-31
**V2移行元**: services/secure-access-service/database-design.md（組織管理テーブルのみ）

---

## 概要

このドキュメントは、BC-004（組織構造とガバナンス）のデータモデルとデータベース設計を定義します。

---

## 主要テーブル

### organizations
組織マスタ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 組織ID |
| name | VARCHAR(200) | NOT NULL | 組織名 |
| code | VARCHAR(50) | NOT NULL, UNIQUE | 組織コード |
| type | VARCHAR(50) | NOT NULL | 組織タイプ（headquarters/branch/division/department） |
| description | TEXT | | 説明 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: code, type

---

### organization_units
組織単位

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 単位ID |
| organization_id | UUID | FK → organizations, NOT NULL | 組織ID |
| name | VARCHAR(200) | NOT NULL | 単位名 |
| parent_unit_id | UUID | FK → organization_units | 親単位ID |
| hierarchy_level | INTEGER | NOT NULL | 階層レベル（0=ルート） |
| path | VARCHAR(500) | | 組織パス |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: organization_id, parent_unit_id, hierarchy_level

---

### organization_hierarchies
組織階層（閉包テーブル）

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 階層ID |
| ancestor_unit_id | UUID | FK → organization_units, NOT NULL | 祖先単位ID |
| descendant_unit_id | UUID | FK → organization_units, NOT NULL | 子孫単位ID |
| depth | INTEGER | NOT NULL | 階層深度（0=自分自身） |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: ancestor_unit_id, descendant_unit_id, depth
**ユニーク制約**: (ancestor_unit_id, descendant_unit_id)

---

### organization_members
組織メンバー

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | メンバーID |
| organization_id | UUID | FK → organizations, NOT NULL | 組織ID |
| unit_id | UUID | FK → organization_units, NOT NULL | 単位ID |
| user_id | UUID | FK → users（BC-003）, NOT NULL | ユーザーID |
| role_in_unit | VARCHAR(100) | | 単位内ロール |
| joined_at | TIMESTAMP | NOT NULL | 参加日時 |

**インデックス**: organization_id, unit_id, user_id

---

## データフロー

### 組織作成フロー
```
1. organizations テーブルにINSERT
2. ルート単位をorganization_units テーブルにINSERT（parent_unit_id = NULL）
3. organization_hierarchies テーブルに自己参照レコードINSERT（depth = 0）
4. BC-007 へ組織作成通知
```

### 組織単位追加フロー
```
1. organization_units テーブルにINSERT
2. 親単位との階層関係をorganization_hierarchies テーブルにINSERT
3. パスを更新（path）
4. BC-007 へ組織変更通知
```

---

**ステータス**: Phase 0 - 基本構造作成完了
