# パラソル設計ファイル編集ページのUI実装（分離型レイアウト）

## 📋 概要

Issue #141で実装したファイル・ディレクトリ構造に続き、各設計ファイル（usecase.md、page.md、api-usage.md）をクリックした際の**分離型フルスクリーン編集画面**を実装する。

## 🎨 採用レイアウト: オプション3（分離型）

### 基本コンセプト
- **モード切替**: 編集・プレビュー・図表モードの明確な分離
- **フルスクリーン**: 各モードで画面を最大活用
- **シンプル**: 一度に1つの作業に集中
- **モバイル対応**: レスポンシブで使いやすい

### レイアウト詳細

```
┌─────────────────────────────────────────────────────────┐
│ [← 戻る] service/capability/operation/usecase           │
│ ファイル: [usecase.md] [page.md] [api-usage.md]        │
├─────────────────────────────────────────────────────────┤
│ モード: [📝 編集] [👁️ プレビュー] [📊 図表] [⚙️ 設定]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              選択モードのフルスクリーン表示                │
│                                                         │
│  📝 編集モード: Monaco Editor (全画面)                   │
│  👁️ プレビューモード: Markdown + 図表レンダリング         │
│  📊 図表モード: Mermaid/Draw.io/Excalidraw             │
│  ⚙️ 設定モード: ファイル設定・エクスポート                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [💾 保存] [📋 コピー] [📤 エクスポート] [🔍 検索] [❓ ヘルプ] │
└─────────────────────────────────────────────────────────┘
```

## 🎯 4つのモード詳細

### 1. 📝 編集モード
```typescript
interface EditMode {
  editor: 'monaco'           // VS Code風エディタ
  features: [
    'syntax-highlight',      // Markdownシンタックス
    'auto-complete',         // 自動補完
    'find-replace',          // 検索・置換
    'line-numbers',          // 行番号
    'minimap',              // コードマップ
    'vim-mode'              // Vimキーバインド（オプション）
  ]
  shortcuts: {
    save: 'Ctrl+S',
    preview: 'Ctrl+P',
    diagram: 'Ctrl+D'
  }
}
```

### 2. 👁️ プレビューモード
```typescript
interface PreviewMode {
  render: 'react-markdown'   // Markdownレンダリング
  features: [
    'mermaid-diagrams',      // Mermaid図表表示
    'table-rendering',       // テーブル表示
    'code-highlight',        // コードハイライト
    'link-navigation',       // リンクナビゲーション
    'print-friendly',        // 印刷対応
    'zoom-control'          // 拡大・縮小
  ]
  export: ['pdf', 'html', 'docx']
}
```

### 3. 📊 図表モード
```typescript
interface DiagramMode {
  tools: [
    'mermaid',              // テキストベース図表
    'drawio',               // 高機能図表エディタ
    'excalidraw',           // 手書き風スケッチ
    'plantuml'              // UML図表
  ]
  templates: [
    'robustness-diagram',    // ロバストネス図
    'sequence-diagram',      // シーケンス図
    'er-diagram',           // ER図
    'flowchart',            // フローチャート
    'wireframe'             // ワイヤーフレーム
  ]
  export: ['svg', 'png', 'pdf', 'json']
}
```

### 4. ⚙️ 設定モード
```typescript
interface SettingsMode {
  sections: [
    'file-properties',       // ファイル属性
    'export-options',        // エクスポート設定
    'editor-preferences',    // エディタ設定
    'diagram-templates',     // 図表テンプレート
    'collaboration'          // 共同編集設定
  ]
}
```

## 🔄 モード切替フロー

```
編集モード ←→ プレビューモード
    ↕              ↕
図表モード ←→ 設定モード
```

### 切替パターン
- **編集 → プレビュー**: `Ctrl+P` または タブクリック
- **編集 → 図表**: `Ctrl+D` または 図表挿入時自動遷移
- **プレビュー → 編集**: 編集ボタンまたは `E` キー
- **設定アクセス**: 全モードから `⚙️` ボタン

## 🛠️ 技術実装仕様

### 1. URL構造
```
/parasol/edit/:serviceId/:capabilityId/:operationId/:usecaseId
?file=:fileType&mode=:mode

例:
/parasol/edit/knowledge-service/knowledge-mgmt/capture/classify-knowledge
?file=usecase&mode=edit
```

### 2. 状態管理
```typescript
interface EditorState {
  currentFile: {
    service: string
    capability: string
    operation: string
    usecase: string
    type: 'usecase' | 'page' | 'api-usage'
  }
  mode: 'edit' | 'preview' | 'diagram' | 'settings'
  content: string
  isDirty: boolean
  lastSaved: Date
}
```

### 3. コンポーネント構造
```
ParasolFileEditor/
├── EditorHeader           # ナビゲーション・タブ
├── ModeSelector          # モード切替ボタン
├── EditorContent/        # メインコンテンツエリア
│   ├── EditMode          # Monaco Editor
│   ├── PreviewMode       # Markdown表示
│   ├── DiagramMode       # 図表エディタ
│   └── SettingsMode      # 設定画面
└── EditorFooter          # 保存・操作ボタン
```

## 📱 レスポンシブ対応

### デスクトップ (1024px以上)
- 全機能フル表示
- キーボードショートカット対応
- 高解像度図表表示

### タブレット (768px-1023px)
- タッチ操作最適化
- モード切替簡略化
- 図表ツール簡素化

### モバイル (768px未満)
- 縦スクロール最適化
- 大きなタッチターゲット
- エッセンシャル機能のみ

## 🚀 実装フェーズ

### Phase 1: 基本編集機能 (3日)
1. ルーティング・URL設計
2. 基本レイアウト・モード切替
3. Monaco Editor統合
4. ファイル読み込み・保存API

### Phase 2: プレビュー機能 (2日)
1. Markdownレンダリング
2. Mermaid図表表示
3. プレビュー・編集切替

### Phase 3: 図表編集機能 (4日)
1. Mermaidエディタ統合
2. Draw.io iframe統合
3. Excalidrawコンポーネント
4. 図表テンプレート

### Phase 4: 設定・エクスポート (2日)
1. ファイル設定画面
2. エクスポート機能
3. 印刷対応

### Phase 5: UX改善 (2日)
1. キーボードショートカット
2. 自動保存機能
3. エラーハンドリング

## ✅ 完了条件

- [ ] 4つのモード（編集・プレビュー・図表・設定）が動作
- [ ] ファイルタブ切り替え（usecase/page/api-usage）
- [ ] モード間のスムーズな切り替え
- [ ] Monaco Editorでの編集機能
- [ ] Markdownプレビュー表示
- [ ] Mermaid図表編集・表示
- [ ] ファイル保存・読み込み
- [ ] レスポンシブ対応完了
- [ ] キーボードショートカット対応
- [ ] エクスポート機能（PDF/HTML）

## 📊 期待効果

### UX向上
- **集中力**: モード分離による作業集中度向上
- **シンプル**: 分かりやすいインターフェース
- **効率**: キーボードショートカットによる高速操作

### 開発効率
- **編集速度**: Monaco Editorによる高速編集
- **プレビュー**: リアルタイム確認
- **図表作成**: 統合された図表編集環境

### モバイル対応
- **使いやすさ**: タッチデバイス最適化
- **パフォーマンス**: モード分離による軽量化
- **可読性**: フルスクリーン表示による視認性向上

---

**優先度**: High
**工数見積もり**: 13日間（5フェーズ）
**レイアウト**: 分離型フルスクリーン
**担当**: パラソル開発チーム