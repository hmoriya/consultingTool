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

## 🛠️ 実装アプローチ

### アーキテクチャパターン
- **リアルタイムメッセージング**: WebSocket による双方向通信
- **ビデオ・音声会議**: WebRTC による P2P/SFU 接続
- **プレゼンス管理**: Redis Pub/Sub によるオンライン状態同期
- **会議スケジューリング**: カレンダー統合（iCal/CalDAV）

### 主要技術スタック
- **WebSocket サーバー**: Socket.io / WS
  - リアルタイムメッセージング
  - タイピング通知・既読状態同期
  - プレゼンス（オンライン/オフライン）配信
  - 自動再接続・ハートビート
- **WebRTC インフラ**: Janus / Mediasoup / Twilio
  - ビデオ・音声通話（1対1、グループ）
  - 画面共有
  - SFU（Selective Forwarding Unit）による多人数会議
  - TURN/STUN サーバー（NAT traversal）
- **メッセージキュー**: Redis Pub/Sub / RabbitMQ
  - メッセージ配信保証
  - スケールアウト対応（複数WebSocketサーバー間同期）
  - メッセージ永続化（RabbitMQ Durable Queue）
- **リアルタイムDB**: Redis / Firestore
  - プレゼンス情報管理
  - 未読カウント同期
  - タイピングインジケーター
- **会議管理**: カレンダーAPI統合
  - Google Calendar API
  - Microsoft Graph API (Outlook)
  - CalDAV プロトコル対応

### 実装パターン

#### WebSocket メッセージング
```typescript
// サーバー側: Socket.io
io.on('connection', (socket) => {
  // 認証・プレゼンス登録
  socket.on('authenticate', async (token) => {
    const user = await authenticateToken(token)
    socket.userId = user.id
    await updatePresence(user.id, 'online')
  })

  // メッセージ送信
  socket.on('send_message', async (data) => {
    const message = await createMessage(data)
    // 受信者へリアルタイム配信
    io.to(data.recipientId).emit('new_message', message)
    // DB永続化
    await saveMessage(message)
  })

  // 切断時プレゼンス更新
  socket.on('disconnect', async () => {
    await updatePresence(socket.userId, 'offline')
  })
})
```

#### WebRTC ビデオ会議
```typescript
// クライアント側: WebRTC接続
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:turn.example.com', credential: '...' }
  ]
})

// ローカルストリーム取得
const localStream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
})

localStream.getTracks().forEach(track => {
  peerConnection.addTrack(track, localStream)
})

// シグナリング（Socket.io経由）
socket.on('offer', async (offer) => {
  await peerConnection.setRemoteDescription(offer)
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
  socket.emit('answer', answer)
})
```

#### 会議スケジューリング統合
```typescript
// Google Calendar API 統合
async function scheduleMeeting(meeting) {
  const event = {
    summary: meeting.title,
    description: meeting.agenda,
    start: { dateTime: meeting.startTime },
    end: { dateTime: meeting.endTime },
    attendees: meeting.participants.map(p => ({ email: p.email })),
    conferenceData: {
      createRequest: {
        requestId: uuid(),
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  }

  const result = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1
  })

  return result.data.hangoutLink // ビデオ会議URL
}
```

### パフォーマンス最適化
- **WebSocket スケーリング**:
  - 水平スケーリング: 複数WebSocketサーバー（ロードバランサー + Sticky Session）
  - Redis Pub/Sub による サーバー間メッセージ同期
  - 接続数上限: 10,000接続/サーバー
- **WebRTC 最適化**:
  - SFU使用: 帯域幅削減（N-1接続 → 1接続）
  - VP9/H.264コーデック選択
  - Simulcast: 複数ビットレート配信
- **レイテンシ削減**:
  - CDN: 地理的分散配置
  - HTTP/2: 多重化による高速化
  - gRPC: 低レイテンシ通信

---

## ⚠️ 前提条件と制約

### 技術的前提条件
- **インフラ要件**:
  - WebSocket サーバー（Node.js: 2GB RAM/サーバー）
  - Redis クラスタ（プレゼンス・Pub/Sub用）
  - TURN/STUN サーバー（WebRTC NAT traversal）
  - メディアサーバー（SFU: Janus/Mediasoup）
- **ネットワーク要件**:
  - WebSocket: ポート443（WSS over TLS）
  - WebRTC: UDP 10000-20000（メディアストリーム）
  - TURN: TCP/UDP 3478（フォールバック）
- **クライアント要件**:
  - モダンブラウザ（Chrome 90+, Firefox 88+, Safari 14+）
  - WebRTC サポート必須
  - カメラ・マイク権限

