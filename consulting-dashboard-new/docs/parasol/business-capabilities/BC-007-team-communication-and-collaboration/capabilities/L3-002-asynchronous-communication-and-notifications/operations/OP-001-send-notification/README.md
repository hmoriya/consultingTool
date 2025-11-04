# OP-001: 通知を送信する

**作成日**: 2025-10-31
**所属L3**: L3-002-asynchronous-communication-and-notifications: Asynchronous Communication And Notifications
**所属BC**: BC-007: Team Communication & Collaboration
**V2移行元**: services/collaboration-facilitation-service/capabilities/communication-delivery/operations/send-notification

---

## 📋 How: この操作の定義

### 操作の概要
通知を送信するを実行し、ビジネス価値を創出する。

### 実現する機能
- 通知を送信するに必要な情報の入力と検証
- 通知を送信するプロセスの実行と進捗管理
- 結果の記録と関係者への通知
- 監査証跡の記録

### 入力
- 操作実行に必要なビジネス情報
- 実行者の認証情報と権限
- 関連エンティティの参照情報

### 出力
- 操作結果（成功/失敗）
- 更新されたエンティティ情報
- 監査ログと履歴情報
- 次のアクションへのガイダンス

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| senderId | UUID | Yes | - | UUID形式、BC-003 User参照 | 送信者ID（システムの場合はnull） |
| recipientIds | Array<UUID> | Yes | - | UUID配列、1-10000件 | 受信者ID配列 |
| notificationType | STRING_20 | Yes | - | task/project/system/custom | 通知タイプ |
| priority | STRING_20 | Yes | - | urgent/high/normal/low | 優先度（SLA決定） |
| title | STRING_200 | Yes | - | 1-200文字 | 通知タイトル |
| message | TEXT | Yes | - | 1-5000文字 | 通知本文 |
| actionUrl | STRING_100 | No | null | URL形式 | アクションURL（クリック時の遷移先） |
| actionLabel | STRING_50 | No | null | 1-50文字 | アクションボタンラベル |
| channels | Array<Enum> | No | ['push'] | push/email/sms | 配信チャネル配列 |
| expiresAt | DateTime | No | null | ISO8601形式 | 有効期限 |
| metadata | Object | No | {} | JSON形式、最大1KB | メタデータ（カスタム情報） |

### バリデーションルール
1. **senderId**: BC-003のUserエンティティが存在（システム通知時はnull可）
2. **recipientIds**: 全員BC-003のUser、重複なし
3. **priority=urgent**: SLA 10秒、push+email+sms必須
4. **priority=high**: SLA 60秒、push+email推奨
5. **priority=normal**: SLA 300秒、push推奨
6. **priority=low**: Best Effort、アプリ内のみ
7. **channels**: urgentの場合、['push', 'email', 'sms']強制
8. **expiresAt**: 現在時刻より後、1年以内

## 📤 出力仕様

### 成功レスポンス
**HTTP 202 Accepted**（非同期処理）
```json
{
  "notificationId": "uuid",
  "batchId": "uuid",
  "senderId": "uuid",
  "recipientCount": 150,
  "priority": "high",
  "slaDeadline": "2025-11-04T10:01:00Z",
  "channels": ["push", "email"],
  "status": "queued",
  "deliveryTracking": {
    "queued": 150,
    "delivering": 0,
    "delivered": 0,
    "failed": 0
  },
  "estimatedCompletionTime": "2025-11-04T10:01:00Z",
  "createdAt": "2025-11-04T10:00:00Z"
}
```

### 配信ステータス確認（GET /notifications/{id}/status）
```json
{
  "notificationId": "uuid",
  "status": "delivered",
  "deliveryDetails": {
    "push": {
      "attempted": 150,
      "delivered": 145,
      "failed": 5
    },
    "email": {
      "attempted": 150,
      "delivered": 148,
      "failed": 2
    }
  },
  "deliveryTime": "2025-11-04T10:00:45Z",
  "slaAchieved": true,
  "averageDeliveryTime": 38
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC007_L3002_OP001_001**: senderIdが不正（UUID形式エラー）
- **ERR_BC007_L3002_OP001_002**: recipientIds件数エラー（1-10000件）
- **ERR_BC007_L3002_OP001_003**: priority不正
- **ERR_BC007_L3002_OP001_004**: title長さエラー（1-200文字）
- **ERR_BC007_L3002_OP001_005**: message長さエラー（1-5000文字）
- **ERR_BC007_L3002_OP001_006**: channels不正（urgent時の制約違反）

#### HTTP 404 Not Found
- **ERR_BC007_L3002_OP001_404_01**: 送信者が存在しません
- **ERR_BC007_L3002_OP001_404_02**: 受信者が存在しません（一部）

#### HTTP 429 Too Many Requests
- **ERR_BC007_L3002_OP001_429**: レート制限超過（1000通知/分）

#### HTTP 500 Internal Server Error
- **ERR_BC007_L3002_OP001_500**: 通知送信中にシステムエラー（ログ参照）

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Notification Aggregate**: 通知ライフサイクル管理
  - 参照: [../../../../domain/README.md#notification-aggregate](../../../../domain/README.md#notification-aggregate)
  - 集約ルート: Notification
  - 包含エンティティ: NotificationRecipient, NotificationDeliveryLog

#### ドメインメソッド
```typescript
// 通知作成
const notification = Notification.create({
  senderId,
  recipientIds,
  notificationType,
  priority,
  title,
  message
});

