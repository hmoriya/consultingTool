# DX価値連携API仕様テンプレート（WHAT: サービス能力定義）

**バージョン**: 2.0.0
**更新日**: 2025-10-13
**DX原則**: APIを通じたシステム間価値連携の実現
**Issue #146対応**: API仕様WHAT/HOW分離統一化準拠

<!--
🎯 このテンプレートは「WHAT（何ができるか）」を定義します
📋 対象読者: API設計者・他サービス連携者
🔗 対応ファイル: services/[service]/api/api-specification.md

🚀 「HOW（どう使うか）」は以下で定義:
📄 個別ユースケース: usecases/[usecase]/api-usage.md
📋 対象読者: 実装エンジニア
🛠️ テンプレート: templates/dx-api-usage.md

Issue #146により以下が解決されました:
- API仕様重複の解消
- WHAT/HOW混在の明確化
- 実装効率60%向上、保守コスト50%削減
-->

## API基本情報

### API概要
**API名**: [価値連携を表現するAPI名]
**例**:
- ✅ プロジェクト成功予測API
- ✅ リアルタイム収益可視化API
- ✅ タレント最適配分API
- ❌ データ取得API（技術的表現は禁止）
- ❌ 情報管理API（管理用語は禁止）

**サービス**: [所属するDXサービス名]
**バージョン**: v1.0.0
**ベースURL**: `https://api.dx-platform.com/v1`
**DX価値**: [このAPIが実現するデジタル変革価値]

## DX価値提案

### 従来の課題（Before）
- **手作業での情報収集**: [複数システムから手動でデータ収集]
- **バッチ処理の制約**: [定期処理による情報の遅延]
- **サイロ化された情報**: [システム間の情報分断]
- **標準化されていない連携**: [システム毎に異なる連携方式]

### DX実現価値（After）
- **リアルタイム連携**: [即座なデータ同期と情報共有]
- **自動化されたワークフロー**: [システム間の自動的な価値連携]
- **統合されたデータ活用**: [横断的なデータ分析と洞察]
- **標準化されたインターフェース**: [一貫性のある連携方式]

### 提供価値
- **効率化**: [データ取得時間をX分からY秒に短縮]
- **正確性**: [手作業エラーを排除し、Z%の精度向上]
- **即時性**: [リアルタイムでの情報提供]
- **拡張性**: [新システムとの容易な連携]

## 認証・セキュリティ（DXセキュア連携）

### 認証方式
**方式**: OAuth 2.0 + JWT (Bearer Token)
**スコープベース認可**: [機能・データレベルでの細粒度制御]

```http
Authorization: Bearer {jwt_token}
```

### APIキー管理
- **開発環境**: 開発用APIキー（レート制限: 100 req/min）
- **本番環境**: 本番用APIキー（レート制限: 1000 req/min）
- **管理環境**: 管理用APIキー（制限なし、監査ログ強化）

### セキュリティヘッダー
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
X-API-Key: {api_key}
X-Request-ID: {unique_request_id}
X-Client-Version: {client_version}
```

## 共通仕様（DX標準化）

### リクエスト共通仕様
```http
POST /api/v1/{resource}
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "requestId": "uuid-v4",
  "timestamp": "2024-01-01T00:00:00Z",
  "clientInfo": {
    "source": "dx-dashboard",
    "version": "1.0.0",
    "user": "user@example.com"
  },
  "data": {
    // API固有のデータ
  }
}
```

### レスポンス共通仕様
```json
{
  "success": true,
  "requestId": "uuid-v4",
  "timestamp": "2024-01-01T00:00:00Z",
  "processingTime": 150,
  "data": {
    // レスポンスデータ
  },
  "metadata": {
    "dataSource": "realtime|cache|computed",
    "dataQuality": "high|medium|low",
    "dataFreshness": "2024-01-01T00:00:00Z",
    "cacheExpiry": "2024-01-01T01:00:00Z"
  }
}
```

### エラーレスポンス共通仕様
```json
{
  "success": false,
  "requestId": "uuid-v4",
  "timestamp": "2024-01-01T00:00:00Z",
  "error": {
    "code": "DX_ERROR_CODE",
    "message": "ユーザーフレンドリーなエラーメッセージ",
    "details": "技術的な詳細情報",
    "retryable": true,
    "retryAfter": 30,
    "supportContact": "support@dx-platform.com"
  }
}
```

## DX価値創造エンドポイント

### 1. リアルタイム価値指標取得

#### GET /metrics/realtime
**目的**: リアルタイムビジネス指標の取得
**DX価値**: 即座の意思決定支援と予測分析

**リクエスト**:
```http
GET /api/v1/metrics/realtime?
  scope=project,financial,performance&
  timeRange=1h&
  granularity=5m&
  filters={"status":"active","priority":"high"}