### ビジネス制約
- **メッセージング**:
  - 配信保証: At-least-once delivery
  - 配信遅延: < 100ms（95パーセンタイル）
  - 同時接続数: 最大10,000ユーザー/サーバー
- **ビデオ会議**:
  - 1対1通話: 最大1080p、30fps
  - グループ通話: 最大30人、720p
  - 画面共有: 最大4K、15fps
  - 会議時間: 最大8時間（無制限プラン）
- **プレゼンス**:
  - 更新頻度: 30秒毎のハートビート
  - オフライン判定: 60秒無応答
  - プレゼンス状態: online, away, busy, offline

### データ制約
- **メッセージ**: 最大10,000文字
- **添付ファイル**: 最大10MB/ファイル、5ファイル/メッセージ
- **メッセージ履歴**: 90日間保持（有料プランは無制限）
- **ビデオ録画**: 最大4時間、H.264/AAC形式

### 運用制約
- **可用性**: 99.95%（年間ダウンタイム < 4.38時間）
- **メンテナンス**: 月次メンテナンス（日本時間 午前3-5時）
- **セキュリティ**: E2E暗号化（オプション）、TLS 1.3必須
- **監視**: リアルタイム接続数、メッセージ配信レート、WebRTC品質指標

---

## 🔗 BC設計との統合

### ドメインモデル統合
- **Aggregate Root**: `CommunicationAggregate`
  - 集約エンティティ: Message, Meeting, ConversationThread, Participant
  - 不変条件: メッセージ順序性、会議参加者最大数、プレゼンス整合性
  - ビジネスルール: メッセージ配信ポリシー、会議スケジューリングルール

### BC間連携

#### 全BC共通（BC-007は通信インフラを全BCに提供）
- **リアルタイム通知基盤**:
  - 各BCのイベント発生時にWebSocket経由で即座通知
  - 例: BC-001 `TaskAssignedEvent` → リアルタイムプッシュ通知
- **コラボレーション促進**:
  - プロジェクトチャネル（BC-001）
  - ナレッジ共有ディスカッション（BC-006）
  - チーム連絡チャネル（BC-005）

#### BC-001 (Project Delivery) との連携
- **プロジェクトチャネル自動作成**:
  - イベント: `ProjectCreatedEvent`
  - アクション: プロジェクト専用チャネル・会議室自動生成
  - API: `POST /api/communication/channels/for-project/{projectId}`

#### BC-005 (Team & Resource) との連携
- **チームメンバー情報参照**:
  - イベント: `TeamMemberAddedEvent`
  - アクション: チームチャネルにメンバー自動追加
  - API: `POST /api/communication/channels/{channelId}/members`

#### BC-006 (Knowledge Management) との連携
- **ナレッジディスカッション**:
  - イベント: `KnowledgeArticlePublishedEvent`
  - アクション: 関連カテゴリチャネルで議論促進
  - API: `POST /api/communication/messages/to-channel/{channelId}`

### API設計統合
- **メッセージングAPI**: `POST /api/messages`, `GET /api/messages/thread/{threadId}`
- **会議API**: `POST /api/meetings`, `GET /api/meetings/schedule`
- **プレゼンスAPI**: `GET /api/presence/user/{userId}`, `PUT /api/presence/status`
- **WebSocket API**: `wss://api.example.com/ws` (Socket.io)
- **詳細**: [../../api/README.md](../../api/README.md)

### データ層統合
- **テーブル設計**:
  - `messages`: メッセージ本体
  - `meetings`: 会議情報
  - `conversation_threads`: スレッド管理
  - `participants`: 参加者情報
  - `meeting_attendees`: 会議出席者
  - `presence_states`: プレゼンス状態（Redis）
- **詳細**: [../../data/README.md](../../data/README.md)

### イベント駆動統合
- **発行イベント**:
  - `MessageSentEvent`: メッセージ送信時
  - `MeetingScheduledEvent`: 会議スケジュール時
  - `MeetingStartedEvent`: 会議開始時
  - `UserPresenceChangedEvent`: プレゼンス変更時
- **購読イベント**:
  - BC-001 `ProjectCreatedEvent`, `TaskAssignedEvent`
  - BC-005 `TeamMemberAddedEvent`, `TeamCreatedEvent`
  - BC-006 `KnowledgeArticlePublishedEvent`

### リアルタイム技術スタック統合
- **WebSocket プロトコル**: Socket.io v4（自動再接続、Room管理）
- **メッセージフォーマット**: JSON（軽量）、MessagePack（バイナリ高速化）
- **認証**: JWT トークン（WebSocket handshake時検証）
- **スケーリング**: Redis Adapter（複数サーバー間同期）

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