// 配信チャネル設定
notification.setChannels(['push', 'email']);

// 配信
await notification.deliver(deliveryService);
```

#### ドメインサービス
- **NotificationDeliveryService.deliver()**: 優先度別配信（SLA保証）
- **NotificationDeliveryService.sendPush()**: Push通知配信（FCM/APNS）
- **NotificationDeliveryService.sendEmail()**: Email配信（SendGrid/SES）
- **NotificationDeliveryService.sendSMS()**: SMS配信（Twilio）
- **NotificationSLAService.trackSLA()**: SLA監視・アラート

### SLA配信アーキテクチャ
- **優先度別キュー**: Redis Queue（urgent/high/normal/low）
- **配信保証**: At-least-once delivery、重複排除（idempotency key）
- **リトライ戦略**: Exponential backoff、最大3回
- **SLA監視**: Prometheus metrics、Grafana dashboard

### SLA要件（ドメイン定義準拠）
| 優先度 | SLA | 配信方法 | リトライ |
|-------|-----|---------|---------|
| urgent | 10秒以内 | Push + Email + SMS | 3回（5秒間隔） |
| high | 60秒以内 | Push + Email | 3回（30秒間隔） |
| normal | 300秒以内 | Push | 2回（2分間隔） |
| low | Best Effort | アプリ内のみ | なし |

### トランザクション境界
- **開始**: 通知送信リクエスト受信時
- **コミット**: Notification作成 + 受信者登録 + キューイング完了時
- **ロールバック**: バリデーションエラー、受信者不存在時

### 副作用
- **ドメインイベント発行**:
  - `NotificationSent` - 配信開始
  - `NotificationDelivered` - 配信完了（各チャネル）
  - `NotificationRead` - 既読（ユーザーアクション）
- **通知**:
  - Push: FCM（Android）、APNS（iOS）
  - Email: SendGrid/AWS SES
  - SMS: Twilio
- **外部システム連携**:
  - RabbitMQ: 非同期配信キュー
  - Redis: 配信ステータスキャッシュ

### BC間連携
- **BC-003依存**: Userエンティティ参照、通知設定取得
- **BC-001/BC-005/BC-006**: 各BCからの通知トリガー

### 実装手順
1. 送信者存在確認（senderId指定時）
2. 受信者存在確認（recipientIds）
3. ユーザー通知設定取得（BC-003、通知OFF時間帯確認）
4. priority別SLA計算
5. Notification Aggregate作成
6. トランザクション開始
7. Notification保存
8. NotificationRecipient作成（全受信者）
9. 優先度別キューイング（Redis Queue）
10. NotificationSentイベント発行
11. トランザクションコミット
12. 非同期配信開始（Worker処理）
13. SLA監視開始

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 |
|--------|---------------|------|-------------|
| ERR_BC007_L3002_OP001_001 | 400 | senderId形式エラー | No |
| ERR_BC007_L3002_OP001_002 | 400 | recipientIds件数エラー | No |
| ERR_BC007_L3002_OP001_003 | 400 | priority不正 | No |
| ERR_BC007_L3002_OP001_004 | 400 | title長さエラー | No |
| ERR_BC007_L3002_OP001_005 | 400 | message長さエラー | No |
| ERR_BC007_L3002_OP001_006 | 400 | channels制約違反 | No |
| ERR_BC007_L3002_OP001_404_01 | 404 | 送信者不存在 | No |
| ERR_BC007_L3002_OP001_404_02 | 404 | 受信者不存在 | No |
| ERR_BC007_L3002_OP001_429 | 429 | レート制限超過 | Yes（1分後） |
| ERR_BC007_L3002_OP001_500 | 500 | システムエラー | Yes |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC007_L3002_OP001_500、ERR_BC007_L3002_OP001_429
- **リトライ回数**: priority別（urgent=3回、high=3回、normal=2回、low=なし）
- **バックオフ**: priority別（urgent=5s、high=30s、normal=2m）
- **デッドレターキュー**: 最終失敗時はDLQへ移動、アラート発報

### SLA違反時の処理
1. SLA期限10秒前にアラート（Slack/PagerDuty）
2. SLA違反発生時に即座エスカレーション
3. SLA違反ログをDB記録（分析用）
4. 週次SLA達成率レポート生成

### ログ記録要件
- **INFO**: 通知送信成功（notificationId, priority, 受信者数、SLA期限記録）
- **WARN**: SLA期限接近（10秒前）、大量配信（1000件超）、配信失敗（一部）
- **ERROR**: システムエラー（スタックトレース、入力パラメータ全量記録）、SLA違反
- **監査ログ**: 全通知送信（成功/失敗問わず）をAuditLogに記録（BC-003経由）

### パフォーマンス監視
- **SLA達成率**: > 99.9%（urgent/high）
- **配信レイテンシ**: P50/P95/P99測定
- **スループット**: 100,000通知/分
- **配信成功率**: > 99%（各チャネル）

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
> - [services/collaboration-facilitation-service/capabilities/communication-delivery/operations/send-notification/](../../../../../../services/collaboration-facilitation-service/capabilities/communication-delivery/operations/send-notification/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
