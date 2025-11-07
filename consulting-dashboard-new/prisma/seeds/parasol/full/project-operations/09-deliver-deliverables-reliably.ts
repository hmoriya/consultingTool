import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedDeliverDeliverablesReliably(service: unknown, capability: unknown) {
  console.log('    Creating business operation: 成果物を確実にデリバリーする...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'DeliverDeliverablesReliably',
      displayName: '成果物を確実にデリバリーする',
      design: `# ビジネスオペレーション: 成果物を確実にデリバリーする [DeliverDeliverablesReliably] [DELIVER_DELIVERABLES_RELIABLY]

## オペレーション概要

### 目的
プロジェクトの成果物を計画通りに完成させ、確実にクライアントへ納品することで、プロジェクトの成功と顧客満足を実現する

### ビジネス価値
- **納期遵守**: 納期遵守率95%達成、遅延リスク70%削減、早期完成20%向上
- **品質確保**: 納品後の手戻り80%削減、クライアント承認率90%、再作業工数60%削減
- **効率向上**: デリバリープロセス時間40%短縮、承認サイクル50%短縮、文書化工数30%削減

### 実行頻度
- **頻度**: マイルストーン毎、フェーズ終了時、最終納品時、定期レビュー（月次）
- **トリガー**: 成果物完成、品質承認取得、納期到来、クライアント要請
- **所要時間**: 内部確認（2-4時間）、納品準備（4-8時間）、納品・承認（1-2日）

## ロールと責任

### 関与者
- デリバリーマネージャー [DeliveryManager] [DELIVERY_MANAGER]
  - 責任: デリバリープロセス全体統括、納品計画策定、最終品質確認
  - 権限: 納品判断、リソース調整、クライアント交渉

- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: 成果物管理、スケジュール調整、ステークホルダー調整
  - 権限: 優先順位決定、納期調整、品質基準承認

- 成果物オーナー [DeliverableOwner] [DELIVERABLE_OWNER]
  - 責任: 成果物作成、品質確保、ドキュメント作成、修正対応
  - 権限: 実装方針決定、技術選定、作業見積

- クライアント代表 [ClientRepresentative] [CLIENT_REPRESENTATIVE]
  - 責任: 要求定義、受入テスト、承認判定、フィードバック提供
  - 権限: 最終承認、変更要求、納期調整要請

### RACI マトリクス
| ステップ | DM | PM | 成果物オーナー | クライアント |
|---------|----|----|--------------|-------------|
| 成果物計画 | A | R | C | I |
| 成果物作成 | I | C | R | I |
| 内部確認 | R | C | C | I |
| 納品準備 | R | C | C | I |
| 納品実施 | R | A | C | I |
| 受入確認 | C | C | I | R |
| 完了処理 | R | C | I | A |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：成果物デリバリーサイクル]
  ↓
[ステップ1：成果物計画・定義]
  ↓
[ステップ2：成果物作成・開発]
  ↓
[ステップ3：内部レビュー・品質確認]
  ↓
[判断：品質基準達成？]
  ↓ No                      ↓ Yes
[ステップ2へ戻る]           [ステップ4へ]
  ↓
[ステップ4：納品準備・パッケージング]
  ↓
[ステップ5：納品実施]
  ↓
[ステップ6：受入確認・承認取得]
  ↓
[判断：承認？]
  ↓ No                      ↓ Yes
[修正対応へ]                [ステップ7へ]
  ↓
[ステップ7：完了処理・引き継ぎ]
  ↓
[終了：デリバリー完了]
\`\`\`

### 各ステップの詳細

#### ステップ1: 成果物計画・定義 [PlanAndDefineDeliverables] [PLAN_AND_DEFINE_DELIVERABLES]
- **目的**: 成果物の仕様、品質基準、納期を明確に定義
- **入力**: 契約書、要求仕様、プロジェクト計画、過去の類似案件
- **活動**:
  1. 成果物一覧の作成と優先順位付け
  2. 各成果物の詳細仕様定義
  3. 品質基準と受入条件の明確化
  4. 依存関係とクリティカルパスの特定
  5. デリバリースケジュールの策定
  6. リスクと対応策の検討
- **出力**: 成果物定義書、デリバリー計画、品質基準書
- **所要時間**: 1-2日

#### ステップ2: 成果物作成・開発 [CreateAndDevelopDeliverables] [CREATE_AND_DEVELOP_DELIVERABLES]
- **目的**: 定義された仕様に基づいて成果物を作成
- **入力**: 成果物定義書、技術標準、テンプレート
- **活動**:
  1. 開発環境・ツールの準備
  2. 成果物の段階的開発
  3. 単体テスト・動作確認
  4. 進捗の可視化と報告
  5. 技術的課題の解決
  6. 作業記録の保持
- **出力**: 成果物（初版）、開発ドキュメント、テスト結果
- **所要時間**: 成果物により異なる（数日-数週間）

#### ステップ3: 内部レビュー・品質確認 [ConductInternalReviewAndQuality] [CONDUCT_INTERNAL_REVIEW_AND_QUALITY]
- **目的**: 成果物が品質基準を満たすことを内部で確認
- **入力**: 成果物、品質基準、チェックリスト
- **活動**:
  1. 成果物の完全性確認
  2. 技術レビューの実施
  3. 品質基準との照合
  4. クロスチェックと相互確認
  5. 改善点の特定と修正
  6. レビュー記録の作成
- **出力**: レビュー済み成果物、品質確認書、改善リスト
- **所要時間**: 2-4時間

#### ステップ4: 納品準備・パッケージング [PrepareDeliveryAndPackaging] [PREPARE_DELIVERY_AND_PACKAGING]
- **目的**: 成果物を納品可能な状態に整備
- **入力**: 品質確認済み成果物、納品要件
- **活動**:
  1. 成果物の最終整形
  2. 付属ドキュメントの作成（マニュアル、仕様書）
  3. バージョン管理と構成管理
  4. 納品媒体・形式の準備
  5. セキュリティチェック（機密情報、ライセンス）
  6. 納品チェックリストの確認
- **出力**: 納品パッケージ、付属文書、納品明細
- **所要時間**: 4-8時間

#### ステップ5: 納品実施 [ExecuteDelivery] [EXECUTE_DELIVERY]
- **目的**: 成果物を確実にクライアントへ引き渡す
- **入力**: 納品パッケージ、納品計画、連絡先情報
- **活動**:
  1. 納品方法の最終確認（対面/オンライン/郵送）
  2. 納品スケジュールの調整
  3. 成果物の転送・引き渡し
  4. 納品確認と受領書取得
  5. 納品内容の説明・プレゼンテーション
  6. 質疑応答とサポート
- **出力**: 納品完了通知、受領確認、議事録
- **所要時間**: 2-4時間

#### ステップ6: 受入確認・承認取得 [ConfirmAcceptanceAndApproval] [CONFIRM_ACCEPTANCE_AND_APPROVAL]
- **目的**: クライアントによる成果物の受入と正式承認を取得
- **入力**: 納品成果物、受入基準、テスト計画
- **活動**:
  1. 受入テストの支援
  2. クライアントレビューへの対応
  3. フィードバックの収集と記録
  4. 指摘事項の分類（要対応/対応不要）
  5. 承認プロセスの進行管理
  6. 承認文書の取得
- **出力**: 承認書、フィードバック記録、対応事項リスト
- **所要時間**: 1-2日

#### ステップ7: 完了処理・引き継ぎ [CompleteAndHandover] [COMPLETE_AND_HANDOVER]
- **目的**: デリバリーを正式に完了し、必要な引き継ぎを実施
- **入力**: 承認書、プロジェクト記録、教訓
- **活動**:
  1. 最終成果物のアーカイブ
  2. プロジェクト文書の整理
  3. 運用・保守への引き継ぎ
  4. クライアントへの操作説明
  5. 教訓とベストプラクティスの記録
  6. プロジェクトクローズ処理
- **出力**: 完了報告書、引き継ぎ文書、教訓記録
- **所要時間**: 4-8時間

## 状態遷移

### 状態定義
- 計画中 [Planning] [PLANNING]: 成果物を定義中
- 開発中 [Developing] [DEVELOPING]: 成果物を作成中
- レビュー中 [UnderReview] [UNDER_REVIEW]: 内部確認中
- 納品準備中 [PreparingDelivery] [PREPARING_DELIVERY]: パッケージング中
- 納品済み [Delivered] [DELIVERED]: クライアントに引き渡し完了
- 確認中 [UnderAcceptance] [UNDER_ACCEPTANCE]: 受入テスト中
- 承認済み [Approved] [APPROVED]: クライアント承認取得
- 完了 [Completed] [COMPLETED]: すべての処理が完了

### 遷移条件
\`\`\`
計画中 --[定義完了]--> 開発中
開発中 --[開発完了]--> レビュー中
レビュー中 --[品質OK]--> 納品準備中
レビュー中 --[要修正]--> 開発中
納品準備中 --[準備完了]--> 納品済み
納品済み --[受入開始]--> 確認中
確認中 --[承認]--> 承認済み
確認中 --[要修正]--> 開発中
承認済み --[引き継ぎ完了]--> 完了
\`\`\`

## ビジネスルール

### 事前条件
1. 成果物の仕様と受入基準が明確である
2. 品質基準がクライアントと合意されている
3. デリバリープロセスが確立されている
4. 必要なリソースと権限が確保されている

### 実行中の制約
1. すべての成果物は内部レビューを通過必須
2. 納品前に必ずセキュリティチェックを実施
3. クライアント承認なしに次フェーズへ進まない
4. 重要な変更は必ず変更管理プロセスを通す
5. 納品物のバージョン管理を徹底

### 事後条件
1. すべての成果物が承認され納品完了している
2. 納品の証跡が記録されている
3. クライアントが成果物を利用可能な状態
4. プロジェクト文書が整理・保管されている
5. 教訓が次回プロジェクトに活用可能

## パラソルドメインモデル

### エンティティ定義
- 成果物 [Deliverable] [DELIVERABLE]
  - 成果物ID、プロジェクトID、名称、種別、仕様、状態、納期
- 納品記録 [DeliveryRecord] [DELIVERY_RECORD]
  - 記録ID、成果物ID、納品日、納品方法、受領者、承認状態
- レビュー記録 [ReviewRecord] [REVIEW_RECORD]
  - 記録ID、成果物ID、レビュー日、レビュアー、結果、指摘事項
- 承認記録 [ApprovalRecord] [APPROVAL_RECORD]
  - 記録ID、成果物ID、承認者、承認日、条件、有効期限

### 値オブジェクト
- 成果物種別 [DeliverableType] [DELIVERABLE_TYPE]
  - ドキュメント、ソフトウェア、データ、モデル、報告書
- 納品方法 [DeliveryMethod] [DELIVERY_METHOD]
  - 対面、メール、クラウド、物理媒体、システム連携

## KPI

1. **納期遵守率**: 計画通りに納品できた成果物の割合
   - 目標値: 95%以上
   - 測定方法: (納期遵守数 / 全成果物数) × 100
   - 測定頻度: 月次

2. **初回承認率**: 初回提出で承認された成果物の割合
   - 目標値: 85%以上
   - 測定方法: (初回承認数 / 全成果物数) × 100
   - 測定頻度: プロジェクト完了時

3. **納品後欠陥率**: 納品後に発見された欠陥の発生率
   - 目標値: 0.5%以下
   - 測定方法: (納品後欠陥数 / 全成果物数) × 100
   - 測定頻度: 四半期

4. **デリバリーサイクルタイム**: 成果物完成から承認までの平均時間
   - 目標値: 3営業日以内
   - 測定方法: 承認日時 - 完成日時 の平均
   - 測定頻度: 月次

5. **クライアント満足度**: 成果物に対する満足度スコア
   - 目標値: 4.5/5.0以上
   - 測定方法: 納品後アンケートの平均スコア
   - 測定頻度: 納品完了時`,
      pattern: 'DeliveryManagement',
      goal: 'プロジェクトの成果物を計画通りに完成させ、確実にクライアントへ納品する',
      roles: JSON.stringify([
        { name: 'DeliveryManager', displayName: 'デリバリーマネージャー', systemName: 'DELIVERY_MANAGER' },
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'DeliverableOwner', displayName: '成果物オーナー', systemName: 'DELIVERABLE_OWNER' },
        { name: 'ClientRepresentative', displayName: 'クライアント代表', systemName: 'CLIENT_REPRESENTATIVE' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'PlanAndDefineDeliverables', displayName: '成果物計画・定義', systemName: 'PLAN_AND_DEFINE_DELIVERABLES' },
          { name: 'CreateAndDevelopDeliverables', displayName: '成果物作成・開発', systemName: 'CREATE_AND_DEVELOP_DELIVERABLES' },
          { name: 'ConductInternalReviewAndQuality', displayName: '内部レビュー・品質確認', systemName: 'CONDUCT_INTERNAL_REVIEW_AND_QUALITY' },
          { name: 'PrepareDeliveryAndPackaging', displayName: '納品準備・パッケージング', systemName: 'PREPARE_DELIVERY_AND_PACKAGING' },
          { name: 'ExecuteDelivery', displayName: '納品実施', systemName: 'EXECUTE_DELIVERY' },
          { name: 'ConfirmAcceptanceAndApproval', displayName: '受入確認・承認取得', systemName: 'CONFIRM_ACCEPTANCE_AND_APPROVAL' },
          { name: 'CompleteAndHandover', displayName: '完了処理・引き継ぎ', systemName: 'COMPLETE_AND_HANDOVER' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'Planning', displayName: '計画中', systemName: 'PLANNING' },
        { name: 'Developing', displayName: '開発中', systemName: 'DEVELOPING' },
        { name: 'UnderReview', displayName: 'レビュー中', systemName: 'UNDER_REVIEW' },
        { name: 'PreparingDelivery', displayName: '納品準備中', systemName: 'PREPARING_DELIVERY' },
        { name: 'Delivered', displayName: '納品済み', systemName: 'DELIVERED' },
        { name: 'UnderAcceptance', displayName: '確認中', systemName: 'UNDER_ACCEPTANCE' },
        { name: 'Approved', displayName: '承認済み', systemName: 'APPROVED' },
        { name: 'Completed', displayName: '完了', systemName: 'COMPLETED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}