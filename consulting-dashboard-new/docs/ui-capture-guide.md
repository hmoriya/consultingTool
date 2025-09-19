# UIキャプチャガイド

## 概要

ヘルプページのユースケースに実際の画面キャプチャを追加し、ユーザーが視覚的に操作を理解できるようにしました。

## キャプチャ構成

### ディレクトリ構造

```
public/captures/
├── executive/          # エグゼクティブ向け
│   ├── exec-portfolio/      # ポートフォリオ管理（5枚）
│   └── exec-financial/      # 財務分析（5枚）
├── pm/                 # PM向け
│   ├── pm-project-mgmt/     # プロジェクト管理（5枚）
│   └── pm-timesheet-approval/ # 工数承認（5枚）
├── consultant/         # コンサルタント向け
│   ├── consultant-task/     # タスク管理（5枚）
│   ├── consultant-timesheet/ # 工数入力（5枚）
│   └── consultant-skill/    # スキル管理（5枚）
├── client/             # クライアント向け
│   ├── client-progress/     # 進捗確認（5枚）
│   └── client-document/     # 成果物管理（5枚）
└── common/             # 共通機能
    ├── common-message/      # メッセージ（5枚）
    └── common-notification/ # 通知（5枚）
```

## キャプチャの更新方法

### 1. 全ロールの一括更新

```bash
# すべてのロールのキャプチャを一括生成
node scripts/capture-all-roles.js
```

### 2. 特定ロールの更新

```bash
# 個別のスクリプトを作成して実行
node scripts/capture-consultant.js
```

### 3. キャプチャスクリプトの構成

```javascript
const captures = [
  {
    role: 'executive',
    email: 'exec@example.com',
    password: 'password123',
    captures: [
      {
        useCase: 'exec-portfolio',
        steps: [
          { nav: '/dashboard/executive', wait: 2000, filename: 'step-1.png', desc: 'ダッシュボード' },
          // ... 他のステップ
        ]
      }
    ]
  }
];
```

## 技術仕様

### キャプチャ設定

- **解像度**: 1280×800px
- **デバイススケール**: 1.5倍（高解像度）
- **フォーマット**: PNG
- **ファイル名規則**: `step-{番号}.png`

### Playwright設定

```javascript
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1.5,
});
```

## トラブルシューティング

### 問題: キャプチャが表示されない

1. ファイルパスを確認
   ```bash
   ls -la public/captures/{カテゴリ}/{ユースケースID}/
   ```

2. ブラウザのコンソールでエラーを確認

3. フォールバックが機能しているか確認（PNG→SVG）

### 問題: キャプチャが古い

1. ブラウザキャッシュをクリア
2. 開発サーバーを再起動
3. スクリプトを再実行

## ベストプラクティス

1. **一貫性の維持**
   - 同じビューポートサイズを使用
   - 待機時間を適切に設定

2. **視認性の向上**
   - 重要な操作の前後でキャプチャ
   - UIが安定してから撮影

3. **メンテナンス**
   - UI変更時は必ずキャプチャを更新
   - CI/CDパイプラインでの自動化を検討

## 今後の拡張

- [ ] 画像への注釈追加機能
- [ ] GIFアニメーションでの操作説明
- [ ] 多言語対応（言語別キャプチャ）
- [ ] AI による画像説明の自動生成