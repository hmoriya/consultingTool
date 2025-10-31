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
