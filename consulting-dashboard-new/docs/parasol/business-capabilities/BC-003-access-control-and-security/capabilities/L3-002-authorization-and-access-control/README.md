# L3-002: Authorization & Access Control

**作成日**: 2025-10-31
**所属BC**: BC-003: Access Control & Security
**V2移行元**: control-access-permissions

---

## 📋 What: この能力の定義

### 能力の概要
リソースへのアクセス権限を管理・制御する能力。ロールベースアクセス制御（RBAC）、権限付与、権限レビューを通じて、適切なアクセス制御を実現します。

### 実現できること
- ロール・権限の定義と管理
- きめ細かな権限付与
- 動的な権限チェック
- 権限の定期的レビューと監査
- 最小権限の原則の適用

### 必要な知識
- アクセス制御モデル（RBAC、ABAC）
- 権限管理のベストプラクティス
- セキュリティポリシー設計
- コンプライアンス要件
- 権限分離の原則

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: AccessControlAggregate ([../../domain/README.md](../../domain/README.md#access-control-aggregate))
- **Entities**: Role, Permission, RoleAssignment, ResourceAccess
- **Value Objects**: AccessLevel, PermissionScope, ResourceType

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/roles - ロール定義
  - POST /api/permissions - 権限定義
  - PUT /api/users/{id}/roles - ロール付与
  - GET /api/access/check - 権限チェック

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: roles, permissions, role_permissions, user_roles, access_control_lists

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: ロール・権限を定義する | ロール体系の構築 | 2-3個 | define-roles-and-permissions |
| **OP-002**: 権限を付与・管理する | ユーザーへの権限割当 | 3-4個 | grant-and-manage-permissions |
| **OP-003**: 権限を監査・レビューする | 権限の適切性確認 | 2-3個 | audit-and-review-permissions |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 7-10個
- **V2からの移行**: そのまま移行

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/secure-access-service/capabilities/control-access-permissions/](../../../../services/secure-access-service/capabilities/control-access-permissions/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-002 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
