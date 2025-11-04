# OP-002: 会議を管理する

**作成日**: 2025-10-31
**所属L3**: L3-001-synchronous-communication: Synchronous Communication
**所属BC**: BC-007: Team Communication & Collaboration
**V2移行元**: services/collaboration-facilitation-service/capabilities/communication-delivery/operations/manage-meetings

---

## 📋 How: この操作の定義

### 操作の概要
会議を管理するを実行し、ビジネス価値を創出する。

### 実現する機能
- 会議を管理するに必要な情報の入力と検証
- 会議を管理するプロセスの実行と進捗管理
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
| organizerId | UUID | Yes | - | UUID形式、BC-003 User参照 | 主催者ID |
| meetingTitle | STRING_200 | Yes | - | 1-200文字 | 会議タイトル |
| meetingType | STRING_20 | Yes | - | scheduled/recurring/instant | 会議タイプ |
| startTime | DateTime | Yes | - | ISO8601形式、現在時刻以降 | 開始時刻 |
| duration | INTEGER | Yes | - | 15-480分 | 所要時間（分） |
| participantIds | Array<UUID> | Yes | - | UUID配列、1-100件 | 参加者ID配列 |
| location | STRING_100 | No | "Online" | 1-500文字 | 開催場所 |
| onlineMeetingUrl | STRING_100 | No | null | URL形式 | オンライン会議URL |
| agenda | TEXT | No | "" | 最大5000文字 | 議題 |
| recurrenceRule | Object | No | null | RRULE形式（recurring時必須） | 繰り返しルール |
| ├─ frequency | STRING_20 | Yes | - | daily/weekly/monthly | 繰り返し頻度 |
| ├─ interval | INTEGER | No | 1 | 1-99 | 間隔 |
| ├─ endDate | DATE | No | null | YYYY-MM-DD形式 | 終了日 |
| └─ occurrences | INTEGER | No | null | 1-365 | 繰り返し回数 |
| reminders | Array | No | [15] | 分単位、最大5件 | リマインダー時刻配列 |
| webrtcConfig | Object | No | null | WebRTC設定 | WebRTC設定 |

### バリデーションルール
1. **organizerId**: BC-003のUserエンティティが存在、Active状態
2. **startTime**: 現在時刻以降、2年以内
3. **duration**: 15分以上、8時間以内
4. **participantIds**: 重複なし、全員BC-003のUser
5. **meetingType=recurring**: recurrenceRule必須
6. **recurrenceRule.endDate**: startTimeより後、2年以内
7. **ダブルブッキング**: 参加者全員の時間が空いているか確認

## 📤 出力仕様

### 成功レスポンス
**HTTP 201 Created**
```json
{
  "meetingId": "uuid",
  "organizerId": "uuid",
  "meetingTitle": "プロジェクト進捗会議",
  "meetingType": "scheduled",
  "status": "scheduled",
  "startTime": "2025-11-04T14:00:00Z",
  "endTime": "2025-11-04T15:00:00Z",
  "duration": 60,
  "participantIds": ["uuid1", "uuid2", "uuid3"],
  "participantStatus": {
    "uuid1": "accepted",
    "uuid2": "pending",
    "uuid3": "pending"
  },
  "location": "会議室A / Online",
  "onlineMeetingUrl": "https://meet.example.com/mtg-uuid",
  "webrtcRoomId": "uuid",
  "remindersSent": false,
  "createdAt": "2025-11-04T10:00:00Z"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC007_L3001_OP002_001**: organizerIdが不正（UUID形式エラー）
- **ERR_BC007_L3001_OP002_002**: startTimeが過去または2年超
- **ERR_BC007_L3001_OP002_003**: duration範囲外（15-480分）
- **ERR_BC007_L3001_OP002_004**: participantIds件数エラー（1-100件）
- **ERR_BC007_L3001_OP002_005**: recurring時にrecurrenceRule未指定
- **ERR_BC007_L3001_OP002_006**: ダブルブッキング検出

#### HTTP 404 Not Found
- **ERR_BC007_L3001_OP002_404_01**: 主催者が存在しません
- **ERR_BC007_L3001_OP002_404_02**: 参加者が存在しません

#### HTTP 409 Conflict
- **ERR_BC007_L3001_OP002_409**: 参加者の時間が重複しています

#### HTTP 500 Internal Server Error
- **ERR_BC007_L3001_OP002_500**: 会議作成中にシステムエラー（ログ参照）

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Meeting Aggregate**: 会議ライフサイクル管理
  - 参照: [../../../../domain/README.md#meeting-aggregate](../../../../domain/README.md#meeting-aggregate)
  - 集約ルート: Meeting
  - 包含エンティティ: MeetingParticipant, MeetingAgenda, MeetingMinutes

#### ドメインメソッド
```typescript
// 会議作成
const meeting = Meeting.schedule({
  organizerId,
  meetingTitle,
  startTime,
  duration,
  participantIds
});

