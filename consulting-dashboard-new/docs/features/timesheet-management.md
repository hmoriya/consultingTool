# タイムシート機能ドキュメント

## 概要

タイムシート機能は、コンサルタントの工数管理と承認プロセスを効率化するための中核機能です。日々の作業時間の記録から、プロジェクト別の集計、承認フローまでを一元管理します。

## 主な機能

### 1. 工数入力

#### 機能概要
- 日別・プロジェクト別の工数入力
- タスク単位での詳細な時間記録
- 作業内容の記載
- 一時保存機能

#### データ構造
```typescript
interface TimesheetEntry {
  id: string
  userId: string
  projectId: string
  taskId?: string
  date: Date
  hours: number
  description: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  submittedAt?: Date
  approvedAt?: Date
  approvedBy?: string
  rejectionReason?: string
}
```

### 2. 工数承認

#### 機能概要
- PMによる工数承認フロー
- 一括承認/却下機能
- コメント機能
- 承認履歴の管理

#### 承認フロー
1. **ドラフト** - コンサルタントが入力中
2. **提出済み** - PMの承認待ち
3. **承認済み** - PMが承認完了
4. **却下** - PMが却下（修正要求）

### 3. 工数集計・レポート

#### 集計機能
- プロジェクト別工数集計
- 月次・週次・日次レポート
- チーム/個人別の稼働率分析
- 予実対比分析

#### レポート形式
- CSVエクスポート
- PDFレポート生成
- グラフ表示（稼働率推移、プロジェクト別工数など）

## 画面構成

### 1. 工数入力画面（コンサルタント向け）

#### パス
`/timesheet`

#### 主な要素
- カレンダービュー（月次/週次切り替え）
- 日別工数入力フォーム
- プロジェクト選択ドロップダウン
- タスク選択（オプション）
- 工数入力（0.5時間単位）
- 作業内容テキストエリア
- 提出/一時保存ボタン

### 2. 工数承認画面（PM向け）

#### パス
`/timesheet/approval`

#### 主な要素
- 承認待ちリスト
- フィルター機能（期間、プロジェクト、メンバー）
- 詳細確認モーダル
- 一括承認チェックボックス
- 却下理由入力フォーム

### 3. 工数レポート画面

#### パス
`/timesheet/reports`

#### 主な要素
- 期間選択
- 集計軸選択（プロジェクト/メンバー/タスク）
- グラフ表示エリア
- データテーブル
- エクスポートボタン

## データベース設計

### TimesheetEntry テーブル
```sql
CREATE TABLE TimesheetEntry (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  projectId TEXT NOT NULL,
  taskId TEXT,
  date DATE NOT NULL,
  hours REAL NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  submittedAt TIMESTAMP,
  approvedAt TIMESTAMP,
  approvedBy TEXT,
  rejectionReason TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (projectId) REFERENCES Project(id),
  FOREIGN KEY (taskId) REFERENCES Task(id)
);
```

### TimesheetApproval テーブル
```sql
CREATE TABLE TimesheetApproval (
  id TEXT PRIMARY KEY,
  timesheetId TEXT NOT NULL,
  approverId TEXT NOT NULL,
  status TEXT NOT NULL,
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (timesheetId) REFERENCES TimesheetEntry(id),
  FOREIGN KEY (approverId) REFERENCES User(id)
);
```

## API エンドポイント

### 工数入力関連
- `POST /api/timesheet` - 工数入力
- `PUT /api/timesheet/:id` - 工数更新
- `DELETE /api/timesheet/:id` - 工数削除
- `GET /api/timesheet/user/:userId` - ユーザーの工数一覧
- `GET /api/timesheet/project/:projectId` - プロジェクトの工数一覧

### 承認関連
- `GET /api/timesheet/approval/pending` - 承認待ち一覧
- `POST /api/timesheet/approval/approve` - 承認処理
- `POST /api/timesheet/approval/reject` - 却下処理
- `POST /api/timesheet/approval/bulk` - 一括承認

### レポート関連
- `GET /api/timesheet/reports/summary` - 集計データ取得
- `GET /api/timesheet/reports/export` - データエクスポート

## アクセス権限

### コンサルタント
- 自身の工数入力・編集・削除
- 自身の工数履歴閲覧
- 承認ステータスの確認

### PM
- チームメンバーの工数承認
- プロジェクト工数レポート閲覧
- 工数データのエクスポート

### エグゼクティブ
- 全プロジェクトの工数レポート閲覧
- 稼働率分析
- コスト分析

## 業務フロー

### 日次工数入力フロー
1. コンサルタントが当日の工数を入力
2. 作業内容を記載
3. 一時保存または提出
4. PMへ通知送信

### 週次承認フロー
1. PMが週次で工数を確認
2. 内容を精査
3. 承認または却下
4. 却下の場合は理由を記載
5. コンサルタントへ通知

### 月次締めフロー
1. 月末に全工数の承認確認
2. 未承認分の処理
3. 月次レポート生成
4. 請求データ連携

## 通知機能

### コンサルタント向け
- 工数却下通知
- 未入力リマインド（日次）
- 月次締め前リマインド

### PM向け
- 承認待ち通知
- 週次承認リマインド
- 異常値アラート（1日10時間超など）

## ベストプラクティス

### 工数入力
- 日次で入力する（記憶が新しいうちに）
- 作業内容は具体的に記載
- プロジェクト/タスクは正確に選択

### 承認作業
- 週次で定期的に承認
- 却下時は具体的な理由を記載
- 異常値は個別確認

### データ活用
- 月次でプロジェクト収益性を分析
- 稼働率を基にリソース配分を最適化
- 予実差異を分析し改善

## トラブルシューティング

### よくある問題

#### 工数が入力できない
- プロジェクトアサインを確認
- 日付が正しいか確認
- ブラウザキャッシュをクリア

#### 承認ボタンが表示されない
- PMロールが付与されているか確認
- 該当プロジェクトのPMか確認

#### レポートが表示されない
- 期間選択が正しいか確認
- データが承認済みか確認

## 今後の拡張予定

- モバイルアプリ対応
- 音声入力機能
- AI による異常値検出
- 他システムとの連携強化