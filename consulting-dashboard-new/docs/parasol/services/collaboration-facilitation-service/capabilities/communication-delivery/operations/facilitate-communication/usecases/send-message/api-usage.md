# API利用仕様: メッセージを送信する (HOW: 具体的利用方法)

<!--
🎯 このファイルはIssue #146 API仕様WHAT/HOW分離統一化の一環で作成されました
📋 「HOW（どう使うか）」を定義します
👥 対象読者: 実装エンジニア
🔗 配置場所: usecases/send-message/api-usage.md

💡 「WHAT（何ができるか）」は以下で定義:
📄 サービス仕様: services/collaboration-facilitation-service/api/api-specification.md
👥 対象読者: API設計者・サービス連携者
🛠️ テンプレート: templates/dx-api-specification.md
-->

## 利用するAPI一覧

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| メッセージ作成API | POST /api/communications/messages | メッセージ内容の作成・保存 | `content`, `recipients`, `priority`, `channelType` |
| メッセージ配信API | POST /api/communications/send | 作成されたメッセージの配信実行 | `messageId`, `deliveryOptions`, `immediateDelivery` |
| 配信状況確認API | GET /api/communications/delivery-status/{messageId} | メッセージ配信状況の確認 | `messageId`, `includeDetails` |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | ユースケース開始時 | 認証トークン取得・送信権限確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | メッセージ送信前 | メッセージ送信権限の確認 |
| secure-access-service | UC-AUTH-03: アクセスログを記録する | ユースケース完了時 | メッセージ送信操作の監査ログ記録 |

## API呼び出しシーケンス

### 基本フロー: メッセージ送信シナリオ

1. **事前認証・権限確認**:
   - `POST /api/auth/usecases/authenticate` (secure-access-service UC-AUTH-01)
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - ユーザー認証とメッセージ送信権限の確認

2. **メッセージ内容作成**:
   - `POST /api/communications/messages` (自サービス)
   - メッセージ内容、受信者リスト、優先度を設定してメッセージエンティティを作成

3. **受信者権限確認**:
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - 各受信者がメッセージを受信する権限があることを確認

4. **メッセージ配信実行**:
   - `POST /api/communications/send` (自サービス)
   - 作成されたメッセージの配信を実行

5. **配信状況確認**:
   - `GET /api/communications/delivery-status/{messageId}` (自サービス)
   - メッセージ配信の成功・失敗状況を確認

6. **監査ログ記録**:
   - `POST /api/auth/usecases/log-access` (secure-access-service UC-AUTH-03)
   - メッセージ送信実行の監査記録

### 代替フロー: 大容量メッセージ送信

1. **大容量ファイル条件**: 添付ファイルが10MB以上の場合
2. **段階的配信処理**: バックグラウンドでの非同期配信
3. **復帰処理**: 基本フロー5（配信状況確認）に戻る

### WebSocketリアルタイム更新

1. **配信進捗更新**: `wss://api.../ws/communications/delivery-progress/{messageId}`
2. **受信確認更新**: `wss://api.../ws/communications/read-receipts/{messageId}`
3. **エラー通知**: `wss://api.../ws/communications/delivery-errors/{messageId}`

## エラーハンドリング

### 認証・権限エラー
- **AUTH_FAILED**: 認証失敗時のトークン再取得処理
- **PERMISSION_DENIED**: 送信権限不足時のエラー表示
- **RECIPIENT_ACCESS_DENIED**: 受信者権限不足時の該当者除外処理

### 配信エラー
- **NETWORK_ERROR**: ネットワーク障害時の配信リトライ
- **RECIPIENT_NOT_FOUND**: 受信者不明時の該当者除外
- **MESSAGE_TOO_LARGE**: メッセージサイズ超過時の分割送信

### システムエラー
- **SERVICE_UNAVAILABLE**: サービス停止時のフォールバック処理
- **RATE_LIMIT_EXCEEDED**: レート制限時の遅延送信

### リトライ・復旧戦略
- **ネットワークエラー**: 3回まで自動リトライ（指数バックオフ）
- **一時的サービス障害**: キューイングでの遅延送信
- **配信失敗**: 代替チャネルでの再送信

## パフォーマンス最適化

### 配信最適化
- **バッチ処理**: 複数受信者への一括配信
- **優先度制御**: 緊急メッセージの優先配信
- **キャッシュ活用**: 受信者情報のメモリキャッシュ

### ネットワーク最適化
- **接続プール**: HTTP接続の再利用
- **圧縮**: メッセージ内容のgzip圧縮
- **CDN活用**: 添付ファイルのCDN配信

### リソース最適化
- **非同期処理**: 大量配信の非同期実行
- **メモリ管理**: 配信完了後のリソース解放

## 品質保証

### 配信品質
- **配信成功率**: 99.5%以上 - 正常時の配信成功率
- **配信遅延**: 95%ile < 3秒 - 通常メッセージの配信時間
- **エラー率**: 0.5%以下 - システムエラーによる配信失敗率

### パフォーマンス品質
- **レスポンス時間**: 95%ile < 2秒 - API応答時間
- **スループット**: 1000msg/分以上 - 配信処理能力

### レスポンス時間目標
- **メッセージ作成API**: 95%ile < 1秒、99%ile < 2秒
- **メッセージ配信API**: 95%ile < 3秒、99%ile < 5秒
- **配信状況確認API**: 95%ile < 0.5秒、99%ile < 1秒
- **権限確認API**: 95%ile < 0.3秒、99%ile < 0.5秒
- **認証API**: 95%ile < 0.5秒、99%ile < 1秒