# L3-001: Resource Planning & Allocation

**作成日**: 2025-10-31
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: optimally-allocate-resources, workload-tracking (productivity-visualization-service)

---

## 📋 What: この能力の定義

### 能力の概要
リソースを計画し最適に配分する能力。リソース需要予測、配分計画、稼働率最適化、工数記録を通じて、リソースの効率的活用を実現します。

### 実現できること
- リソース需要の予測
- スキルベースのリソース配分
- 稼働率の可視化と最適化
- 工数の記録と承認
- リソース競合の解決

### 必要な知識
- リソース管理手法
- キャパシティプランニング
- スキルマトリックス管理
- 工数管理プロセス
- 最適化アルゴリズム

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: ResourceAllocationAggregate ([../../domain/README.md](../../domain/README.md#resource-allocation-aggregate))
- **Entities**: Resource, ResourceAllocation, Timesheet, TimesheetEntry, UtilizationRate
- **Value Objects**: Availability, SkillLevel, WorkloadCapacity, UtilizationPercentage

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/resources/allocate - リソース配分
  - GET /api/resources/forecast - 需要予測
  - POST /api/timesheets/record - 工数記録
  - GET /api/resources/utilization - 稼働率分析

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: resources, resource_allocations, timesheets, timesheet_entries, utilization_metrics

詳細: [../../data/README.md](../../data/README.md)

---

## 🛠️ 実装アプローチ

### 技術的実現方法

#### アルゴリズム・パターン
- **リソース配分最適化**: 線形計画法（Linear Programming）- 制約条件下での最適配分
- **需要予測**: 時系列分析（ARIMA、指数平滑法）
- **稼働率計算**: 集計アルゴリズム（実工数 / 標準工数）
- **デザインパターン**:
  - Strategy Pattern（配分アルゴリズムの切り替え）
  - Observer Pattern（配分変更イベント通知）
  - Factory Pattern（タイムシート生成）

#### 実装要件
- **最適化計算**: 最適化エンジン（線形計画法ソルバー）
- **時系列予測**: 予測エンジン（需要予測）
- **カレンダー計算**: 日付計算機能（営業日・稼働日計算）
- **可視化**: 可視化機能（稼働率グラフ、ガントチャート）

### パフォーマンス考慮事項

#### スケーラビリティ
- **リソース数**: 最大10,000リソース
- **配分計算**: 複雑な制約でも10秒以内に最適解を算出
- **稼働率計算**: 1,000リソース × 1年間の集計を5秒以内

#### キャッシュ戦略
- **リソース可用性**: キャッシュ機構（TTL: 15分、配分変更時に無効化）
- **稼働率集計**: 日次バッチで事前計算、キャッシュ機構保存
- **カレンダー情報**: メモリキャッシュ（祝日・休日マスタ）

#### 最適化ポイント
- **バッチ集計**: タイムシート承認時に稼働率を増分更新
- **インデックス活用**: `resource_allocations(resource_id, start_date, end_date)`, `timesheets(resource_id, period_start)`
- **パーティション**: タイムシートを年月でパーティション分割

---

## ⚠️ 前提条件と制約

### BC間連携

#### 依存BC
- **BC-001: Project Delivery & Quality** - プロジェクト情報、タスク情報
  - 使用API: `GET /api/bc-001/projects/{projectId}` - プロジェクト詳細
  - 使用API: `GET /api/bc-001/projects/{projectId}/tasks` - タスク一覧
- **BC-002: Financial Health & Profitability** - コスト情報
  - 使用API: `GET /api/bc-002/resources/{resourceId}/cost-rate` - リソース単価
- **BC-003: Access Control & Security** - 承認権限
  - 使用API: `POST /api/bc-003/authorize` - タイムシート承認権限チェック

#### 提供API（他BCから利用）
- **BC-001**: リソース配分情報を提供
  - `GET /api/bc-005/resources/availability` - リソース可用性
  - `GET /api/bc-005/resources/{resourceId}/allocations` - 配分状況

### データ整合性要件

#### トランザクション境界
- **リソース配分**: ResourceAllocation作成 + プロジェクトへの関連付けを1トランザクション
- **タイムシート承認**: Timesheet状態更新 + 稼働率再計算を原子的に実行
- **整合性レベル**: 強整合性（ACID準拠）

#### データ制約
- リソース配分率の合計は200%以下（兼務考慮）
- タイムシート合計時間は1日24時間以下
- 承認済みタイムシートは変更不可
- 配分期間の開始日 ≤ 終了日

### セキュリティ要件

#### 認証・認可
- **認証**: JWT Bearer Token（BC-003認証機能）
- **必要権限**:
  - リソース配分: `resource:allocate`
  - タイムシート承認: `timesheet:approve`
  - 稼働率参照: `resource:utilization:read`

#### データ保護
- **機密度**: リソース情報はInternal、稼働率データはConfidential
- **監査ログ**: 全ての配分変更・タイムシート承認を記録
- **アクセス制御**: 本人・上司・PMのみタイムシート編集可能

### スケーラビリティ制約

#### 最大同時処理
- **配分作成**: 100リクエスト/秒
- **タイムシート提出**: 500リクエスト/秒
- **稼働率計算**: 50リクエスト/秒（重い集計）

#### データ量上限
- **アクティブリソース数**: 10,000リソース
- **配分レコード**: 100万件（過去3年分）
- **タイムシートエントリ**: 1億件（全履歴）

---

## 🔗 BC設計との統合

### 使用ドメインオブジェクト

#### Aggregates
- **Resource Aggregate** ([../../domain/README.md#resource-aggregate](../../domain/README.md#resource-aggregate))
  - Resource（集約ルート）: リソースライフサイクル管理
  - ResourceAllocation: リソース配分
  - Timesheet: タイムシート
  - TimesheetEntry: タイムシート明細

#### Value Objects
- **Availability**: 稼働可能性（available_hours, allocated_hours）
- **UtilizationRate**: 稼働率（actual_hours / standard_hours）
- **AllocationPercentage**: 配分率（0.0-2.0、200%まで許可）

### 呼び出すAPI例

#### リソース配分作成
```http
POST /api/v1/bc-005/resources/{resourceId}/allocations
Content-Type: application/json
Authorization: Bearer {token}

{
  "projectId": "project-uuid",
  "allocationPercentage": 0.5,
  "startDate": "2025-11-10",
  "endDate": "2026-02-28",
  "notes": "新製品開発プロジェクト担当"
}

Response:
{
  "allocationId": "allocation-uuid",
  "resourceId": "resource-uuid",
  "projectId": "project-uuid",
  "allocationPercentage": 0.5,
  "startDate": "2025-11-10",
  "endDate": "2026-02-28",
  "createdAt": "2025-11-03T10:00:00Z"
}
```

#### リソース可用性取得
```http
GET /api/v1/bc-005/resources/availability?skillId=typescript&startDate=2025-11-10&endDate=2026-02-28

Response:
{
  "availableResources": [
    {
      "resourceId": "resource-uuid",
      "name": "山田太郎",
      "skillLevel": 4,
      "availabilityPercentage": 0.3,
      "currentAllocations": [
        {"projectId": "proj-1", "percentage": 0.5},
        {"projectId": "proj-2", "percentage": 0.2}
      ]
    }
  ]
}
```

#### タイムシート記録
```http
POST /api/v1/bc-005/timesheets
Content-Type: application/json

{
  "resourceId": "resource-uuid",
  "periodStart": "2025-11-03",
  "periodEnd": "2025-11-09",
  "entries": [
    {
      "date": "2025-11-03",
      "projectId": "project-uuid",
      "taskId": "task-uuid",
      "hours": 8.0,
      "description": "要件定義レビュー"
    }
  ]
}

Response:
{
  "timesheetId": "timesheet-uuid",
  "status": "draft",
  "totalHours": 40.0,
  "createdAt": "2025-11-03T18:00:00Z"
}
```

#### タイムシート承認
```http
POST /api/v1/bc-005/timesheets/{timesheetId}/approve
Content-Type: application/json

{
  "approverId": "manager-uuid",
  "comments": "承認しました"
}

Response:
{
  "timesheetId": "timesheet-uuid",
  "status": "approved",
  "approvedBy": "manager-uuid",
  "approvedAt": "2025-11-04T09:00:00Z"
}
```

#### 稼働率取得
```http
GET /api/v1/bc-005/resources/{resourceId}/utilization?startDate=2025-10-01&endDate=2025-10-31

Response:
{
  "resourceId": "resource-uuid",
  "period": {
    "startDate": "2025-10-01",
    "endDate": "2025-10-31"
  },
  "utilizationRate": 0.85,
  "totalHours": 160,
  "workableHours": 176,
  "breakdown": [
    {"projectId": "proj-1", "hours": 88, "percentage": 0.55},
    {"projectId": "proj-2", "hours": 72, "percentage": 0.45}
  ]
}
```

### データアクセスパターン

#### 読み取り
- **resources テーブル**:
  - インデックス: `idx_resources_user_id`（ユーザー別リソース）
  - インデックス: `idx_resources_status`（アクティブリソース）
- **resource_allocations テーブル**:
  - インデックス: `idx_allocations_resource_id_dates`（リソース別期間検索）
  - インデックス: `idx_allocations_project_id`（プロジェクト別リソース）
- **timesheets テーブル**:
  - インデックス: `idx_timesheets_resource_id_period`（リソース別期間）
  - パーティション: 年月別パーティション

#### 書き込み
- **配分作成トランザクション**:
  ```sql
  BEGIN;
  -- 配分率チェック
  SELECT SUM(allocation_percentage) FROM resource_allocations
    WHERE resource_id = ? AND start_date <= ? AND end_date >= ?;
  -- 配分作成
  INSERT INTO resource_allocations (...) VALUES (...);
  -- キャッシュ無効化
  DELETE FROM cache WHERE key = 'resource:' || resource_id || ':availability';
  COMMIT;
  ```
- **タイムシート承認トランザクション**:
  ```sql
  BEGIN;
  UPDATE timesheets SET status = 'approved', approved_by = ?, approved_at = NOW() WHERE id = ?;
  -- 稼働率再計算（集計テーブル更新）
  INSERT INTO utilization_metrics (...) VALUES (...) ON CONFLICT UPDATE;
  COMMIT;
  ```

#### キャッシュアクセス
- **リソース可用性キャッシュ**:
  ```
  Key: `resource:{resourceId}:availability:{date}`
  Value: JSON（配分状況）
  TTL: 900秒（15分）
  ```
- **稼働率キャッシュ**:
  ```
  Key: `resource:{resourceId}:utilization:{year_month}`
  Value: 稼働率（%）
  TTL: 日次バッチで更新
  ```

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: リソースを配分する | プロジェクトへの人員配置 | 3-4個 | allocate-resources |
| **OP-002**: リソース需要を予測する | 将来の必要人員の予測 | 2-3個 | forecast-resource-demand |
| **OP-003**: 稼働率を最適化する | 稼働率の分析と改善 | 2-3個 | optimize-resource-utilization |
| **OP-004**: 工数を記録・承認する | タイムシート管理 | 3個 | record-time, approve-timesheet (workload-tracking) |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 4個
- **推定UseCase数**: 10-13個
- **V2からの移行**: productivity-visualization-service の workload-tracking を統合

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/talent-optimization-service/capabilities/optimally-allocate-resources/](../../../../services/talent-optimization-service/capabilities/optimally-allocate-resources/)
> - [services/productivity-visualization-service/capabilities/workload-tracking/](../../../../services/productivity-visualization-service/capabilities/workload-tracking/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-001 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
