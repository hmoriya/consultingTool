# KPI・財務分析機能ドキュメント

## 概要

KPI・財務分析機能は、コンサルティングファームの経営状況を可視化し、データドリブンな意思決定を支援するための機能です。プロジェクト収益性、リソース効率性、顧客満足度など、多角的な観点から組織のパフォーマンスを分析します。

## 主な機能

### 1. KPI管理

#### 主要KPIカテゴリ
- **財務KPI** - 売上高、利益率、キャッシュフロー
- **プロジェクトKPI** - 完了率、納期遵守率、品質スコア
- **リソースKPI** - 稼働率、生産性、スキル活用度
- **顧客KPI** - 満足度、リピート率、NPS
- **成長KPI** - 新規獲得、市場シェア、イノベーション指標

#### KPIダッシュボード
- リアルタイムデータ表示
- カスタマイズ可能なウィジェット
- ドリルダウン分析
- アラート・通知設定
- 目標vs実績の可視化

### 2. 財務分析

#### 収益分析
- プロジェクト別収益性
- クライアント別収益貢献
- サービスライン別分析
- 月次/四半期/年次推移
- 予算vs実績分析

#### コスト分析
- 直接費（人件費、外注費）
- 間接費（管理費、設備費）
- プロジェクト別原価
- リソース別コスト
- コスト削減機会の特定

#### 収益性分析
- 粗利率・営業利益率
- プロジェクト別ROI
- クライアント生涯価値（CLV）
- 損益分岐点分析
- What-ifシナリオ分析

### 3. 予測・計画

#### 売上予測
- パイプライン分析
- 成約確率予測
- 季節性分析
- トレンド予測
- シナリオプランニング

#### 予算管理
- 部門別予算配分
- 予算消化率モニタリング
- 予算超過アラート
- 予算再配分提案

## データ構造

### KPIDefinition テーブル
```typescript
interface KPIDefinition {
  id: string
  name: string
  category: 'financial' | 'project' | 'resource' | 'customer' | 'growth'
  description: string
  formula: string
  unit: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  target: number
  threshold: {
    critical: number
    warning: number
    good: number
    excellent: number
  }
  owner: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### KPIValue テーブル
```typescript
interface KPIValue {
  id: string
  kpiId: string
  periodStart: Date
  periodEnd: Date
  actualValue: number
  targetValue: number
  previousValue?: number
  variance: number
  variancePercentage: number
  status: 'critical' | 'warning' | 'on_track' | 'excellent'
  notes?: string
  calculatedAt: Date
}
```

### FinancialTransaction テーブル
```typescript
interface FinancialTransaction {
  id: string
  type: 'revenue' | 'cost' | 'investment'
  category: string
  subCategory?: string
  projectId?: string
  clientId?: string
  amount: number
  currency: string
  exchangeRate?: number
  date: Date
  description: string
  invoiceNumber?: string
  paymentStatus?: 'pending' | 'paid' | 'overdue'
  approvedBy?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}
```

## 画面構成

### 1. エグゼクティブダッシュボード

#### パス
`/dashboard/executive`

#### 主な要素
- KPIサマリーカード（主要6指標）
- 売上・利益推移グラフ
- プロジェクトポートフォリオ
- リソース稼働率ヒートマップ
- アラート・通知エリア

### 2. 財務分析画面

#### パス
`/analytics/financial`

#### 主な要素
- 期間選択フィルター
- 収益性マトリックス
- コスト構造円グラフ
- キャッシュフロー表
- 予実対比テーブル

### 3. KPI詳細画面

#### パス
`/analytics/kpi/:id`

#### 主な要素
- KPI推移グラフ
- 統計情報（平均、標準偏差等）
- 相関分析
- 要因分析
- アクションプラン

### 4. 予測分析画面

#### パス
`/analytics/forecast`

#### 主な要素
- 売上予測グラフ
- シナリオ選択
- 感度分析
- リスク要因
- 信頼区間表示

## 分析ロジック

### 収益性計算
```typescript
interface ProfitabilityMetrics {
  revenue: number
  directCost: number
  indirectCost: number
  grossProfit: number
  grossProfitMargin: number
  operatingProfit: number
  operatingProfitMargin: number
  netProfit: number
  netProfitMargin: number
}

