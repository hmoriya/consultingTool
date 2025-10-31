# L3-001: Synchronous Communication

**作成日**: 2025-10-31
**所属BC**: BC-007: Team Communication & Collaboration
**V2移行元**: communication-delivery (同期通信部分)

---

## 📋 What: この能力の定義

### 能力の概要
リアルタイムのコミュニケーションを促進する能力。会議管理、即時メッセージング、リアルタイム協調作業を通じて、チームの即応性を高めます。

### 実現できること
- リアルタイムメッセージング
- 会議のスケジューリングと実施
- ビデオ・音声会議の統合
- リアルタイムコラボレーション
- 即座のフィードバック交換

### 必要な知識
- リアルタイム通信技術
- 会議ファシリテーション
- コラボレーションツール
- コミュニケーション理論
- チームコミュニケーション

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: CommunicationAggregate ([../../domain/README.md](../../domain/README.md#communication-aggregate))
- **Entities**: Message, Meeting, ConversationThread, Participant
- **Value Objects**: MessageStatus, MeetingType, ParticipantRole

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/messages - メッセージ送信
  - POST /api/meetings - 会議管理
  - GET /api/communication/realtime - リアルタイム通信

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: messages, meetings, conversation_threads, participants, meeting_attendees

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: コミュニケーションを促進する | リアルタイム対話の実現 | 2-3個 | facilitate-communication |
| **OP-002**: 会議を管理する | 会議のスケジュールと実施 | 2-3個 | manage-meetings |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 2個
- **推定UseCase数**: 4-6個
- **V2からの移行**: 同期通信部分を分離

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/collaboration-facilitation-service/capabilities/communication-delivery/](../../../../services/collaboration-facilitation-service/capabilities/communication-delivery/) (facilitate-communication, manage-meetings部分)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-001 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
