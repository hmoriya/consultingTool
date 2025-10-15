# パラソル設計ファイル編集ページのUI実装（フルスクリーン・統合型切り替え）

## 📋 概要

Issue #141で実装したファイル・ディレクトリ構造に続き、各設計ファイル（usecase.md、page.md、api-usage.md）をクリックした際の**フルスクリーンモードと通常モードを切り替え可能な統合編集画面**を実装する。

## 🎨 採用レイアウト: ハイブリッド型（フルスクリーン + 統合）

### 基本コンセプト
- **表示モード切替**: フルスクリーン ↔ 分割表示の自由な切り替え
- **ディレクトリ統合**: ファイルエクスプローラーとエディタの一体化
- **作業効率**: 集中作業（フルスクリーン）と並行作業（分割）の両対応
- **直感的操作**: ワンクリックでモード切り替え

### 🖥️ 表示モード詳細

#### 1. フルスクリーンモード（集中編集）
```
┌─────────────────────────────────────────────────────────┐
│ [🔳→📱] [← 戻る] service/capability/operation/usecase     │
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

#### 2. 統合モード（分割表示・並行作業）
```
┌─────────────────────────────────────────────────────────┐
│ [📱→🔳] [← 戻る] service/capability/operation/usecase     │
├─────────────────┬───────────────────────────────────────┤
│ 📁 ディレクトリ  │ ファイル: [usecase.md] [page.md] [api]  │
│                │ モード: [📝] [👁️] [📊] [⚙️]            │
│ 📂 services     ├───────────────────────────────────────┤
│ ├📂 knowledge   │                                      │
│ │ ├📂 capture   │         選択モードの表示              │
│ │ │ ├📁 classify │                                      │
│ │ │ │ ├📄 usecase│  📝 Monaco Editor                   │
│ │ │ │ ├🖼️ page   │  👁️ Markdown Preview               │
│ │ │ │ └🔧 api    │  📊 Diagram Editor                 │
│ │ │ ├📁 extract  │  ⚙️ Settings Panel                 │
│ │ │ └📁 validate │                                      │
│ │ └📂 share      │                                      │
│ └📂 project      │                                      │
│                 │                                      │
├─────────────────┴───────────────────────────────────────┤
│ [💾 保存] [📋 コピー] [📤 エクスポート] [🔍 検索] [❓ ヘルプ] │
└─────────────────────────────────────────────────────────┘
```

### 🔄 モード切り替え仕様

#### 表示モード切り替えボタン
- **🔳→📱**: 統合モード → フルスクリーンモード
- **📱→🔳**: フルスクリーンモード → 統合モード
- **位置**: ヘッダー左上（戻るボタンの隣）
- **ショートカット**: `F11` または `Ctrl+Shift+F`

#### 自動モード判定
```typescript
interface ViewModeConfig {
  autoSwitchRules: {
    screenWidth: {
      mobile: { below: 768, defaultMode: 'fullscreen' },
      tablet: { below: 1024, defaultMode: 'integrated' },
      desktop: { above: 1024, defaultMode: 'user-preference' }
    },
    taskType: {
      intensive_editing: 'fullscreen',    // 長文編集時
      file_browsing: 'integrated',        // ファイル参照時
      diagram_creation: 'fullscreen',     // 図表作成時
      multi_file_work: 'integrated'       // 複数ファイル作業時
    }
  }
}
```

## 🎯 4つのモード詳細（両表示モード対応）

### 1. 📝 編集モード
```typescript
interface EditMode {
  editor: 'monaco'
  features: {
    fullscreen: [
      'syntax-highlight',      // Markdownシンタックス
      'auto-complete',         // 自動補完
      'find-replace',          // 検索・置換
      'line-numbers',          // 行番号
      'minimap',              // コードマップ
      'vim-mode',             // Vimキーバインド
      'zen-mode'              // 禅モード（超集中）
    ],
    integrated: [
      'syntax-highlight',
      'auto-complete',
      'find-replace',
      'line-numbers',
      'file-preview'          // サイドファイルプレビュー
    ]
  }
  shortcuts: {
    save: 'Ctrl+S',
    preview: 'Ctrl+P',
    diagram: 'Ctrl+D',
    toggle_view: 'F11'
  }
}
```

### 2. 👁️ プレビューモード
```typescript
interface PreviewMode {
  render: 'react-markdown'
  features: {
    fullscreen: [
      'mermaid-diagrams',      // Mermaid図表表示
      'table-rendering',       // テーブル表示
      'code-highlight',        // コードハイライト
      'print-friendly',        // 印刷対応
      'zoom-control',         // 拡大・縮小
      'presentation-mode'      // プレゼンテーションモード
    ],
    integrated: [
      'mermaid-diagrams',
      'table-rendering',
      'code-highlight',
      'linked-files'          // 関連ファイル表示
    ]
  }
  export: ['pdf', 'html', 'docx', 'slides']
}
```

### 3. 📊 図表モード
```typescript
interface DiagramMode {
  tools: ['mermaid', 'drawio', 'excalidraw', 'plantuml']
  features: {
    fullscreen: {
      canvas: 'unlimited',    // 無制限キャンバス
      tools: 'full-palette', // 全ツールパレット
      export: 'high-res'     // 高解像度エクスポート
    },
    integrated: {
      canvas: 'fit-to-panel', // パネル内収納
      tools: 'essential',     // 基本ツールのみ
      export: 'standard'      // 標準解像度
    }
  }
  templates: [
    'robustness-diagram',    // ロバストネス図
    'sequence-diagram',      // シーケンス図
    'er-diagram',           // ER図
    'flowchart',            // フローチャート
    'wireframe'             // ワイヤーフレーム
  ]
}
```

### 4. ⚙️ 設定モード
```typescript
interface SettingsMode {
  sections: {
    fullscreen: [
      'file-properties',       // ファイル属性
      'export-options',        // エクスポート設定
      'editor-preferences',    // エディタ設定
      'diagram-templates',     // 図表テンプレート
      'collaboration',         // 共同編集設定
      'workspace-layout'       // ワークスペース設定
    ],
    integrated: [
      'file-properties',
      'quick-export',         // クイックエクスポート
      'editor-preferences',
      'layout-preferences'    // レイアウト設定
    ]
  }
}
```

## 🛠️ 技術実装仕様

### 1. URL構造（表示モード対応）
```
/parasol/edit/:serviceId/:capabilityId/:operationId/:usecaseId
?file=:fileType&mode=:mode&view=:viewMode