function calculateProfitability(
  transactions: FinancialTransaction[]
): ProfitabilityMetrics {
  const revenue = transactions
    .filter(t => t.type === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const directCost = transactions
    .filter(t => t.type === 'cost' && t.category === 'direct')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const indirectCost = transactions
    .filter(t => t.type === 'cost' && t.category === 'indirect')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const grossProfit = revenue - directCost
  const operatingProfit = grossProfit - indirectCost
  
  return {
    revenue,
    directCost,
    indirectCost,
    grossProfit,
    grossProfitMargin: (grossProfit / revenue) * 100,
    operatingProfit,
    operatingProfitMargin: (operatingProfit / revenue) * 100,
    netProfit: operatingProfit, // 簡略化
    netProfitMargin: (operatingProfit / revenue) * 100
  }
}
```

### トレンド予測
```typescript
function forecastRevenue(
  historicalData: { date: Date, revenue: number }[],
  periods: number
): { date: Date, forecast: number, confidence: [number, number] }[] {
  // 線形回帰による予測
  const regression = linearRegression(historicalData)
  const seasonality = detectSeasonality(historicalData)
  
  const forecasts = []
  for (let i = 1; i <= periods; i++) {
    const trend = regression.slope * i + regression.intercept
    const seasonal = seasonality[i % seasonality.length]
    const forecast = trend * seasonal
    
    // 信頼区間の計算
    const confidence = [
      forecast * 0.9,  // 下限
      forecast * 1.1   // 上限
    ]
    
    forecasts.push({
      date: addMonths(new Date(), i),
      forecast,
      confidence
    })
  }
  
  return forecasts
}
```

## API エンドポイント

### KPI関連
- `GET /api/kpi/definitions` - KPI定義一覧
- `GET /api/kpi/values` - KPI値取得
- `POST /api/kpi/calculate` - KPI計算実行
- `GET /api/kpi/dashboard` - ダッシュボードデータ
- `PUT /api/kpi/targets` - 目標値更新

### 財務分析
- `GET /api/financial/summary` - 財務サマリー
- `GET /api/financial/transactions` - 取引データ
- `GET /api/financial/profitability` - 収益性分析
- `GET /api/financial/cashflow` - キャッシュフロー
- `POST /api/financial/forecast` - 予測分析

### レポート
- `GET /api/reports/executive` - 経営レポート
- `GET /api/reports/financial` - 財務レポート
- `GET /api/reports/project/:id` - プロジェクト収支
- `POST /api/reports/export` - レポートエクスポート

## 自動化・アラート

### 自動計算
- 日次KPI計算（深夜2時）
- 週次集計（月曜朝）
- 月次締め（月初）
- 四半期レポート（四半期初）

### アラート条件
```typescript
interface AlertRule {
  kpiId: string
  condition: {
    type: 'threshold' | 'trend' | 'variance'
    operator: '<' | '>' | '=' | 'decreasing' | 'increasing'
    value: number
    periods?: number
  }
  severity: 'info' | 'warning' | 'critical'
  recipients: string[]
  channels: ('email' | 'slack' | 'inapp')[]
}
```

## 可視化

### グラフタイプ
- **時系列グラフ** - KPI推移、売上推移
- **積み上げグラフ** - コスト構造、収益構成
- **散布図** - 相関分析、ポートフォリオ
- **ヒートマップ** - 稼働率、収益性マトリックス
- **ウォーターフォール** - 差異分析、要因分析

### インタラクティブ機能
- ズーム・パン
- データポイント詳細表示
- 期間選択
- データフィルタリング
- エクスポート機能

## レポート生成

### 定期レポート
- 日次ダッシュボード
- 週次パフォーマンスレポート
- 月次経営レポート
- 四半期決算レポート
- 年次総括レポート

### カスタムレポート
- レポートテンプレート作成
- 動的データバインディング
- 多言語対応
- ブランディング対応
- 配信スケジュール設定

## ベストプラクティス

### KPI設定
- SMART原則の適用
- バランススコアカードの活用
- 先行指標と遅行指標のバランス
- 定期的な見直し

### データ品質
- データ入力ルールの徹底
- 自動検証ルール
- 異常値の検出と対処
- データガバナンス

### 分析活用
- 定期的なレビュー会議
- アクションプランの策定
- PDCAサイクルの実施
- ベンチマーク比較

## アクセス権限

### エグゼクティブ
- 全社KPI閲覧
- 財務データフルアクセス
- 予測シナリオ作成
- レポート承認

### 財務担当
- 財務データ入力・編集
- KPI計算実行
- レポート作成
- 予算管理

### PM
- プロジェクトKPI閲覧
- プロジェクト収支確認
- チームKPI管理

### 一般ユーザー
- 個人KPI閲覧
- チームKPI閲覧（制限付き）

## トラブルシューティング

### データ不整合
- 計算ロジック確認
- データソース確認
- タイムゾーン確認
- 為替レート更新

### パフォーマンス問題
- インデックス最適化
- 集計テーブル活用
- キャッシュ設定
- クエリ最適化

## 今後の拡張予定

### 短期
- AI予測モデル導入
- リアルタイムダッシュボード
- モバイル対応強化
- 外部データ連携

### 中期
- 予測精度向上（機械学習）
- 自然言語での分析
- 競合ベンチマーク
- 自動インサイト生成

### 長期
- 完全自動化された経営分析
- プレスクリプティブ分析
- 量子コンピューティング活用
- ブロックチェーン監査証跡