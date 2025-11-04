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

## 🛠️ 実装アプローチ

### 技術的実現方法

#### アルゴリズム・パターン
- **リスク評価アルゴリズム**: リスクマトリックス分析（影響度 × 発生確率）
- **リスクスコア計算**: 定量的リスクスコア（1-9スケール）
- **対応優先順位付け**: クリティカルパス上のリスク優先、スコア降順
- **デザインパターン**:
  - State Pattern（リスクステータス遷移: identified → assessed → in_mitigation → resolved/materialized）
  - Strategy Pattern（異なるリスク対応戦略）
  - Observer Pattern（リスク状態変更通知）

#### 推奨ライブラリ・フレームワーク
- **リスク可視化**: Chart.js - リスクマトリックス、ヒートマップ
- **リスクシミュレーション**: Monte Carlo simulation library（リスク影響予測）
- **アラート通知**: WebSocket（リアルタイムリスクアラート）+ BC-007連携
- **レポート生成**: PDFKit - リスクレポートPDF生成

### パフォーマンス考慮事項

#### スケーラビリティ
- **リスク数上限**: 1プロジェクトあたり最大500リスク
- **同時評価**: 最大100リスク/分の評価処理
- **イシュー数**: 1プロジェクトあたり最大1,000イシュー

#### キャッシュ戦略
- **リスクマトリックス**: Redis cache（TTL: 15分、リスク更新時に無効化）
- **重大リスクリスト**: メモリキャッシュ（リアルタイム更新）
- **プロジェクトリスクレベル**: 10分間隔でキャッシュ更新

#### 最適化ポイント
- **集約計算**: マテリアライズドビュー `mv_project_risk_summary`（リスク変更時にリフレッシュ）
- **遅延読み込み**: 解決済みリスクは必要時のみロード
- **インデックス活用**: `risks(project_id, risk_score DESC)`, `risks(status, impact, probability)`, `issues(project_id, severity)`

---

## ⚠️ 前提条件と制約

### BC間連携

#### 依存BC
- **BC-007: Team Communication & Collaboration** - リスクアラートとエスカレーション
  - 使用API: `POST /api/bc-007/alerts` - 重大リスク緊急通知
  - 使用API: `POST /api/bc-007/escalate` - リスクエスカレーション
  - 使用API: `POST /api/bc-007/notifications` - リスク状態変更通知
- **BC-006: Knowledge Management & Learning** - リスク教訓の蓄積
  - 使用API: `POST /api/bc-006/lessons-learned` - リスク発現時の教訓登録
  - 使用API: `GET /api/bc-006/knowledge/risks` - 過去リスク事例検索
- **BC-001 L3-002: Project Execution & Delivery** - プロジェクトヘルス状態への影響
  - 使用API: `PUT /api/bc-001/projects/{id}/health` - リスクによるヘルス更新
- **BC-002: Financial Health & Profitability** - リスク対応コスト追跡
  - 使用API: `POST /api/bc-002/costs/risk-mitigation` - 対応コスト記録

#### 提供API（他BCから利用）
- **BC-001 L3-001, L3-002**: プロジェクトリスクレベルの参照

### データ整合性要件

#### トランザクション境界
- **リスク識別**: リスク登録 + 評価依頼 + プロジェクトオーナー通知（BC-007）
- **リスク発現**: リスクステータス更新 + イシュー作成 + 緊急通知（BC-007） + 教訓登録（BC-006）
- **整合性レベル**: 結果整合性（イベント駆動、Saga Pattern）

#### データ制約
- リスクスコア = 影響度（1-3）× 発生確率（1-3）
- 重大リスク（スコア9）は必ず対応策を持つ
- リスク発現時は必ずIssueエンティティを作成

### セキュリティ要件

#### 認証・認可
- **認証**: JWT Bearer Token（BC-003発行）
- **必要権限**:
  - リスク識別: `risk:create` + プロジェクトメンバー権限
  - リスク評価: `risk:assess` + プロジェクトオーナーまたはリスク管理者
  - 対応計画: `risk:mitigate` + プロジェクトオーナー
  - リスク解決: `risk:resolve` + プロジェクトオーナー

