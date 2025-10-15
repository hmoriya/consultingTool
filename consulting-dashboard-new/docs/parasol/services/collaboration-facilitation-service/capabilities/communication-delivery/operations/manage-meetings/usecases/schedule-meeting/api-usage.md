# API利用仕様: 会議をスケジュールする (HOW: 具体的利用方法)

<!--
🎯 このファイルはIssue #146 API仕様WHAT/HOW分離統一化の一環で作成されました
📋 「HOW（どう使うか）」を定義します
👥 対象読者: 実装エンジニア
🔗 配置場所: usecases/schedule-meeting/api-usage.md

💡 「WHAT（何ができるか）」は以下で定義:
📄 サービス仕様: services/collaboration-facilitation-service/api/api-specification.md
👥 対象読者: API設計者・サービス連携者
🛠️ テンプレート: templates/dx-api-specification.md
-->

## 利用するAPI一覧

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| 会議作成API | POST /api/meetings | 会議基本情報の作成・保存 | `title`, `description`, `startTime`, `endTime`, `location` |
| 参加者招待API | POST /api/meetings/{meetingId}/invitations | 会議参加者への招待送信 | `meetingId`, `participantIds`, `message`, `responseRequired` |
| 会議室予約API | POST /api/meetings/{meetingId}/room-booking | 会議室の予約・確保 | `meetingId`, `roomId`, `equipment`, `catering` |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | ユースケース開始時 | 認証トークン取得・会議作成権限確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | 会議作成前 | 会議作成・会議室予約権限の確認 |
| talent-optimization-service | UC-TALENT-02: メンバー情報を取得する | 参加者選択時 | 参加可能メンバーの一覧と空き状況 |
| project-success-service | UC-PROJECT-05: プロジェクト関係者を取得する | プロジェクト会議時 | プロジェクト関連参加者の特定 |
| secure-access-service | UC-AUTH-03: アクセスログを記録する | ユースケース完了時 | 会議スケジュール操作の監査ログ記録 |

## API呼び出しシーケンス

### 基本フロー: 会議スケジュール作成シナリオ

1. **事前認証・権限確認**:
   - `POST /api/auth/usecases/authenticate` (secure-access-service UC-AUTH-01)
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - ユーザー認証と会議作成権限の確認

2. **参加者候補取得**:
   - `POST /api/talent/usecases/get-member-info` (talent-optimization-service UC-TALENT-02)
   - `POST /api/projects/usecases/get-project-stakeholders` (project-success-service UC-PROJECT-05)
   - 参加可能メンバーとプロジェクト関係者の情報取得

3. **会議基本情報作成**:
   - `POST /api/meetings` (自サービス)
   - 会議タイトル、説明、開始・終了時間、場所を設定して会議エンティティを作成

4. **会議室予約**:
   - `POST /api/meetings/{meetingId}/room-booking` (自サービス)
   - 必要な設備・ケータリングを含む会議室の予約実行

5. **参加者招待送信**:
   - `POST /api/meetings/{meetingId}/invitations` (自サービス)
   - 選択された参加者への招待メール・通知の一括送信

6. **参加者権限確認**:
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - 各参加者の会議参加権限確認

7. **監査ログ記録**:
   - `POST /api/auth/usecases/log-access` (secure-access-service UC-AUTH-03)
   - 会議スケジュール作成実行の監査記録

### 代替フロー: 緊急会議スケジュール

1. **緊急会議条件**: 開始時間が2時間以内の場合
2. **即時処理**: 会議室空き状況の即座確認と自動予約
3. **復帰処理**: 基本フロー5（参加者招待）に戻る

### WebSocketリアルタイム更新

1. **参加者応答状況**: `wss://api.../ws/meetings/responses/{meetingId}`
2. **会議室空き状況**: `wss://api.../ws/meetings/room-availability/{roomId}`
3. **スケジュール競合**: `wss://api.../ws/meetings/conflicts/{participantId}`

## エラーハンドリング

### 認証・権限エラー
- **AUTH_FAILED**: 認証失敗時のトークン再取得処理
- **PERMISSION_DENIED**: 会議作成権限不足時のエラー表示
- **ROOM_BOOKING_DENIED**: 会議室予約権限不足時の代替会議室提案

### スケジュール・リソースエラー
- **ROOM_NOT_AVAILABLE**: 会議室予約済み時の代替会議室提案
- **PARTICIPANT_CONFLICT**: 参加者スケジュール競合時の時間調整提案
- **TIME_SLOT_INVALID**: 無効な時間設定時の修正提案

### システムエラー
- **SERVICE_UNAVAILABLE**: 外部サービス停止時のオフライン機能
- **INVITATION_SEND_FAILED**: 招待送信失敗時のリトライ機能

### リトライ・復旧戦略
- **ネットワークエラー**: 3回まで自動リトライ（指数バックオフ）
- **会議室予約失敗**: 類似条件の代替会議室自動検索
- **招待送信失敗**: 個別参加者への再送信処理

## パフォーマンス最適化

### スケジュール最適化
- **空き時間検索**: 参加者スケジュールの並列検索
- **会議室推奨**: AIによる最適会議室提案
- **時間候補生成**: 参加者全員の空き時間自動検出

### 通知最適化
- **バッチ招待**: 複数参加者への一括招待送信
- **優先度制御**: 緊急会議の優先通知
- **配信チャネル**: 参加者設定に応じた最適チャネル選択

### リソース最適化
- **キャッシュ活用**: 会議室・参加者情報のメモリキャッシュ
- **非同期処理**: 大人数招待の非同期実行

## 品質保証

### 会議作成品質
- **作成成功率**: 99.5%以上 - 正常時の会議作成成功率
- **会議室予約成功率**: 98%以上 - 希望会議室の予約成功率
- **招待送信成功率**: 99.9%以上 - 参加者への招待送信成功率

### 応答・通知品質
- **招待応答率**: 85%以上 - 参加者からの応答取得率
- **通知到達率**: 99.5%以上 - 招待通知の到達率

### レスポンス時間目標
- **会議作成API**: 95%ile < 2秒、99%ile < 4秒
- **参加者情報取得API**: 95%ile < 1秒、99%ile < 2秒
- **会議室予約API**: 95%ile < 3秒、99%ile < 5秒
- **招待送信API**: 95%ile < 5秒、99%ile < 8秒
- **権限確認API**: 95%ile < 0.3秒、99%ile < 0.5秒