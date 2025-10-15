# パラソル設計ファイル編集ページ - 詳細設計書

## 概要

パラソル設計のユースケース・ページ・API利用仕様を編集するための統合編集インターフェースを実装する。Option 3（分離型フルスクリーンレイアウト）を採用し、4つのモード（Edit/Preview/Diagram/Settings）を切り替え可能にする。

## アーキテクチャ設計

### ルーティング構造

```
/parasol/services/[service]/capabilities/[capability]/operations/[operation]/usecases/[usecase]/edit/[file]

例:
/parasol/services/knowledge-co-creation-service/capabilities/knowledge-management/operations/capture-knowledge/usecases/extract-and-structure-knowledge/edit/usecase
/parasol/services/knowledge-co-creation-service/capabilities/knowledge-management/operations/capture-knowledge/usecases/extract-and-structure-knowledge/edit/page
/parasol/services/knowledge-co-creation-service/capabilities/knowledge-management/operations/capture-knowledge/usecases/extract-and-structure-knowledge/edit/api-usage
```

### コンポーネント階層

```
ParasolFileEditorPage
├── FileEditorLayout
│   ├── EditorModeSelector           # 4モード切り替え
│   ├── EditorToolbar               # ファイル操作・保存
│   └── FileEditorContent
│       ├── EditMode
│       │   └── MonacoEditor        # Markdown編集
│       ├── PreviewMode
│       │   └── MarkdownPreview     # レンダリング表示
│       ├── DiagramMode
│       │   ├── MermaidRenderer
│       │   ├── DrawIORenderer
│       │   ├── ExcalidrawRenderer
│       │   └── PlantUMLRenderer
│       └── SettingsMode
│           └── FileMetadataEditor  # ファイル設定
└── FloatingActionBar               # クイックアクション
```

## モード仕様

### 1. 📝 Edit Mode（編集モード）

#### 機能要件
- Monaco Editorによるリッチテキスト編集
- Markdown構文ハイライト
- リアルタイム構文検証
- オートコンプリート（パラソル専用スニペット）
- Vim/Emacsキーバインド対応

#### UI仕様
```typescript
interface EditModeProps {
  content: string
  filePath: string
  onContentChange: (content: string) => void
  editorSettings: EditorSettings
}

interface EditorSettings {
  theme: 'vs-dark' | 'vs-light' | 'hc-black'
  fontSize: number
  lineHeight: number
  wordWrap: 'on' | 'off' | 'wordWrapColumn'
  minimap: boolean
  lineNumbers: 'on' | 'off' | 'relative'
  keyBindings: 'default' | 'vim' | 'emacs'
}
```

#### パラソル専用スニペット
```json
{
  "parasol-entity": {
    "prefix": "entity",
    "body": [
      "#### ${1:EntityName}（${2:エンティティ名}）",
      "**識別性**: ${3:エンティティの一意識別方法}",
      "**ライフサイクル**: ${4:作成から削除までのライフサイクル}",
      "",
      "| 属性名 | 型 | 必須 | 説明 |",
      "|--------|----|----|------|",
      "| id | UUID | ○ | 一意識別子 |",
      "| ${5:name} | ${6:STRING_100} | ${7:○} | ${8:説明} |"
    ]
  },
  "parasol-usecase": {
    "prefix": "usecase",
    "body": [
      "# ユースケース: ${1:ユースケース名}",
      "",
      "## 基本情報",
      "- **ユースケースID**: UC-${2:XXX}",
      "- **アクター**: ${3:主アクター}",
      "- **概要**: ${4:ユースケースの簡潔な説明}",
      "",
      "## 事前条件",
      "- ${5:条件1}",
      "",
      "## 基本フロー",
      "1. ${6:アクター}が${7:アクション}を実行する",
      "2. システムが${8:処理}を行う"
    ]
  }
}
```

### 2. 👁️ Preview Mode（プレビューモード）

#### 機能要件
- リアルタイムMarkdownレンダリング
- Mermaid図の自動レンダリング
- スクロール同期（Edit ↔ Preview）
- プリント対応CSS
- エクスポート機能（PDF/HTML）

#### UI仕様
```typescript
interface PreviewModeProps {
  content: string
  filePath: string
  scrollPosition?: number
  onScrollSync?: (position: number) => void
}

interface ExportOptions {
  format: 'pdf' | 'html' | 'docx'
  includeImages: boolean
  includeStyles: boolean
  pageSize: 'A4' | 'Letter' | 'Legal'
}
```

#### レンダリング対応
- **Markdown**: GitHub Flavored Markdown
- **Mermaid**: フローチャート、ER図、シーケンス図
- **数式**: KaTeX
- **コードハイライト**: Prism.js
- **テーブル**: 拡張テーブル記法

### 3. 📊 Diagram Mode（図表モード）

#### 機能要件
- Mermaid Live Editor統合
- Draw.io統合
- Excalidraw統合
- PlantUML統合
- 図表のMarkdownへの自動挿入

#### サブモード構成
```typescript
type DiagramTool = 'mermaid' | 'drawio' | 'excalidraw' | 'plantuml'

interface DiagramModeProps {
  selectedTool: DiagramTool
  content: string
  onDiagramInsert: (diagramCode: string) => void
}
```

#### Mermaidサポート図表
- フローチャート（flowchart）
- シーケンス図（sequenceDiagram）
- ER図（erDiagram）
- 状態遷移図（stateDiagram）
- ガントチャート（gantt）
- クラス図（classDiagram）

### 4. ⚙️ Settings Mode（設定モード）

#### 機能要件
- ファイルメタデータ編集
- エディタ設定
- 図表レンダリング設定
- エクスポート設定
- バージョン履歴

