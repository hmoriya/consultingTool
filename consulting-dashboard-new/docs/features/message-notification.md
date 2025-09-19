# メッセージ・通知機能ドキュメント

## 概要

メッセージ・通知機能は、プロジェクトメンバー間のコミュニケーションを円滑にし、重要な情報を確実に伝達するための機能です。リアルタイムメッセージング、システム通知、承認依頼など、様々なコミュニケーションニーズに対応します。

## 主な機能

### 1. メッセージング機能

#### チャンネルベースのコミュニケーション
- プロジェクト別チャンネル
- チーム別チャンネル
- ダイレクトメッセージ
- グループメッセージ

#### メッセージ機能詳細
- テキストメッセージ
- ファイル添付（画像、ドキュメント）
- メンション機能（@ユーザー名）
- メッセージ編集・削除
- 既読管理
- メッセージ検索

### 2. 通知システム

#### 通知タイプ
- **システム通知** - 自動生成される通知
- **承認通知** - 承認が必要なアクション
- **リマインダー** - 期限に関する通知
- **メンション通知** - メッセージでのメンション
- **更新通知** - プロジェクトやタスクの更新

#### 通知チャンネル
- アプリ内通知（ベル通知）
- メール通知
- プッシュ通知（今後実装予定）

### 3. 通知設定

#### ユーザー設定
- 通知タイプ別のON/OFF
- 通知頻度の設定（即時/ダイジェスト）
- 通知時間帯の設定
- チャンネル別の通知設定

## データ構造

### Message テーブル
```typescript
interface Message {
  id: string
  channelId: string
  senderId: string
  content: string
  attachments?: Attachment[]
  mentions?: string[]
  parentId?: string  // スレッド返信用
  editedAt?: Date
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Notification テーブル
```typescript
interface Notification {
  id: string
  userId: string
  type: 'system' | 'approval' | 'reminder' | 'mention' | 'update'
  title: string
  message: string
  actionUrl?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  readAt?: Date
  actionTaken?: boolean
  actionTakenAt?: Date
  expiresAt?: Date
  createdAt: Date
}
```

### Channel テーブル
```typescript
interface Channel {
  id: string
  name: string
  type: 'project' | 'team' | 'direct' | 'group'
  description?: string
  projectId?: string
  members: string[]
  isArchived: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

## 画面構成

### 1. メッセージ画面

#### パス
`/messages`

#### 主な要素
- チャンネルリスト（左サイドバー）
- メッセージエリア（中央）
- チャンネル情報（右サイドバー）
- メッセージ入力欄
- ファイル添付ボタン
- 絵文字リアクション

#### 機能詳細
- リアルタイム更新
- 無限スクロール
- メッセージ検索
- ファイルプレビュー

### 2. 通知センター

#### パス
ヘッダーの通知ベルアイコンから表示

#### 主な要素
- 通知リスト
- フィルター（全て/未読/タイプ別）
- 一括既読ボタン
- 個別アクションボタン

### 3. 通知設定画面

#### パス
`/settings/notifications`

#### 主な要素
- 通知タイプ一覧
- ON/OFFトグル
- 通知頻度設定
- メール通知設定
- 通知時間帯設定

## 通知ロジック

### 自動通知トリガー

#### プロジェクト関連
- プロジェクトへのアサイン
- タスクの割り当て
- 期限間近の通知（3日前、1日前）
- ステータス変更

#### 承認関連
- 承認依頼
- 承認完了
- 却下通知
- 再提出依頼

#### システム関連
- ログイン通知（新しいデバイス）
- パスワード変更
- アカウント設定変更

### 通知優先度

1. **緊急（Urgent）**
   - 即座の対応が必要
   - 赤色で表示
   - メール通知も送信

2. **高（High）**
   - 重要な情報
   - オレンジ色で表示
   - デフォルトでメール送信

3. **中（Medium）**
   - 標準的な通知
   - 青色で表示

4. **低（Low）**
   - 情報共有レベル
   - グレー色で表示

## API エンドポイント

### メッセージ関連
- `GET /api/messages/channels` - チャンネル一覧
- `GET /api/messages/channel/:id` - メッセージ取得
- `POST /api/messages` - メッセージ送信
- `PUT /api/messages/:id` - メッセージ編集
- `DELETE /api/messages/:id` - メッセージ削除
- `POST /api/messages/read` - 既読マーク

### 通知関連
- `GET /api/notifications` - 通知一覧
- `GET /api/notifications/unread` - 未読通知
- `PUT /api/notifications/:id/read` - 既読処理
- `POST /api/notifications/bulk-read` - 一括既読
- `DELETE /api/notifications/:id` - 通知削除

### 設定関連
- `GET /api/notifications/settings` - 通知設定取得
- `PUT /api/notifications/settings` - 通知設定更新

## リアルタイム通信

### WebSocket接続
```typescript
// 接続確立
const socket = new WebSocket('wss://api.example.com/ws')

// チャンネル参加
socket.send(JSON.stringify({
  type: 'join',
  channelId: 'channel123'
}))

// メッセージ受信
socket.on('message', (data) => {
  const message = JSON.parse(data)
  // メッセージ表示処理
})
```

### イベントタイプ
- `message:new` - 新規メッセージ
- `message:edit` - メッセージ編集
- `message:delete` - メッセージ削除
- `notification:new` - 新規通知
- `presence:update` - オンライン状態更新

## セキュリティ

### メッセージ
- チャンネルメンバーのみアクセス可能
- ダイレクトメッセージは当事者のみ
- ファイルアップロードのサイズ制限（10MB）
- ファイルタイプの制限

### 通知
- ユーザー本人の通知のみ取得可能
- 通知URLのアクセス権限チェック
- XSS対策（コンテンツのサニタイズ）

## ベストプラクティス

### メッセージング
- 重要な情報はメンションを使用
- 長文はスレッドで返信
- ファイル名は分かりやすく
- チャンネルの目的を明確に

### 通知管理
- 重要度に応じて通知設定を調整
- 定期的に古い通知を削除
- 承認通知は速やかに対応

## パフォーマンス最適化

### メッセージ
- 最新50件のみ初期表示
- 画像の遅延読み込み
- メッセージのページネーション
- 検索インデックスの最適化

### 通知
- 未読通知の上限設定（100件）
- 古い既読通知の自動削除（30日）
- 通知のバッチ処理

## トラブルシューティング

### メッセージが表示されない
- WebSocket接続を確認
- チャンネルメンバーか確認
- ブラウザの開発者ツールでエラー確認

### 通知が届かない
- 通知設定を確認
- ブラウザの通知許可を確認
- メールアドレスの確認

### リアルタイム更新されない
- ネットワーク接続を確認
- WebSocketの再接続
- ブラウザの更新

## 今後の拡張予定

### 短期（3ヶ月以内）
- モバイルプッシュ通知
- 音声メッセージ
- 画面共有機能
- 通知のスヌーズ機能

### 中期（6ヶ月以内）
- ビデオ通話機能
- AIによる要約機能
- 翻訳機能
- Slack/Teams連携

### 長期（1年以内）
- 音声認識によるメッセージ入力
- AIチャットボット
- 高度な検索（セマンティック検索）
- 外部システム連携強化