# タイムシートサービス API仕様

## 基本情報
- ベースパス: `/api/timesheets`
- 認証方式: JWT Bearer Token
- レート制限: 100リクエスト/分/IP
- バージョン: v1.0.0

## エンドポイント定義

### 1. 工数入力管理

#### GET /api/timesheets
**説明**: タイムシート一覧の取得

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| userId | UUID | - | ユーザーIDフィルター |
| projectId | UUID | - | プロジェクトIDフィルター |
| startDate | DATE | - | 開始日フィルター |
| endDate | DATE | - | 終了日フィルター |
| status | ENUM | - | ステータスフィルター |
| page | INTEGER | - | ページ番号（デフォルト: 1） |
| limit | INTEGER | - | 件数（デフォルト: 20） |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| timesheets | ARRAY[TIMESHEET] | タイムシート一覧 |
| total | INTEGER | 総件数 |
| page | INTEGER | 現在のページ |
| totalPages | INTEGER | 総ページ数 |

---

#### GET /api/timesheets/:id
**説明**: タイムシート詳細の取得

**認証**: 必要（本人または承認者）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | タイムシートID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| id | UUID | タイムシートID |
| userId | UUID | ユーザーID |
| weekStartDate | DATE | 週開始日 |
| weekEndDate | DATE | 週終了日 |
| totalHours | DECIMAL | 合計工数 |
| billableHours | DECIMAL | 請求可能工数 |
| status | ENUM | ステータス |
| entries | ARRAY[TIMESHEET_ENTRY] | 工数エントリー |
| submittedAt | TIMESTAMP | 提出日時 |
| approvedAt | TIMESTAMP | 承認日時 |
| approvedBy | UUID | 承認者ID |
| comments | TEXT | コメント |

---

#### POST /api/timesheets
**説明**: 新規タイムシートの作成

**認証**: 必要

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| weekStartDate | DATE | ✓ | 週開始日（月曜） |
| entries | ARRAY[ENTRY_INPUT] | ✓ | 工数エントリー |
| comments | TEXT | - | コメント |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| timesheet | TIMESHEET_OBJECT | 作成されたタイムシート |

---

#### PUT /api/timesheets/:id
**説明**: タイムシートの更新

**認証**: 必要（本人、ドラフト状態のみ）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | タイムシートID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| entries | ARRAY[ENTRY_INPUT] | - | 工数エントリー |
| comments | TEXT | - | コメント |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| timesheet | TIMESHEET_OBJECT | 更新されたタイムシート |

---

#### POST /api/timesheets/:id/submit
**説明**: タイムシートの提出

**認証**: 必要（本人）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | タイムシートID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| submitted | BOOLEAN | 提出成功フラグ |
| submittedAt | TIMESTAMP | 提出日時 |

---

### 2. 承認処理

#### GET /api/timesheets/approval/pending
**説明**: 承認待ちタイムシート一覧

**認証**: 承認者権限

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| projectId | UUID | - | プロジェクトIDフィルター |
| teamId | UUID | - | チームIDフィルター |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| timesheets | ARRAY[TIMESHEET] | 承認待ちタイムシート |
| count | INTEGER | 件数 |

---

#### POST /api/timesheets/:id/approve
**説明**: タイムシートの承認

**認証**: 承認者権限

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | タイムシートID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| comments | TEXT | - | 承認コメント |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| approved | BOOLEAN | 承認成功フラグ |
| approvedAt | TIMESTAMP | 承認日時 |

---

#### POST /api/timesheets/:id/reject
**説明**: タイムシートの差戻し

**認証**: 承認者権限

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | タイムシートID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| reason | TEXT | ✓ | 差戻し理由 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| rejected | BOOLEAN | 差戻し成功フラグ |
| rejectedAt | TIMESTAMP | 差戻し日時 |

---

### 3. レポート生成

#### GET /api/timesheets/reports/summary
**説明**: 工数サマリーレポート

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| startDate | DATE | ✓ | 開始日 |
| endDate | DATE | ✓ | 終了日 |
| groupBy | ENUM | - | 集計単位（user/project/team） |
| projectId | UUID | - | プロジェクトIDフィルター |
| userId | UUID | - | ユーザーIDフィルター |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| summary | OBJECT | サマリーデータ |
| details | ARRAY[SUMMARY_DETAIL] | 詳細データ |
| totalHours | DECIMAL | 合計工数 |
| billableHours | DECIMAL | 請求可能工数 |
| utilizationRate | PERCENTAGE | 稼働率 |

