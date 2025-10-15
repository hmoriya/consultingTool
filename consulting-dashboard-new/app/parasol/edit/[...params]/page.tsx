'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  Save,
  Eye,
  BarChart3,
  Settings,
  FileText,
  Layout,
  Code,
  Maximize2,
  Minimize2,
  Folder,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ParasolFileEditor } from '@/components/parasol/ParasolFileEditor';
import { DirectoryPanel } from '@/components/parasol/DirectoryPanel';
import { cn } from '@/lib/utils';

interface FileMetadata {
  title: string;
  description: string;
  version: string;
  lastModified: Date;
  author: string;
  tags: string[];
  category: string;
}

interface FileData {
  content: string;
  metadata: FileMetadata;
  exists: boolean;
  lastModified: Date;
}

type EditMode = 'edit' | 'preview' | 'diagram' | 'settings';
type FileType = 'usecase' | 'page' | 'api-usage';
type ViewMode = 'fullscreen' | 'integrated';

const fileTypeConfig = {
  usecase: {
    title: 'ユースケース定義',
    icon: FileText,
    description: 'システム機能の詳細仕様',
    extension: 'usecase.md'
  },
  page: {
    title: 'ページ定義',
    icon: Layout,
    description: 'UI画面の構造と振る舞い',
    extension: 'page.md'
  },
  'api-usage': {
    title: 'API利用仕様',
    icon: Code,
    description: 'このユースケースでのAPI利用方法',
    extension: 'api-usage.md'
  }
} as const;