例:
# フルスクリーンモード
/parasol/edit/knowledge-service/knowledge-mgmt/capture/classify-knowledge
?file=usecase&mode=edit&view=fullscreen

# 統合モード
/parasol/edit/knowledge-service/knowledge-mgmt/capture/classify-knowledge
?file=usecase&mode=edit&view=integrated
```

### 2. 状態管理（拡張）
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
  viewMode: 'fullscreen' | 'integrated'
  layout: {
    directoryWidth: number      // ディレクトリパネル幅
    editorHeight: number        // エディタエリア高さ
    showMinimap: boolean        // ミニマップ表示
    showLineNumbers: boolean    // 行番号表示
  }
  content: string
  isDirty: boolean
  lastSaved: Date
  userPreferences: {
    defaultViewMode: 'fullscreen' | 'integrated'
    autoSwitchRules: ViewModeConfig
  }
}
```

### 3. コンポーネント構造（拡張）
```
ParasolFileEditor/
├── EditorHeader              # ナビゲーション・モード切替
│   ├── BreadcrumbNav        # パンくずナビ
│   ├── ViewModeToggle       # 表示モード切替
│   ├── FileTabSelector      # ファイルタブ
│   └── ModeSelector         # 編集モード切替
├── EditorLayout/            # メインレイアウト
│   ├── DirectoryPanel       # ディレクトリツリー（統合モード時）
│   └── EditorContent/       # メインコンテンツエリア
│       ├── EditMode         # Monaco Editor
│       ├── PreviewMode      # Markdown表示
│       ├── DiagramMode      # 図表エディタ
│       └── SettingsMode     # 設定画面
├── EditorFooter             # 保存・操作ボタン
└── ViewModeManager          # 表示モード管理
```

### 4. レスポンシブ対応（表示モード別）

#### フルスクリーンモード
- **デスクトップ**: 全機能フル表示、キーボードショートカット最適化
- **タブレット**: タッチ操作最適化、フルスクリーンの利点最大化
- **モバイル**: 縦スクロール最適化、エッセンシャル機能集約

