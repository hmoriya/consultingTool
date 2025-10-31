# L3-001: Identity & Authentication

**作成日**: 2025-10-31
**所属BC**: BC-003: Access Control & Security
**V2移行元**: authenticate-and-manage-users

---

## 📋 What: この能力の定義

### 能力の概要
ユーザーの身元を確認し、安全な認証を提供する能力。ユーザー登録、認証、多要素認証、パスワード管理を通じて、セキュアなアクセスを実現します。

### 実現できること
- セキュアなユーザー登録
- 多要素認証（MFA）の実施
- パスワード管理（変更、リセット、ポリシー適用）
- セッション管理
- シングルサインオン（SSO）対応

### 必要な知識
- 認証プロトコル（OAuth2.0、OpenID Connect）
- 暗号化技術（bcrypt、argon2）
- セキュリティベストプラクティス
- アイデンティティ管理
- コンプライアンス要件（GDPR、個人情報保護法）

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: UserIdentityAggregate ([../../domain/README.md](../../domain/README.md#user-identity-aggregate))
- **Entities**: User, Credential, AuthenticationLog, Session
- **Value Objects**: Email, PasswordHash, MFAToken, SessionToken

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/auth/register - ユーザー登録
  - POST /api/auth/authenticate - 認証実行
  - POST /api/auth/mfa - MFA検証
  - PUT /api/auth/password - パスワード管理

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: users, credentials, authentication_logs, sessions, mfa_tokens

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: ユーザーを登録・認証する | 新規登録とログイン | 3-4個 | register-and-authenticate-users |
| **OP-002**: パスワードを管理する | パスワード変更・リセット | 2-3個 | manage-passwords |
| **OP-003**: 多要素認証を実装する | MFAの設定と検証 | 2-3個 | implement-multi-factor-authentication |

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
> - [services/secure-access-service/capabilities/authenticate-and-manage-users/](../../../../services/secure-access-service/capabilities/authenticate-and-manage-users/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-001 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