export default function ParasolEnhancedEditPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [currentMode, setCurrentMode] = useState<EditMode>('edit');
  const [viewMode, setViewMode] = useState<ViewMode>('integrated');
  const [directoryExpanded, setDirectoryExpanded] = useState(true);

  // URLパラメータの解析
  const paramArray = Array.isArray(params.params) ? params.params : [params.params].filter(Boolean);
  const [service, capability, operation, usecase] = paramArray;
  const fileType = (searchParams.get('file') || 'usecase') as FileType;
  const urlMode = (searchParams.get('mode') || 'edit') as EditMode;
  const urlViewMode = (searchParams.get('view') || 'integrated') as ViewMode;

  const config = fileTypeConfig[fileType];

  // URLパラメータからモードを初期化
  useEffect(() => {
    setCurrentMode(urlMode);
    setViewMode(urlViewMode);
  }, [urlMode, urlViewMode]);

  // ファイルパスの構築
  const filePath = `docs/parasol/services/${service}/capabilities/${capability}/operations/${operation}/usecases/${usecase}/${config.extension}`;

  // パンくずリスト用のパス
  const breadcrumbs = [
    { label: 'パラソル設計', href: '/parasol' },
    { label: service, href: `/parasol/services/${service}` },
    { label: capability, href: `/parasol/services/${service}/capabilities/${capability}` },
    { label: operation, href: `/parasol/services/${service}/capabilities/${capability}/operations/${operation}` },
    { label: usecase, href: `/parasol/services/${service}/capabilities/${capability}/operations/${operation}/usecases/${usecase}` },
    { label: config.title, href: '', current: true }
  ];

  // ファイルデータの読み込み
  useEffect(() => {
    if (service && capability && operation && usecase) {
      loadFile();
    }
  }, [filePath]);

  const loadFile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/parasol/files?path=${encodeURIComponent(filePath)}`);

      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }

      const data: FileData = await response.json();
      setFileData(data);
      setIsModified(false);
    } catch (error) {
      console.error('Error loading file:', error);
      toast.error('ファイルの読み込みに失敗しました');

      // ファイルが存在しない場合は新規作成
      setFileData({
        content: getDefaultContent(fileType),
        metadata: {
          title: config.title,
          description: config.description,
          version: '1.0.0',
          lastModified: new Date(),
          author: 'current-user',
          tags: [],
          category: fileType
        },
        exists: false,
        lastModified: new Date()
      });
      setIsModified(true);
    } finally {
      setLoading(false);
    }
  };

  // ファイルの保存
  const saveFile = async () => {
    if (!fileData || !isModified) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/parasol/files?path=${encodeURIComponent(filePath)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: fileData.content,
          metadata: fileData.metadata
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save file: ${response.statusText}`);
      }

      setFileData(prev => prev ? { ...prev, lastModified: new Date() } : null);
      setIsModified(false);
      toast.success('ファイルを保存しました');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('ファイルの保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  // コンテンツの更新
  const updateContent = (content: string) => {
    setFileData(prev => prev ? { ...prev, content } : null);
    setIsModified(true);
  };

  // 表示モードの切り替え
  const toggleViewMode = useCallback(() => {
    const newViewMode = viewMode === 'fullscreen' ? 'integrated' : 'fullscreen';
    setViewMode(newViewMode);

    // URLパラメータも更新
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('view', newViewMode);
    router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
  }, [viewMode, searchParams, router]);

  // モード変更時のURL更新
  const handleModeChange = useCallback((mode: EditMode) => {
    setCurrentMode(mode);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('mode', mode);
    router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
  }, [searchParams, router]);

  // ファイルタイプ変更時のURL更新
  const handleFileTypeChange = useCallback((newFileType: FileType) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('file', newFileType);
    router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
  }, [searchParams, router]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S または Cmd+S で保存
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveFile();
      }

      // F11 または Ctrl+Shift+F で表示モード切り替え
      if (event.key === 'F11' || ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'F')) {
        event.preventDefault();
        toggleViewMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [saveFile, toggleViewMode]);

  // デフォルトコンテンツの生成
  const getDefaultContent = (type: FileType): string => {
    switch (type) {
      case 'usecase':
        return `# ユースケース: ${usecase}

## 基本情報
- **ユースケースID**: UC-${usecase.toUpperCase()}
- **アクター**:
- **概要**:

## 事前条件
-

## 事後条件
### 成功時
-

### 失敗時
-

## 基本フロー
1.
2.
3.

## 代替フロー
### 代替フロー1:
-

## 例外フロー
### 例外1:
-

## 特別要件
- **性能**:
- **可用性**:
- **セキュリティ**:
`;

      case 'page':
        return `# ページ定義: ${usecase}

## 画面の目的


## 利用者
- **主要利用者**:
- **副次利用者**:

## 画面構成

### ヘッダー部
-

### メインコンテンツ部
-

### フッター部
-

## データ表示

### 表示データ一覧
| データ項目 | 表示形式 | 必須 | 説明 |
|-----------|---------|------|------|
|  |  |  |  |

## 入力項目

### フォーム一覧
| 入力項目 | 入力形式 | 必須 | バリデーション | 説明 |
|---------|---------|------|---------------|------|
|  |  |  |  |  |

## アクション・操作

### 主要アクション
-

### 副次アクション
-

## 画面の振る舞い

### ユーザー操作への反応
-

### 条件による表示変更
-

## 画面遷移

### 遷移元画面
-

### 遷移先画面
-

## エラーハンドリング
-

## アクセシビリティ要件
-

## レスポンシブ対応
- **デスクトップ**:
- **タブレット**:
- **モバイル**:
`;

      case 'api-usage':
        return `# API利用仕様: ${usecase}

## 利用するAPI一覧

### 自サービスAPI
| API | エンドポイント | 利用目的 | パラメータ |
|-----|---------------|----------|-----------|
|  |  |  |  |

### 他サービスAPI（ユースケース利用型）
| サービス | ユースケースAPI | 利用タイミング | 期待結果 |
|---------|-----------------|---------------|----------|
|  |  |  |  |

## API呼び出しシーケンス

1. **事前認証**:
2. **メイン処理**:
3. **結果通知**:
4. **ログ記録**:

## エラーハンドリング

### 認証・認可エラー
-

### API処理エラー
-

### ネットワークエラー
-

### リトライ戦略
-

## パフォーマンス要件
- **レスポンス時間**:
- **スループット**:
- **可用性**:

## セキュリティ要件
- **認証**:
- **認可**:
- **データ保護**:
`;

      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">ファイルを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!fileData || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">ファイルの読み込みに失敗しました</p>
          <Button onClick={() => router.back()}>戻る</Button>
        </div>
      </div>
    );
  }

  const IconComponent = config.icon;

  return (
    <div className="h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="border-b bg-background px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* 左側: ナビゲーション */}
          <div className="flex items-center gap-4">
            {/* 表示モード切り替えボタン */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              className="gap-2"
              title={`${viewMode === 'fullscreen' ? '統合' : 'フルスクリーン'}モードに切り替え (F11)`}
            >
              {viewMode === 'fullscreen' ? (
                <>
                  <Minimize2 className="h-4 w-4" />
                  <span className="hidden sm:inline">統合</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4" />
                  <span className="hidden sm:inline">フルスクリーン</span>
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              戻る
            </Button>

            {/* パンくずリスト */}
            <nav className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  {item.current ? (
                    <span className="text-foreground font-medium">{item.label}</span>
                  ) : (
                    <button
                      onClick={() => router.push(item.href)}
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* 中央: ファイル情報 */}
          <div className="flex items-center gap-3">
            <IconComponent className="h-5 w-5 text-primary" />
            <div className="text-center">
              <h1 className="font-semibold">{config.title}</h1>
              <p className="text-sm text-muted-foreground hidden md:block">{config.description}</p>
            </div>
            {isModified && (
              <Badge variant="secondary" className="text-xs">
                未保存
              </Badge>
            )}
          </div>

          {/* 右側: アクション */}
          <div className="flex items-center gap-2">
            <Button
              onClick={saveFile}
              disabled={!isModified || saving}
              size="sm"
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>

        {/* ファイルタブとモード切り替え */}
        <div className="flex items-center justify-between mt-3 gap-4">
          {/* ファイルタブ */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">ファイル:</span>
            {(['usecase', 'page', 'api-usage'] as const).map((type) => {
              const typeConfig = fileTypeConfig[type];
              const TypeIcon = typeConfig.icon;
              return (
                <Button
                  key={type}
                  variant={fileType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFileTypeChange(type)}
                  className="gap-2"
                >
                  <TypeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{typeConfig.title}</span>
                </Button>
              );
            })}
          </div>

          {/* モード切り替え */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentMode === 'edit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleModeChange('edit')}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">編集</span>
            </Button>
            <Button
              variant={currentMode === 'preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleModeChange('preview')}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">プレビュー</span>
            </Button>
            <Button
              variant={currentMode === 'diagram' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleModeChange('diagram')}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">図表</span>
            </Button>
            <Button
              variant={currentMode === 'settings' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleModeChange('settings')}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">設定</span>
            </Button>
          </div>
        </div>
      </div>

      {/* メインエリア */}
      <div className="flex-1 flex overflow-hidden">
        {/* ディレクトリパネル（統合モード時のみ） */}
        {viewMode === 'integrated' && (
          <div className={cn(
            "border-r bg-muted/30 transition-all duration-300 flex-shrink-0",
            directoryExpanded ? "w-80" : "w-12"
          )}>
            <div className="p-2 border-b flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDirectoryExpanded(!directoryExpanded)}
                className="gap-2"
              >
                {directoryExpanded ? (
                  <>
                    <FolderOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">ディレクトリ</span>
                  </>
                ) : (
                  <Folder className="h-4 w-4" />
                )}
              </Button>
            </div>

            {directoryExpanded && (
              <DirectoryPanel
                currentService={service}
                currentCapability={capability}
                currentOperation={operation}
                currentUsecase={usecase}
                currentFileType={fileType}
                onFileSelect={(newService, newCapability, newOperation, newUsecase, newFileType) => {
                  router.push(`/parasol/edit/${newService}/${newCapability}/${newOperation}/${newUsecase}?file=${newFileType}&mode=${currentMode}&view=${viewMode}`);
                }}
              />
            )}
          </div>
        )}

        {/* エディタエリア */}
        <div className="flex-1 overflow-hidden">
          <ParasolFileEditor
            content={fileData.content}
            filePath={filePath}
            fileType={fileType}
            mode={currentMode}
            metadata={fileData.metadata}
            onContentChange={updateContent}
            onSave={saveFile}
          />
        </div>
      </div>
    </div>
  );
}