#### データ保護
- **機密度**: リスク情報はConfidential（プロジェクトメンバーのみ）
- **重大リスク**: アクセスログ強化（全アクセスを監査ログに記録）
- **エスカレーション**: 経営層への通知はセキュア通信（暗号化）

### スケーラビリティ制約

#### 最大同時処理
- **リスク評価**: 同時50評価/秒
- **リスクアラート**: 1プロジェクトあたり最大100通知/イベント
- **対応策登録**: 同時30登録/秒

#### データ量上限
- **リスク履歴**: プロジェクト完了後3年間保持
- **イシュー履歴**: 全履歴無期限保持（重大インシデント記録）
- **対応策**: 1リスクあたり最大10対応策

---

## 🔗 BC設計との統合

### 使用ドメインオブジェクト

#### Aggregates
- **Risk Aggregate** ([../../domain/README.md#risk-aggregate](../../domain/README.md#risk-aggregate))
  - Risk（集約ルート）: リスクライフサイクル管理
  - RiskMitigation: リスク対応策
  - Issue: リスクが発現した課題
  - RiskAssessment: リスク評価履歴

#### Value Objects
- **RiskLevel**: リスクレベル（low, medium, high, critical）
- **Impact**: 影響度（high=3, medium=2, low=1）
- **Probability**: 発生確率（high=3, medium=2, low=1）
- **RiskScore**: リスクスコア（1-9）
- **IssueStatus**: イシュー状態（open, in_progress, resolved, closed）
- **QualityThreshold**: 品質閾値（品質リスク管理用）

#### Domain Events
- **RiskIdentified**: リスク識別イベント → BC-007プロジェクトオーナー通知
- **RiskAssessed**: リスク評価完了イベント
- **CriticalRiskDetected**: 重大リスク検出イベント → BC-007緊急通知・エスカレーション
- **RiskMitigationPlanned**: リスク対応策計画イベント
- **RiskMaterialized**: リスク発現イベント → BC-007緊急対応通知, BC-006教訓記録
- **RiskResolved**: リスク解決イベント

### 呼び出すAPI例

#### リスク識別
```http
POST /api/v1/bc-001/risks
Content-Type: application/json
Authorization: Bearer {token}

{
  "projectId": "project-uuid",
  "riskName": "主要開発メンバーの離脱リスク",
  "description": "プロジェクト途中での主要メンバー離脱の可能性",
  "category": "resource",
  "identifiedBy": "user-uuid-pm",
  "identifiedDate": "2025-11-10",
  "initialImpact": "high",
  "initialProbability": "medium"
}
```

#### リスク評価
```http
PUT /api/v1/bc-001/risks/{riskId}/assess
Content-Type: application/json

{
  "impact": "high",
  "impactScore": 3,
  "impactJustification": "スケジュール遅延2週間、品質低下の可能性",
  "probability": "medium",
  "probabilityScore": 2,
  "probabilityJustification": "現在のプロジェクト負荷と市場動向から判断",
  "riskScore": 6,
  "assessedBy": "user-uuid-pm",
  "assessmentDate": "2025-11-11"
}
```

#### リスク対応計画
```http
POST /api/v1/bc-001/risks/{riskId}/response
Content-Type: application/json

{
  "strategy": "mitigate",
  "mitigationActions": [
    {
      "action": "ナレッジ共有セッション実施",
      "assigneeId": "user-uuid-lead",
      "deadline": "2025-11-20",
      "cost": 50000
    },
    {
      "action": "クロストレーニング実施",
      "assigneeId": "user-uuid-lead",
      "deadline": "2025-11-30",
      "cost": 100000
    }
  ],
  "contingencyPlan": "外部コンサルタント確保（予算500万円）",
  "monitoringFrequency": "weekly"
}
```

#### リスク監視
```http
PUT /api/v1/bc-001/risks/{riskId}/monitor
Content-Type: application/json

{
  "monitoringDate": "2025-11-15",
  "currentStatus": "in_mitigation",
  "mitigationProgress": 40,
  "impactChange": "none",
  "probabilityChange": "decreased",
  "updatedProbability": "low",
  "notes": "ナレッジ共有セッション完了。確率低減を確認。",
  "nextReviewDate": "2025-11-22"
}
```

#### BC連携: 重大リスクアラート（BC-007）
```http
POST /api/v1/bc-007/alerts
Content-Type: application/json

{
  "type": "critical_risk_detected",
  "severity": "critical",
  "recipientIds": ["project-owner-uuid", "sponsor-uuid"],
  "escalationLevel": "executive",
  "content": {
    "riskId": "risk-uuid",
    "riskName": "主要開発メンバーの離脱リスク",
    "riskScore": 9,
    "impact": "high",
    "probability": "high",
    "projectName": "新製品開発",
    "requiredAction": "immediate_mitigation_plan"
  },
  "notifyChannels": ["email", "sms", "dashboard"]
}
```

#### BC連携: 教訓登録（BC-006）
```http
POST /api/v1/bc-006/lessons-learned
Content-Type: application/json

{
  "projectId": "project-uuid",
  "category": "risk-management",
  "title": "主要メンバー離脱リスクへの対応",
  "situation": "プロジェクト中期にリスクが発現",
  "action": "クロストレーニングとナレッジ共有により影響最小化",
  "result": "スケジュール遅延を1週間に抑制",
  "lesson": "早期のクロストレーニング実施が重要",
  "applicability": "all-projects",
  "relatedRiskId": "risk-uuid"
}
```

### データアクセスパターン

#### 読み取り
- **risks テーブル**:
  - インデックス: `idx_risks_project_id`（プロジェクト配下リスク）
  - インデックス: `idx_risks_score_desc`（リスクスコア降順）
  - インデックス: `idx_risks_status`（アクティブリスクフィルタ）
- **マテリアライズドビュー**: `mv_project_risk_summary`
  ```sql
  SELECT project_id,
         COUNT(*) FILTER (WHERE risk_score = 9) AS critical_risks,
         COUNT(*) FILTER (WHERE risk_score >= 6) AS high_risks,
         AVG(risk_score) AS avg_risk_score,
         MAX(risk_score) AS max_risk_score
  FROM risks
  WHERE status IN ('identified', 'assessed', 'in_mitigation')
  GROUP BY project_id
  ```
- **issues テーブル**:
  - インデックス: `idx_issues_project_severity`（プロジェクト別重要度）
  - インデックス: `idx_issues_risk_id`（リスク発現イシュー検索）

#### 書き込み
- **リスク識別トランザクション**:
  ```sql
  BEGIN;
  INSERT INTO risks (project_id, risk_name, description, impact, probability, risk_score, status)
  VALUES (?, ?, ?, ?, ?, ?, 'identified');
  INSERT INTO risk_assessments (risk_id, assessed_by, impact, probability, risk_score)
  VALUES (?, ?, ?, ?, ?);
  -- イベント発行: RiskIdentified
  COMMIT;
  ```
- **リスク発現トランザクション**:
  ```sql
  BEGIN;
  UPDATE risks SET status = 'materialized', materialized_at = NOW() WHERE id = ?;
  INSERT INTO issues (risk_id, project_id, issue_name, severity, status, created_at)
  VALUES (?, ?, ?, 'high', 'open', NOW());
  -- イベント発行: RiskMaterialized
  COMMIT;
  ```

#### キャッシュアクセス
- **プロジェクトリスクレベル**:
  ```
  Key: `project:risk:level:{projectId}`
  Value: { level: 'high', criticalRisks: 2, highRisks: 5, avgScore: 6.5 }
  TTL: 600秒
  Invalidation: リスク評価・解決時
  ```
- **重大リスクリスト**:
  ```
  Key: `risks:critical`
  Value: JSON（リスクID配列、全プロジェクト横断）
  TTL: 300秒
  Invalidation: 重大リスク検出・解決時
  ```

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
