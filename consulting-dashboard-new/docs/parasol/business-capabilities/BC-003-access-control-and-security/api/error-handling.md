# Error Handling

**BC**: BC-003 - Access Control & Security
**カテゴリ**: Error Handling [エラーハンドリング] [ERROR_HANDLING]
**最終更新**: 2025-11-01

---

## 目次

1. [概要](#overview)
2. [エラーレスポンス形式](#error-response-format)
3. [エラーコード体系](#error-code-system)
4. [エラーコード一覧](#error-code-list)
5. [エラーハンドリングパターン](#error-handling-patterns)

---

## 概要 {#overview}

BC-003の全APIは統一されたエラーレスポンス形式を返します。

### エラーハンドリングの原則

1. **一貫性**: 全エンドポイントで同じ形式
2. **詳細性**: 開発者がデバッグしやすい情報を提供
3. **セキュリティ**: 内部実装の詳細を露出しない
4. **国際化**: 多言語対応のエラーメッセージ
5. **トレーサビリティ**: requestIdで問題を追跡可能

---

## エラーレスポンス形式 {#error-response-format}

### 基本形式

すべてのエラーレスポンスは以下の形式:

```json
{
  "error": {
    "code": "BC003_ERR_XXX",
    "message": "人間が読めるエラーメッセージ",
    "details": {
      "フィールド名": "詳細情報"
    },
    "timestamp": "2025-11-01T10:00:00Z",
    "requestId": "uuid-of-request",
    "documentation": "https://docs.example.com/errors/BC003_ERR_XXX"
  }
}
```

### フィールド説明

| フィールド | 型 | 説明 |
|----------|------|------|
| code | string | エラーコード（BC003_ERR_XXX形式） |
| message | string | ユーザー向けエラーメッセージ（ロケールに応じて多言語対応） |
| details | object | エラー詳細情報（オプション、デバッグ用） |
| timestamp | string | エラー発生日時（ISO 8601形式） |
| requestId | string | リクエストID（ログ追跡用） |
| documentation | string | エラーに関するドキュメントURL（オプション） |

---

## エラーコード体系 {#error-code-system}

### フォーマット

```
BC003_ERR_XXX
```

- **BC003**: Business Capability 003（Access Control & Security）
- **ERR**: Error
- **XXX**: 3桁の数字（エラーカテゴリとシーケンス番号）

### エラーコード範囲

| 範囲 | カテゴリ | 説明 |
|------|---------|------|
| 001-099 | Authentication | 認証関連エラー |
| 100-199 | Authorization | 認可関連エラー（ロール・権限管理） |
| 200-299 | User Management | ユーザー管理関連エラー |
| 300-399 | Audit & Security | 監査・セキュリティ関連エラー |
| 400-499 | Integration | BC間連携関連エラー |
| 429 | Rate Limiting | レート制限エラー |
| 500-599 | System | システムエラー |

---

## エラーコード一覧 {#error-code-list}

### Authentication Errors (001-099)

#### ユーザー登録エラー (001-009)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_001 | 400 | 無効なメールアドレス形式 | 有効なメール形式を使用 |
| BC003_ERR_002 | 400 | ユーザー名が既に使用されている | 別のユーザー名を選択 |
| BC003_ERR_003 | 400 | メールアドレスが既に使用されている | 別のメールアドレスを使用 |
| BC003_ERR_004 | 400 | パスワードが複雑性要件を満たさない | 8文字以上、大小英字・数字・記号を含む |
| BC003_ERR_005 | 404 | 指定組織が存在しない | 有効な組織IDを指定 |

**例**:

```json
{
  "error": {
    "code": "BC003_ERR_004",
    "message": "パスワードが複雑性要件を満たしていません",
    "details": {
      "requirements": {
        "minLength": 8,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireDigit": true,
        "requireSpecialChar": true
      },
      "violations": ["requireSpecialChar", "minLength"]
    },
    "timestamp": "2025-11-01T10:00:00Z",
    "requestId": "req-uuid"
  }
}
```

#### ログインエラー (010-019)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_010 | 401 | メールアドレスまたはパスワードが無効 | 認証情報を確認 |
| BC003_ERR_011 | 401 | MFAコードが無効 | 正しいMFAコードを入力 |
| BC003_ERR_012 | 403 | ユーザーが無効化されている（status: inactive） | メール認証を完了 |
| BC003_ERR_013 | 403 | ユーザーが停止されている（status: suspended） | 管理者に連絡 |
| BC003_ERR_014 | 403 | アカウントがロックされている | 一定時間後に再試行、または管理者に連絡 |

**例**:

```json
{
  "error": {
    "code": "BC003_ERR_014",
    "message": "アカウントがロックされています。5回連続でログインに失敗しました",
    "details": {
      "lockedAt": "2025-11-01T09:50:00Z",
      "lockDuration": 1800,
      "unlockAt": "2025-11-01T10:20:00Z",
      "remainingSeconds": 1200
    },
    "timestamp": "2025-11-01T10:00:00Z",
    "requestId": "req-uuid"
  }
}
```

#### ログアウト・トークンエラー (020-039)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_020 | 401 | 無効なトークン | 再ログイン |
| BC003_ERR_021 | 404 | セッションが存在しない | 再ログイン |
| BC003_ERR_030 | 401 | Refresh Tokenが無効 | 再ログイン |
| BC003_ERR_031 | 401 | Refresh Tokenの有効期限切れ | 再ログイン |
| BC003_ERR_032 | 403 | セッションが無効化されている | 再ログイン |

#### MFAエラー (040-059)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_040 | 400 | 無効なMFA方式 | `totp`または`sms`を指定 |
| BC003_ERR_041 | 400 | SMS方式で電話番号が未指定 | 電話番号を指定 |
| BC003_ERR_042 | 409 | MFAは既に有効化されている | MFAを無効化してから再設定 |
| BC003_ERR_050 | 400 | MFAコードが無効 | 正しいMFAコードを入力 |
| BC003_ERR_051 | 400 | MFAコードの形式が不正（6桁の数字が必要） | 6桁の数字を入力 |
| BC003_ERR_052 | 404 | チャレンジIDが存在しない | 再ログインして新しいチャレンジを取得 |
| BC003_ERR_053 | 410 | チャレンジIDの有効期限切れ（5分） | 再ログインして新しいチャレンジを取得 |
| BC003_ERR_060 | 401 | パスワードが無効 | 正しいパスワードを入力 |
| BC003_ERR_061 | 404 | MFAが有効化されていない | MFAを設定してから無効化 |

#### パスワード管理エラー (070-089)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_070 | 400 | リセットトークンが無効 | パスワードリセットを再度リクエスト |
| BC003_ERR_071 | 400 | リセットトークンの有効期限切れ（1時間） | パスワードリセットを再度リクエスト |
| BC003_ERR_072 | 400 | 新しいパスワードが複雑性要件を満たさない | 要件を満たすパスワードを設定 |
| BC003_ERR_080 | 401 | 現在のパスワードが無効 | 正しい現在のパスワードを入力 |
| BC003_ERR_081 | 400 | 新しいパスワードが複雑性要件を満たさない | 要件を満たすパスワードを設定 |
| BC003_ERR_082 | 400 | 新しいパスワードが過去3つのパスワードと同じ | 異なるパスワードを設定 |

#### セッション管理エラー (090-099)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_090 | 404 | セッションが存在しない | 有効なセッションIDを指定 |
| BC003_ERR_091 | 403 | 他人のセッションを無効化する権限なし | 自身のセッションのみ操作可能 |

---

### Authorization Errors (100-199)

#### ロール管理エラー (100-139)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_100 | 400 | ロール名が既に存在 | 別のロール名を使用 |
| BC003_ERR_101 | 400 | 無効な権限スコープ | 有効な権限スコープを指定 |
| BC003_ERR_102 | 404 | 親ロールが存在しない | 有効な親ロールIDを指定 |
| BC003_ERR_103 | 400 | 循環参照が発生（親ロール階層） | 親ロールを修正 |
| BC003_ERR_110 | 404 | ロールが存在しない | 有効なロールIDを指定 |
| BC003_ERR_111 | 403 | ロール閲覧権限なし | `role:read`権限を付与 |
| BC003_ERR_120 | 400 | システムロールは変更不可 | システムロールは保護されている |
| BC003_ERR_130 | 400 | システムロールは削除不可 | システムロールは保護されている |
| BC003_ERR_131 | 409 | ロールが使用中（ユーザーに割り当てられている） | ユーザーから削除後に再試行 |
| BC003_ERR_132 | 409 | 子ロールが存在 | 子ロールを削除または再配置 |

#### 権限管理エラー (140-159)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_140 | 400 | 無効な権限スコープ | 有効な権限スコープを指定 |
| BC003_ERR_141 | 409 | 一部の権限は既に割り当て済み | 未割り当ての権限のみ指定 |
| BC003_ERR_150 | 404 | 権限が存在しない、またはロールに割り当てられていない | 有効な権限IDを指定 |

#### アクセス制御チェックエラー (200-219)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_200 | 404 | ユーザーが存在しない | 有効なユーザーIDを指定 |
| BC003_ERR_201 | 400 | 無効な権限スコープ | 有効な権限スコープを指定 |
| BC003_ERR_202 | 403 | 他人の権限閲覧権限なし | `user:read`権限を付与 |

---

### User Management Errors (200-299)

#### ユーザー照会・更新エラー (200-209)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_200 | 404 | ユーザーが存在しない | 有効なユーザーIDを指定 |
| BC003_ERR_201 | 403 | ユーザー詳細閲覧権限なし | `user:read`権限を付与 |
| BC003_ERR_202 | 403 | ユーザー更新権限なし | `user:write`権限を付与 |
| BC003_ERR_203 | 400 | 無効なロケール | 有効なロケールを指定（en-US, ja-JP等） |
| BC003_ERR_204 | 400 | 無効なタイムゾーン | IANA形式のタイムゾーンを指定 |

#### ユーザー削除エラー (210-219)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_210 | 403 | ユーザー削除権限なし | `user:delete`権限を付与 |
| BC003_ERR_211 | 403 | 物理削除にはsystem_admin権限が必要 | system_admin権限を付与 |
| BC003_ERR_212 | 400 | 自分自身は削除できない | 他の管理者に依頼 |
| BC003_ERR_213 | 409 | 最後のsystem_adminユーザーは削除不可 | 別のsystem_adminを作成してから削除 |

#### ステータス管理エラー (220-239)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_220 | 403 | ユーザー停止権限なし | `user:manage`権限を付与 |
| BC003_ERR_221 | 400 | 既に停止されている | 現在のステータスを確認 |
| BC003_ERR_222 | 400 | system_adminユーザーは停止できない | system_adminは保護されている |
| BC003_ERR_230 | 403 | ユーザー有効化権限なし | `user:manage`権限を付与 |
| BC003_ERR_231 | 400 | 既に有効化されている | 現在のステータスを確認 |
| BC003_ERR_232 | 400 | 削除済みユーザーは有効化できない | 削除済みユーザーは復元不可 |

#### ロール割当エラー (240-259)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_240 | 404 | 一部のロールが存在しない | 有効なロールIDを指定 |
| BC003_ERR_241 | 403 | ロール割当権限なし | `role:manage`権限を付与 |
| BC003_ERR_242 | 409 | 一部のロールは既に割り当て済み | 未割り当てのロールのみ指定 |
| BC003_ERR_250 | 404 | ロールが割り当てられていない | 割り当て済みのロールを指定 |
| BC003_ERR_251 | 403 | ロール削除権限なし | `role:manage`権限を付与 |
| BC003_ERR_252 | 409 | 最後のsystem_adminロールは削除不可 | 別のsystem_adminを追加してから削除 |

#### プロフィール管理エラー (260-279)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_260 | 403 | プロフィール更新権限なし | 自身のプロフィールのみ更新可能 |
| BC003_ERR_261 | 400 | 無効なロケールまたはタイムゾーン | 有効な値を指定 |
| BC003_ERR_270 | 400 | ファイル形式が無効（JPG, PNG, GIFのみ） | JPG, PNG, GIF形式の画像を使用 |
| BC003_ERR_271 | 400 | ファイルサイズが大きすぎる（最大5MB） | 5MB以下の画像を使用 |
| BC003_ERR_272 | 400 | 画像サイズが不正（最小100x100、最大2048x2048） | 適切なサイズの画像を使用 |

---

### Audit & Security Errors (300-399)

#### 監査ログエラー (300-329)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_300 | 400 | 無効な日時範囲 | 開始日時 < 終了日時を確認 |
| BC003_ERR_301 | 403 | 監査ログ閲覧権限なし | `audit:read`権限を付与 |
| BC003_ERR_302 | 400 | 日時範囲が大きすぎる（最大90日間） | 期間を短縮 |
| BC003_ERR_310 | 404 | 監査ログが存在しない | 有効なログIDを指定 |
| BC003_ERR_320 | 400 | エクスポート期間が長すぎる（最大1年間） | 期間を短縮 |
| BC003_ERR_321 | 403 | エクスポート権限なし | `audit:export`権限を付与 |
| BC003_ERR_322 | 429 | 同時エクスポート数の上限（最大3件） | 既存エクスポートの完了を待つ |

#### セキュリティイベントエラー (330-339)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_330 | 400 | 無効なイベントタイプ | 有効なイベントタイプを指定 |
| BC003_ERR_331 | 403 | セキュリティアラート作成権限なし | `security:write`権限を付与 |

#### セキュリティポリシーエラー (340-349)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_340 | 404 | ポリシーが存在しない | 有効なポリシーIDを指定 |
| BC003_ERR_341 | 403 | ポリシー更新権限なし | `security:manage`権限を付与 |
| BC003_ERR_342 | 400 | 無効な設定値 | 有効な設定値を指定 |

---

### Integration Errors (400-499)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_400 | 400 | BC間連携エラー | リクエストを確認 |
| BC003_ERR_401 | 401 | BC間サービスアカウントが無効 | 有効なサービスアカウントを使用 |
| BC003_ERR_402 | 403 | BC間連携権限なし | 適切な権限を付与 |

---

### Rate Limiting Error (429)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_429 | 429 | レート制限超過 | Retry-Afterヘッダーを確認して再試行 |

**例**:

```json
{
  "error": {
    "code": "BC003_ERR_429",
    "message": "レート制限を超過しました",
    "details": {
      "limit": 10,
      "remaining": 0,
      "resetAt": "2025-11-01T10:01:00Z",
      "retryAfter": 60
    },
    "timestamp": "2025-11-01T10:00:00Z",
    "requestId": "req-uuid"
  }
}
```

---

### System Errors (500-599)

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC003_ERR_500 | 500 | 内部サーバーエラー | 運営チームに連絡（requestIdを提供） |
| BC003_ERR_501 | 503 | サービス一時停止中（メンテナンス） | メンテナンス終了後に再試行 |
| BC003_ERR_502 | 502 | 外部サービスエラー | 時間を置いて再試行 |
| BC003_ERR_503 | 504 | タイムアウト | 時間を置いて再試行 |

---

## エラーハンドリングパターン {#error-handling-patterns}

### クライアント側のエラーハンドリング

#### TypeScriptでの実装例

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId: string;
  documentation?: string;
}

async function handleApiCall<T>(
  apiCall: () => Promise<Response>
): Promise<T> {
  try {
    const response = await apiCall();

    if (!response.ok) {
      const errorData: { error: ApiError } = await response.json();
      throw new ApiError(errorData.error);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      handleApiError(error);
    } else {
      handleNetworkError(error);
    }
    throw error;
  }
}

class ApiError extends Error {
  code: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId: string;
  documentation?: string;

  constructor(errorData: ApiError) {
    super(errorData.message);
    this.name = 'ApiError';
    this.code = errorData.code;
    this.details = errorData.details;
    this.timestamp = errorData.timestamp;
    this.requestId = errorData.requestId;
    this.documentation = errorData.documentation;
  }
}

function handleApiError(error: ApiError): void {
  switch (error.code) {
    case 'BC003_ERR_010':
      // ログイン失敗
      showLoginError('メールアドレスまたはパスワードが無効です');
      break;

    case 'BC003_ERR_014':
      // アカウントロック
      const unlockAt = error.details?.unlockAt;
      showAccountLockedError(`アカウントがロックされています。${unlockAt}に自動解除されます`);
      break;

    case 'BC003_ERR_020':
    case 'BC003_ERR_030':
    case 'BC003_ERR_031':
      // トークン無効
      redirectToLogin();
      break;

    case 'BC003_ERR_429':
      // レート制限
      const retryAfter = error.details?.retryAfter || 60;
      showRateLimitError(`リクエストが多すぎます。${retryAfter}秒後に再試行してください`);
      break;

    case 'BC003_ERR_500':
      // サーバーエラー
      showSystemError(`システムエラーが発生しました。リクエストID: ${error.requestId}`);
      reportErrorToMonitoring(error);
      break;

    default:
      // 一般エラー
      showGenericError(error.message);
  }
}

function handleNetworkError(error: any): void {
  console.error('Network error:', error);
  showNetworkError('ネットワークエラーが発生しました。接続を確認してください');
}
```

#### リトライロジック

```typescript
async function apiCallWithRetry<T>(
  apiCall: () => Promise<Response>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await handleApiCall<T>(apiCall);
    } catch (error) {
      lastError = error as Error;

      if (error instanceof ApiError) {
        // リトライ可能なエラーか判定
        if (!isRetryableError(error.code)) {
          throw error;
        }

        // 指数バックオフ
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await sleep(delay);
      } else {
        // ネットワークエラーは常にリトライ
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await sleep(delay);
      }
    }
  }

  throw lastError!;
}

function isRetryableError(errorCode: string): boolean {
  const retryableErrors = [
    'BC003_ERR_429', // レート制限
    'BC003_ERR_500', // 内部サーバーエラー
    'BC003_ERR_502', // 外部サービスエラー
    'BC003_ERR_503', // タイムアウト
  ];

  return retryableErrors.includes(errorCode);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### ユーザーフレンドリーなエラーメッセージ

```typescript
const userFriendlyMessages: Record<string, string> = {
  'BC003_ERR_001': 'メールアドレスの形式が正しくありません',
  'BC003_ERR_002': 'このユーザー名は既に使用されています',
  'BC003_ERR_003': 'このメールアドレスは既に登録されています',
  'BC003_ERR_004': 'パスワードは8文字以上で、大文字・小文字・数字・記号を含む必要があります',
  'BC003_ERR_010': 'メールアドレスまたはパスワードが正しくありません',
  'BC003_ERR_011': '認証コードが正しくありません',
  'BC003_ERR_012': 'アカウントが有効化されていません。メールを確認してください',
  'BC003_ERR_013': 'アカウントが停止されています。管理者に連絡してください',
  'BC003_ERR_014': 'アカウントがロックされています。しばらくしてから再試行してください',
  'BC003_ERR_020': 'セッションの有効期限が切れました。再ログインしてください',
  'BC003_ERR_429': 'リクエストが多すぎます。しばらくしてから再試行してください',
  'BC003_ERR_500': 'システムエラーが発生しました。しばらくしてから再試行してください',
};

function getUserFriendlyMessage(errorCode: string, defaultMessage: string): string {
  return userFriendlyMessages[errorCode] || defaultMessage;
}
```

---

## 関連ドキュメント

- [README.md](./README.md) - API設計概要
- [authentication-api.md](./authentication-api.md) - 認証API
- [authorization-api.md](./authorization-api.md) - 認可API
- [user-management-api.md](./user-management-api.md) - ユーザー管理API
- [audit-security-api.md](./audit-security-api.md) - 監査・セキュリティAPI
- [rate-limiting-sla.md](./rate-limiting-sla.md) - レート制限とSLA

---

**ステータス**: Phase 2.2 - BC-003 Error Handling完成
**最終更新**: 2025-11-01
