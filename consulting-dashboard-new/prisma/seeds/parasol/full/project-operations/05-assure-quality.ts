import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedAssureQuality(service: any, capability: any) {
  console.log('    Creating business operation: 品質を保証する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'AssureQuality',
      displayName: '品質を保証する',
      design: `# ビジネスオペレーション: 品質を保証する [AssureQuality] [ASSURE_QUALITY]

## オペレーション概要

### 目的
成果物がクライアントの期待と合意された品質基準を満たすことを体系的に確認し、高品質なデリバリーを通じてクライアントの信頼を獲得する

### ビジネス価値
- **品質向上**: 欠陥密度70%削減、初回品質合格率95%達成、手戻り工数50%削減
- **顧客満足度向上**: 品質起因のクレーム80%削減、顧客満足度スコア20%向上
- **コスト削減**: 品質不良による追加コストを60%削減、保守コスト40%低減

### 実行頻度
- **頻度**: フェーズゲート毎、成果物完成時、定期レビュー（週次/月次）
- **トリガー**: 成果物完成、マイルストーン到達、品質基準変更、インシデント発生
- **所要時間**: 内部レビュー（2-4時間）、顧客レビュー（4-8時間）

## ロールと責任

### 関与者
- 品質管理責任者 [QualityManager] [QUALITY_MANAGER]
  - 責任: 品質管理プロセス全体の統括、品質基準の設定、最終品質承認
  - 権限: 品質ゲート判定、リリース承認、プロセス改善指示

- レビュアー [Reviewer] [REVIEWER]
  - 責任: レビュー実施、欠陥検出、改善提案、レビュー記録作成
  - 権限: 品質判定、修正要求、ベストプラクティス推奨

- 成果物作成者 [Deliverable Owner] [DELIVERABLE_OWNER]
  - 責任: 品質基準準拠、自己レビュー実施、指摘事項対応
  - 権限: 修正方針決定、対応優先順位設定

- クライアント [Client] [CLIENT]
  - 責任: 品質基準承認、受入テスト実施、最終承認
  - 権限: 品質基準変更、成果物承認、追加要求

### RACI マトリクス
| ステップ | QM | レビュアー | 作成者 | クライアント |
|---------|----|-----------| ------|-------------|
| 基準設定 | R | C | C | A |
| 品質計画 | R | C | I | C |
| 内部レビュー | A | R | C | I |
| 欠陥修正 | I | C | R | I |
| 品質検証 | R | C | I | I |
| 顧客レビュー | C | C | R | A |
| 改善実施 | R | C | C | I |

## ビジネスプロセス

### プロセスフロー
\`\`\`
[開始：品質保証サイクル]
  ↓
[ステップ1：品質基準設定]
  ↓
[ステップ2：品質計画策定]
  ↓
[ステップ3：内部レビュー実施]
  ↓
[判断：品質基準達成？]
  ↓ No                      ↓ Yes
[ステップ4：欠陥修正]        [ステップ5へ]
  ↓ (ループバック)
[ステップ5：品質検証]
  ↓
[ステップ6：顧客レビュー]
  ↓
[判断：承認？]
  ↓ No              ↓ Yes
[ステップ4へ戻る]    [ステップ7：品質改善]
                    ↓
                 [終了：品質保証完了]
\`\`\`

### 各ステップの詳細

#### ステップ1: 品質基準設定 [SetQualityStandards] [SET_QUALITY_STANDARDS]
- **目的**: プロジェクト固有の品質基準と受入条件を明確化
- **入力**: 契約書、業界標準、組織品質方針、クライアント要求
- **活動**:
  1. 品質特性の定義（機能性、信頼性、使用性、効率性、保守性）
  2. 測定可能な品質指標の設定（欠陥密度、カバレッジ率等）
  3. 受入基準の具体化（定量的・定性的基準）
  4. 品質ゲート条件の設定
  5. レビュー観点とチェックリストの作成
  6. クライアントとの合意形成
- **出力**: 品質基準書、受入条件定義書、チェックリスト
- **所要時間**: 4-8時間

#### ステップ2: 品質計画策定 [DevelopQualityPlan] [DEVELOP_QUALITY_PLAN]
- **目的**: 品質を確保するための具体的な活動計画を立案
- **入力**: 品質基準書、プロジェクト計画、リソース情報
- **活動**:
  1. レビュー計画の策定（種類、時期、参加者）
  2. テスト戦略の定義（レベル、手法、環境）
  3. 品質保証活動のスケジューリング
  4. 必要なツールと環境の特定
  5. 品質メトリクスの収集方法定義
  6. エスカレーションパスの明確化
- **出力**: 品質保証計画書、レビュー計画、テスト計画
- **所要時間**: 1日

#### ステップ3: 内部レビュー実施 [ConductInternalReview] [CONDUCT_INTERNAL_REVIEW]
- **目的**: 成果物の品質を内部で徹底的に検証
- **入力**: 成果物、チェックリスト、レビュー基準
- **活動**:
  1. 自己レビューの実施（作成者による）
  2. ピアレビューの実施（同僚による相互確認）
  3. 専門家レビューの実施（SMEによる深掘り）
  4. 静的解析ツールの実行（該当する場合）
  5. レビュー結果の記録と分類
  6. 改善優先順位の決定
- **出力**: レビュー記録、欠陥一覧、改善提案
- **所要時間**: 2-4時間

#### ステップ4: 欠陥修正 [CorrectDefects] [CORRECT_DEFECTS]
- **目的**: 検出された欠陥を効率的に修正
- **入力**: 欠陥一覧、優先順位、修正基準
- **活動**:
  1. 欠陥の根本原因分析
  2. 修正方針の決定
  3. 影響範囲の特定
  4. 修正作業の実施
  5. 修正内容の文書化
  6. 回帰テストの準備
- **出力**: 修正済み成果物、修正記録、テストケース
- **所要時間**: 欠陥規模による（1時間-数日）

#### ステップ5: 品質検証 [VerifyQuality] [VERIFY_QUALITY]
- **目的**: 修正後の成果物が品質基準を満たすことを確認
- **入力**: 修正済み成果物、品質基準、検証基準
- **活動**:
  1. 修正確認テストの実施
  2. 回帰テストの実行
  3. 品質メトリクスの測定
  4. 基準達成度の評価
  5. トレーサビリティの確認
  6. 検証記録の作成
- **出力**: 検証報告書、品質メトリクス実績、合格判定
- **所要時間**: 2-3時間

#### ステップ6: 顧客レビュー [ConductClientReview] [CONDUCT_CLIENT_REVIEW]
- **目的**: クライアントによる成果物の確認と承認取得
- **入力**: 品質保証済み成果物、レビュー資料
- **活動**:
  1. レビュー資料の準備（デモ環境、説明資料）
  2. レビュー会議の実施
  3. 成果物のウォークスルー
  4. クライアントフィードバックの収集
  5. 質疑応答と clarification
  6. 承認または改善要求の記録
- **出力**: 顧客レビュー記録、承認書または改善要求
- **所要時間**: 4-8時間

#### ステップ7: 品質改善 [ImproveQuality] [IMPROVE_QUALITY]
- **目的**: 品質保証プロセスから得た知見を活用して継続的改善
- **入力**: 品質実績データ、レビュー記録、顧客フィードバック
- **活動**:
  1. 品質データの分析（傾向、パターン）
  2. プロセス改善機会の特定
  3. ベストプラクティスの抽出
  4. 教訓の文書化
  5. 改善施策の実施
  6. 標準・テンプレートの更新
- **出力**: 改善提案書、更新された標準、教訓記録
- **所要時間**: 2-4時間

## 状態遷移

### 状態定義
- 未開始 [NotStarted] [NOT_STARTED]: 品質保証活動開始前
- 基準設定中 [SettingStandards] [SETTING_STANDARDS]: 品質基準を定義中
- レビュー中 [UnderReview] [UNDER_REVIEW]: 内部レビュー実施中
- 修正中 [Correcting] [CORRECTING]: 欠陥修正作業中
- 検証中 [Verifying] [VERIFYING]: 品質検証実施中
- 顧客確認中 [ClientReviewing] [CLIENT_REVIEWING]: 顧客レビュー中
- 承認済み [Approved] [APPROVED]: 品質承認取得
- 改善中 [Improving] [IMPROVING]: 品質改善活動中

### 遷移条件
\`\`\`
未開始 --[品質保証開始]--> 基準設定中
基準設定中 --[基準確定]--> レビュー中
レビュー中 --[欠陥発見]--> 修正中
レビュー中 --[欠陥なし]--> 検証中
修正中 --[修正完了]--> レビュー中
検証中 --[内部合格]--> 顧客確認中
顧客確認中 --[承認]--> 承認済み
顧客確認中 --[要修正]--> 修正中
承認済み --[改善活動]--> 改善中
\`\`\`

## ビジネスルール

### 事前条件
1. 品質基準がクライアントと合意されている
2. レビュー体制と責任者が明確である
3. 必要な品質保証ツールが利用可能である
4. 成果物の完成基準が定義されている

### 実行中の制約
1. 重要成果物は必ず第三者レビューを実施
2. 致命的欠陥は24時間以内に対応開始
3. 顧客レビュー前に内部品質ゲートを通過必須
4. 品質データは改竄不可な形で記録
5. 修正による副作用は必ず検証

### 事後条件
1. 全ての品質基準が満たされている
2. レビュー記録が完備されている
3. クライアント承認が文書化されている
4. 品質メトリクスが更新されている
5. 改善提案が次回プロジェクトに活用可能

## パラソルドメインモデル

### エンティティ定義
- 品質基準 [QualityStandard] [QUALITY_STANDARD]
  - 基準ID、プロジェクトID、基準項目、目標値、測定方法
- レビュー記録 [ReviewRecord] [REVIEW_RECORD]
  - 記録ID、成果物ID、レビュー種別、実施日、レビュアー、結果
- 欠陥 [Defect] [DEFECT]
  - 欠陥ID、成果物ID、重要度、種別、発見者、状態
- 品質メトリクス [QualityMetric] [QUALITY_METRIC]
  - メトリクスID、測定日、指標名、計画値、実績値

### 値オブジェクト
- 欠陥重要度 [DefectSeverity] [DEFECT_SEVERITY]
  - 致命的、重大、中程度、軽微
- 品質判定 [QualityJudgment] [QUALITY_JUDGMENT]
  - 合格、条件付き合格、不合格

## KPI

1. **初回品質合格率**: 初回レビューで合格した成果物の割合
   - 目標値: 85%以上
   - 測定方法: (初回合格成果物数 / 全成果物数) × 100
   - 測定頻度: 月次

2. **欠陥密度**: 成果物サイズあたりの欠陥数
   - 目標値: 0.5件/KLOC以下（コードの場合）
   - 測定方法: 欠陥数 / 成果物サイズ
   - 測定頻度: 成果物完成時

3. **欠陥除去効率**: 内部で発見・修正した欠陥の割合
   - 目標値: 95%以上
   - 測定方法: (内部発見欠陥数 / 全欠陥数) × 100
   - 測定頻度: フェーズ完了時

4. **顧客報告欠陥数**: 顧客から報告された欠陥の数
   - 目標値: 0.1件/人月以下
   - 測定方法: 顧客報告欠陥数 / 投入人月
   - 測定頻度: 月次

5. **品質コスト率**: 品質保証活動に要したコストの割合
   - 目標値: 総工数の15-20%
   - 測定方法: (品質保証工数 / 総工数) × 100
   - 測定頻度: 月次`,
      pattern: 'QualityControl',
      goal: '成果物が品質基準を満たすことを体系的に確認し、高品質なデリバリーを実現する',
      roles: JSON.stringify([
        { name: 'QualityManager', displayName: '品質管理責任者', systemName: 'QUALITY_MANAGER' },
        { name: 'Reviewer', displayName: 'レビュアー', systemName: 'REVIEWER' },
        { name: 'DeliverableOwner', displayName: '成果物作成者', systemName: 'DELIVERABLE_OWNER' },
        { name: 'Client', displayName: 'クライアント', systemName: 'CLIENT' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'SetQualityStandards', displayName: '品質基準設定', systemName: 'SET_QUALITY_STANDARDS' },
          { name: 'DevelopQualityPlan', displayName: '品質計画策定', systemName: 'DEVELOP_QUALITY_PLAN' },
          { name: 'ConductInternalReview', displayName: '内部レビュー実施', systemName: 'CONDUCT_INTERNAL_REVIEW' },
          { name: 'CorrectDefects', displayName: '欠陥修正', systemName: 'CORRECT_DEFECTS' },
          { name: 'VerifyQuality', displayName: '品質検証', systemName: 'VERIFY_QUALITY' },
          { name: 'ConductClientReview', displayName: '顧客レビュー', systemName: 'CONDUCT_CLIENT_REVIEW' },
          { name: 'ImproveQuality', displayName: '品質改善', systemName: 'IMPROVE_QUALITY' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'NotStarted', displayName: '未開始', systemName: 'NOT_STARTED' },
        { name: 'SettingStandards', displayName: '基準設定中', systemName: 'SETTING_STANDARDS' },
        { name: 'UnderReview', displayName: 'レビュー中', systemName: 'UNDER_REVIEW' },
        { name: 'Correcting', displayName: '修正中', systemName: 'CORRECTING' },
        { name: 'Verifying', displayName: '検証中', systemName: 'VERIFYING' },
        { name: 'ClientReviewing', displayName: '顧客確認中', systemName: 'CLIENT_REVIEWING' },
        { name: 'Approved', displayName: '承認済み', systemName: 'APPROVED' },
        { name: 'Improving', displayName: '改善中', systemName: 'IMPROVING' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}