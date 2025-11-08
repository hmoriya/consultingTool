import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedTrackRevenue(service: unknown, capability: unknown) {
  console.log('    Creating business operation: 収益を正確に追跡する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'TrackRevenue',
      displayName: '収益を正確に追跡する',
      design: `# ビジネスオペレーション: 収益を正確に追跡する [TrackRevenue] [TRACK_REVENUE]

## オペレーション概要

### 目的
プロジェクト単位の収益を契約から請求・入金まで正確に追跡し、リアルタイムで収益性を可視化することで、経営判断の精度を向上させ、キャッシュフローを最適化する

### ビジネス価値
- **財務精度向上**: 収益認識精度99.9%、請求漏れゼロ化、入金遅延50%削減
- **経営判断迅速化**: リアルタイム収益把握により意思決定速度3倍向上
- **キャッシュフロー改善**: 売上債権回転日数20%短縮、資金繰り予測精度90%以上

### 実行頻度
- **頻度**: 日次（売上計上）、月次（請求処理）、随時（入金確認）
- **トリガー**: 契約締結、マイルストーン達成、請求タイミング、入金通知
- **所要時間**: 日次処理30分、月次請求2-3時間、入金処理15分

## ロールと責任

### 関与者
- 財務アナリスト [FinancialAnalyst] [FINANCIAL_ANALYST]
  - 責任: 収益計上、請求管理、入金確認、レポート作成
  - 権限: 財務データ入力、請求書発行、収益分析

- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: 進捗報告、請求承認、収益予測提供
  - 権限: プロジェクト収益確認、請求依頼

- 財務マネージャー [FinanceManager] [FINANCE_MANAGER]
  - 責任: 収益認識方針決定、承認、監査対応
  - 権限: 方針策定、最終承認、修正指示

- 経理担当者 [Accountant] [ACCOUNTANT]
  - 責任: 会計処理、税務処理、監査資料準備
  - 権限: 仕訳入力、財務諸表作成

### RACI マトリクス
| ステップ | 財務アナリスト | PM | 財務マネージャー | 経理 |
|---------|--------------|-----|----------------|------|
| 契約登録 | R | I | A | I |
| 収益計上 | R | C | A | I |
| 請求処理 | R | C | A | I |
| 入金確認 | R | I | I | C |
| 収益分析 | R | C | A | I |
| レポート作成 | R | I | A | C |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始:契約締結/収益発生]
  ↓
[ステップ1:契約情報登録]
  ↓
[ステップ2:収益認識計画策定]
  ↓
[ステップ3:収益計上処理]
  ↓
[ステップ4:請求書作成・発行]
  ↓
[ステップ5:入金確認・消込]
  ↓
[判断:差異あり？]
  ├─ Yes → [差異分析・対応]
  └─ No  → [ステップ6:収益レポート作成]
  ↓
[ステップ7:経営報告・分析]
  ↓
[終了:収益追跡完了]
\`\`\`

### 各ステップの詳細

#### ステップ1: 契約情報登録 [RegisterContract] [REGISTER_CONTRACT]
- **目的**: 収益管理の基礎となる契約情報を正確に記録
- **入力**: 契約書、価格表、支払条件
- **活動**:
  1. 契約基本情報の入力（顧客、金額、期間）
  2. 収益認識方法の選択（一括/分割/進行基準）
  3. 請求スケジュールの設定
  4. 税務情報の登録
  5. 承認ワークフローの設定
  6. 関連プロジェクトとの紐付け
- **出力**: 契約マスタ情報、請求計画
- **所要時間**: 30分-1時間

#### ステップ2: 収益認識計画策定 [PlanRevenueRecognition] [PLAN_REVENUE_RECOGNITION]
- **目的**: 会計基準に準拠した収益認識タイミングと金額を計画
- **入力**: 契約情報、会計方針、プロジェクト計画
- **活動**:
  1. 収益認識基準の確認（IFRS15/ASC606）
  2. 履行義務の識別
  3. 取引価格の配分
  4. 収益認識タイミングの決定
  5. 月次収益計画の作成
  6. 会計システムへの設定
- **出力**: 収益認識スケジュール、会計設定
- **所要時間**: 1-2時間

#### ステップ3: 収益計上処理 [RecognizeRevenue] [RECOGNIZE_REVENUE]
- **目的**: 計画に基づき適切なタイミングで収益を計上
- **入力**: 収益認識計画、プロジェクト進捗、成果物納品情報
- **活動**:
  1. 収益計上条件の確認
  2. 進捗度・完成度の評価
  3. 計上金額の算出
  4. 仕訳データの作成
  5. 承認取得
  6. 会計システムへの計上
- **出力**: 収益計上仕訳、計上明細
- **所要時間**: 日次30分

#### ステップ4: 請求書作成・発行 [CreateAndIssueInvoice] [CREATE_AND_ISSUE_INVOICE]
- **目的**: 契約条件に基づき正確な請求書を作成し顧客へ送付
- **入力**: 請求計画、実績データ、顧客情報
- **活動**:
  1. 請求対象の確定
  2. 請求金額の計算
  3. 請求書の作成
  4. 内容確認・承認取得
  5. 請求書の発行・送付
  6. 請求台帳への記録
- **出力**: 請求書、送付記録
- **所要時間**: 1件15-30分

#### ステップ5: 入金確認・消込 [ConfirmAndMatchPayment] [CONFIRM_AND_MATCH_PAYMENT]
- **目的**: 入金を確認し売掛金と正確に消込処理
- **入力**: 銀行入金データ、売掛金明細
- **活動**:
  1. 入金データの取得
  2. 請求書との照合
  3. 消込処理の実行
  4. 差額・遅延の識別
  5. 入金確認通知
  6. 売掛金残高更新
- **出力**: 消込結果、残高一覧
- **所要時間**: 15-30分

#### ステップ6: 収益レポート作成 [GenerateRevenueReport] [GENERATE_REVENUE_REPORT]
- **目的**: 経営層向けに収益状況を分析しレポート化
- **入力**: 収益データ、予算、前年実績
- **活動**:
  1. 収益実績の集計
  2. 予算対比分析
  3. 前年同期比較
  4. プロジェクト別収益性分析
  5. 将来予測の更新
  6. 経営指標の算出
- **出力**: 収益分析レポート、ダッシュボード
- **所要時間**: 2-3時間

#### ステップ7: 経営報告・分析 [ReportToManagement] [REPORT_TO_MANAGEMENT]
- **目的**: 収益情報を基に経営判断に必要な洞察を提供
- **入力**: 収益レポート、市場動向、戦略計画
- **活動**:
  1. 経営会議での報告
  2. 収益トレンド分析
  3. リスク・機会の特定
  4. 改善提案の作成
  5. アクションプランの策定
  6. フォローアップ設定
- **出力**: 経営報告資料、改善施策
- **所要時間**: 1-2時間

## 状態遷移

### 状態定義
- 契約済 [Contracted] [CONTRACTED]: 契約が締結され登録完了
- 計画中 [Planning] [PLANNING]: 収益認識計画を策定中
- 計上中 [Recognizing] [RECOGNIZING]: 収益を計上処理中
- 請求済 [Invoiced] [INVOICED]: 請求書を発行済
- 入金待ち [AwaitingPayment] [AWAITING_PAYMENT]: 入金を待機中
- 入金済 [Paid] [PAID]: 入金確認・消込完了
- 完了 [Completed] [COMPLETED]: 収益追跡プロセス完了

### 遷移条件
\`\`\`
契約済 --[計画開始]--> 計画中
計画中 --[計画承認]--> 計上中
計上中 --[請求タイミング]--> 請求済
請求済 --[請求書送付]--> 入金待ち
入金待ち --[入金確認]--> 入金済
入金済 --[レポート完了]--> 完了
入金待ち --[督促必要]--> 請求済（再送）
\`\`\`

## ビジネスルール

### 事前条件
1. 有効な契約が存在する
2. 収益認識方針が明確
3. 必要な承認権限を保有
4. 会計システムへのアクセス権

### 実行中の制約
1. 会計基準への準拠（IFRS/日本基準）
2. 内部統制要件の遵守
3. 税法上の要求事項対応
4. 監査証跡の保持
5. 職務分離原則の遵守

### 事後条件
1. 収益が正確に計上されている
2. 請求と入金が照合されている
3. 監査証跡が完備している
4. レポートが作成されている
5. 売掛金残高が正確

## パラソルドメインモデル

### エンティティ定義
- 収益契約 [RevenueContract] [REVENUE_CONTRACT]
  - 契約ID、顧客ID、契約金額、期間、収益認識方法、状態
- 収益計上 [RevenueRecognition] [REVENUE_RECOGNITION]
  - 計上ID、契約ID、計上日、金額、進捗度、承認状態
- 請求書 [Invoice] [INVOICE]
  - 請求書ID、契約ID、請求日、金額、支払期限、状態
- 入金記録 [PaymentRecord] [PAYMENT_RECORD]
  - 入金ID、請求書ID、入金日、金額、消込状態

### 値オブジェクト
- 収益認識方法 [RecognitionMethod] [RECOGNITION_METHOD]
  - 一括計上、分割計上、進行基準、完成基準
- 請求サイクル [BillingCycle] [BILLING_CYCLE]
  - 月次、四半期、マイルストーン、完了時

## KPI

1. **収益計上精度**: 計画対実績の乖離率
   - 目標値: ±5%以内
   - 測定方法: |実績-計画|/計画 × 100
   - 測定頻度: 月次

2. **請求処理時間**: 請求書作成から発行までの時間
   - 目標値: 2営業日以内
   - 測定方法: 発行日-作成開始日
   - 測定頻度: 月次

3. **売掛金回転日数**: 売上債権の回収速度
   - 目標値: 45日以内
   - 測定方法: 売掛金残高/(年間売上高/365)
   - 測定頻度: 月次

4. **入金予測精度**: キャッシュフロー予測の正確性
   - 目標値: 90%以上
   - 測定方法: 予測的中率
   - 測定頻度: 週次

5. **請求漏れ率**: 請求すべき案件の漏れ
   - 目標値: 0%
   - 測定方法: 請求漏れ件数/全請求対象 × 100
   - 測定頻度: 月次`,
      pattern: 'RevenueTracking',
      goal: 'プロジェクト収益を契約から入金まで正確に追跡し可視化する',
      roles: JSON.stringify([
        { name: 'FinancialAnalyst', displayName: '財務アナリスト', systemName: 'FINANCIAL_ANALYST' },
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'FinanceManager', displayName: '財務マネージャー', systemName: 'FINANCE_MANAGER' },
        { name: 'Accountant', displayName: '経理担当者', systemName: 'ACCOUNTANT' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'RegisterContract', displayName: '契約情報登録', systemName: 'REGISTER_CONTRACT' },
          { name: 'PlanRevenueRecognition', displayName: '収益認識計画策定', systemName: 'PLAN_REVENUE_RECOGNITION' },
          { name: 'RecognizeRevenue', displayName: '収益計上処理', systemName: 'RECOGNIZE_REVENUE' },
          { name: 'CreateAndIssueInvoice', displayName: '請求書作成・発行', systemName: 'CREATE_AND_ISSUE_INVOICE' },
          { name: 'ConfirmAndMatchPayment', displayName: '入金確認・消込', systemName: 'CONFIRM_AND_MATCH_PAYMENT' },
          { name: 'GenerateRevenueReport', displayName: '収益レポート作成', systemName: 'GENERATE_REVENUE_REPORT' },
          { name: 'ReportToManagement', displayName: '経営報告・分析', systemName: 'REPORT_TO_MANAGEMENT' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'Contracted', displayName: '契約済', systemName: 'CONTRACTED' },
        { name: 'Planning', displayName: '計画中', systemName: 'PLANNING' },
        { name: 'Recognizing', displayName: '計上中', systemName: 'RECOGNIZING' },
        { name: 'Invoiced', displayName: '請求済', systemName: 'INVOICED' },
        { name: 'AwaitingPayment', displayName: '入金待ち', systemName: 'AWAITING_PAYMENT' },
        { name: 'Paid', displayName: '入金済', systemName: 'PAID' },
        { name: 'Completed', displayName: '完了', systemName: 'COMPLETED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}