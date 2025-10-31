# BC-003: データ設計

**BC**: Access Control & Security
**作成日**: 2025-10-31
**V2移行元**: services/secure-access-service/database-design.md（セキュリティ機能のみ）

---

## 概要

このドキュメントは、BC-003（アクセス制御とセキュリティ）のデータモデルとデータベース設計を定義します。

---

## 主要テーブル

### users
ユーザーマスタ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | ユーザーID |
| email | VARCHAR(255) | NOT NULL, UNIQUE | メールアドレス |
| username | VARCHAR(100) | NOT NULL, UNIQUE | ユーザー名 |
| password_hash | VARCHAR(255) | NOT NULL | パスワードハッシュ |
| status | VARCHAR(20) | NOT NULL | 状態（active/inactive/suspended/deleted） |
| mfa_enabled | BOOLEAN | DEFAULT false | MFA有効フラグ |
| mfa_secret | VARCHAR(255) | | MFAシークレット |
| last_login_at | TIMESTAMP | | 最終ログイン日時 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: email, username, status

---

### roles
ロール

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | ロールID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | ロール名 |
| description | TEXT | | 説明 |
| is_system_role | BOOLEAN | DEFAULT false | システムロールフラグ |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: name

---

### permissions
権限

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 権限ID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | 権限名 |
| resource | VARCHAR(100) | NOT NULL | リソース |
| action | VARCHAR(20) | NOT NULL | アクション（read/write/delete/execute） |
| description | TEXT | | 説明 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: name, resource
**ユニーク制約**: (resource, action)

---

### user_roles
ユーザーロール関連

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 関連ID |
| user_id | UUID | FK → users, NOT NULL | ユーザーID |
| role_id | UUID | FK → roles, NOT NULL | ロールID |
| granted_by | UUID | FK → users | 付与者 |
| granted_at | TIMESTAMP | NOT NULL | 付与日時 |

**インデックス**: user_id, role_id
**ユニーク制約**: (user_id, role_id)

---

### role_permissions
ロール権限関連

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 関連ID |
| role_id | UUID | FK → roles, NOT NULL | ロールID |
| permission_id | UUID | FK → permissions, NOT NULL | 権限ID |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: role_id, permission_id
**ユニーク制約**: (role_id, permission_id)

---

### sessions
セッション

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | セッションID |
| user_id | UUID | FK → users, NOT NULL | ユーザーID |
| access_token | VARCHAR(500) | NOT NULL, UNIQUE | アクセストークン |
| refresh_token | VARCHAR(500) | NOT NULL, UNIQUE | リフレッシュトークン |
| ip_address | VARCHAR(45) | | IPアドレス |
| user_agent | VARCHAR(500) | | ユーザーエージェント |
| expires_at | TIMESTAMP | NOT NULL | 有効期限 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: user_id, access_token, expires_at

---

### audit_logs
監査ログ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | ログID |
| user_id | UUID | FK → users | ユーザーID |
| action | VARCHAR(100) | NOT NULL | アクション |
| resource | VARCHAR(200) | | リソース |
| resource_id | VARCHAR(100) | | リソースID |
| ip_address | VARCHAR(45) | | IPアドレス |
| user_agent | VARCHAR(500) | | ユーザーエージェント |
| success | BOOLEAN | NOT NULL | 成功フラグ |
| error_message | TEXT | | エラーメッセージ |
| recorded_at | TIMESTAMP | NOT NULL | 記録日時 |

**インデックス**: user_id, action, recorded_at, success

---

### security_events
セキュリティイベント

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | イベントID |
| event_type | VARCHAR(50) | NOT NULL | イベントタイプ（login_failure/suspicious_activity/etc） |
| severity | VARCHAR(20) | NOT NULL | 重要度（low/medium/high/critical） |
| user_id | UUID | FK → users | ユーザーID |
| ip_address | VARCHAR(45) | | IPアドレス |
| description | TEXT | NOT NULL | 説明 |
| detected_at | TIMESTAMP | NOT NULL | 検知日時 |
| resolved_at | TIMESTAMP | | 解決日時 |

**インデックス**: event_type, severity, detected_at

---

## データフロー

### ユーザー登録・認証フロー
```
1. users テーブルにINSERT（status = active）
2. デフォルトロールをuser_roles テーブルにINSERT
3. ログイン時、認証情報を検証
4. 成功時、sessions テーブルにセッションINSERT
5. audit_logs テーブルにログイン記録
```

### 権限チェックフロー
```
1. access_token からuser_id を取得
2. user_roles でユーザーのロール取得
3. role_permissions で権限確認
4. 結果をaudit_logs に記録
```

### セキュリティ監視フロー
```
1. 不審なアクティビティ検知
2. security_events テーブルにINSERT
3. 重要度が high 以上の場合、BC-007 へアラート通知
4. 対応完了時、resolved_at を更新
```

---

## BC間データ連携

### 全BCへの認証・認可情報提供
- ユーザー情報（users）
- セッション情報（sessions）
- 権限情報（role_permissions）

### BC-004 (Org Governance) への組織情報照会
- 組織構造データはBC-004から取得

### BC-007 (Communication) へのセキュリティアラート送信
- セキュリティイベント（security_events.severity = high/critical）

---

## パフォーマンス最適化

### インデックス戦略
- 頻繁に検索されるカラムにインデックス作成
- セッション有効期限チェックの最適化（expires_at）
- 監査ログ検索の最適化（recorded_at + user_id複合インデックス）

### パーティショニング
- `audit_logs` テーブル: recorded_at (月単位) でパーティション分割
- `security_events` テーブル: detected_at (月単位) でパーティション分割
- `sessions` テーブル: 定期的な古いセッション削除

### セキュリティ考慮
- `password_hash` の暗号化（bcrypt/argon2）
- `access_token`, `refresh_token` の暗号化
- `audit_logs` の不変性保証（INSERT ONLYテーブル）

---

## V2からの移行

### 移行ステータス
- ✅ テーブル構造の定義（セキュリティ機能のみ）
- ✅ 主要インデックスの設計
- ✅ 組織構造テーブルはBC-004へ移行
- 🟡 詳細なデータフローのドキュメント化
- 🟡 パフォーマンスチューニング指針の作成

---

## 関連ドキュメント

- [database-design.md](database-design.md) - 詳細DB設計
- [data-flow.md](data-flow.md) - データフロー詳細
- [../domain/README.md](../domain/README.md) - ドメインモデル

---

**ステータス**: Phase 0 - 基本構造作成完了
**次のアクション**: database-design.mdの詳細化
