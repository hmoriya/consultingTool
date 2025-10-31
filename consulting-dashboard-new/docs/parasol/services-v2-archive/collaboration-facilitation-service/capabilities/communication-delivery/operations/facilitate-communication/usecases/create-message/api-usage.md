# API利用仕様: メッセージを作成する (HOW: 具体的利用方法)

<!--
🎯 このファイルはIssue #146 API仕様WHAT/HOW分離統一化の一環で作成されました
📋 「HOW（どう使うか）」を定義します
👥 対象読者: 実装エンジニア
🔗 配置場所: usecases/create-message/api-usage.md

💡 「WHAT（何ができるか）」は以下で定義:
📄 サービス仕様: services/collaboration-facilitation-service/api/api-specification.md
👥 対象読者: API設計者・サービス連携者
🛠️ テンプレート: templates/dx-api-specification.md
-->

## 利用するAPI一覧

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
| メッセージドラフト作成API | POST /api/communications/drafts | メッセージドラフトの作成・保存 | `title`, `content`, `recipientIds`, `priority`, `channelType` |
| ドラフト更新API | PUT /api/communications/drafts/{id} | ドラフト内容の更新 | `title`, `content`, `recipientIds`, `priority` |
| ドラフト削除API | DELETE /api/communications/drafts/{id} | 不要ドラフトの削除 | `id` |
| ドラフト一覧取得API | GET /api/communications/drafts | 作成者のドラフト一覧 | `status`, `limit`, `offset` |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | ユースケース開始時 | 認証トークン取得・作成権限確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | ドラフト保存前 | メッセージ作成権限の確認 |
| secure-access-service | UC-AUTH-03: アクセスログを記録する | 操作完了時 | メッセージドラフト操作の監査ログ記録 |

## API呼び出しシーケンス

### 基本フロー: メッセージドラフト作成シナリオ

1. **事前認証・権限確認**:
   - `POST /api/auth/usecases/authenticate` (secure-access-service UC-AUTH-01)
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - ユーザー認証とメッセージ作成権限の確認

2. **ドラフト初期作成**:
   - `POST /api/communications/drafts` (自サービス)
   - 基本的なメッセージ情報でドラフトエンティティを作成（status: draft）

3. **受信者権限事前確認**:
   - `POST /api/auth/usecases/validate-permission` (secure-access-service UC-AUTH-02)
   - 選択した受信者への送信権限があることを確認

4. **ドラフト内容更新**:
   - `PUT /api/communications/drafts/{id}` (自サービス)
   - ドラフト内容の詳細設定・更新

5. **自動保存・版管理**:
   - `PUT /api/communications/drafts/{id}` (自サービス)
   - 定期的な自動保存とバージョン管理

6. **監査ログ記録**:
   - `POST /api/auth/usecases/log-access` (secure-access-service UC-AUTH-03)
   - ドラフト作成・更新操作の監査記録

### 代替フロー: 既存ドラフト編集

1. **ドラフト読み込み**: 既存ドラフトの編集モード開始
2. **リアルタイム更新**: 複数編集者対応の排他制御
3. **復帰処理**: 基本フロー4（ドラフト内容更新）に戻る

### 自動保存機能

1. **定期保存**: 30秒間隔での自動保存
2. **フォーカス離脱保存**: フィールド離脱時の保存
3. **緊急保存**: ブラウザ閉鎖前の保存

## エラーハンドリング

### 認証・権限エラー
- **AUTH_FAILED**: 認証失敗時のトークン再取得処理
- **PERMISSION_DENIED**: 作成権限不足時のエラー表示
- **RECIPIENT_ACCESS_DENIED**: 受信者選択権限不足時の該当者除外処理

### ドラフト操作エラー
- **DRAFT_SAVE_FAILED**: 保存失敗時の自動リトライ
- **VALIDATION_ERROR**: 入力内容検証エラー時の詳細エラー表示
- **CONFLICT_ERROR**: 複数編集時の競合解決

### システムエラー
- **SERVICE_UNAVAILABLE**: サービス停止時のローカル保存
- **NETWORK_ERROR**: ネットワーク障害時のオフライン編集モード

### リトライ・復旧戦略
- **保存エラー**: 3回まで自動リトライ（指数バックオフ）
- **ネットワーク障害**: ローカルストレージでの一時保存
- **競合解決**: マージ機能での競合解決支援

## パフォーマンス最適化

### 編集最適化
- **差分保存**: 変更部分のみの保存
- **バッチ保存**: 複数変更の一括保存
- **キャッシュ活用**: ドラフト履歴のメモリキャッシュ

### UI最適化
- **非同期保存**: UIブロックしない保存処理
- **プログレッシブロード**: 大量ドラフトの段階的読み込み
- **プリロード**: よく使用するテンプレートの事前読み込み

### ストレージ最適化
- **定期クリーンアップ**: 古いドラフトの自動削除
- **圧縮保存**: ドラフト内容の圧縮保存

## 品質保証

### ドラフト管理品質
- **保存成功率**: 99.8%以上 - 正常時のドラフト保存成功率
- **復旧成功率**: 95%以上 - 障害時のドラフト復旧成功率
- **データ整合性**: 100% - ドラフト⇔最終送信の内容整合性

### パフォーマンス品質
- **保存レスポンス時間**: 95%ile < 1秒 - ドラフト保存時間
- **読み込み時間**: 95%ile < 2秒 - ドラフト一覧読み込み時間

### レスポンス時間目標
- **ドラフト作成API**: 95%ile < 0.8秒、99%ile < 1.5秒
- **ドラフト更新API**: 95%ile < 0.5秒、99%ile < 1秒
- **ドラフト一覧API**: 95%ile < 1秒、99%ile < 2秒
- **権限確認API**: 95%ile < 0.3秒、99%ile < 0.5秒
- **認証API**: 95%ile < 0.5秒、99%ile < 1秒