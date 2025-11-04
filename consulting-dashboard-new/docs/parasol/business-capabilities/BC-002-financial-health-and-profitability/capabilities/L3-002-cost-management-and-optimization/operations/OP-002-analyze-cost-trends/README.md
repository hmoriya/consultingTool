# OP-002: コストトレンドを分析する

**作成日**: 2025-10-31
**所属L3**: L3-002-cost-management-and-optimization: Cost Management And Optimization
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/analyze-cost-trends

---

## 📋 How: この操作の定義

### 操作の概要
過去のコストデータを分析し、コストトレンドや傾向を可視化する。コスト増加要因の特定や将来予測により、コスト最適化の意思決定を支援する。

### 実現する機能
- 時系列コスト分析とトレンド可視化
- カテゴリ別・プロジェクト別コスト比較
- コスト増加要因の特定
- コスト予測とシミュレーション

### 入力
- 過去のコストデータ
- 分析期間の指定
- 分析軸（カテゴリ、プロジェクト、部門）
- ベンチマークデータ

### 出力
- コストトレンドレポート
- カテゴリ別コスト分析
- コスト増加要因分析
- コスト予測レポート

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| analysisPeriod | OBJECT | Yes | - | 開始日 < 終了日 | 分析期間 |
| analysisPeriod.startDate | DATE | Yes | - | YYYY-MM-DD形式 | 分析開始日 |
| analysisPeriod.endDate | DATE | Yes | - | YYYY-MM-DD形式 | 分析終了日 |
| categories | ARRAY | No | ALL | PERSONNEL/EQUIPMENT/OUTSOURCING/OTHER | 分析対象カテゴリ |
| groupBy | ENUM | No | MONTH | DAY/WEEK/MONTH/QUARTER/YEAR | 集計粒度 |
| comparisonType | ENUM | No | PREVIOUS_PERIOD | PREVIOUS_PERIOD/PREVIOUS_YEAR/BUDGET | 比較基準 |
| projectIds | ARRAY | No | ALL | 有効なプロジェクトID配列 | 対象プロジェクト |
| includeProjection | BOOLEAN | No | false | - | 将来予測を含めるか |
| projectionMonths | INTEGER | Conditional | 3 | 1-12、includeProjection=true時有効 | 予測期間（月） |

### バリデーションルール
1. **期間妥当性**: startDate < endDate
2. **期間長**: 分析期間 ≤ 3年
3. **予測期間**: projectionMonths は 1-12 の範囲
4. **プロジェクト確認**: projectIds が有効なプロジェクト（BC-001）であること

## 📤 出力仕様

### 成功レスポンス
**HTTP 200 OK**
```json
{
  "analysisPeriod": {
    "startDate": "2024-01-01",
    "endDate": "2025-10-31"
  },
  "summary": {
    "totalCost": "50000000.00",
    "averageMonthlyCost": "2380952.38",
    "trendDirection": "INCREASING",
    "trendPercentage": 15.5,
    "currency": "JPY"
  },
  "categoryBreakdown": [
    {
      "category": "PERSONNEL",
      "totalCost": "30000000.00",
      "percentage": 60.0,
      "trend": "STABLE"
    }
  ],
  "timeSeriesData": [
    {
      "period": "2024-01",
      "totalCost": "2000000.00",
      "personnelCost": "1200000.00",
      "equipmentCost": "500000.00"
    }
  ],
  "comparison": {
    "previousPeriodCost": "43000000.00",
    "variance": "7000000.00",
    "variancePercentage": 16.3
  },
  "anomalies": [
    {
      "period": "2025-08",
      "category": "EQUIPMENT",
      "detectedCost": "5000000.00",
      "expectedCost": "800000.00",
      "deviation": 525.0
    }
  ],
  "projection": {
    "enabled": false
  },
  "generatedAt": "2025-11-04T10:00:00Z"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC002_L3002_OP002_001**: 分析期間不正（開始日 ≥ 終了日）
- **ERR_BC002_L3002_OP002_002**: 分析期間が3年を超過
- **ERR_BC002_L3002_OP002_003**: 予測期間が範囲外（1-12月）

#### HTTP 401 Unauthorized
- **ERR_BC002_L3002_OP002_401**: 認証トークン無効

#### HTTP 403 Forbidden
- **ERR_BC002_L3002_OP002_403**: コスト分析権限なし

#### HTTP 404 Not Found
- **ERR_BC002_L3002_OP002_404**: 指定プロジェクトが存在しない

#### HTTP 500 Internal Server Error
- **ERR_BC002_L3002_OP002_500**: システムエラー（集計計算エラー等）

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Cost Aggregate**: 参照 [../../../../domain/README.md](../../../../domain/README.md)
  - 集約ルート: Cost
  - ドメインサービス: CostAnalysisService
  - 値オブジェクト: CostTrend, TrendDirection

#### ドメインメソッド
```typescript
// コストトレンド分析
const costAnalysisService = new CostAnalysisService();
const trend = await costAnalysisService.analyzeTrends({
  period: new DateRange(startDate, endDate),
  categories,
  groupBy,
  comparisonType
});

