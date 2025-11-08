import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedRecordTimeEntries(service: unknown, capability: unknown) {
  console.log('    Creating business operation: 工数を記録する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'RecordTimeEntries',
      displayName: '工数を記録する',
      design: `# ビジネスオペレーション: 工数を記録する [RecordTimeEntries] [RECORD_TIME_ENTRIES]

## オペレーション概要

### 目的
コンサルタントが日々の作業時間を正確かつ効率的に記録し、プロジェクトの実績工数として確定可能な状態にする

### ビジネス価値
- **効率性向上**: 工数入力時間を1日あたり平均5分以内に短縮、月間で2時間の生産性向上
- **品質向上**: 入力ミスを70%削減、記録精度95%以上を達成、請求漏れを防止
- **リアルタイム性**: 当日の工数を即座に可視化、PMが進捗をリアルタイムで把握可能

### 実行頻度
- **頻度**: 日次（推奨：当日または翌営業日）
- **トリガー**: 業務終了時、週末、月末締め前
- **所要時間**: 1日あたり3-5分（複数プロジェクト参画時は10分程度）

## ロールと責任

### 関与者
- コンサルタント [Consultant] [CONSULTANT]
  - 責任: 日々の作業時間の正確な記録、期限内の入力完了
  - 権限: 自身の工数入力、修正申請

- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: 工数入力状況の監視、未入力者へのリマインド
  - 権限: チームメンバーの工数閲覧、承認・差し戻し

- タイムシート管理者 [TimesheetAdministrator] [TIMESHEET_ADMINISTRATOR]
  - 責任: 全社の工数記録状況の監視、期限管理、システム運用
  - 権限: 全工数データの閲覧、強制確定（例外的）

### RACI マトリクス
| ステップ | コンサルタント | PM | タイムシート管理者 |
|---------|---------------|----|--------------------|
| 作業実施 | R | I | I |
| 工数入力 | R | I | I |
| 入力確認 | C | A | R |
| 承認申請 | R | A | I |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：業務実施] 
  ↓
[ステップ1：作業記録] 
  ↓
[ステップ2：プロジェクト選択]
  ↓
[ステップ3：タスク選択]
  ↓
[ステップ4：工数入力]
  ↓
[ステップ5：コメント追加]
  ↓
[判断：入力内容正確？]
  ↓ Yes
[ステップ6：保存] → [終了：記録完了]
  ↓ No
[代替：修正] → [ステップ2へ戻る]
\`\`\`

### 各ステップの詳細

#### ステップ1: 作業記録 [RecordWork] [RECORD_WORK]
- **目的**: 実施した作業内容と時間をメモする
- **入力**: 実施した業務活動
- **活動**:
  1. 作業開始時に作業内容を意識
  2. プロジェクトとタスクをメモ
  3. 作業時間を記録（開始・終了時刻または所要時間）
  4. 複数プロジェクトの場合は切り替え時点を記録
  5. 作業の特記事項があればメモ
- **出力**: 作業メモ（紙またはデジタル）
- **所要時間**: 実作業中（随時）

#### ステップ2: プロジェクト選択 [SelectProject] [SELECT_PROJECT]
- **目的**: 工数を記録する対象プロジェクトを選択
- **入力**: 作業メモ、自身が参画しているプロジェクトリスト
- **活動**:
  1. 工数管理システムにログイン
  2. 対象日付を選択（デフォルトは当日）
  3. 自身が配置されているプロジェクトの一覧を確認
  4. 作業を実施したプロジェクトを選択
  5. 社内業務の場合は「社内業務」を選択
- **出力**: 選択済みプロジェクト
- **所要時間**: 30秒

#### ステップ3: タスク選択 [SelectTask] [SELECT_TASK]
- **目的**: プロジェクト内のどのタスクに時間を費やしたかを特定
- **入力**: 選択済みプロジェクト、プロジェクトのWBS
- **活動**:
  1. プロジェクトのタスクリストを表示
  2. 実施した作業に対応するタスクを検索
  3. タスク階層をドリルダウンして具体的なタスクを選択
  4. 該当タスクがない場合はPMに確認または「その他」を選択
  5. 複数タスクに従事した場合は別々に記録
- **出力**: 選択済みタスク
- **所要時間**: 30秒〜1分

#### ステップ4: 工数入力 [EnterHours] [ENTER_HOURS]
- **目的**: 実際に費やした時間を数値として入力
- **入力**: 選択済みタスク、作業メモの時間情報
- **活動**:
  1. 作業時間を時間単位で入力（例: 3.5時間）
  2. 開始・終了時刻を入力する方式の場合は時刻を入力
  3. 合計時間が1日の労働時間を超えていないか確認
  4. 他のプロジェクトとの合計が妥当か確認
  5. システムが自動計算した場合は結果を確認
- **出力**: 入力済み工数
- **所要時間**: 30秒

#### ステップ5: コメント追加 [AddComments] [ADD_COMMENTS]
- **目的**: 工数の背景や特記事項を記録し承認者の理解を助ける
- **入力**: 入力済み工数、作業メモ
- **活動**:
  1. 実施した作業の具体的な内容を簡潔に記述（50文字程度）
  2. 予定外の追加作業や遅延理由があれば記載
  3. 承認者への補足説明が必要な場合は詳細を追記
  4. クライアントへの請求時に参照する情報があれば記載
  5. 定型作業の場合はテンプレート文を使用
- **出力**: コメント付き工数エントリ
- **所要時間**: 1-2分

#### ステップ6: 保存 [SaveEntry] [SAVE_ENTRY]
- **目的**: 入力した工数を確定しシステムに保存
- **入力**: コメント付き工数エントリ
- **活動**:
  1. 入力内容を最終確認（プロジェクト、タスク、時間、コメント）
  2. 請求区分（請求可能/請求不可）を確認または選択
  3. 「保存」ボタンをクリック
  4. 保存成功メッセージを確認
  5. 他のプロジェクトやタスクがある場合はステップ2へ戻る
- **出力**: 保存済み工数エントリ（ステータス：承認待ち）
- **所要時間**: 30秒

## 状態遷移

### 状態定義
- 未入力 [NotEntered] [NOT_ENTERED]: 営業日だが工数が未入力
- 下書き [Draft] [DRAFT]: 入力途中で一時保存された状態
- 承認待ち [PendingApproval] [PENDING_APPROVAL]: 入力完了し承認待ち
- 承認済み [Approved] [APPROVED]: PMまたは承認者が承認した
- 差し戻し [Rejected] [REJECTED]: 修正が必要として差し戻された
- 確定 [Finalized] [FINALIZED]: 期間締めにより確定し変更不可

### 遷移条件
\`\`\`
未入力 --[入力開始]--> 下書き
下書き --[一時保存]--> 下書き
下書き --[入力完了・保存]--> 承認待ち
承認待ち --[承認者が承認]--> 承認済み
承認待ち --[承認者が差し戻し]--> 差し戻し
差し戻し --[修正・再保存]--> 承認待ち
承認済み --[期間締め]--> 確定
\`\`\`

## ビジネスルール

### 事前条件
1. コンサルタントがプロジェクトに配置されている
2. プロジェクトのWBSとタスクが定義されている
3. 工数管理システムへのアクセス権が付与されている
4. 対象日が営業日である（休日・祝日は入力不要）

### 実行中の制約
1. 1日の工数合計は24時間を超えてはならない
2. 未来の日付には工数を入力できない
3. 期間が締められた日付には工数を入力・修正できない
4. 他人の工数は入力できない（管理者権限を除く）
5. 工数は0.5時間単位で入力する（15分単位も許可する場合あり）

### 事後条件
1. 工数エントリが「承認待ち」状態でシステムに記録されている
2. PMに工数入力通知が送信される（設定による）
3. プロジェクトの実績工数に自動集計される（承認前でも参考値として）
4. コンサルタントの稼働時間に加算される
5. 入力履歴が監査ログに記録される

## パラソルドメインモデル

### エンティティ定義
- 工数エントリ [TimeEntry] [TIME_ENTRY]
  - エントリID、コンサルタントID、プロジェクトID、タスクID、日付、工数（時間）、請求区分、コメント、ステータス、入力日時、更新日時
- 工数期間 [TimesheetPeriod] [TIMESHEET_PERIOD]
  - 期間ID、開始日、終了日、締め状態、締め日、確定日
- 承認履歴 [ApprovalHistory] [APPROVAL_HISTORY]
  - 履歴ID、エントリID、承認者ID、承認日時、承認結果、コメント

### 値オブジェクト
- 工数時間 [WorkingHours] [WORKING_HOURS]
  - 時間数（0.5単位）、分数（0-59）
- 請求区分 [BillableType] [BILLABLE_TYPE]
  - 区分（請求可能/請求不可/社内業務）、理由

## KPI

1. **当日入力率**: 作業当日中に工数を入力した割合
   - 目標値: 80%以上
   - 測定方法: (当日入力件数 / 全入力件数) × 100
   - 測定頻度: 日次

2. **期限内入力率**: 締め期限内に工数を入力した割合
   - 目標値: 98%以上
   - 測定方法: (期限内入力日数 / 営業日数) × 100
   - 測定頻度: 週次

3. **入力エラー率**: 差し戻しや修正が必要だった工数の割合
   - 目標値: 5%未満
   - 測定方法: (差し戻し件数 / 全入力件数) × 100
   - 測定頻度: 週次

4. **工数入力所要時間**: 1日分の工数入力にかかる平均時間
   - 目標値: 5分以内
   - 測定方法: システムログから算出（入力画面表示〜保存までの時間）
   - 測定頻度: 月次`,
      pattern: 'CRUD',
      goal: 'コンサルタントが日々の作業時間を正確かつ効率的に記録し、プロジェクトの実績工数として確定可能な状態にする',
      roles: JSON.stringify([
        { name: 'Consultant', displayName: 'コンサルタント', systemName: 'CONSULTANT' },
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'TimesheetAdministrator', displayName: 'タイムシート管理者', systemName: 'TIMESHEET_ADMINISTRATOR' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'RecordWork', displayName: '作業記録', systemName: 'RECORD_WORK' },
          { name: 'SelectProject', displayName: 'プロジェクト選択', systemName: 'SELECT_PROJECT' },
          { name: 'SelectTask', displayName: 'タスク選択', systemName: 'SELECT_TASK' },
          { name: 'EnterHours', displayName: '工数入力', systemName: 'ENTER_HOURS' },
          { name: 'AddComments', displayName: 'コメント追加', systemName: 'ADD_COMMENTS' },
          { name: 'SaveEntry', displayName: '保存', systemName: 'SAVE_ENTRY' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'NotEntered', displayName: '未入力', systemName: 'NOT_ENTERED' },
        { name: 'Draft', displayName: '下書き', systemName: 'DRAFT' },
        { name: 'PendingApproval', displayName: '承認待ち', systemName: 'PENDING_APPROVAL' },
        { name: 'Approved', displayName: '承認済み', systemName: 'APPROVED' },
        { name: 'Rejected', displayName: '差し戻し', systemName: 'REJECTED' },
        { name: 'Finalized', displayName: '確定', systemName: 'FINALIZED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}