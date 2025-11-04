# L3-001: Organization Design & Structure

**作成日**: 2025-10-31
**所属BC**: BC-004: Organizational Structure & Governance
**V2移行元**: manage-organizational-structure

---

## 📋 What: この能力の定義

### 能力の概要
組織構造を設計・管理する能力。組織の定義、階層構造の構築、組織変更管理を通じて、効率的な組織運営を実現します。

### 実現できること
- 組織構造の明確な定義
- 組織階層の可視化
- 組織変更・再編成の管理
- 組織単位間の関係性管理
- 組織図の動的な生成

### 必要な知識
- 組織設計理論
- 組織変更管理（チェンジマネジメント）
- ガバナンス構造
- 組織開発手法
- 組織図作成技法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: OrganizationAggregate ([../../domain/README.md](../../domain/README.md#organization-aggregate))
- **Entities**: Organization, OrganizationUnit, OrganizationHierarchy, OrganizationChange
- **Value Objects**: OrganizationType, HierarchyLevel, ReportingRelationship

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/organizations - 組織作成
  - POST /api/organizations/{id}/units - 組織単位追加
  - GET /api/organizations/{id}/hierarchy - 階層構造取得
  - PUT /api/organizations/{id}/restructure - 組織再編

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: organizations, organization_units, organization_hierarchies, organization_changes

詳細: [../../data/README.md](../../data/README.md)

---

## 🛠️ 実装アプローチ

### 技術的実現方法

#### アルゴリズム・パターン
- **階層管理**: 閉包テーブル（Closure Table）パターン - 祖先・子孫の高速検索
- **循環参照検知**: グラフ探索アルゴリズム（DFS: Depth First Search）
- **組織再編**: トランザクショナルツリー更新（子孫の一括パス更新）
- **デザインパターン**:
  - Composite Pattern（組織階層構造）
  - Repository Pattern（組織データアクセス）
  - Domain Event（組織変更イベント）

#### 推奨ライブラリ・フレームワーク
- **ツリー構造可視化**: [D3.js](https://d3js.org/) - 組織図の動的レンダリング
- **階層データ**: [ltree](https://www.postgresql.org/docs/current/ltree.html)（PostgreSQL） - ラベル付きツリー型
- **グラフアルゴリズム**: [graphlib](https://github.com/dagrejs/graphlib) - 循環参照検知
- **組織図生成**: [OrgChart.js](https://github.com/dabeng/OrgChart) - インタラクティブ組織図

### パフォーマンス考慮事項

#### スケーラビリティ
- **組織階層深度**: 最大10レベル
- **組織単位数**: 1組織あたり最大10,000単位
- **階層検索**: 平均50ms以内（閉包テーブル活用）

#### キャッシュ戦略
- **組織階層**: Redis cache（TTL: 30分、組織再編時に無効化）
- **組織パス**: メモリキャッシュ（組織単位変更時に再計算）
- **メンバー一覧**: Redis cache（TTL: 15分）

#### 最適化ポイント
- **閉包テーブル**: 祖先・子孫クエリをO(1)で実行
- **パス事前計算**: 組織パス文字列を事前計算して保存
- **インデックス活用**: `organization_units(organization_id, parent_unit_id)`, `organization_hierarchies(ancestor_id, descendant_id)`

---

## ⚠️ 前提条件と制約

### BC間連携

#### 依存BC
- **BC-003: Access Control & Security** - ユーザー情報、組織権限
  - 使用API: `GET /api/bc-003/users/{userId}` - ユーザー情報
  - 使用API: `POST /api/bc-003/authorize` - 組織操作権限チェック
- **BC-005: Team & Resource Optimization** - チーム配置情報
  - 使用API: `GET /api/bc-005/teams?organizationUnitId={unitId}` - 組織単位別チーム

#### 提供API（他BCから利用）
- **BC-001, BC-005**: 組織構造・階層情報を提供
  - `GET /api/bc-004/organizations/{orgId}` - 組織情報
  - `GET /api/bc-004/organizations/{orgId}/hierarchy` - 組織階層
  - `GET /api/bc-004/organization-units/{unitId}` - 組織単位情報

### データ整合性要件

#### トランザクション境界
- **組織作成**: Organization + ルートOrganizationUnit を1トランザクションで作成
- **組織再編**: 親変更 + 全子孫のパス更新 + 閉包テーブル再構築を原子的に実行
- **整合性レベル**: 強整合性（ACID準拠）

#### データ制約
- 組織コードの一意性（グローバル一意）
- 組織単位名の一意性（同一親配下で一意）
- 循環参照禁止（A → B → C → A は不可）
- 階層深度制限（最大10レベル）

### セキュリティ要件

#### 認証・認可
- **認証**: JWT Bearer Token（BC-003認証機能）
- **必要権限**:
  - 組織作成: `organization:create`
  - 組織単位作成: `organization:unit:create`
  - 組織再編: `organization:restructure`

#### データ保護
- **機密度**: 組織情報はInternal（社内限定）
- **監査ログ**: 全ての組織構造変更を記録
- **アクセス制御**: 組織管理者とシステム管理者のみ編集可能

### スケーラビリティ制約

#### 最大同時処理
- **組織作成**: 10リクエスト/秒
- **組織再編**: 1リクエスト/秒（重い処理）
- **階層検索**: 1,000リクエスト/秒（キャッシュ活用）

#### データ量上限
- **組織数**: 1,000組織
- **組織単位数**: 1組織あたり最大10,000単位
- **階層深度**: 最大10レベル

---

## 🔗 BC設計との統合

### 使用ドメインオブジェクト

#### Aggregates
- **Organization Aggregate** ([../../domain/README.md#organization-aggregate](../../domain/README.md#organization-aggregate))
  - Organization（集約ルート）: 組織ライフサイクル管理
  - OrganizationUnit: 組織単位（部門・事業部・課）
  - OrganizationMember: 組織メンバー

#### Value Objects
- **OrganizationPath**: 組織パス（例: /本社/営業本部/第一営業部）
- **UnitType**: 組織単位タイプ（root/division/department/section/team）
- **HierarchyLevel**: 階層レベル（0-10）

### 呼び出すAPI例

#### 組織作成
```http
POST /api/v1/bc-004/organizations
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "アクメ株式会社",
  "code": "ACME",
  "type": "headquarters",
  "description": "本社組織"
}

Response:
{
  "organizationId": "org-uuid",
  "name": "アクメ株式会社",
  "code": "ACME",
  "rootUnitId": "unit-uuid",
  "createdAt": "2025-11-03T10:00:00Z"
}
```

#### 組織単位作成
```http
POST /api/v1/bc-004/organizations/{orgId}/units
Content-Type: application/json

{
  "name": "営業本部",
  "unitType": "division",
  "parentUnitId": "root-unit-uuid",
  "description": "全社営業統括"
}

Response:
{
  "unitId": "unit-uuid",
  "name": "営業本部",
  "unitType": "division",
  "hierarchyLevel": 1,
  "path": "/本社/営業本部",
  "createdAt": "2025-11-03T10:00:00Z"
}
```

#### 組織階層取得
```http
GET /api/v1/bc-004/organizations/{orgId}/hierarchy

Response:
{
  "organizationId": "org-uuid",
  "hierarchy": {
    "unitId": "root-unit-uuid",
    "name": "本社",
    "unitType": "root",
    "children": [
      {
        "unitId": "unit-1",
        "name": "営業本部",
        "unitType": "division",
        "children": [
          {
            "unitId": "unit-1-1",
            "name": "第一営業部",
            "unitType": "department",
            "children": []
          }
        ]
      }
    ]
  }
}
```

#### 組織再編（親変更）
```http
PUT /api/v1/bc-004/organization-units/{unitId}/parent
Content-Type: application/json

{
  "newParentUnitId": "new-parent-uuid",
  "reason": "組織再編: 営業統合"
}

Response:
{
  "unitId": "unit-uuid",
  "previousParentId": "old-parent-uuid",
  "newParentId": "new-parent-uuid",
  "previousPath": "/本社/営業本部/第一営業部",
  "newPath": "/本社/統合営業本部/第一営業部",
  "affectedDescendantCount": 15,
  "updatedAt": "2025-11-03T10:00:00Z"
}
```

#### メンバー追加
```http
POST /api/v1/bc-004/organization-units/{unitId}/members
Content-Type: application/json

{
  "userId": "user-uuid",
  "roleInUnit": "manager",
  "joinedAt": "2025-11-03"
}

Response:
{
  "memberId": "member-uuid",
  "unitId": "unit-uuid",
  "userId": "user-uuid",
  "roleInUnit": "manager",
  "joinedAt": "2025-11-03T00:00:00Z"
}
```

### データアクセスパターン

#### 読み取り
- **organizations テーブル**:
  - インデックス: `idx_organizations_code`（組織コード検索）
  - インデックス: `idx_organizations_status`（アクティブ組織フィルタ）
- **organization_units テーブル**:
  - インデックス: `idx_org_units_organization_id`（組織別単位）
  - インデックス: `idx_org_units_parent_unit_id`（親子関係検索）
- **organization_hierarchies テーブル（閉包テーブル）**:
  - インデックス: `idx_org_hierarchies_ancestor_id`（祖先検索）
  - インデックス: `idx_org_hierarchies_descendant_id`（子孫検索）

#### 書き込み
- **組織作成トランザクション**:
  ```sql
  BEGIN;
  INSERT INTO organizations (...) VALUES (...);
  INSERT INTO organization_units (name, organization_id, unit_type, parent_unit_id, hierarchy_level, path)
    VALUES ('本社', org_id, 'root', NULL, 0, '/本社');
  COMMIT;
  ```
- **組織再編トランザクション**:
  ```sql
  BEGIN;
  -- 親変更
  UPDATE organization_units SET parent_unit_id = new_parent_id WHERE id = unit_id;
  -- 子孫のパス更新（再帰的）
  UPDATE organization_units SET path = ... WHERE id IN (SELECT descendant_id FROM organization_hierarchies WHERE ancestor_id = unit_id);
  -- 閉包テーブル再構築
  DELETE FROM organization_hierarchies WHERE descendant_id = unit_id OR ancestor_id = unit_id;
  INSERT INTO organization_hierarchies (...) VALUES (...);
  COMMIT;
  ```

#### キャッシュアクセス
- **組織階層キャッシュ**:
  ```
  Key: `org:{orgId}:hierarchy`
  Value: JSON（ツリー構造）
  TTL: 1800秒（30分）
  Invalidation: 組織再編時
  ```
- **組織単位情報キャッシュ**:
  ```
  Key: `org_unit:{unitId}`
  Value: JSON（単位情報 + パス + メンバー数）
  TTL: 900秒（15分）
  ```

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 組織を定義・構築する | 組織構造の初期設定 | 2-3個 | define-and-build-organization |
| **OP-002**: 組織階層を可視化する | 組織図の生成と表示 | 2個 | visualize-organizational-hierarchy |
| **OP-003**: 組織を変更・再編成する | 組織変更の管理 | 2-3個 | change-and-reorganize-structure |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 6-8個
- **V2からの移行**: BC#3から分離・独立

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/secure-access-service/capabilities/manage-organizational-structure/](../../../../services/secure-access-service/capabilities/manage-organizational-structure/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-001 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
