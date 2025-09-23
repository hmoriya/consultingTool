# 認証サービス API仕様

## 基本情報
- ベースパス: `/api/auth`
- 認証方式: JWT Bearer Token
- レート制限: 100リクエスト/分/IP
- バージョン: v1.0.0

## 共通ヘッダー
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}  # 認証が必要なエンドポイント
```

## 共通レスポンス形式
```
成功時:
{
  "success": BOOLEAN,
  "data": OBJECT | ARRAY,
  "timestamp": TIMESTAMP
}

エラー時:
{
  "success": BOOLEAN,
  "error": {
    "code": STRING,
    "message": STRING,
    "details": OBJECT (optional)
  },
  "timestamp": TIMESTAMP
}
```

## エンドポイント定義

### 1. ユーザー認証

#### POST /api/auth/login
**説明**: ユーザーのログイン認証を行う

**認証**: 不要

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| email | EMAIL | ✓ | ログインメールアドレス |
| password | STRING | ✓ | パスワード（平文） |
| remember | BOOLEAN | - | ログイン状態を保持（デフォルト: false） |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| token | JWT_TOKEN | アクセストークン |
| refreshToken | JWT_TOKEN | リフレッシュトークン |
| expiresIn | INTEGER | 有効期限（秒） |
| user | USER_OBJECT | ユーザー基本情報 |

**エラーコード**:
- `AUTH_INVALID_CREDENTIALS`: 認証情報が無効
- `AUTH_ACCOUNT_LOCKED`: アカウントがロック中
- `AUTH_ACCOUNT_INACTIVE`: アカウントが無効

---

#### POST /api/auth/logout
**説明**: ユーザーのログアウト処理

**認証**: 必要

**リクエスト**: なし

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| message | STRING | ログアウト完了メッセージ |

---

#### POST /api/auth/refresh
**説明**: アクセストークンの更新

**認証**: リフレッシュトークン

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| refreshToken | JWT_TOKEN | ✓ | リフレッシュトークン |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| token | JWT_TOKEN | 新しいアクセストークン |
| expiresIn | INTEGER | 有効期限（秒） |

---

### 2. ユーザー登録

#### POST /api/auth/register
**説明**: 新規ユーザーの登録

**認証**: 不要（公開登録）または管理者権限

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| email | EMAIL | ✓ | メールアドレス |
| password | STRING_MIN_8 | ✓ | パスワード（8文字以上） |
| name | STRING_50 | ✓ | 氏名 |
| organization | STRING_100 | - | 組織名 |
| role | ENUM | - | ロール（Admin権限時のみ指定可） |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| userId | UUID | 作成されたユーザーID |
| email | EMAIL | メールアドレス |
| requiresVerification | BOOLEAN | メール認証が必要か |

---

#### POST /api/auth/verify-email
**説明**: メールアドレスの認証

**認証**: 不要

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| token | STRING | ✓ | 認証トークン |
| userId | UUID | ✓ | ユーザーID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| verified | BOOLEAN | 認証成功フラグ |
| message | STRING | 結果メッセージ |

---

### 3. パスワード管理

#### POST /api/auth/forgot-password
**説明**: パスワードリセットの申請

**認証**: 不要

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| email | EMAIL | ✓ | 登録メールアドレス |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| message | STRING | 処理結果メッセージ |
| sentTo | EMAIL | 送信先（マスク処理済み） |

---

#### POST /api/auth/reset-password
**説明**: パスワードのリセット

**認証**: 不要

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| token | STRING | ✓ | リセットトークン |
| password | STRING_MIN_8 | ✓ | 新しいパスワード |
| confirmPassword | STRING_MIN_8 | ✓ | パスワード確認 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| success | BOOLEAN | リセット成功フラグ |
| message | STRING | 結果メッセージ |

---

#### POST /api/auth/change-password
**説明**: パスワードの変更

**認証**: 必要

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| currentPassword | STRING | ✓ | 現在のパスワード |
| newPassword | STRING_MIN_8 | ✓ | 新しいパスワード |
| confirmPassword | STRING_MIN_8 | ✓ | パスワード確認 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| changed | BOOLEAN | 変更成功フラグ |
| message | STRING | 結果メッセージ |

---

### 4. ユーザー管理

#### GET /api/users
**説明**: ユーザー一覧の取得

**認証**: 管理者権限

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| page | INTEGER | - | ページ番号（デフォルト: 1） |
| limit | INTEGER | - | 件数（デフォルト: 20、最大: 100） |
| search | STRING | - | 検索キーワード |
| role | ENUM | - | ロールフィルター |
| status | ENUM | - | ステータスフィルター |
| sort | STRING | - | ソート順（例: name:asc） |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| users | ARRAY[USER] | ユーザーリスト |
| total | INTEGER | 総件数 |
| page | INTEGER | 現在のページ |
| totalPages | INTEGER | 総ページ数 |

---

#### GET /api/users/:id
**説明**: ユーザー詳細の取得

**認証**: 必要（本人または管理者）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | ユーザーID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| id | UUID | ユーザーID |
| email | EMAIL | メールアドレス |
| name | STRING_50 | 氏名 |
| role | ENUM | ロール |
| organization | STRING_100 | 組織名 |
| status | ENUM | ステータス |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |
| lastLoginAt | TIMESTAMP | 最終ログイン日時 |

---

#### PUT /api/users/:id
**説明**: ユーザー情報の更新

**認証**: 必要（本人または管理者）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | ユーザーID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| name | STRING_50 | - | 氏名 |
| organization | STRING_100 | - | 組織名 |
| role | ENUM | - | ロール（管理者のみ） |
| status | ENUM | - | ステータス（管理者のみ） |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| user | USER_OBJECT | 更新後のユーザー情報 |

---

#### DELETE /api/users/:id
**説明**: ユーザーの削除（論理削除）

**認証**: 管理者権限

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | ユーザーID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| deleted | BOOLEAN | 削除成功フラグ |
| message | STRING | 結果メッセージ |

---

### 5. セッション管理

#### GET /api/auth/sessions
**説明**: アクティブセッションの取得

**認証**: 必要

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| sessions | ARRAY[SESSION] | セッションリスト |
| current | STRING | 現在のセッションID |

---

#### DELETE /api/auth/sessions/:id
**説明**: セッションの無効化

**認証**: 必要

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | STRING | セッションID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| revoked | BOOLEAN | 無効化成功フラグ |

---

## 型定義

### USER_OBJECT
```
{
  id: UUID,
  email: EMAIL,
  name: STRING_50,
  role: ENUM[Executive|PM|Consultant|Client|Admin],
  organization: STRING_100,
  status: ENUM[Active|Inactive|Locked]
}
```

### SESSION
```
{
  id: STRING,
  device: STRING,
  ipAddress: IP_ADDRESS,
  userAgent: STRING,
  createdAt: TIMESTAMP,
  lastActivityAt: TIMESTAMP
}
```

### JWT_TOKEN
```
文字列形式のJWTトークン
形式: header.payload.signature
エンコーディング: Base64URL
```

### STRING_MIN_8
```
最小8文字の文字列
パスワードポリシー適用時は追加制約:
- 大文字・小文字・数字・記号を含む
```

## エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| AUTH_INVALID_CREDENTIALS | 401 | 認証情報が無効 |
| AUTH_TOKEN_EXPIRED | 401 | トークンの有効期限切れ |
| AUTH_TOKEN_INVALID | 401 | 無効なトークン |
| AUTH_INSUFFICIENT_PERMISSION | 403 | 権限不足 |
| AUTH_ACCOUNT_LOCKED | 403 | アカウントロック |
| AUTH_ACCOUNT_INACTIVE | 403 | アカウント無効 |
| AUTH_USER_NOT_FOUND | 404 | ユーザーが存在しない |
| AUTH_EMAIL_ALREADY_EXISTS | 409 | メールアドレス重複 |
| AUTH_RATE_LIMIT_EXCEEDED | 429 | レート制限超過 |

## セキュリティ考慮事項

1. **パスワードポリシー**
   - 最小8文字
   - 大文字・小文字・数字・記号を含む
   - 過去3回のパスワードは再利用不可

2. **アカウントロック**
   - 5回連続でログイン失敗時に15分間ロック
   - 管理者による手動解除可能

3. **トークン管理**
   - アクセストークン有効期限: 15分
   - リフレッシュトークン有効期限: 7日
   - トークンは署名付きJWT

4. **監査ログ**
   - すべての認証イベントを記録
   - ログイン、ログアウト、パスワード変更等