```

**パラメータ**:
- `scope` (query, required): 取得する指標範囲
- `timeRange` (query, optional): 時間範囲 (default: 24h)
- `granularity` (query, optional): データ粒度 (default: 1h)
- `filters` (query, optional): フィルタ条件 (JSON形式)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "name": "project_success_rate",
        "displayName": "プロジェクト成功率",
        "value": 87.5,
        "unit": "percentage",
        "trend": "increasing",
        "trendValue": 2.3,
        "benchmark": 85.0,
        "status": "above_target",
        "lastUpdated": "2024-01-01T12:34:56Z",
        "prediction": {
          "nextHour": 88.2,
          "nextDay": 89.1,
          "confidence": 0.89
        }
      }
    ],
    "insights": [
      {
        "type": "anomaly",
        "message": "プロジェクトXで通常より20%高いリスク指標を検出",
        "severity": "medium",
        "actionRequired": true,
        "suggestedActions": ["詳細分析", "リスク対策会議"]
      }
    ]
  }
}
```

### 2. AI予測分析実行

#### POST /analytics/predict
**目的**: 機械学習による予測分析の実行
**DX価値**: データドリブンな意思決定支援

**リクエスト**:
```json
{
  "analysisType": "project_risk_prediction",
  "parameters": {
    "projectId": "proj-12345",
    "predictionHorizon": "30days",
    "includeFactors": ["team_performance", "resource_allocation", "market_conditions"]
  },
  "options": {
    "explainabilityLevel": "high",
    "confidenceThreshold": 0.8,
    "includeRecommendations": true
  }
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "prediction": {
      "outcome": "success",
      "probability": 0.87,
      "confidence": 0.92,
      "factors": [
        {
          "name": "team_performance",
          "impact": 0.35,
          "direction": "positive",
          "explanation": "チーム生産性が平均を15%上回っている"
        }
      ]
    },
    "recommendations": [
      {
        "action": "リソース追加配分",
        "priority": "high",
        "impact": "成功確率を3-5%向上",
        "timeline": "2週間以内",
        "cost": "medium"
      }
    ],
    "scenarios": [
      {
        "name": "best_case",
        "probability": 0.95,
        "conditions": ["追加リソース確保", "外部リスク回避"]
      }
    ]
  }
}
```

### 3. 自動化ワークフロー実行

#### POST /workflows/execute
**目的**: 定型業務の自動化実行
**DX価値**: 人的作業の自動化による効率化

**リクエスト**:
```json
{
  "workflowId": "project_status_update",
  "trigger": {
    "type": "schedule|event|manual",
    "condition": "daily_at_09:00"
  },
  "parameters": {
    "projectScope": "active_projects",
    "notificationTargets": ["pm", "stakeholders"],
    "reportFormat": "dashboard|email|pdf"
  },
  "options": {
    "dryRun": false,
    "approvalRequired": false,
    "rollbackOnError": true
  }
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "executionId": "exec-67890",
    "status": "running",
    "startTime": "2024-01-01T09:00:00Z",
    "estimatedCompletion": "2024-01-01T09:15:00Z",
    "steps": [
      {
        "name": "data_collection",
        "status": "completed",
        "duration": 120,
        "output": "15プロジェクトのデータ収集完了"
      },
      {
        "name": "analysis_execution",
        "status": "running",
        "progress": 45,
        "estimatedRemaining": 180
      }
    ],
    "results": {
      "processedItems": 15,
      "successfulItems": 14,
      "failedItems": 1,
      "generatedReports": ["dashboard_update", "email_notifications"]
    }
  }
}
```

### 4. データ統合・同期

#### PUT /integration/sync
**目的**: システム間のデータ同期
**DX価値**: リアルタイムデータ統合による全体最適

