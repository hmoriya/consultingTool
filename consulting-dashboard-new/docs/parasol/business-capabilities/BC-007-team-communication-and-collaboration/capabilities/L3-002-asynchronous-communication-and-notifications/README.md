# L3-002: Asynchronous Communication & Notifications

**作成日**: 2025-10-31
**所属BC**: BC-007: Team Communication & Collaboration
**V2移行元**: communication-delivery (非同期部分), deliver-immediate-information

---

## 📋 What: この能力の定義

### 能力の概要
非同期のコミュニケーションと通知を管理する能力。通知配信、メッセージ管理、SLA管理を通じて、適切なタイミングでの情報伝達を実現します。

### 実現できること
- 非同期メッセージングの管理
- 一般通知の配信
- 緊急通知の即時配信
- 通知のSLA管理
- 通知配信状況の追跡

### 必要な知識
- メッセージキューイング技術
- 通知システム設計
- SLA管理
- プッシュ通知技術
- 配信最適化

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: NotificationAggregate ([../../domain/README.md](../../domain/README.md#notification-aggregate))
- **Entities**: Notification, Message, NotificationRule, DeliveryStatus
- **Value Objects**: Priority, SLA, DeliveryChannel, NotificationStatus

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/notifications/send - 一般通知配信
  - POST /api/notifications/urgent - 緊急通知配信
  - GET /api/notifications/status - 配信状況確認

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: notifications, messages, notification_rules, delivery_statuses

詳細: [../../data/README.md](../../data/README.md)

---

## 🛠️ 実装アプローチ

### アーキテクチャパターン
- **メッセージキューイング**: RabbitMQ/Kafka による非同期配信
- **優先度管理**: 優先度キューによるSLA保証
- **配信追跡**: イベントソーシングによる配信状況管理
- **リトライ機構**: 指数バックオフによる再配信

### 主要技術スタック
- **メッセージキュー**: メッセージング機構
  - 優先度キュー（urgent, high, normal, low）
  - 永続化キュー（配信保証）
  - Dead Letter Queue（失敗メッセージ処理）
  - メッセージTTL（有効期限）
- **配信チャネル管理**: キャッシュ機構 / リレーショナルデータベース
  - プッシュ通知機能
  - Email送信機能
  - SMS送信機能
  - Webhook（カスタム連携）
- **SLA管理**: 優先度キュー + ワーカープール
  - urgent: 10秒以内配信開始（専用Worker）
  - high: 1分以内配信開始（高優先Worker）
  - normal: 5分以内配信開始（通常Worker）
  - low: Best Effort（バッチ処理）
- **配信追跡**: 全文検索エンジン / 時系列データベース
  - 配信ステータス管理（pending → sending → delivered/failed）
  - 配信ログの永続化
  - 配信失敗分析

### 実装パターン

#### 優先度別メッセージキュー
```typescript
// メッセージング機構 優先度キュー設定
await queue.assertQueue('notifications', {
  durable: true,
  arguments: {
    'x-max-priority': 10, // 0-10の優先度
    'x-message-ttl': 86400000, // 24時間TTL
    'x-dead-letter-exchange': 'dlx.notifications'
  }
})

// 通知発行（優先度付き）
async function publishNotification(notification) {
  const priority = {
    urgent: 10,
    high: 7,
    normal: 5,
    low: 1
  }[notification.priority]

  await queue.publish('notifications', '',
    Buffer.from(JSON.stringify(notification)),
    {
      priority,
      persistent: true,
      timestamp: Date.now()
    }
  )
}
```

#### SLA保証配信システム
```typescript
// SLA別Worker Pool
class NotificationWorkerPool {
  urgentWorkers: Worker[] // 10秒SLA専用
  highWorkers: Worker[]   // 1分SLA専用
  normalWorkers: Worker[] // 5分SLA専用

  async processNotification(notification) {
    const sla = SLA_CONFIG[notification.priority]
    const deadline = Date.now() + sla.timeout

    try {
      await Promise.race([
        this.deliver(notification),
        this.timeout(sla.timeout)
      ])
    } catch (error) {
      if (Date.now() > deadline) {
        // SLA違反: エスカレーション
        await this.escalate(notification, error)
      }
      // リトライキューへ
      await this.scheduleRetry(notification, error)
    }
  }
}
```

#### マルチチャネル配信
```typescript
// 配信チャネル選択と配信
async function deliverNotification(notification) {
  const channels = selectChannels(notification.priority, notification.user)

  for (const channel of channels) {
    try {
      switch (channel.type) {
        case 'push':
          await sendPushNotification(notification, channel)
          break
        case 'email':
          await sendEmail(notification, channel)
          break
        case 'sms':
          if (notification.priority === 'urgent') {
            await sendSMS(notification, channel)
          }
          break
        case 'webhook':
          await callWebhook(notification, channel)
          break
      }

      await logDelivery(notification.id, channel.type, 'delivered')
    } catch (error) {
      await logDelivery(notification.id, channel.type, 'failed', error)
    }
  }
}
```

#### 指数バックオフリトライ
```typescript
// リトライ戦略
const RETRY_CONFIG = {
  urgent: { maxRetries: 3, intervals: [5s, 5s, 5s] },
  high: { maxRetries: 3, intervals: [30s, 30s, 30s] },
  normal: { maxRetries: 2, intervals: [2m, 2m] },
  low: { maxRetries: 0 } // リトライなし
}

async function scheduleRetry(notification, attempt) {
  const config = RETRY_CONFIG[notification.priority]

  if (attempt >= config.maxRetries) {
    await moveToDeadLetterQueue(notification)
    return
  }

  const delay = config.intervals[attempt]
  await queue.publish('notifications.retry', '',
    Buffer.from(JSON.stringify(notification)),
    {
      headers: { 'x-delay': delay },
      persistent: true
    }
  )
}
```

### パフォーマンス最適化
- **配信スループット**:
  - 水平スケーリング: Worker数動的調整（負荷ベース）
  - バッチ処理: 低優先度通知の一括配信
  - 目標: 100,000通知/分
- **レイテンシ削減**:
  - 優先度キュー: 緊急通知の即座配信
  - Connection Pool: SMTP/API接続の再利用
  - 非同期処理: I/O待ち時間の最小化
- **リソース効率**:
  - Rate Limiting: チャネル別配信レート制限
  - Circuit Breaker: 外部サービス障害時の遮断
  - Backpressure: キュー深度監視と流量制御

---

## ⚠️ 前提条件と制約

### 技術的前提条件
- **インフラ要件**:
  - メッセージング機構クラスタ（3ノード以上）
  - キャッシュ機構（配信状態キャッシュ）
  - リレーショナルデータベース/全文検索エンジン（配信ログ）
  - Worker Server（4GB RAM, 2 vCPU × 台数）
- **外部サービス**:
  - プッシュ通知機能
  - Email送信機能
  - SMS送信機能
- **リソース要件**:
  - 最低: 8GB RAM, 4 vCPU（Worker Pool）
  - 推奨: 16GB RAM, 8 vCPU（高負荷環境）

### ビジネス制約
- **SLA定義**:
  - **urgent**: 10秒以内配信開始（99.9%達成）
  - **high**: 1分以内配信開始（99.5%達成）
  - **normal**: 5分以内配信開始（99%達成）
  - **low**: Best Effort（SLA保証なし）
- **配信チャネル優先順位**:
  1. Push通知（アプリ起動中）
  2. WebSocket（リアルタイム接続中）
  3. Email（Push失敗時）
  4. SMS（urgentかつEmail失敗時）
- **リトライポリシー**:
  - urgent: 3回リトライ（5秒間隔）
  - high: 3回リトライ（30秒間隔）
  - normal: 2回リトライ（2分間隔）
  - low: リトライなし

### データ制約
- **通知サイズ**: 最大10KB（本文+メタデータ）
- **添付データ**: 最大100KB（JSON/バイナリ）
- **配信ログ保持**: 90日間（無制限プランは1年）
- **バッチサイズ**: 最大1000通知/バッチ

### 運用制約
- **配信レート制限**:
  - Email: 100通/分/ユーザー
  - SMS: 10通/日/ユーザー（コスト考慮）
  - Push: 無制限（ただしOS側制限あり）
- **ユーザー設定尊重**:
  - 通知OFF時間帯（夜間・週末等）
  - カテゴリ別通知ON/OFF
  - ただしurgent通知は常に配信
- **監視・アラート**:
  - SLA違反率 < 1%
  - 配信失敗率 < 5%
  - キュー深度 < 10,000件

---

## 🔗 BC設計との統合

### ドメインモデル統合
- **Aggregate Root**: `NotificationAggregate`
  - 集約エンティティ: Notification, Message, NotificationRule, DeliveryStatus
  - 不変条件: 優先度別SLA遵守、配信順序性、リトライ上限
  - ビジネスルール: 配信チャネル選択、ユーザー設定適用、エスカレーション

### BC間連携

#### 全BC共通（BC-007は通知インフラを全BCに提供）
- **イベント駆動通知**:
  - 各BCのドメインイベント発生時に通知配信
  - 例: BC-001 `TaskDeadlineApproachingEvent` → リマインダー通知
- **優先度マッピング**:
  - システムアラート → urgent
  - タスクアサイン・期限 → high
  - 一般更新・コメント → normal
  - マーケティング → low

#### BC-001 (Project Delivery) との連携
- **タスク・期限通知**:
  - イベント: `TaskAssignedEvent`, `DeadlineApproachingEvent`
  - 優先度: high（期限24時間前）、urgent（期限6時間前）
  - API: `POST /api/notifications/send`（priority指定）

#### BC-003 (Access Control) との連携
- **セキュリティアラート**:
  - イベント: `SuspiciousActivityDetectedEvent`
  - 優先度: urgent
  - 配信: Push + Email + SMS（多チャネル）

#### BC-005 (Team & Resource) との連携
- **チーム通知**:
  - イベント: `TeamMemberAddedEvent`, `SkillCertificationExpiredEvent`
  - 優先度: normal（一般）、high（資格失効）
  - API: `POST /api/notifications/send-to-team/{teamId}`

#### BC-006 (Knowledge Management) との連携
- **知識更新通知**:
  - イベント: `KnowledgeArticlePublishedEvent`
  - 優先度: normal（購読者へ）
  - 配信: Email（ダイジェスト形式、日次バッチ）

### API設計統合
- **通知配信API**:
  - `POST /api/notifications/send` - 単一通知
  - `POST /api/notifications/send-bulk` - 一括通知
  - `POST /api/notifications/send-urgent` - 緊急通知（SLA 10秒）
- **配信状況API**:
  - `GET /api/notifications/{id}/status` - 配信状況確認
  - `GET /api/notifications/delivery-log` - 配信ログ取得
- **設定API**:
  - `PUT /api/notifications/preferences` - ユーザー通知設定
  - `GET /api/notifications/channels` - 有効チャネル一覧
- **詳細**: [../../api/README.md](../../api/README.md)

### データ層統合
- **テーブル設計**:
  - `notifications`: 通知メタデータ
  - `messages`: メッセージ本体
  - `notification_rules`: 通知ルール（カテゴリ別設定）
  - `delivery_statuses`: 配信状況履歴
  - `user_notification_preferences`: ユーザー通知設定
- **詳細**: [../../data/README.md](../../data/README.md)

### イベント駆動統合
- **発行イベント**:
  - `NotificationSentEvent`: 通知送信時
  - `NotificationDeliveredEvent`: 配信成功時
  - `NotificationFailedEvent`: 配信失敗時
  - `SLAViolatedEvent`: SLA違反時
- **購読イベント**（全BCから）:
  - BC-001: `TaskAssignedEvent`, `DeadlineApproachingEvent`
  - BC-003: `SuspiciousActivityDetectedEvent`
  - BC-005: `TeamMemberAddedEvent`, `SkillCertificationExpiredEvent`
  - BC-006: `KnowledgeArticlePublishedEvent`

### キューアーキテクチャ統合
- **優先度キュー構成**:
  ```
  notifications.urgent  (priority: 10, workers: 5)
  notifications.high    (priority: 7,  workers: 3)
  notifications.normal  (priority: 5,  workers: 2)
  notifications.low     (priority: 1,  workers: 1)
  ```
- **Dead Letter Queue**: `dlq.notifications`（手動リカバリ）
- **Retry Queue**: `notifications.retry.{priority}`

### モニタリング統合
- **配信メトリクス**:
  - SLA達成率（優先度別）
  - 配信成功率（チャネル別）
  - 平均配信時間
  - キュー深度（優先度別）
- **アラート条件**:
  - SLA違反率 > 1%
  - 配信失敗率 > 5%
  - キュー深度 > 10,000件
  - Worker異常終了

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 通知を配信する | 一般通知・緊急通知の送信 | 3-4個 | send-notification, deliver-notifications |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 1-2個
- **推定UseCase数**: 3-4個
- **V2からの移行**: deliver-immediate-information を統合、SLAで分割

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/collaboration-facilitation-service/capabilities/communication-delivery/](../../../../services/collaboration-facilitation-service/capabilities/communication-delivery/) (send-notification部分)
> - [services/collaboration-facilitation-service/capabilities/deliver-immediate-information/](../../../../services/collaboration-facilitation-service/capabilities/deliver-immediate-information/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-002 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