---

#### GET /api/timesheets/reports/project/:projectId
**説明**: プロジェクト別工数レポート

**認証**: PM以上の権限

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| startDate | DATE | - | 開始日 |
| endDate | DATE | - | 終了日 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| projectId | UUID | プロジェクトID |
| projectName | STRING | プロジェクト名 |
| totalHours | DECIMAL | 合計工数 |
| budgetedHours | DECIMAL | 予算工数 |
| burnRate | PERCENTAGE | 消化率 |
| memberBreakdown | ARRAY[MEMBER_HOURS] | メンバー別内訳 |
| taskBreakdown | ARRAY[TASK_HOURS] | タスク別内訳 |
| weeklyTrend | ARRAY[WEEKLY_HOURS] | 週次推移 |

---

#### GET /api/timesheets/reports/utilization
**説明**: リソース稼働率レポート

**認証**: 管理者権限

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| startDate | DATE | ✓ | 開始日 |
| endDate | DATE | ✓ | 終了日 |
| teamId | UUID | - | チームIDフィルター |
| departmentId | UUID | - | 部署IDフィルター |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| resources | ARRAY[RESOURCE_UTILIZATION] | リソース別稼働率 |
| averageUtilization | PERCENTAGE | 平均稼働率 |
| targetUtilization | PERCENTAGE | 目標稼働率 |
| underutilized | ARRAY[UUID] | 低稼働リソース |
| overutilized | ARRAY[UUID] | 過稼働リソース |

---

### 4. エクスポート機能

#### GET /api/timesheets/export
**説明**: タイムシートのエクスポート

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| format | ENUM | ✓ | 形式（csv/excel/pdf） |
| startDate | DATE | ✓ | 開始日 |
| endDate | DATE | ✓ | 終了日 |
| userId | UUID | - | ユーザーIDフィルター |
| projectId | UUID | - | プロジェクトIDフィルター |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| downloadUrl | URL | ダウンロードURL |
| expiresAt | TIMESTAMP | URL有効期限 |

---

## 型定義

### TIMESHEET_OBJECT
```
{
  id: UUID,
  userId: UUID,
  weekStartDate: DATE,
  weekEndDate: DATE,
  totalHours: DECIMAL,
  billableHours: DECIMAL,
  status: ENUM[Draft|Submitted|Approved|Rejected],
  submittedAt: TIMESTAMP,
  approvedAt: TIMESTAMP,
  approvedBy: UUID
}
```

### TIMESHEET_ENTRY
```
{
  id: UUID,
  timesheetId: UUID,
  projectId: UUID,
  taskId: UUID,
  date: DATE,
  hours: DECIMAL,
  billable: BOOLEAN,
  description: TEXT,
  category: ENUM[Development|Design|Meeting|Documentation|Testing|Other]
}
```

### ENTRY_INPUT
```
{
  projectId: UUID,
  taskId: UUID,
  date: DATE,
  hours: DECIMAL,
  billable: BOOLEAN,
  description: TEXT,
  category: ENUM
}
```

### RESOURCE_UTILIZATION
```
{
  resourceId: UUID,
  resourceName: STRING,
  totalAvailableHours: DECIMAL,
  totalWorkedHours: DECIMAL,
  billableHours: DECIMAL,
  utilizationRate: PERCENTAGE,
  billableRate: PERCENTAGE
}
```

### SUMMARY_DETAIL
```
{
  groupKey: STRING,
  groupName: STRING,
  totalHours: DECIMAL,
  billableHours: DECIMAL,
  count: INTEGER
}
```

## エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| TIMESHEET_NOT_FOUND | 404 | タイムシートが存在しない |
| TIMESHEET_ALREADY_SUBMITTED | 400 | 既に提出済み |
| TIMESHEET_NOT_EDITABLE | 403 | 編集不可状態 |
| INVALID_WEEK_RANGE | 400 | 無効な週範囲 |
| HOURS_EXCEED_LIMIT | 400 | 工数が上限を超過 |
| APPROVAL_NOT_ALLOWED | 403 | 承認権限なし |
| EXPORT_FAILED | 500 | エクスポート失敗 |
| FUTURE_DATE_NOT_ALLOWED | 400 | 未来日の入力不可 |