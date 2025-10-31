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
