# L3-005: Risk & Issue Management

**作成日**: 2025-10-31
**所属BC**: BC-001: Project Delivery & Quality Management
**V2移行元**: foresee-and-handle-risks, monitor-and-ensure-quality

---

## 📋 What: この能力の定義

### 能力の概要
プロジェクトのリスクと課題を先回りして管理する能力。リスクの識別、評価、対応計画、継続的監視を通じて、プロジェクトの安定性を確保します。

### 実現できること
- プロジェクトリスクの早期識別
- リスク影響度・発生確率の評価
- リスク対応計画の策定
- リスク・イシューの継続的監視
- 品質リスクの統合管理

### 必要な知識
- リスク管理手法（PMBOK、ISO31000）
- リスクアセスメント技法
- 課題管理プロセス
- 品質管理手法
- 早期警告システム

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: RiskManagementAggregate ([../../domain/README.md](../../domain/README.md#risk-management-aggregate))
- **Entities**: Risk, Issue, RiskResponse, Mitigation, QualityMetric
- **Value Objects**: RiskLevel, Probability, Impact, IssueStatus, QualityThreshold

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/risks - リスク識別
  - PUT /api/risks/{id}/assess - リスク評価
  - POST /api/risks/{id}/response - 対応計画
  - PUT /api/risks/{id}/monitor - リスク監視

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: risks, issues, risk_assessments, risk_responses, mitigations, quality_metrics

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: リスクを識別・評価する | リスクの発見と優先度付け | 3-4個 | identify-and-assess-risks |
| **OP-002**: リスク対応を計画する | 対応戦略の策定と実施 | 2-3個 | plan-risk-response |
| **OP-003**: リスク・イシューを監視・対処する | 継続監視と課題対応 | 3-4個 | monitor-and-handle-risks, visualize-and-control-progress |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 8-11個
- **V2からの移行**: 品質監視機能を統合（monitor-and-ensure-quality を統合）

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/project-success-service/capabilities/foresee-and-handle-risks/](../../../../services/project-success-service/capabilities/foresee-and-handle-risks/)
> - [services/project-success-service/capabilities/monitor-and-ensure-quality/](../../../../services/project-success-service/capabilities/monitor-and-ensure-quality/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-005 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
