# BC-001: API設計

**BC**: Project Delivery & Quality Management
**作成日**: 2025-10-31
**V2移行元**: services/project-success-service/api/

---

## 概要

このディレクトリは、BC-001（プロジェクト配信と品質管理）のAPI設計を定義します。

**重要**: Issue #146対応により、API設計はWHAT（能力定義）とHOW（利用方法）に分離されています。

---

## API設計構成

### 📄 api-specification.md（WHAT: 能力定義）
**役割**: BC-001が提供するAPI能力の定義
- エンドポイント一覧
- リクエスト/レスポンススキーマ
- 認証・認可要件
- エラーハンドリング

**Issue #146対応**: WHATレイヤー（能力の定義）

### 📁 endpoints/（WHAT詳細）
個別エンドポイントの詳細定義
- RESTful APIエンドポイント仕様
- GraphQL スキーマ（該当する場合）

### 📁 schemas/（WHAT詳細）
データスキーマ定義
- リクエストスキーマ
- レスポンススキーマ
- 共通データ型

---

## 主要APIエンドポイント

### Project Management API
```
POST   /api/bc-001/projects
GET    /api/bc-001/projects/{projectId}
PUT    /api/bc-001/projects/{projectId}
DELETE /api/bc-001/projects/{projectId}
GET    /api/bc-001/projects
```

### Task Management API
```
POST   /api/bc-001/projects/{projectId}/tasks
GET    /api/bc-001/projects/{projectId}/tasks/{taskId}
PUT    /api/bc-001/projects/{projectId}/tasks/{taskId}
DELETE /api/bc-001/projects/{projectId}/tasks/{taskId}
GET    /api/bc-001/projects/{projectId}/tasks
```

### Deliverable Management API
```
POST   /api/bc-001/projects/{projectId}/deliverables
GET    /api/bc-001/projects/{projectId}/deliverables/{deliverableId}
PUT    /api/bc-001/projects/{projectId}/deliverables/{deliverableId}
POST   /api/bc-001/projects/{projectId}/deliverables/{deliverableId}/review
```

### Risk Management API
```
POST   /api/bc-001/projects/{projectId}/risks
GET    /api/bc-001/projects/{projectId}/risks/{riskId}
PUT    /api/bc-001/projects/{projectId}/risks/{riskId}
GET    /api/bc-001/projects/{projectId}/risks
POST   /api/bc-001/projects/{projectId}/risks/{riskId}/mitigation
```

---

## UseCase API（HOW: 利用方法）

各ユースケースの具体的なAPI利用方法は、L3 Capabilityのユースケース層で定義されます:

- `capabilities/L3-XXX/operations/OP-XXX/usecases/{usecase-name}/api-usage.md`

**Issue #146対応**: HOWレイヤー（利用方法）は各ユースケースに配置

---

## BC間連携API

### BC-002 (Financial) へのコスト連携
```
POST /api/bc-002/cost-allocations
Body: { projectId, amount, category, date }
```

### BC-005 (Resources) へのリソース要求
```
POST /api/bc-005/resource-requests
Body: { projectId, skillRequirements, duration }
```

### BC-006 (Knowledge) への知識検索
```
GET /api/bc-006/knowledge/search?q={query}&context=project
```

### BC-007 (Communication) への通知送信
```
POST /api/bc-007/notifications
Body: { recipients, message, priority, channel }
```

---

## 認証・認可

### 認証方式
- OAuth 2.0 + JWT
- BC-003 (Access Control & Security) による認証基盤

### 認可ポリシー
- プロジェクトオーナー: 全権限
- プロジェクトメンバー: 読取 + タスク更新
- ステークホルダー: 読取のみ

---

## V2からの移行

### V2構造（移行元）
```
services/project-success-service/api/
├── api-specification.md（サービスレベル - 廃止）
└── api-specification.md（Issue #146対応版）
```

### V3構造（移行先）
```
BC-001/api/
├── README.md（本ファイル）
├── api-specification.md（WHAT - Issue #146対応）
├── endpoints/（WHAT詳細）
└── schemas/（WHAT詳細）
```

### 移行ステータス
- ✅ API仕様の移行完了（Issue #146対応版）
- ✅ エンドポイント構造の整理
- 🟡 詳細ドキュメントの作成中

---

## 関連ドキュメント

- [api-specification.md](api-specification.md) - API仕様（WHAT）
- Issue #146: API WHAT/HOW分離ガイド
- [../domain/README.md](../domain/README.md) - ドメインモデル

---

**ステータス**: Phase 1 - 基本構造作成完了
**次のアクション**: api-specification.mdの詳細化