// 参加者追加
meeting.addParticipant(userId, 'required');

// リマインダー設定
meeting.setReminders([15, 60, 1440]);

// WebRTC room作成
const webrtcRoom = await meeting.createWebRTCRoom();
```

#### ドメインサービス
- **MeetingSchedulingService.checkAvailability()**: 空き時間確認、ダブルブッキング検出
- **MeetingSchedulingService.findOptimalTime()**: 最適時間提案
- **MeetingNotificationService.sendInvitations()**: 招待メール送信
- **MeetingNotificationService.sendReminders()**: リマインダー送信（スケジュール）
- **WebRTCService.createRoom()**: WebRTC room作成

### WebRTC統合
- **プロバイダー**: Jitsi/Zoom/Teams
- **認証**: JWT、参加者検証
- **品質**: HD video、画面共有、録画

### トランザクション境界
- **開始**: 会議作成リクエスト受信時
- **コミット**: Meeting作成 + Participant作成 + WebRTCroom作成 + 招待メール送信キューイング完了時
- **ロールバック**: バリデーションエラー、ダブルブッキング検出時

### 副作用
- **ドメインイベント発行**:
  - `MeetingScheduled` - 全参加者に通知
  - `MeetingReminderScheduled` - リマインダースケジューリング
- **通知**:
  - 招待メール: 全参加者（即座）
  - リマインダー: 設定時刻に自動送信
- **外部システム連携**:
  - WebRTC: Room作成、URL生成
  - カレンダー: iCal形式イベント生成
  - BC-007 Notification: 招待・リマインダー通知

### BC間連携
- **BC-003依存**: Userエンティティ参照、カレンダーアクセス権限
- **BC-001参照**: プロジェクト会議（プロジェクトコンテキスト付加）
- **BC-007 Notification**: 招待・リマインダー・変更通知

### 実装手順
1. 主催者存在・権限確認（BC-003）
2. 参加者存在確認（participantIds）
3. ダブルブッキングチェック（全参加者）
4. Meeting Aggregate作成
5. トランザクション開始
6. Meeting保存
7. MeetingParticipant作成（全参加者）
8. WebRTC room作成（onlineMeeting時）
9. リマインダースケジューリング（非同期ジョブ登録）
10. MeetingScheduledイベント発行
11. トランザクションコミット
12. 招待メール送信（BC-007 Notification経由）
13. カレンダーイベント配信

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 |
|--------|---------------|------|-------------|
| ERR_BC007_L3001_OP002_001 | 400 | organizerId形式エラー | No |
| ERR_BC007_L3001_OP002_002 | 400 | startTime範囲外 | No |
| ERR_BC007_L3001_OP002_003 | 400 | duration範囲外 | No |
| ERR_BC007_L3001_OP002_004 | 400 | participantIds件数エラー | No |
| ERR_BC007_L3001_OP002_005 | 400 | recurrenceRule未指定 | No |
| ERR_BC007_L3001_OP002_006 | 400 | ダブルブッキング検出 | No |
| ERR_BC007_L3001_OP002_404_01 | 404 | 主催者不存在 | No |
| ERR_BC007_L3001_OP002_404_02 | 404 | 参加者不存在 | No |
| ERR_BC007_L3001_OP002_409 | 409 | 時間重複 | No |
| ERR_BC007_L3001_OP002_500 | 500 | システムエラー | Yes |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC007_L3001_OP002_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (2s, 4s, 8s)
- **リトライ不可エラー**: バリデーションエラー（400系）、競合エラー（409）

### リマインダー配信保証
1. リマインダー送信失敗時は3回リトライ
2. リトライ後も失敗した場合はアラート
3. 送信ログはDB記録（監査用）

### ログ記録要件
- **INFO**: 会議作成成功（meetingId, organizerId, 参加者数、WebRTC room ID記録）
- **WARN**: ダブルブッキング検出、大規模会議（50人超）、長時間会議（4時間超）
- **ERROR**: システムエラー（スタックトレース、入力パラメータ全量記録）
- **監査ログ**: 全会議作成（成功/失敗問わず）をAuditLogに記録（BC-003経由）

### パフォーマンス監視
- **ダブルブッキングチェック**: < 200ms
- **WebRTC room作成**: < 1秒
- **招待メール配信**: < 5秒

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
> - [services/collaboration-facilitation-service/capabilities/communication-delivery/operations/manage-meetings/](../../../../../../services/collaboration-facilitation-service/capabilities/communication-delivery/operations/manage-meetings/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
