'use client';

import { useState, useEffect, useCallback } from 'react';
import { Monaco } from '@monaco-editor/react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// 動的インポートでパフォーマンス最適化（フォールバック対応）
const MonacoEditor = dynamic(() => import('@monaco-editor/react').catch(() => ({ default: null })), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
});

import { FallbackTextEditor } from './FallbackTextEditor';

const MarkdownPreview = dynamic(() => import('./MarkdownPreview'), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
});

const DiagramEditor = dynamic(() => import('./DiagramEditor'), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
});

const SettingsPanel = dynamic(() => import('./SettingsPanel'), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
});

type EditMode = 'edit' | 'preview' | 'diagram' | 'settings';
type FileType = 'usecase' | 'page' | 'api-usage';

interface FileMetadata {
  title: string;
  description: string;
  version: string;
  lastModified: Date;
  author: string;
  tags: string[];
  category: string;
}

interface EditorSettings {
  theme: 'vs-dark' | 'vs-light' | 'hc-black';
  fontSize: number;
  lineHeight: number;
  wordWrap: 'on' | 'off' | 'wordWrapColumn';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative';
  keyBindings: 'default' | 'vim' | 'emacs';
}

interface ParasolFileEditorProps {
  content: string;
  filePath: string;
  fileType: FileType;
  mode: EditMode;
  metadata: FileMetadata;
  onContentChange: (content: string) => void;
  onSave: () => void;
}

