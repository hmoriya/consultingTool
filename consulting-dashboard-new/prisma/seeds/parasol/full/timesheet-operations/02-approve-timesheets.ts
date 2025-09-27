import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedApproveTimesheets(service: any, capability: any) {
  console.log('    Creating business operation: 工数を承認する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'ApproveTimesheets',
      displayName: '工数を承認する',
      design: `# ビジネスオペレーション: 工数を承認する [ApproveTimesheets] [APPROVE_TIMESHEETS]

## オペレーション概要

### 目的
チームメンバーが入力した工数を確認し、プロジェクトの実績として正式に承認することで、正確な原価管理と請求処理を可能にする

### ビジネス価値
- **精度向上**: 工数精度を99%以上に維持、請求漏れ・誤請求をゼロ化
- **効率化**: 承認プロセスを70%高速化、月末締め作業を2日短縮
- **透明性確保**: 承認履歴の完全記録により監査対応力100%向上

### 実行頻度
- **頻度**: 日次（推奨）〜週次、月末には必須
- **トリガー**: チームメンバーの工数入力完了、締め期限前、異常値検知時
- **所要時間**: 1人あたり3-5分、チーム全体で30分程度

## ロールと責任

### 関与者
- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: チーム工数の妥当性確認、承認/差し戻し判断、異常値対応
  - 権限: 承認実行、差し戻し、コメント追加

- チームリーダー [TeamLeader] [TEAM_LEADER]
  - 責任: 担当メンバーの工数事前確認、PM承認前のレビュー
  - 権限: 仮承認、差し戻し推奨、詳細確認

- タイムシート管理者 [TimesheetAdministrator] [TIMESHEET_ADMINISTRATOR]
  - 責任: 承認プロセスの監視、未承認アラート、締め管理
  - 権限: 承認督促、強制承認（緊急時）、レポート生成

- 経理担当者 [AccountingStaff] [ACCOUNTING_STAFF]
  - 責任: 承認済み工数の確認、請求データ作成
  - 権限: 承認済みデータの閲覧、請求区分確認

### RACI マトリクス
| ステップ | PM | チームリーダー | 管理者 | 経理 |
|---------|-----|-------------|--------|------|
| 工数確認 | R | C | I | I |
| 妥当性判断 | A | R | C | I |
| 承認実行 | R | C | I | I |
| 差し戻し | R | C | C | I |
| 最終確定 | A | I | R | C |

## ビジネスプロセス

### プロセスフロー
\`\`\`
[開始：承認対象工数あり]
  ↓
[ステップ1：承認対象抽出]
  ↓
[ステップ2：工数内容確認]
  ↓
[ステップ3：妥当性検証]
  ↓
[判断：承認可能？]
  ├─ Yes → [ステップ4：承認実行]
  └─ No  → [ステップ5：差し戻し]
  ↓
[ステップ6：通知送信]
  ↓
[判断：全件完了？]
  ├─ No → [ステップ2へ戻る]
  └─ Yes → [終了：承認完了]
\`\`\`

### 各ステップの詳細

#### ステップ1: 承認対象抽出 [ExtractPendingTimesheets] [EXTRACT_PENDING_TIMESHEETS]
- **目的**: 承認が必要な工数エントリを特定し一覧化
- **入力**: 承認権限情報、対象期間
- **活動**:
  1. 自身が管理するプロジェクト/チームを確認
  2. 「承認待ち」ステータスの工数を抽出
  3. 優先度順（期限切れ、金額大、重要プロジェクト）に並び替え
  4. 異常値（極端に多い/少ない）をハイライト
  5. 過去の承認パターンを参照
- **出力**: 承認対象工数リスト（優先順位付き）
- **所要時間**: 1-2分

#### ステップ2: 工数内容確認 [ReviewTimesheetDetails] [REVIEW_TIMESHEET_DETAILS]
- **目的**: 各工数エントリの詳細を確認し理解
- **入力**: 承認対象工数、プロジェクト情報、タスク情報
- **活動**:
  1. 日付・時間・プロジェクト・タスクを確認
  2. 作業内容コメントを読み理解
  3. 該当日のプロジェクト活動と照合
  4. 請求可否区分を確認
  5. 添付資料があれば参照（作業成果物等）
- **出力**: 確認済み工数情報
- **所要時間**: 30秒/件

#### ステップ3: 妥当性検証 [ValidateReasonableness] [VALIDATE_REASONABLENESS]
- **目的**: 工数の妥当性を多角的に検証
- **入力**: 確認済み工数、過去実績、標準工数
- **活動**:
  1. タスクの標準工数と比較
  2. 本人の過去の作業パターンと照合
  3. チーム全体の工数バランスを確認
  4. プロジェクト進捗との整合性確認
  5. 異常値の原因を特定（必要に応じ本人確認）
- **出力**: 妥当性判断結果、懸念事項
- **所要時間**: 1-2分/件

#### ステップ4: 承認実行 [ExecuteApproval] [EXECUTE_APPROVAL]
- **目的**: 妥当と判断した工数を正式に承認
- **入力**: 妥当性確認済み工数
- **活動**:
  1. 承認対象を最終確認
  2. 承認ボタンをクリック
  3. 必要に応じ承認コメントを追加
  4. バルク承認機能で複数件を一括処理
  5. 承認履歴を自動記録
- **出力**: 承認済み工数（ステータス更新）
- **所要時間**: 30秒/件

#### ステップ5: 差し戻し [RejectTimesheet] [REJECT_TIMESHEET]
- **目的**: 修正が必要な工数を差し戻し
- **入力**: 問題のある工数エントリ
- **活動**:
  1. 差し戻し理由を明確に記載
  2. 修正すべき箇所を具体的に指摘
  3. 参考情報や正しい例を提示
  4. 修正期限を設定
  5. 差し戻し通知を送信
- **出力**: 差し戻し工数（理由付き）
- **所要時間**: 2-3分/件

#### ステップ6: 通知送信 [SendNotifications] [SEND_NOTIFICATIONS]
- **目的**: 承認結果を関係者に通知
- **入力**: 承認/差し戻し結果
- **活動**:
  1. 承認完了通知を入力者に送信
  2. 差し戻しの場合は詳細理由を含めて通知
  3. チーム全体の承認状況をまとめて通知
  4. 未承認残がある場合はリマインダー設定
  5. 経理部門に承認完了を通知（月末）
- **出力**: 通知送信完了、送信ログ
- **所要時間**: 自動処理

## 状態遷移

### 状態定義
- 承認待ち [PendingApproval] [PENDING_APPROVAL]: 入力完了し承認待機中
- 一次承認済み [FirstApproved] [FIRST_APPROVED]: チームリーダー承認済み
- 承認済み [Approved] [APPROVED]: PM承認完了
- 差し戻し [Rejected] [REJECTED]: 修正要求あり
- 確定 [Finalized] [FINALIZED]: 期間締めで変更不可
- 請求済み [Billed] [BILLED]: 顧客請求処理完了

### 遷移条件
\`\`\`
承認待ち --[TL承認]--> 一次承認済み
一次承認済み --[PM承認]--> 承認済み
承認待ち --[PM直接承認]--> 承認済み
承認待ち --[差し戻し]--> 差し戻し
一次承認済み --[差し戻し]--> 差し戻し
差し戻し --[再提出]--> 承認待ち
承認済み --[期間締め]--> 確定
確定 --[請求処理]--> 請求済み
\`\`\`

## ビジネスルール

### 事前条件
1. 承認者がプロジェクトの承認権限を保有
2. 承認対象の工数が「承認待ち」ステータス
3. 工数入力期限が経過している（または間近）
4. プロジェクトWBSと予算が確定している

### 実行中の制約
1. 自分自身の工数は承認できない（上位承認者が必要）
2. 過去の確定期間の工数は承認変更不可
3. 請求済みの工数は修正不可
4. 承認は階層順（TL→PM）が推奨されるが、スキップ可能
5. 差し戻しは具体的な理由の記載が必須

### 事後条件
1. 工数ステータスが「承認済み」または「差し戻し」に更新
2. 承認履歴が完全に記録されている
3. 入力者に結果通知が送信されている
4. プロジェクト実績工数が更新されている
5. 承認率・差し戻し率が統計に反映されている

## パラソルドメインモデル

### エンティティ定義
- 承認履歴 [ApprovalHistory] [APPROVAL_HISTORY]
  - 履歴ID、工数エントリID、承認者ID、承認日時、アクション（承認/差し戻し）、コメント、承認レベル
- 承認権限 [ApprovalAuthority] [APPROVAL_AUTHORITY]
  - 権限ID、ユーザーID、プロジェクトID、承認可能レベル、有効期限
- 承認ルール [ApprovalRule] [APPROVAL_RULE]
  - ルールID、プロジェクトID、条件（金額、期間等）、必要承認レベル、自動承認設定

### 値オブジェクト
- 承認アクション [ApprovalAction] [APPROVAL_ACTION]
  - アクション種別（承認、差し戻し、保留）、理由コード
- 承認レベル [ApprovalLevel] [APPROVAL_LEVEL]
  - レベル（1次承認、2次承認、最終承認）、必須/任意フラグ

## KPI

1. **承認処理時間**: 工数提出から承認完了までの平均時間
   - 目標値: 24時間以内
   - 測定方法: 承認完了時刻 - 提出時刻の平均
   - 測定頻度: 週次

2. **差し戻し率**: 提出された工数のうち差し戻された割合
   - 目標値: 5%以下
   - 測定方法: (差し戻し件数 / 承認依頼件数) × 100
   - 測定頻度: 週次

3. **自動承認率**: ルールベースで自動承認された割合
   - 目標値: 60%以上
   - 測定方法: (自動承認件数 / 全承認件数) × 100
   - 測定頻度: 月次

4. **期限遵守率**: 締め期限までに承認完了した割合
   - 目標値: 99%以上
   - 測定方法: (期限内承認プロジェクト数 / 全プロジェクト数) × 100
   - 測定頻度: 月次`,
      pattern: 'Approval',
      goal: 'チームメンバーの工数を迅速かつ正確に承認し、プロジェクト原価管理と請求処理を確実に実行する',
      roles: JSON.stringify([
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'TeamLeader', displayName: 'チームリーダー', systemName: 'TEAM_LEADER' },
        { name: 'TimesheetAdministrator', displayName: 'タイムシート管理者', systemName: 'TIMESHEET_ADMINISTRATOR' },
        { name: 'AccountingStaff', displayName: '経理担当者', systemName: 'ACCOUNTING_STAFF' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'ExtractPendingTimesheets', displayName: '承認対象抽出', systemName: 'EXTRACT_PENDING_TIMESHEETS' },
          { name: 'ReviewTimesheetDetails', displayName: '工数内容確認', systemName: 'REVIEW_TIMESHEET_DETAILS' },
          { name: 'ValidateReasonableness', displayName: '妥当性検証', systemName: 'VALIDATE_REASONABLENESS' },
          { name: 'ExecuteApproval', displayName: '承認実行', systemName: 'EXECUTE_APPROVAL' },
          { name: 'RejectTimesheet', displayName: '差し戻し', systemName: 'REJECT_TIMESHEET' },
          { name: 'SendNotifications', displayName: '通知送信', systemName: 'SEND_NOTIFICATIONS' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'PendingApproval', displayName: '承認待ち', systemName: 'PENDING_APPROVAL' },
        { name: 'FirstApproved', displayName: '一次承認済み', systemName: 'FIRST_APPROVED' },
        { name: 'Approved', displayName: '承認済み', systemName: 'APPROVED' },
        { name: 'Rejected', displayName: '差し戻し', systemName: 'REJECTED' },
        { name: 'Finalized', displayName: '確定', systemName: 'FINALIZED' },
        { name: 'Billed', displayName: '請求済み', systemName: 'BILLED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}