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