export function ParasolFileEditor({
  content,
  filePath,
  fileType,
  mode,
  metadata,
  onContentChange,
  onSave,
}: ParasolFileEditorProps) {
  const [editorSettings, setEditorSettings] = useState<EditorSettings>(() => {
    // ローカルストレージから設定を復元
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('parasol-editor-settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // エラーの場合はデフォルト設定を使用
        }
      }
    }

    return {
      theme: 'vs-dark',
      fontSize: 14,
      lineHeight: 1.5,
      wordWrap: 'on',
      minimap: true,
      lineNumbers: 'on',
      keyBindings: 'default',
    };
  });

  // 設定の保存
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('parasol-editor-settings', JSON.stringify(editorSettings));
    }
  }, [editorSettings]);

  // Monaco Editorの設定
  const handleEditorWillMount = useCallback((monaco: Monaco) => {
    // パラソル専用スニペットの登録
    monaco.languages.registerCompletionItemProvider('markdown', {
      provideCompletionItems: (model, position) => {
        const suggestions = getParasolSnippets(monaco, fileType);
        return { suggestions };
      },
    });

    // カスタムテーマの定義
    monaco.editor.defineTheme('parasol-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
      },
    });
  }, [fileType]);

  // エディタの設定
  const editorOptions = {
    fontSize: editorSettings.fontSize,
    lineHeight: editorSettings.lineHeight,
    wordWrap: editorSettings.wordWrap,
    minimap: { enabled: editorSettings.minimap },
    lineNumbers: editorSettings.lineNumbers,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    folding: true,
    renderWhitespace: 'boundary',
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    formatOnPaste: true,
    formatOnType: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false,
    },
    // キーボードショートカット
    keyBindings: editorSettings.keyBindings,
  };

  // キーボードショートカットの設定
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S または Cmd+S で保存
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave]);

  // モードに応じたコンテンツの表示
  const renderContent = () => {
    switch (mode) {
      case 'edit':
        return (
          <div className="h-full">
            {MonacoEditor ? (
              <MonacoEditor
                language="markdown"
                theme={editorSettings.theme === 'vs-dark' ? 'parasol-dark' : editorSettings.theme}
                value={content}
                onChange={(value) => onContentChange(value || '')}
                options={editorOptions}
                beforeMount={handleEditorWillMount}
                className="h-full"
              />
            ) : (
              <FallbackTextEditor
                value={content}
                onChange={onContentChange}
                placeholder="マークダウンを入力してください..."
                className="h-full"
              />
            )}
          </div>
        );

      case 'preview':
        return (
          <MarkdownPreview
            content={content}
            filePath={filePath}
            fileType={fileType}
          />
        );

      case 'diagram':
        return (
          <DiagramEditor
            content={content}
            onContentChange={onContentChange}
            fileType={fileType}
          />
        );

      case 'settings':
        return (
          <SettingsPanel
            metadata={metadata}
            editorSettings={editorSettings}
            onEditorSettingsChange={setEditorSettings}
            filePath={filePath}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full bg-background">
      {renderContent()}
    </div>
  );
}

// パラソル専用スニペットの定義
function getParasolSnippets(monaco: unknown, fileType: FileType) {
  const baseSnippets = [
    {
      label: 'entity',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: [
        '#### ${1:EntityName}（${2:エンティティ名}）',
        '**識別性**: ${3:エンティティの一意識別方法}',
        '**ライフサイクル**: ${4:作成から削除までのライフサイクル}',
        '',
        '| 属性名 | 型 | 必須 | 説明 |',
        '|--------|----|----|------|',
        '| id | UUID | ○ | 一意識別子 |',
        '| ${5:name} | ${6:STRING_100} | ${7:○} | ${8:説明} |',
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'パラソルエンティティ定義テンプレート',
    },
    {
      label: 'mermaid-er',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: [
        '```mermaid',
        'erDiagram',
        '    ${1:Entity1} {',
        '        UUID id PK',
        '        STRING name',
        '        TIMESTAMP created_at',
        '    }',
        '    ${2:Entity2} {',
        '        UUID id PK',
        '        UUID entity1_id FK',
        '        STRING description',
        '    }',
        '    ${1:Entity1} ||--o{ ${2:Entity2} : "has many"',
        '```',
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'MermaidのER図テンプレート',
    },
    {
      label: 'mermaid-flow',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: [
        '```mermaid',
        'flowchart TD',
        '    A[${1:開始}] --> B{${2:条件}}',
        '    B -->|Yes| C[${3:処理1}]',
        '    B -->|No| D[${4:処理2}]',
        '    C --> E[${5:終了}]',
        '    D --> E',
        '```',
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Mermaidのフローチャートテンプレート',
    },
  ];

  // ファイルタイプ別の専用スニペット
  const typeSpecificSnippets = (() => {
    switch (fileType) {
      case 'usecase':
        return [
          {
            label: 'usecase-template',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '# ユースケース: ${1:ユースケース名}',
              '',
              '## 基本情報',
              '- **ユースケースID**: UC-${2:XXX}',
              '- **アクター**: ${3:主アクター}',
              '- **概要**: ${4:ユースケースの簡潔な説明}',
              '',
              '## 事前条件',
              '- ${5:条件1}',
              '',
              '## 基本フロー',
              '1. ${6:アクター}が${7:アクション}を実行する',
              '2. システムが${8:処理}を行う',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'ユースケース定義テンプレート',
          },
        ];

      case 'page':
        return [
          {
            label: 'page-template',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '# ページ定義: ${1:ページ名}',
              '',
              '## 画面の目的',
              '${2:この画面で達成したいビジネス目的を記述}',
              '',
              '## 利用者',
              '- **${3:主要利用者}**: ${4:役割と利用目的}',
              '',
              '## 画面構成',
              '',
              '### ヘッダー部',
              '- ${5:ヘッダーに表示する要素}',
              '',
              '### メインコンテンツ部',
              '- **${6:セクション1名}**: ${7:表示内容と機能}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'ページ定義テンプレート',
          },
        ];

      case 'api-usage':
        return [
          {
            label: 'api-usage-template',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '# API利用仕様: ${1:ユースケース名}',
              '',
              '## 利用するAPI一覧',
              '',
              '### 自サービスAPI',
              '| API | エンドポイント | 利用目的 | パラメータ |',
              '|-----|---------------|----------|-----------|',
              '| ${2:API名} | ${3:POST /api/service/resource} | ${4:目的} | ${5:パラメータ} |',
              '',
              '### 他サービスAPI（ユースケース利用型）',
              '| サービス | ユースケースAPI | 利用タイミング | 期待結果 |',
              '|---------|-----------------|---------------|----------|',
              '| ${6:secure-access-service} | ${7:UC-AUTH-01: ユーザー認証} | ${8:処理開始時} | ${9:認証トークン取得} |',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'API利用仕様テンプレート',
          },
        ];

      default:
        return [];
    }
  })();

  return [...baseSnippets, ...typeSpecificSnippets];
}