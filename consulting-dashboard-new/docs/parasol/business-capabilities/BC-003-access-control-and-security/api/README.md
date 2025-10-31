# BC-003: API設計

**BC**: Access Control & Security
**作成日**: 2025-10-31
**V2移行元**: services/secure-access-service/api/（セキュリティ機能のみ）

---

## 概要

このディレクトリは、BC-003（アクセス制御とセキュリティ）のAPI設計を定義します。

**重要**: Issue #146対応により、API設計はWHAT（能力定義）とHOW（利用方法）に分離されています。

---

## API設計構成

### 📄 api-specification.md（WHAT: 能力定義）
**役割**: BC-003が提供するAPI能力の定義
- エンドポイント一覧
- リクエスト/レスポンススキーマ
- 認証・認可要件
- エラーハンドリング

**Issue #146対応**: WHATレイヤー（能力の定義）

### 📁 endpoints/（WHAT詳細）
個別エンドポイントの詳細定義
- RESTful APIエンドポイント仕様
- OAuth 2.0 エンドポイント

### 📁 schemas/（WHAT詳細）
データスキーマ定義
- リクエストスキーマ
- レスポンススキーマ
- 共通データ型

---

## 主要APIエンドポイント

### Authentication API
```
POST   /api/bc-003/auth/register
POST   /api/bc-003/auth/login
POST   /api/bc-003/auth/logout
POST   /api/bc-003/auth/refresh-token
POST   /api/bc-003/auth/mfa/setup
POST   /api/bc-003/auth/mfa/verify
POST   /api/bc-003/auth/password/reset
POST   /api/bc-003/auth/password/change
```

### User Management API
```
GET    /api/bc-003/users
GET    /api/bc-003/users/{userId}
PUT    /api/bc-003/users/{userId}
DELETE /api/bc-003/users/{userId}
POST   /api/bc-003/users/{userId}/suspend
POST   /api/bc-003/users/{userId}/activate
```

### Authorization API
```
GET    /api/bc-003/roles
POST   /api/bc-003/roles
GET    /api/bc-003/roles/{roleId}
PUT    /api/bc-003/roles/{roleId}
DELETE /api/bc-003/roles/{roleId}
GET    /api/bc-003/permissions
POST   /api/bc-003/roles/{roleId}/permissions
DELETE /api/bc-003/roles/{roleId}/permissions/{permissionId}
POST   /api/bc-003/auth/check-permission
```

### Audit & Security API
```
GET    /api/bc-003/audit-logs
GET    /api/bc-003/audit-logs/{logId}
GET    /api/bc-003/security-events
POST   /api/bc-003/security-events/alert
GET    /api/bc-003/compliance/reports
```

---

## UseCase API（HOW: 利用方法）

各ユースケースの具体的なAPI利用方法は、L3 Capabilityのユースケース層で定義されます:

- `capabilities/L3-XXX/operations/OP-XXX/usecases/{usecase-name}/api-usage.md`

**Issue #146対応**: HOWレイヤー（利用方法）は各ユースケースに配置

---

## BC間連携API

### 全BCへの認証・認可サービス提供
全BCから以下のAPIが利用されます:
```
POST /api/bc-003/auth/validate-token
POST /api/bc-003/auth/check-permission
GET  /api/bc-003/users/{userId}/profile
```

### BC-004 (Org Governance) への組織情報照会
```
GET /api/bc-004/organizations/{orgId}/structure
GET /api/bc-004/organizations/{orgId}/users
```

### BC-007 (Communication) へのセキュリティアラート送信
```
POST /api/bc-007/notifications
Body: { type: 'security_alert', recipients, message, severity }
```

---

## 認証・認可

### 認証方式
- OAuth 2.0 + JWT
- 多要素認証（MFA）対応
- シングルサインオン（SSO）対応

### 認可ポリシー
- システム管理者: 全権限
- セキュリティ管理者: ユーザー・ロール管理権限
- 監査担当者: 監査ログ閲覧権限
- 一般ユーザー: 自身の情報閲覧・更新権限

---

## V2からの移行

### V2構造（移行元）
```
services/secure-access-service/api/
├── api-specification.md（サービスレベル - 廃止）
└── api-specification.md（Issue #146対応版）
```

### V3構造（移行先）
```
BC-003/api/
├── README.md（本ファイル）
├── api-specification.md（WHAT - Issue #146対応）
├── endpoints/（WHAT詳細）
└── schemas/（WHAT詳細）
```

### 移行ステータス
- ✅ API仕様の移行完了（Issue #146対応版）
- ✅ エンドポイント構造の整理
- ✅ 組織管理APIはBC-004へ分離
- 🟡 詳細ドキュメントの作成中

---

## 関連ドキュメント

- [api-specification.md](api-specification.md) - API仕様（WHAT）
- Issue #146: API WHAT/HOW分離ガイド
- [../domain/README.md](../domain/README.md) - ドメインモデル

---

**ステータス**: Phase 0 - 基本構造作成完了
**次のアクション**: api-specification.mdの詳細化
