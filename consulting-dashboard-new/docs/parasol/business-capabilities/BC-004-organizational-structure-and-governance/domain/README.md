# BC-004: ドメイン設計

**BC**: Organizational Structure & Governance
**作成日**: 2025-10-31
**V2移行元**: services/secure-access-service/domain-language.md（組織管理部分のみ）

---

## 概要

このドキュメントは、BC-004（組織構造とガバナンス）のドメインモデルを定義します。

## 主要集約（Aggregates）

### 1. Organization Aggregate
**集約ルート**: Organization [Organization] [ORGANIZATION]
- **責務**: 組織全体のライフサイクル管理
- **包含エンティティ**: OrganizationUnit, OrganizationHierarchy, OrganizationMember
- **不変条件**: 組織階層に循環参照が存在しない

---

## 主要エンティティ（Entities）

### Organization [Organization] [ORGANIZATION]
組織 [Organization] [ORGANIZATION]
├── 組織ID [OrganizationID] [ORGANIZATION_ID]: UUID
├── 組織名 [OrganizationName] [ORGANIZATION_NAME]: STRING_200
├── 組織コード [OrganizationCode] [ORGANIZATION_CODE]: STRING_50
├── 組織タイプ [OrganizationType] [ORGANIZATION_TYPE]: ENUM（本社/支社/事業部/部門/課）
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### OrganizationUnit [OrganizationUnit] [ORGANIZATION_UNIT]
組織単位 [OrganizationUnit] [ORGANIZATION_UNIT]
├── 単位ID [UnitID] [UNIT_ID]: UUID
├── 組織ID [OrganizationID] [ORGANIZATION_ID]: UUID
├── 単位名 [UnitName] [UNIT_NAME]: STRING_200
├── 親単位ID [ParentUnitID] [PARENT_UNIT_ID]: UUID（オプション）
├── 階層レベル [HierarchyLevel] [HIERARCHY_LEVEL]: INTEGER
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### OrganizationHierarchy [OrganizationHierarchy] [ORGANIZATION_HIERARCHY]
組織階層 [OrganizationHierarchy] [ORGANIZATION_HIERARCHY]
├── 階層ID [HierarchyID] [HIERARCHY_ID]: UUID
├── 祖先単位ID [AncestorUnitID] [ANCESTOR_UNIT_ID]: UUID
├── 子孫単位ID [DescendantUnitID] [DESCENDANT_UNIT_ID]: UUID
├── 階層深度 [Depth] [DEPTH]: INTEGER
└── パス [Path] [PATH]: STRING_500

---

## 主要値オブジェクト（Value Objects）

### OrganizationPath [OrganizationPath] [ORGANIZATION_PATH]
組織パス [OrganizationPath] [ORGANIZATION_PATH]
├── パス文字列 [pathString] [PATH_STRING]: STRING_500（例: /本社/事業部/部門）
├── パス要素 [pathElements] [PATH_ELEMENTS]: ARRAY<STRING>
└── 深度 [depth] [DEPTH]: INTEGER

### UnitType [UnitType] [UNIT_TYPE]
単位タイプ [UnitType] [UNIT_TYPE]
├── タイプ名 [typeName] [TYPE_NAME]: STRING_50
├── 階層レベル [hierarchyLevel] [HIERARCHY_LEVEL]: INTEGER
└── 説明 [description] [DESCRIPTION]: TEXT

---

## ドメインサービス

### OrganizationDesignService
**責務**: 組織設計の高度化
- `designOrganization()`: 組織構造の設計
- `validateHierarchy()`: 階層整合性検証（循環参照チェック）
- `restructureOrganization()`: 組織再編の実行

### OrganizationVisualizationService
**責務**: 組織可視化
- `visualizeHierarchy()`: 組織階層の可視化
- `generateOrgChart()`: 組織図の生成
- `analyzeOrganizationStructure()`: 組織構造分析

---

## V2からの移行メモ

### 移行済み
- ✅ Organization, OrganizationUnit, OrganizationHierarchyエンティティの定義
- ✅ 集約境界の明確化
- ✅ BC-003から戦略的に分離

### 移行中
- 🟡 詳細なドメインルールのドキュメント化
- 🟡 aggregates.md, entities.md, value-objects.mdへの分割

---

**ステータス**: Phase 0 - 基本構造作成完了
**次のアクション**: 詳細ドメインモデルの文書化