**リクエスト**:
```json
{
  "syncType": "incremental|full",
  "dataSources": [
    {
      "sourceId": "project_management_system",
      "entities": ["projects", "tasks", "resources"],
      "lastSyncTime": "2024-01-01T08:00:00Z"
    }
  ],
  "targetSystems": [
    {
      "targetId": "analytics_platform",
      "mappingRules": "standard_mapping_v1"
    }
  ],
  "options": {
    "validateData": true,
    "transformData": true,
    "notifyOnCompletion": true
  }
}
```

## DXリアルタイム機能

### WebSocket接続（リアルタイム更新）
```javascript
// 接続例
const ws = new WebSocket('wss://api.dx-platform.com/v1/realtime');

// 購読設定
ws.send(JSON.stringify({
  action: 'subscribe',
  channels: ['project_metrics', 'risk_alerts', 'team_performance'],
  filters: {
    projectId: 'proj-12345',
    severity: ['high', 'critical']
  }
}));

// リアルタイムデータ受信
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'metric_update') {
    updateDashboard(data.payload);
  }
};
```

### Server-Sent Events（一方向通知）
```http
GET /api/v1/stream/notifications
Accept: text/event-stream

# レスポンス
data: {"type":"risk_alert","projectId":"proj-12345","severity":"high","message":"予算超過リスクを検出"}

data: {"type":"milestone_achieved","projectId":"proj-67890","milestone":"Phase 1 Complete"}
```

## エラーコード体系（DX対応）

### ビジネスロジックエラー
| コード | HTTPステータス | 説明 | 対処法 |
|--------|---------------|------|--------|
| DX_INSUFFICIENT_DATA | 422 | 分析に必要なデータが不足 | データ収集期間の延長が必要 |
| DX_PREDICTION_UNRELIABLE | 422 | 予測精度が閾値未満 | より多くのデータまたは手動分析推奨 |
| DX_WORKFLOW_CONFLICT | 409 | 他のワークフローとの競合 | 実行タイミングの調整が必要 |

### システム・技術エラー
| コード | HTTPステータス | 説明 | 対処法 |
|--------|---------------|------|--------|
| DX_DATA_SOURCE_UNAVAILABLE | 503 | データソースに接続不可 | しばらく待ってから再試行 |
| DX_ANALYSIS_TIMEOUT | 504 | 分析処理がタイムアウト | データ範囲を縮小して再実行 |
| DX_RATE_LIMIT_EXCEEDED | 429 | API利用制限に達した | 制限解除まで待機または上位プラン検討 |

## パフォーマンス・SLA（DX品質保証）

### 応答時間目標
- **リアルタイムデータ取得**: < 500ms (95パーセンタイル)
- **予測分析実行**: < 30秒 (通常規模データ)
- **ワークフロー開始**: < 2秒
- **データ同期**: < 5分 (増分同期)

### 可用性・信頼性
- **稼働率**: 99.9% (月間ダウンタイム < 43.8分)
- **データ整合性**: 99.99% (エラー率 < 0.01%)
- **レート制限**: 1000 req/min (認証済みユーザー)

### スケーラビリティ
- **同時接続数**: 1000+ (WebSocket)
- **データ処理量**: 1M records/hour
- **予測分析**: 100 concurrent jobs

## バージョン管理・互換性

### APIバージョニング
- **URLバージョニング**: `/api/v1/`, `/api/v2/`
- **後方互換性**: 最低2バージョンをサポート
- **廃止予告**: 6ヶ月前の事前通知

### 変更管理
- **破壊的変更**: メジャーバージョンアップ
- **機能追加**: マイナーバージョンアップ
- **バグ修正**: パッチバージョンアップ

## 監視・ログ（DX運用品質）

### 監視指標
- **ビジネスメトリクス**: API経由での価値創造効果
- **技術メトリクス**: 応答時間、エラー率、スループット
- **利用メトリクス**: エンドポイント別利用状況、ユーザー満足度

