import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// 通知・コミュニケーションサービスの完全なパラソルデータ
export async function seedNotificationServiceFullParasol() {
  console.log('  Seeding notification-service full parasol data...')
  
  // 既存のサービスをチェック
  const existingService = await parasolDb.service.findFirst({
    where: { name: 'collaboration-facilitation' }
  })
  
  if (existingService) {
    console.log('  コラボレーション促進サービス already exists, skipping...')
    return
  }
  
  // サービスを作成
  const service = await parasolDb.service.create({
    data: {
      name: 'collaboration-facilitation',
      displayName: 'コラボレーション促進サービス',
      description: 'チーム間のコミュニケーションと協働を促進し、生産性を向上',

      domainLanguage: JSON.stringify({
        entities: [
          {
            name: '通知 [Notification] [NOTIFICATION]',
            attributes: [
              { name: 'ID [id] [NOTIFICATION_ID]', type: 'UUID' },
              { name: '受信者ID [recipientId] [RECIPIENT_ID]', type: 'UUID' },
              { name: '通知タイプ [type] [TYPE]', type: 'ENUM' },
              { name: 'タイトル [title] [TITLE]', type: 'STRING_200' },
              { name: '本文 [body] [BODY]', type: 'TEXT' },
              { name: '重要度 [priority] [PRIORITY]', type: 'ENUM' },
              { name: 'リンクURL [linkUrl] [LINK_URL]', type: 'STRING_500' },
              { name: '既読フラグ [isRead] [IS_READ]', type: 'BOOLEAN' },
              { name: '既読日時 [readAt] [READ_AT]', type: 'TIMESTAMP' },
              { name: '通知日時 [notifiedAt] [NOTIFIED_AT]', type: 'TIMESTAMP' },
              { name: '有効期限 [expiresAt] [EXPIRES_AT]', type: 'TIMESTAMP' }
            ],
            businessRules: [
              '重要通知は複数チャネルで配信',
              '未読通知は30日でアーカイブ',
              '通知タイプ別に配信設定を尊重'
            ]
          },
          {
            name: 'チャンネル [Channel] [CHANNEL]',
            attributes: [
              { name: 'ID [id] [CHANNEL_ID]', type: 'UUID' },
              { name: 'チャンネル名 [name] [NAME]', type: 'STRING_100' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: 'タイプ [type] [TYPE]', type: 'ENUM' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: '作成者ID [createdBy] [CREATED_BY]', type: 'UUID' },
              { name: 'プライベートフラグ [isPrivate] [IS_PRIVATE]', type: 'BOOLEAN' },
              { name: 'アーカイブフラグ [isArchived] [IS_ARCHIVED]', type: 'BOOLEAN' }
            ],
            businessRules: [
              'プロジェクト開始時に自動作成',
              'アーカイブ後は読み取り専用',
              'プライベートチャンネルは招待制'
            ]
          },
          {
            name: 'メッセージ [Message] [MESSAGE]',
            attributes: [
              { name: 'ID [id] [MESSAGE_ID]', type: 'UUID' },
              { name: 'チャンネルID [channelId] [CHANNEL_ID]', type: 'UUID' },
              { name: '送信者ID [senderId] [SENDER_ID]', type: 'UUID' },
              { name: '本文 [content] [CONTENT]', type: 'TEXT' },
              { name: 'スレッドID [threadId] [THREAD_ID]', type: 'UUID' },
              { name: '添付ファイル [attachments] [ATTACHMENTS]', type: 'JSON' },
              { name: '編集フラグ [isEdited] [IS_EDITED]', type: 'BOOLEAN' },
              { name: '送信日時 [sentAt] [SENT_AT]', type: 'TIMESTAMP' }
            ],
            businessRules: [
              'メッセージは24時間以内なら編集可',
              'スレッドは3階層まで',
              '添付ファイルは10MBまで'
            ]
          },
          {
            name: 'アラート [Alert] [ALERT]',
            attributes: [
              { name: 'ID [id] [ALERT_ID]', type: 'UUID' },
              { name: 'アラート名 [name] [NAME]', type: 'STRING_200' },
              { name: 'カテゴリ [category] [CATEGORY]', type: 'ENUM' },
              { name: '緊急度 [urgency] [URGENCY]', type: 'ENUM' },
              { name: '対象ID [targetId] [TARGET_ID]', type: 'UUID' },
              { name: '対象タイプ [targetType] [TARGET_TYPE]', type: 'ENUM' },
              { name: '闾値 [threshold] [THRESHOLD]', type: 'JSON' },
              { name: '現在値 [currentValue] [CURRENT_VALUE]', type: 'JSON' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: '発生日時 [triggeredAt] [TRIGGERED_AT]', type: 'TIMESTAMP' },
              { name: '解決日時 [resolvedAt] [RESOLVED_AT]', type: 'TIMESTAMP' }
            ],
            businessRules: [
              '緊急アラートは即座にエスカレーション',
              '未対応アラートは段階的にエスカレーション',
              '解決時は対応内容の記録必須'
            ]
          },
          {
            name: '通知設定 [NotificationPreference] [NOTIFICATION_PREFERENCE]',
            attributes: [
              { name: 'ID [id] [NOTIFICATION_PREFERENCE_ID]', type: 'UUID' },
              { name: 'ユーザーID [userId] [USER_ID]', type: 'UUID' },
              { name: 'チャンネル [channel] [CHANNEL]', type: 'ENUM' },
              { name: '通知タイプ別設定 [typeSettings] [TYPE_SETTINGS]', type: 'JSON' },
              { name: '通知時間帯 [activeHours] [ACTIVE_HOURS]', type: 'JSON' },
              { name: 'ダイジェスト設定 [digestSettings] [DIGEST_SETTINGS]', type: 'JSON' }
            ],
            businessRules: [
              'デフォルト設定からカスタマイズ',
              '重要通知はオプトアウト不可',
              '時間帯設定はタイムゾーン考慮'
            ]
          }
        ],
        valueObjects: [
          {
            name: '通知タイプ [NotificationType] [NOTIFICATION_TYPE]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'ENUM' }],
            businessRules: [
              'タスク、承認、コメント、リマインダー、アラート等',
              'タイプ別にテンプレート定義',
              'タイプ別に配信ルール設定'
            ]
          },
          {
            name: '緊急度 [Urgency] [URGENCY]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'ENUM' }],
            businessRules: [
              '緊急、高、中、低の4段階',
              '緊急度により配信手段を変更',
              'エスカレーションタイミングを決定'
            ]
          }
        ],
        domainServices: [
          {
            name: '通知配信サービス [NotificationDeliveryService] [NOTIFICATION_DELIVERY_SERVICE]',
            operations: [
              '通知の生成・送信',
              '配信チャネルの選定',
              '配信状態の追跡',
              'リトライ処理'
            ]
          },
          {
            name: 'メッセージングサービス [MessagingService] [MESSAGING_SERVICE]',
            operations: [
              'メッセージの送受信',
              'スレッド管理',
              'ファイル共有',
              'リアルタイム配信'
            ]
          }
        ]
      }),
      apiSpecification: JSON.stringify({}),
      dbSchema: JSON.stringify({})
    }
  })
  
  // ビジネスケーパビリティ: 情報を即座に届ける能力
  const capability = await parasolDb.businessCapability.create({
    data: {
      serviceId: service.id,
      name: 'InstantCommunicationCapability',
      displayName: '情報を即座に届ける能力',
      description: '重要な情報やイベントをリアルタイムで関係者に通知し、迅速な意思決定とコラボレーションを実現する能力',
      definition: `# ビジネスケーパビリティ: 情報を即座に届ける能力 [InstantCommunicationCapability] [INSTANT_COMMUNICATION_CAPABILITY]

## ケーパビリティ概要

### 定義
プロジェクトやタスクで発生する重要なイベントを自動検知し、関係者に最適なタイミングと手段でリアルタイムに通知することで、情報の遅延や見落としを防ぎ、迅速な対応と円滑なコミュニケーションを実現する組織的能力。

### ビジネス価値
- **直接的価値**: 意思決定速度50%向上、情報伝達漏れ90%削減、会議時間30%削減
- **間接的価値**: チームコラボレーション効率20%向上、問題の早期発見と対処、顧客満足度向上
- **戦略的価値**: 組織の反応速度向上、透明性の確保、リモートワーク環境の最適化

### 成熟度レベル
- **現在**: レベル2（管理段階） - 基本的な通知とメール送信が存在
- **目標**: レベル4（予測可能段階） - AIによる最適な通知タイミングと手段の自動選択（2025年Q4）

## ビジネスオペレーション群

### 通知管理グループ
- 通知を配信する [DeliverNotifications] [DELIVER_NOTIFICATIONS]
  - 目的: イベント発生時に関係者へ即座に通知を送信
- 通知を管理する [ManageNotifications] [MANAGE_NOTIFICATIONS]
  - 目的: 通知設定のカスタマイズと通知履歴の管理
- 通知を集約する [AggregateNotifications] [AGGREGATE_NOTIFICATIONS]
  - 目的: 過剰な通知を防ぐため複数通知をまとめて配信

### メッセージンググループ
- メッセージを送受信する [ExchangeMessages] [EXCHANGE_MESSAGES]
  - 目的: プロジェクトメンバー間のリアルタイムメッセージング
- チャンネルを管理する [ManageChannels] [MANAGE_CHANNELS]
  - 目的: プロジェクトやトピック別のコミュニケーションチャンネルを管理
- ファイルを共有する [ShareFiles] [SHARE_FILES]
  - 目的: チャンネル内でファイルや資料を共有

### アラート管理グループ
- 緊急アラートを発信する [SendUrgentAlerts] [SEND_URGENT_ALERTS]
  - 目的: 重大なイベントや問題を即座にエスカレーション
- アラートをエスカレーションする [EscalateAlerts] [ESCALATE_ALERTS]
  - 目的: 未対応アラートを上位者へ自動エスカレーション
- アラート対応を記録する [RecordAlertResponses] [RECORD_ALERT_RESPONSES]
  - 目的: アラートへの対応履歴を記録し改善に活用

## 関連ケーパビリティ

### 前提ケーパビリティ
- プロジェクトを成功に導く能力 [ProjectSuccessCapability] [PROJECT_SUCCESS_CAPABILITY]
  - 依存理由: プロジェクトイベントが通知の起点となる
- 認証・認可する能力 [AuthenticationCapability] [AUTHENTICATION_CAPABILITY]
  - 依存理由: ユーザー情報と権限が通知配信の前提

### 連携ケーパビリティ
- タスクを完遂する能力 [TaskCompletionCapability] [TASK_COMPLETION_CAPABILITY]
  - 連携価値: タスクイベントが通知トリガーとなる
- 承認を得る能力 [ApprovalCapability] [APPROVAL_CAPABILITY]
  - 連携価値: 承認依頼や承認結果を通知で配信

## パラソルドメインモデル概要

### 中核エンティティ
- 通知 [Notification] [NOTIFICATION]
- チャンネル [Channel] [CHANNEL]
- メッセージ [Message] [MESSAGE]
- アラート [Alert] [ALERT]
- 通知設定 [NotificationSetting] [NOTIFICATION_SETTING]

### 主要な集約
- 通知集約（通知、配信履歴、既読状態）
- チャンネル集約（チャンネル、メンバー、メッセージ）
- アラート集約（アラート、エスカレーション履歴、対応記録）

## 評価指標（KPI）

1. **通知到達率**: 送信された通知が正常に配信された割合
   - 目標値: 99.9%以上
   - 測定方法: (正常配信数 / 送信試行数) × 100
   - 測定頻度: 日次

2. **通知反応時間**: 通知受信から既読・対応までの平均時間
   - 目標値: 15分以内（緊急通知）、4時間以内（通常通知）
   - 測定方法: 対応時刻 - 通知送信時刻の平均
   - 測定頻度: 日次

3. **通知有効性率**: 通知により実際にアクションが取られた割合
   - 目標値: 70%以上
   - 測定方法: (アクション発生数 / 通知送信数) × 100
   - 測定頻度: 週次

4. **メッセージ応答時間**: メッセージ送信から返信までの平均時間
   - 目標値: 1時間以内（営業時間内）
   - 測定方法: 返信時刻 - 送信時刻の平均
   - 測定頻度: 週次

5. **アラート解決時間**: アラート発信から解決までの平均時間
   - 目標値: 30分以内（緊急）、4時間以内（重要）
   - 測定方法: 解決時刻 - アラート発信時刻の平均
   - 測定頻度: 日次

## 必要なリソース

### 人的リソース
- **全ユーザー**: 通知受信とメッセージング
  - 人数: 全社員
  - スキル要件: 基本的なIT操作、コミュニケーション能力

- **通知管理者**: 通知システムの運用管理
  - 人数: 1-2名
  - スキル要件: システム運用、トラブルシューティング

- **チャンネル管理者**: チャンネルの作成・管理
  - 人数: プロジェクトマネージャー全員
  - スキル要件: チーム運営、モデレーション

### 技術リソース
- **通知配信システム**: 多様な手段での通知配信
  - 用途: プッシュ通知、メール、SMS、Slack等への配信
  - 要件: 高可用性（99.9%）、リアルタイム配信、配信履歴管理

- **メッセージングプラットフォーム**: リアルタイムチャット
  - 用途: チーム内コミュニケーション、ファイル共有
  - 要件: WebSocket対応、モバイルアプリ、検索機能

- **アラート管理システム**: 緊急アラートの管理
  - 用途: 重大イベントの検知、エスカレーション、対応記録
  - 要件: 重要度判定、自動エスカレーション、監査ログ

### 情報リソース
- **通知テンプレート**: イベント種別ごとの通知文面
  - 用途: 一貫性のある通知配信
  - 更新頻度: 四半期

- **ユーザー設定**: 個人の通知受信設定
  - 用途: ユーザーの好みに応じた通知配信
  - 更新頻度: リアルタイム

- **チャンネル構成**: プロジェクトとチャンネルの対応
  - 用途: 適切なコミュニケーション場所の提供
  - 更新頻度: プロジェクト開始・終了時

## 実現ロードマップ

### Phase 1: 基盤構築（2024 Q1-Q2）
- 通知配信システムの導入
- 基本通知タイプの実装（タスク、承認、コメント）
- メッセージングプラットフォームの導入
- プロジェクト別チャンネルの自動作成

### Phase 2: 機能拡張（2024 Q3-Q4）
- 通知設定のカスタマイズ機能
- 通知集約機能（ダイジェスト配信）
- アラート管理機能の実装
- モバイルプッシュ通知対応

### Phase 3: 最適化（2025 Q1-Q2）
- AI活用による最適通知タイミング予測
- ユーザー行動に基づく通知手段の自動選択
- スマート要約機能（長文メッセージの自動要約）
- 予測的アラート（問題発生前の警告）`,
      category: 'Core'
    }
  })
  
  // ビジネスオペレーションを作成
  const { seedNotificationOperationsFull } = await import('./notification-operations-full')
  await seedNotificationOperationsFull(service, capability)
  
  return { service, capability }
}