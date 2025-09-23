# プロジェクトサービス API仕様

## 基本情報
- ベースパス: `/api/projects`
- 認証方式: JWT Bearer Token
- レート制限: 100リクエスト/分/IP
- バージョン: v1.0.0

## 共通ヘッダー
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
```

## エンドポイント定義

### 1. プロジェクト管理

#### GET /api/projects
**説明**: プロジェクト一覧の取得

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| page | INTEGER | - | ページ番号（デフォルト: 1） |
| limit | INTEGER | - | 件数（デフォルト: 20） |
| status | ENUM | - | ステータスフィルター |
| clientId | UUID | - | クライアントIDフィルター |
| search | STRING | - | 検索キーワード |
| sort | STRING | - | ソート順（例: startDate:desc） |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| projects | ARRAY[PROJECT] | プロジェクトリスト |
| total | INTEGER | 総件数 |
| page | INTEGER | 現在のページ |
| totalPages | INTEGER | 総ページ数 |

---

#### GET /api/projects/:id
**説明**: プロジェクト詳細の取得

**認証**: 必要（プロジェクトメンバーまたは管理者）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | プロジェクトID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| id | UUID | プロジェクトID |
| code | STRING_20 | プロジェクトコード |
| name | STRING_100 | プロジェクト名 |
| description | TEXT | プロジェクト説明 |
| status | ENUM | ステータス |
| budget | MONEY | 予算 |
| startDate | DATE | 開始日 |
| endDate | DATE | 終了予定日 |
| actualEndDate | DATE | 実終了日 |
| clientId | UUID | クライアントID |
| progress | PERCENTAGE | 進捗率 |
| members | ARRAY[PROJECT_MEMBER] | メンバー一覧 |
| milestones | ARRAY[MILESTONE] | マイルストーン一覧 |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |

---

#### POST /api/projects
**説明**: 新規プロジェクトの作成

**認証**: PM以上の権限

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| code | STRING_20 | ✓ | プロジェクトコード（一意） |
| name | STRING_100 | ✓ | プロジェクト名 |
| description | TEXT | - | プロジェクト説明 |
| budget | MONEY | ✓ | 予算 |
| startDate | DATE | ✓ | 開始日 |
| endDate | DATE | ✓ | 終了予定日 |
| clientId | UUID | ✓ | クライアントID |
| pmUserId | UUID | ✓ | PM担当者ID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| project | PROJECT_OBJECT | 作成されたプロジェクト |

---

#### PUT /api/projects/:id
**説明**: プロジェクト情報の更新

**認証**: PM以上の権限（プロジェクト所属）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | プロジェクトID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| name | STRING_100 | - | プロジェクト名 |
| description | TEXT | - | プロジェクト説明 |
| budget | MONEY | - | 予算 |
| status | ENUM | - | ステータス |
| endDate | DATE | - | 終了予定日 |
| actualEndDate | DATE | - | 実終了日 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| project | PROJECT_OBJECT | 更新されたプロジェクト |

---

#### DELETE /api/projects/:id
**説明**: プロジェクトの削除（論理削除）

**認証**: 管理者権限

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | プロジェクトID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| deleted | BOOLEAN | 削除成功フラグ |

---

### 2. タスク管理

#### GET /api/projects/:projectId/tasks
**説明**: タスク一覧の取得

**認証**: 必要（プロジェクトメンバー）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| status | ENUM | - | ステータスフィルター |
| assigneeId | UUID | - | 担当者フィルター |
| priority | ENUM | - | 優先度フィルター |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| tasks | ARRAY[TASK] | タスクリスト |
| total | INTEGER | 総件数 |

---

#### GET /api/projects/:projectId/tasks/:taskId
**説明**: タスク詳細の取得

**認証**: 必要（プロジェクトメンバー）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |
| taskId | UUID | タスクID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| id | UUID | タスクID |
| title | STRING_200 | タスクタイトル |
| description | TEXT | タスク説明 |
| status | ENUM | ステータス |
| priority | ENUM | 優先度 |
| assigneeId | UUID | 担当者ID |
| estimatedHours | DECIMAL | 見積工数 |
| actualHours | DECIMAL | 実工数 |
| startDate | DATE | 開始日 |
| dueDate | DATE | 期限日 |
| completedDate | DATE | 完了日 |
| dependencies | ARRAY[UUID] | 依存タスクID |
| attachments | ARRAY[ATTACHMENT] | 添付ファイル |

---

#### POST /api/projects/:projectId/tasks
**説明**: 新規タスクの作成

**認証**: 必要（プロジェクトメンバー）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| title | STRING_200 | ✓ | タスクタイトル |
| description | TEXT | - | タスク説明 |
| priority | ENUM | ✓ | 優先度 |
| assigneeId | UUID | - | 担当者ID |
| estimatedHours | DECIMAL | ✓ | 見積工数 |
| startDate | DATE | ✓ | 開始日 |
| dueDate | DATE | ✓ | 期限日 |
| dependencies | ARRAY[UUID] | - | 依存タスクID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| task | TASK_OBJECT | 作成されたタスク |

---

#### PUT /api/projects/:projectId/tasks/:taskId
**説明**: タスク情報の更新

**認証**: 必要（タスク担当者またはPM）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |
| taskId | UUID | タスクID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| title | STRING_200 | - | タスクタイトル |
| description | TEXT | - | タスク説明 |
| status | ENUM | - | ステータス |
| priority | ENUM | - | 優先度 |
| assigneeId | UUID | - | 担当者ID |
| estimatedHours | DECIMAL | - | 見積工数 |
| actualHours | DECIMAL | - | 実工数 |
| dueDate | DATE | - | 期限日 |
| completedDate | DATE | - | 完了日 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| task | TASK_OBJECT | 更新されたタスク |

---

#### DELETE /api/projects/:projectId/tasks/:taskId
**説明**: タスクの削除

**認証**: PM以上の権限

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |
| taskId | UUID | タスクID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| deleted | BOOLEAN | 削除成功フラグ |

---

### 3. マイルストーン管理

#### GET /api/projects/:projectId/milestones
**説明**: マイルストーン一覧の取得

**認証**: 必要（プロジェクトメンバー）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| milestones | ARRAY[MILESTONE] | マイルストーン一覧 |

---

#### POST /api/projects/:projectId/milestones
**説明**: 新規マイルストーンの作成

**認証**: PM以上の権限

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| name | STRING_100 | ✓ | マイルストーン名 |
| description | TEXT | - | 説明 |
| dueDate | DATE | ✓ | 期限日 |
| deliverables | ARRAY[STRING] | - | 成果物リスト |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| milestone | MILESTONE_OBJECT | 作成されたマイルストーン |

---

### 4. メンバー管理

#### GET /api/projects/:projectId/members
**説明**: プロジェクトメンバー一覧の取得

**認証**: 必要（プロジェクトメンバー）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| members | ARRAY[PROJECT_MEMBER] | メンバー一覧 |

---

#### POST /api/projects/:projectId/members
**説明**: プロジェクトメンバーの追加

**認証**: PM以上の権限

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| userId | UUID | ✓ | ユーザーID |
| role | ENUM | ✓ | プロジェクト内ロール |
| allocationRate | PERCENTAGE | ✓ | 稼働率 |
| startDate | DATE | ✓ | 参加開始日 |
| endDate | DATE | - | 参加終了予定日 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| member | PROJECT_MEMBER_OBJECT | 追加されたメンバー |

---

#### DELETE /api/projects/:projectId/members/:userId
**説明**: プロジェクトメンバーの削除

**認証**: PM以上の権限

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |
| userId | UUID | ユーザーID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| removed | BOOLEAN | 削除成功フラグ |

---

### 5. リスク管理

#### GET /api/projects/:projectId/risks
**説明**: リスク一覧の取得

**認証**: 必要（プロジェクトメンバー）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| severity | ENUM | - | 重要度フィルター |
| status | ENUM | - | ステータスフィルター |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| risks | ARRAY[RISK] | リスク一覧 |

---

#### POST /api/projects/:projectId/risks
**説明**: 新規リスクの登録

**認証**: 必要（プロジェクトメンバー）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| title | STRING_200 | ✓ | リスクタイトル |
| description | TEXT | ✓ | リスク説明 |
| probability | ENUM | ✓ | 発生可能性 |
| impact | ENUM | ✓ | 影響度 |
| mitigation | TEXT | - | 軽減策 |
| owner | UUID | ✓ | 責任者ID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| risk | RISK_OBJECT | 登録されたリスク |

---

## 型定義

### PROJECT_OBJECT
```
{
  id: UUID,
  code: STRING_20,
  name: STRING_100,
  description: TEXT,
  status: ENUM[Planning|Active|OnHold|Completed|Cancelled],
  budget: MONEY,
  startDate: DATE,
  endDate: DATE,
  actualEndDate: DATE,
  clientId: UUID,
  progress: PERCENTAGE
}
```

### TASK_OBJECT
```
{
  id: UUID,
  title: STRING_200,
  description: TEXT,
  status: ENUM[NotStarted|InProgress|Blocked|Completed|Cancelled],
  priority: ENUM[Low|Medium|High|Critical],
  assigneeId: UUID,
  estimatedHours: DECIMAL,
  actualHours: DECIMAL,
  startDate: DATE,
  dueDate: DATE,
  completedDate: DATE
}
```

### MILESTONE_OBJECT
```
{
  id: UUID,
  name: STRING_100,
  description: TEXT,
  dueDate: DATE,
  actualDate: DATE,
  status: ENUM[Pending|Achieved|Missed],
  deliverables: ARRAY[STRING]
}
```

### PROJECT_MEMBER_OBJECT
```
{
  userId: UUID,
  projectId: UUID,
  role: ENUM[pm|member|reviewer|observer],
  allocationRate: PERCENTAGE,
  startDate: DATE,
  endDate: DATE,
  actualHours: DECIMAL
}
```

### RISK_OBJECT
```
{
  id: UUID,
  title: STRING_200,
  description: TEXT,
  probability: ENUM[VeryLow|Low|Medium|High|VeryHigh],
  impact: ENUM[VeryLow|Low|Medium|High|VeryHigh],
  severity: ENUM[Low|Medium|High|Critical],
  status: ENUM[Open|Monitoring|Mitigated|Closed],
  mitigation: TEXT,
  owner: UUID
}
```

## エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| PROJECT_NOT_FOUND | 404 | プロジェクトが存在しない |
| PROJECT_ACCESS_DENIED | 403 | プロジェクトへのアクセス権限なし |
| PROJECT_CODE_DUPLICATE | 409 | プロジェクトコード重複 |
| TASK_NOT_FOUND | 404 | タスクが存在しない |
| TASK_DEPENDENCY_ERROR | 400 | タスク依存関係エラー |
| MEMBER_ALREADY_EXISTS | 409 | メンバー既に存在 |
| ALLOCATION_EXCEEDS_LIMIT | 400 | 稼働率が100%を超過 |
| MILESTONE_DATE_CONFLICT | 400 | マイルストーン日付の矛盾 |