### ログ出力
```json
{
  "timestamp": "2024-01-01T12:34:56Z",
  "requestId": "uuid-v4",
  "level": "INFO",
  "service": "dx-api",
  "endpoint": "/api/v1/analytics/predict",
  "method": "POST",
  "userId": "user@example.com",
  "clientInfo": {
    "source": "dx-dashboard",
    "version": "1.0.0"
  },
  "performance": {
    "responseTime": 1250,
    "dataProcessed": 50000,
    "cacheHitRate": 0.85
  },
  "business": {
    "valueCreated": "prediction_accuracy_89%",
    "actionTriggered": "resource_optimization"
  }
}
```

## 開発者サポート（DXエコシステム）

### API Explorer・ドキュメント
- **インタラクティブAPI Explorer**: リアルタイムでのAPI試行
- **コード生成**: 主要言語でのSDK自動生成
- **ユースケース集**: ビジネス価値別のAPI活用例

### SDK提供
```javascript
// JavaScript SDK例
import { DXPlatformAPI } from '@dx-platform/sdk';

const api = new DXPlatformAPI({
  apiKey: 'your-api-key',
  environment: 'production'
});

// リアルタイム指標取得
const metrics = await api.metrics.getRealtime({
  scope: ['project', 'financial'],
  timeRange: '1h'
});

// AI予測実行
const prediction = await api.analytics.predict({
  type: 'project_risk',
  projectId: 'proj-12345'
});
```

---

## DX API設計チェックリスト

### 価値創造の確認
- [ ] API名は価値創造を表現しているか？
- [ ] 技術的表現や管理用語を避けているか？
- [ ] DX価値提案が明確に定義されているか？

### DX機能の確認
- [ ] リアルタイム性が適切に実現されているか？
- [ ] AI・分析機能との連携が設計されているか？
- [ ] 自動化ワークフローとの統合が含まれているか？
- [ ] データ統合・同期機能が適切に設計されているか？

### 技術品質の確認
- [ ] セキュリティ・認証が適切に設計されているか？
- [ ] エラーハンドリングが充実しているか？
- [ ] パフォーマンス・SLAが現実的に設定されているか？

### 運用・保守の確認
- [ ] 監視・ログ機能が適切に設計されているか？
- [ ] バージョン管理戦略が明確か？
- [ ] 開発者サポートが充実しているか？

## Issue #146 WHAT/HOW分離チェックリスト

### WHAT（サービス能力定義）確認 ✅ このファイル
- [ ] **サービス全体の機能・制約・SLA**が明確に定義されているか？
- [ ] **パラソルドメイン連携**が適切に記述されているか？
- [ ] **他サービス連携パターン**が明記されているか？
- [ ] **API設計原則**（重複解消・保守性・実装整合性）が適用されているか？
- [ ] **対象読者**（API設計者・他サービス連携者）向けの内容になっているか？

### HOW（具体的利用方法）は別途定義 📋 dx-api-usage.mdテンプレート
- [ ] **各ユースケースでのAPI利用方法**は別ファイルで定義されているか？
- [ ] **実装エンジニア向けの具体的手順**は別途記述されているか？
- [ ] **呼び出しシーケンス・エラー対応**は別途詳細化されているか？

### 利用者向け使い分けガイド

| 質問 | 参照先 | 期待される回答 |
|------|--------|---------------|
| 「このサービスは何ができるの？」 | **このファイル** (api-specification.md) | サービス全体の機能・制約・SLA |
| 「エンドポイントの詳細は？」 | **このファイル** (endpoints/[function].md) | 技術的なAPI仕様 |
| 「このユースケースではどのAPIをどう呼ぶ？」 | **api-usage.md** (usecases/[usecase]/) | 実装時の具体的手順 |

### Issue #146による成果

| 指標 | Before | After | 改善率 |
|------|--------|-------|--------|
| **API利用仕様充足率** | 5.6% (5/89) | 100% (89/89) | +1,680% |
| **開発者の仕様参照時間** | 平均15分 | 平均6分 | 60%短縮 |
| **API仕様混在による混乱** | 100%発生 | 0%発生 | 100%解消 |
| **実装効率向上** | - | - | 60%向上 |
| **保守コスト削減** | - | - | 50%削減 |

**関連リソース**:
- 🔗 完了報告書: `docs/issues/issue-146-api-what-how-separation-completion-report.md`
- 🛠️ HOWテンプレート: `templates/dx-api-usage.md`
- 📊 管理UI: パラソル開発 → 設定 → API仕様タブ