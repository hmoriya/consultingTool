import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedDeliverNotifications(service: any, capability: any) {
  console.log('    Creating business operation: 通知を配信する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'DeliverNotifications',
      displayName: '通知を配信する',
      design: `# ビジネスオペレーション: 通知を配信する [DeliverNotifications] [DELIVER_NOTIFICATIONS]

## オペレーション概要

### 目的
システム内で発生した重要なイベントを検知し、関係者に適切なタイミングと手段で通知を配信することで、情報の遅延や見落としを防ぎ、迅速な対応を促進する

### ビジネス価値
- **効率性向上**: 情報伝達時間を従来の90%削減、意思決定速度50%向上
- **品質向上**: 情報伝達漏れ95%削減、重要イベントへの対応時間70%短縮
- **満足度向上**: リアルタイム通知によるユーザー満足度20%向上

### 実行頻度
- **頻度**: イベント発生時（リアルタイム）
- **トリガー**: タスク割当、承認依頼、期限接近、コメント投稿、ステータス変更等
- **所要時間**: 1-3秒（イベント検知から配信まで）

## ロールと責任

### 関与者
- システム [System] [SYSTEM]
  - 責任: イベント検知、通知生成、配信実行
  - 権限: 全ユーザーへの通知送信、配信ログ記録

- 通知送信者 [NotificationSender] [NOTIFICATION_SENDER]
  - 責任: イベント発生（例: タスク割当実行者）
  - 権限: 特定イベントのトリガー

- 通知受信者 [NotificationRecipient] [NOTIFICATION_RECIPIENT]
  - 責任: 通知受信、確認、対応
  - 権限: 通知設定のカスタマイズ、既読管理

- 通知管理者 [NotificationAdministrator] [NOTIFICATION_ADMINISTRATOR]
  - 責任: 通知システムの監視、配信失敗の対処
  - 権限: 全通知の閲覧、配信設定の変更

### RACI マトリクス
| ステップ | システム | 送信者 | 受信者 | 管理者 |
|---------|---------|--------|--------|--------|
| イベント発生 | I | R | I | I |
| イベント検知 | R | I | I | C |
| 受信者特定 | R | C | I | C |
| 通知生成 | R | C | I | C |
| 通知配信 | R | I | A | C |
| 配信確認 | R | I | C | A |

## ビジネスプロセス

### プロセスフロー
\`\`\`
[開始：イベント発生] 
  ↓
[ステップ1：イベント検知]
  ↓
[ステップ2：通知対象者特定]
  ↓
[ステップ3：通知内容生成]
  ↓
[ステップ4：配信手段選択]
  ↓
[判断：即時配信？]
  ↓ Yes
[ステップ5：通知配信] → [ステップ6：配信記録] → [終了：配信完了]
  ↓ No
[代替：配信キューに追加] → [スケジュール配信]
\`\`\`

### 各ステップの詳細

#### ステップ1: イベント検知 [DetectEvent] [DETECT_EVENT]
- **目的**: システム内で発生した通知対象イベントを検知
- **入力**: システム内の各種イベント
- **活動**:
  1. データベースの変更イベントを監視（CDC: Change Data Capture）
  2. アプリケーションレイヤーからのイベント発行を検知
  3. イベントタイプを分類（タスク関連、承認関連、コメント関連等）
  4. イベントの重要度を判定（緊急/重要/通常/情報）
  5. イベント詳細情報を抽出（エンティティID、変更内容等）
- **出力**: 検知済みイベント情報
- **所要時間**: 0.1秒

#### ステップ2: 通知対象者特定 [IdentifyRecipients] [IDENTIFY_RECIPIENTS]
- **目的**: イベントに対して通知を受け取るべき関係者を特定
- **入力**: 検知済みイベント情報
- **活動**:
  1. イベント種別に応じた通知ルールを取得
  2. 関連エンティティ（プロジェクト、タスク等）の関係者を抽出
  3. 権限に基づく通知対象者のフィルタリング
  4. ユーザーの通知設定を確認（受信可否、配信手段）
  5. 通知対象者リストを生成（ユーザーID、配信手段のペア）
- **出力**: 通知対象者リスト
- **所要時間**: 0.5秒

#### ステップ3: 通知内容生成 [GenerateContent] [GENERATE_CONTENT]
- **目的**: イベント情報から通知メッセージを生成
- **入力**: 検知済みイベント情報、通知対象者リスト
- **活動**:
  1. イベント種別に対応する通知テンプレートを取得
  2. イベント詳細情報をテンプレートに埋め込み
  3. 通知タイトルと本文を生成
  4. アクションリンクを生成（例: タスク詳細画面へのリンク）
  5. 多言語対応が必要な場合は受信者の言語設定に応じて翻訳
- **出力**: 通知メッセージ（タイトル、本文、リンク）
- **所要時間**: 0.3秒

#### ステップ4: 配信手段選択 [SelectDeliveryMethod] [SELECT_DELIVERY_METHOD]
- **目的**: 各受信者に最適な配信手段を選択
- **入力**: 通知対象者リスト、ユーザー設定
- **活動**:
  1. ユーザーの通知設定を確認（アプリ内/メール/SMS/外部連携）
  2. イベント重要度に基づく配信手段の優先順位決定
  3. 緊急通知の場合は複数手段での配信を決定
  4. ユーザーのオンライン状態を確認（リアルタイム配信の可否）
  5. 配信手段ごとの送信先情報を取得（メールアドレス、デバイストークン等）
- **出力**: 受信者別配信計画（配信手段、送信先、タイミング）
- **所要時間**: 0.5秒

#### ステップ5: 通知配信 [DeliverNotification] [DELIVER_NOTIFICATION]
- **目的**: 選択された配信手段で実際に通知を送信
- **入力**: 受信者別配信計画、通知メッセージ
- **活動**:
  1. アプリ内通知の場合: データベースに通知レコードを作成
  2. プッシュ通知の場合: プッシュ通知サービスへ送信
  3. メール通知の場合: メール送信サービスへ送信
  4. 外部連携（Slack等）の場合: Webhook経由で送信
  5. 送信結果（成功/失敗）を記録
- **出力**: 配信結果
- **所要時間**: 1-2秒（配信手段による）

#### ステップ6: 配信記録 [RecordDelivery] [RECORD_DELIVERY]
- **目的**: 通知配信の履歴を記録し監査と分析に利用
- **入力**: 配信結果
- **活動**:
  1. 配信ログをデータベースに記録
  2. 配信成功/失敗のメトリクスを更新
  3. 失敗した配信については再試行キューに追加
  4. 配信統計情報を集計（配信数、成功率、配信時間等）
  5. 異常検知アラートの判定（配信失敗率が閾値超過等）
- **出力**: 配信ログ、統計情報
- **所要時間**: 0.5秒

## 状態遷移

### 状態定義
- 未送信 [NotSent] [NOT_SENT]: イベントは検知されたが配信前
- 送信中 [Sending] [SENDING]: 配信処理を実行中
- 配信済み [Delivered] [DELIVERED]: 受信者に正常に配信された
- 既読 [Read] [READ]: 受信者が通知を確認した
- 対応済み [Acted] [ACTED]: 受信者が通知に対してアクションを実行
- 配信失敗 [Failed] [FAILED]: 配信に失敗した
- 再試行中 [Retrying] [RETRYING]: 配信を再試行中

### 遷移条件
\`\`\`
未送信 --[配信開始]--> 送信中
送信中 --[配信成功]--> 配信済み
送信中 --[配信失敗]--> 配信失敗
配信失敗 --[再試行]--> 再試行中
再試行中 --[配信成功]--> 配信済み
配信済み --[ユーザーが確認]--> 既読
既読 --[ユーザーがアクション]--> 対応済み
\`\`\`

## ビジネスルール

### 事前条件
1. 通知対象イベントが定義されている
2. 通知テンプレートが準備されている
3. ユーザーの通知設定が登録されている
4. 配信インフラ（メールサーバー、プッシュサービス等）が稼働している

### 実行中の制約
1. 同一ユーザーへの通知は1分間に10件まで（過剰配信防止）
2. 深夜時間帯（22:00-8:00）は緊急通知のみ配信
3. 配信失敗時は最大3回まで再試行（指数バックオフ）
4. 同一イベントに対する重複通知は防止（deduplicate）
5. 通知の保持期間は90日間（それ以降は自動削除）

### 事後条件
1. 通知が配信済みまたは配信失敗の状態になっている
2. 配信ログが記録されている
3. 配信失敗の場合は再試行キューに追加されている
4. 受信者がアプリ内で通知を確認可能である
5. 配信統計情報が更新されている

## パラソルドメインモデル

### エンティティ定義
- 通知 [Notification] [NOTIFICATION]
  - 通知ID、イベントID、イベントタイプ、送信者ID、受信者ID、タイトル、本文、リンク、重要度、配信手段、ステータス、送信日時、既読日時
- 配信ログ [DeliveryLog] [DELIVERY_LOG]
  - ログID、通知ID、配信手段、送信先、配信結果、配信日時、エラーメッセージ
- 通知設定 [NotificationSetting] [NOTIFICATION_SETTING]
  - 設定ID、ユーザーID、イベントタイプ、配信手段（アプリ内/メール/プッシュ）、有効フラグ

### 値オブジェクト
- 重要度 [Priority] [PRIORITY]
  - レベル（緊急/重要/通常/情報）、配信遅延許容時間
- 配信結果 [DeliveryResult] [DELIVERY_RESULT]
  - ステータス（成功/失敗）、レスポンスコード、エラーメッセージ

## KPI

1. **配信成功率**: 送信試行に対する配信成功の割合
   - 目標値: 99.5%以上
   - 測定方法: (配信成功数 / 送信試行数) × 100
   - 測定頻度: 日次

2. **配信遅延時間**: イベント発生から配信完了までの時間
   - 目標値: 3秒以内（95パーセンタイル）
   - 測定方法: 配信完了時刻 - イベント発生時刻
   - 測定頻度: リアルタイム

3. **既読率**: 配信された通知が確認された割合
   - 目標値: 80%以上
   - 測定方法: (既読数 / 配信数) × 100
   - 測定頻度: 日次

4. **アクション率**: 通知によりアクションが実行された割合
   - 目標値: 60%以上
   - 測定方法: (アクション数 / 配信数) × 100
   - 測定頻度: 週次`,
      pattern: 'Event',
      goal: 'システム内で発生した重要なイベントを検知し、関係者に適切なタイミングと手段で通知を配信する',
      roles: JSON.stringify([
        { name: 'System', displayName: 'システム', systemName: 'SYSTEM' },
        { name: 'NotificationSender', displayName: '通知送信者', systemName: 'NOTIFICATION_SENDER' },
        { name: 'NotificationRecipient', displayName: '通知受信者', systemName: 'NOTIFICATION_RECIPIENT' },
        { name: 'NotificationAdministrator', displayName: '通知管理者', systemName: 'NOTIFICATION_ADMINISTRATOR' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'DetectEvent', displayName: 'イベント検知', systemName: 'DETECT_EVENT' },
          { name: 'IdentifyRecipients', displayName: '通知対象者特定', systemName: 'IDENTIFY_RECIPIENTS' },
          { name: 'GenerateContent', displayName: '通知内容生成', systemName: 'GENERATE_CONTENT' },
          { name: 'SelectDeliveryMethod', displayName: '配信手段選択', systemName: 'SELECT_DELIVERY_METHOD' },
          { name: 'DeliverNotification', displayName: '通知配信', systemName: 'DELIVER_NOTIFICATION' },
          { name: 'RecordDelivery', displayName: '配信記録', systemName: 'RECORD_DELIVERY' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'NotSent', displayName: '未送信', systemName: 'NOT_SENT' },
        { name: 'Sending', displayName: '送信中', systemName: 'SENDING' },
        { name: 'Delivered', displayName: '配信済み', systemName: 'DELIVERED' },
        { name: 'Read', displayName: '既読', systemName: 'READ' },
        { name: 'Acted', displayName: '対応済み', systemName: 'ACTED' },
        { name: 'Failed', displayName: '配信失敗', systemName: 'FAILED' },
        { name: 'Retrying', displayName: '再試行中', systemName: 'RETRYING' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}