// 異常値検出
const anomalies = trend.detectAnomalies({
  threshold: 2.0 // 標準偏差の2倍
});
```

### トランザクション境界
- **開始**: リクエスト受信時
- **コミット**: 分析結果生成完了時
- **ロールバック**: 計算エラー時（読み取り専用のため影響最小）

### 副作用
- **ドメインイベント発行**: `CostTrendAnomalyDetected` (異常値検出時)
- **BC間連携**:
  - BC-001: プロジェクト情報取得
  - BC-007: コスト異常アラート通知配信

### 実装手順
1. **期間検証**: startDate < endDate、期間 ≤ 3年確認
2. **データ収集**: 指定期間のコストデータ取得（Decimal.js使用）
3. **カテゴリ集計**: categories別にコスト集計
4. **時系列集計**: groupBy粒度で時系列データ生成
5. **トレンド計算**: 線形回帰で傾向分析
6. **異常値検出**: 標準偏差±2σを超える値を検出
7. **比較分析**: comparisonTypeに基づく比較計算
8. **予測生成**: includeProjection=true時、将来予測を算出
9. **レポート生成**: 分析結果をJSON形式で返却

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 | 対処方法 |
|--------|---------------|------|-------------|----------|
| ERR_BC002_L3002_OP002_001 | 400 | 分析期間不正 | No | 開始日 < 終了日に修正 |
| ERR_BC002_L3002_OP002_002 | 400 | 期間が長すぎる | No | 3年以内に短縮 |
| ERR_BC002_L3002_OP002_003 | 400 | 予測期間不正 | No | 1-12月の範囲で指定 |
| ERR_BC002_L3002_OP002_401 | 401 | 認証エラー | No | 再ログイン |
| ERR_BC002_L3002_OP002_403 | 403 | 権限不足 | No | コスト分析権限を申請 |
| ERR_BC002_L3002_OP002_404 | 404 | プロジェクト不存在 | No | 有効なプロジェクトIDを指定 |
| ERR_BC002_L3002_OP002_500 | 500 | システムエラー | Yes | 管理者に連絡 |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC002_L3002_OP002_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (1s, 2s, 4s)
- **タイムアウト**: 各リクエスト60秒（大量データ処理のため延長）

### ロールバック手順
- **読み取り専用操作**: ロールバック不要（データ変更なし）

### ログ記録要件
- **INFO**: コスト分析実行時（period, categories, groupBy）
- **WARN**: 異常値検出時（category, deviation, threshold）
- **ERROR**: エラー発生時（エラーコード、スタックトレース）
- **AUDIT**: 全コスト分析操作（誰が・いつ・何を分析したか）

### コスト分析特有の注意事項
- **パフォーマンス**: 大量データ処理のためキャッシュ活用推奨
- **Decimal.js必須**: 集計計算でJavaScript number型では精度不足
- **異常値検出**: 統計的手法（標準偏差）による自動検出
- **データ品質**: 欠損データは線形補間またはゼロ埋め

---

## 🔗 設計参照

### ドメインモデル
参照: [../../../../domain/README.md](../../../../domain/README.md)

この操作に関連するドメインエンティティ、値オブジェクト、集約の詳細定義は、上記ドメインモデルドキュメントを参照してください。

### API仕様
参照: [../../../../api/README.md](../../../../api/README.md)

この操作を実現するAPIエンドポイント、リクエスト/レスポンス形式、認証・認可要件は、上記API仕様ドキュメントを参照してください。

### データモデル
参照: [../../../../data/README.md](../../../../data/README.md)

この操作が扱うデータ構造、永続化要件、データ整合性制約は、上記データモデルドキュメントを参照してください。

---

## 🎬 UseCases: この操作を実装するユースケース

| UseCase | 説明 | Page | V2移行元 |
|---------|------|------|---------|
| (Phase 4で作成) | - | - | - |

詳細: [usecases/](usecases/)

> **注記**: ユースケースは Phase 4 の実装フェーズで、V2構造から段階的に移行・作成されます。
>
> **Phase 3 (現在)**: Operation構造とREADME作成
> **Phase 4 (次)**: UseCase定義とページ定義の移行
> **Phase 5**: API実装とテストコード

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: この操作はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/analyze-cost-trends/](../../../../../../../services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/analyze-cost-trends/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