#### 統合モード
- **デスクトップ**: ディレクトリパネル + エディタの2ペイン表示
- **タブレット**: ディレクトリパネル折りたたみ可能
- **モバイル**: 自動的にフルスクリーンモードに切り替え

## 🚀 実装フェーズ（拡張版）

### Phase 1: 基本編集機能 + 表示モード (4日)
1. ルーティング・URL設計（表示モード対応）
2. 基本レイアウト・モード切替
3. Monaco Editor統合（両表示モード対応）
4. ファイル読み込み・保存API
5. **NEW**: 表示モード切り替え機能

### Phase 2: ディレクトリ統合機能 (3日)
1. **NEW**: ディレクトリパネル実装
2. **NEW**: ファイルツリー表示
3. **NEW**: ファイル間ナビゲーション
4. **NEW**: ドラッグ&ドロップ対応

### Phase 3: プレビュー機能 (2日)
1. Markdownレンダリング（両モード対応）
2. Mermaid図表表示
3. プレビュー・編集切替

### Phase 4: 図表編集機能 (4日)
1. Mermaidエディタ統合
2. Draw.io iframe統合
3. Excalidrawコンポーネント
4. 図表テンプレート

### Phase 5: 設定・エクスポート (2日)
1. ファイル設定画面
2. エクスポート機能
3. **NEW**: レイアウト設定
4. 印刷対応

### Phase 6: UX改善・パフォーマンス (3日)
1. キーボードショートカット
2. 自動保存機能
3. **NEW**: 表示モード自動切換
4. **NEW**: パフォーマンス最適化
5. エラーハンドリング

## ✅ 完了条件（拡張版）

### 基本機能
- [ ] 4つのモード（編集・プレビュー・図表・設定）が動作
- [ ] ファイルタブ切り替え（usecase/page/api-usage）
- [ ] モード間のスムーズな切り替え
- [ ] Monaco Editorでの編集機能
- [ ] Markdownプレビュー表示
- [ ] Mermaid図表編集・表示
- [ ] ファイル保存・読み込み

### 表示モード機能
- [ ] **NEW**: フルスクリーンモードと統合モードの切り替え
- [ ] **NEW**: ディレクトリパネルの表示・非表示
- [ ] **NEW**: ファイルツリーナビゲーション
- [ ] **NEW**: 表示モード自動判定機能

### その他
- [ ] レスポンシブ対応完了（両モード）
- [ ] キーボードショートカット対応
- [ ] エクスポート機能（PDF/HTML）
- [ ] **NEW**: ユーザー設定の永続化

## 📊 期待効果（拡張版）

### UX向上
- **柔軟性**: 作業内容に応じた最適な表示モード選択
- **効率性**: ファイル間移動の高速化
- **集中力**: フルスクリーンでの深い集中 + 統合での並行作業
- **直感性**: エクスプローラー風のファイル操作

### 開発効率
- **編集速度**: Monaco Editor + ディレクトリ統合
- **ナビゲーション**: ファイル間の高速移動
- **プレビュー**: リアルタイム確認（両モード）
- **図表作成**: 統合された図表編集環境

### 生産性向上
- **マルチタスク**: 統合モードでの複数ファイル並行編集
- **集中作業**: フルスクリーンでの没入型編集
- **モバイル対応**: 場所を選ばない編集環境

## 🎮 ユーザーエクスペリエンス シナリオ

### シナリオ1: 初回利用時
1. ユーザーがファイルをクリック → 自動的に統合モードで開始
2. ディレクトリパネルでファイル構造を把握
3. 長文編集が必要 → `F11`でフルスクリーンに切り替え

### シナリオ2: 複数ファイル作業時
1. usecase.mdを統合モードで編集
2. ディレクトリパネルからpage.mdを選択
3. 2つのファイルを見比べながら同期編集

### シナリオ3: プレゼンテーション時
1. フルスクリーンモードでプレビュー表示
2. 図表やMarkdownを大画面で共有
3. 必要に応じて編集モードに即座切り替え

---

**優先度**: High
**工数見積もり**: 18日間（6フェーズ）
**レイアウト**: ハイブリッド型（フルスクリーン + 統合）
**担当**: パラソル開発チーム

**新機能ハイライト**:
- 🔄 フルスクリーン ↔ 統合モード切り替え
- 📁 ディレクトリパネル統合
- 🎯 表示モード自動判定
- ⚡ 高速ファイル間ナビゲーション