#### 設定項目
```typescript
interface FileMetadata {
  title: string
  description: string
  version: string
  lastModified: Date
  author: string
  tags: string[]
  category: string
  relatedFiles: string[]
}

interface EditorPreferences {
  autoSave: boolean
  autoSaveInterval: number
  showLineNumbers: boolean
  enableVimMode: boolean
  theme: string
  fontSize: number
}
```

## API設計

### ファイル操作API

```typescript
// GET /api/parasol/files/[...path]
interface GetFileResponse {
  content: string
  metadata: FileMetadata
  exists: boolean
  lastModified: Date
}

// PUT /api/parasol/files/[...path]
interface UpdateFileRequest {
  content: string
  metadata?: Partial<FileMetadata>
}

// POST /api/parasol/files/[...path]/versions
interface CreateVersionRequest {
  content: string
  description: string
}

// GET /api/parasol/files/[...path]/versions
interface GetVersionsResponse {
  versions: FileVersion[]
}
```

### ファイル監視API（WebSocket）

```typescript
// リアルタイム編集監視
interface FileWatchEvent {
  type: 'file_changed' | 'user_joined' | 'user_left'
  filePath: string
  user?: string
  content?: string
  timestamp: Date
}
```

## 状態管理

### Zustand Store設計

```typescript
interface FileEditorStore {
  // Current state
  currentFile: {
    path: string
    content: string
    metadata: FileMetadata
    isModified: boolean
    lastSaved: Date
  }
  currentMode: EditMode
  isLoading: boolean

  // Editor settings
  editorSettings: EditorSettings

  // Actions
  loadFile: (path: string) => Promise<void>
  saveFile: () => Promise<void>
  updateContent: (content: string) => void
  setMode: (mode: EditMode) => void
  updateSettings: (settings: Partial<EditorSettings>) => void

  // Auto-save
  enableAutoSave: () => void
  disableAutoSave: () => void
}
```

## フルスクリーンレイアウト

### レスポンシブ設計

```css
.file-editor-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  width: 100vw;
}

.editor-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--background);
}

.editor-content {
  overflow: hidden;
  position: relative;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .editor-header {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    gap: 0.5rem;
  }

  .mode-selector {
    order: 2;
    grid-column: 1 / -1;
  }
}
```

### キーボードショートカット

```typescript
const keyboardShortcuts = {
  'Ctrl+S': 'save',
  'Ctrl+Shift+P': 'preview',
  'Ctrl+Shift+D': 'diagram',
  'Ctrl+,': 'settings',
  'Ctrl+1': 'edit-mode',
  'Ctrl+2': 'preview-mode',
  'Ctrl+3': 'diagram-mode',
  'Ctrl+4': 'settings-mode',
  'F11': 'toggle-fullscreen',
  'Esc': 'exit-fullscreen'
}
```

## セキュリティ

### 権限制御
```typescript
interface FilePermissions {
  read: boolean
  write: boolean
  delete: boolean
  share: boolean
}

// パスベース権限チェック
function checkFilePermissions(
  userRole: string,
  filePath: string
): FilePermissions {
  // サービス所有者のみ編集可能
  // 他ユーザーは読み取り専用
}
```

### バリデーション
```typescript
interface FileValidationRules {
  maxFileSize: number // 10MB
  allowedExtensions: string[] // ['.md']
  contentValidation: {
    maxLines: number // 10000
    forbiddenPatterns: RegExp[]
  }
}
```

## パフォーマンス最適化

### 遅延読み込み
```typescript
// Monaco Editor の動的ロード
const MonacoEditor = lazy(() => import('@monaco-editor/react'))

// 大きなMarkdownファイルの分割読み込み
const useChunkedContent = (content: string, chunkSize = 1000) => {
  return useMemo(() => {
    return content.split('\n').reduce((chunks, line, index) => {
      const chunkIndex = Math.floor(index / chunkSize)
      if (!chunks[chunkIndex]) chunks[chunkIndex] = []
      chunks[chunkIndex].push(line)
      return chunks
    }, [] as string[][])
  }, [content, chunkSize])
}
```

### キャッシュ戦略
```typescript
// React Query による API キャッシュ
const useFileContent = (path: string) => {
  return useQuery({
    queryKey: ['file', path],
    queryFn: () => fetchFileContent(path),
    staleTime: 5 * 60 * 1000, // 5分
    cacheTime: 30 * 60 * 1000, // 30分
  })
}
```

## 実装優先順位

### Phase 1: 基本編集機能（3日）
1. ✅ ルーティング設定
2. ✅ 基本レイアウト
3. ✅ Monaco Editor統合
4. ✅ ファイル読み書きAPI
5. ✅ 保存機能

### Phase 2: プレビュー機能（2日）
1. ✅ Markdown レンダリング
2. ✅ Mermaid 統合
3. ✅ リアルタイムプレビュー
4. ✅ スクロール同期

### Phase 3: 図表機能（3日）
1. ✅ Mermaid Live Editor
2. ⏳ Draw.io 統合
3. ⏳ Excalidraw 統合
4. ⏳ PlantUML 統合

### Phase 4: 設定・最適化（2日）
1. ⏳ 設定画面
2. ⏳ キーボードショートカット
3. ⏳ パフォーマンス最適化
4. ⏳ エラーハンドリング

### Phase 5: UX改善（3日）
1. ⏳ 自動保存
2. ⏳ バージョン履歴
3. ⏳ 多言語対応
4. ⏳ アクセシビリティ対応

**総実装期間**: 13日
**担当**: フロントエンド開発チーム
**完了予定**: 2025-10-24