'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Eye, BarChart3, Settings, Layout, Code, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ParasolFileEditor } from '@/components/parasol/ParasolFileEditor';

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

export default function ParasolFileEditPage() {
  const params = useParams();
  const router = useRouter();
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [currentMode, setCurrentMode] = useState<EditMode>('edit');

  // パラメータの型安全な取得
  const service = Array.isArray(params.service) ? params.service[0] : params.service;
  const capability = Array.isArray(params.capability) ? params.capability[0] : params.capability;
  const operation = Array.isArray(params.operation) ? params.operation[0] : params.operation;
  const usecase = Array.isArray(params.usecase) ? params.usecase[0] : params.usecase;
  const file = Array.isArray(params.file) ? params.file[0] : params.file;

  const fileType = file as FileType;
  const config = fileTypeConfig[fileType];

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

  // デフォルトコンテンツの生成
  const getDefaultContent = useCallback((type: FileType): string => {
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

## ロバストネス図
\`\`\`mermaid
graph LR
    actor[アクター] --> boundary[境界オブジェクト]
    boundary --> control[コントロール]
    control --> entity[エンティティ]
\`\`\`
`;
      case 'page':
        return `# ページ定義: ${usecase}

## 基本情報
- **ページID**: PG-${usecase.toUpperCase()}
- **URL**: /${service}/${capability}/${operation}/${usecase}
- **タイプ**: [form/list/detail/dashboard]

## 画面構成
### ヘッダー
-

### メインコンテンツ
-

### アクション
-

## データ表示
| 項目名 | データ型 | 必須 | 説明 |
|-------|---------|------|------|
| | | | |

## 入力フォーム
| フィールド名 | データ型 | 必須 | バリデーション |
|-------------|---------|------|----------------|
| | | | |

## ボタン・リンク
- **保存**: [アクション]
- **キャンセル**: [アクション]
`;
      case 'api-usage':
        return `# API利用仕様: ${usecase}

## 利用API一覧
| API名 | メソッド | エンドポイント | 用途 |
|-------|----------|----------------|------|
| | | | |

## API詳細
### API名: [APIの名前]
- **メソッド**: GET/POST/PUT/DELETE
- **エンドポイント**: /api/...
- **認証**: 必要/不要

#### リクエスト
\`\`\`json
{
  
}
\`\`\`

#### レスポンス
##### 成功時 (200)
\`\`\`json
{
  
}
\`\`\`

##### エラー時
- **400 Bad Request**: [エラー内容]
- **401 Unauthorized**: [エラー内容]
- **404 Not Found**: [エラー内容]
- **500 Internal Server Error**: [エラー内容]
`;
      default:
        return '';
    }
  }, [usecase, service, capability, operation]);

  const loadFile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/parasol/files?path=${encodeURIComponent(filePath)}`);

      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }

      const data: FileData = await response.json();
      setFileData(data);
      setIsModified(false);
    } catch (_error) {
      console.error('Error loading file:', _error);
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
  }, [filePath, fileType, config.title, config.description, getDefaultContent]);

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

      const _updatedData = await response.json();
      setFileData(prev => prev ? { ...prev, lastModified: new Date() } : null);
      setIsModified(false);
      toast.success('ファイルを保存しました');
    } catch (_error) {
      console.error('Error saving file:', _error);
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

  // getDefaultContentは上で定義済み

  // ファイルデータの読み込み
  useEffect(() => {
    loadFile();
  }, [loadFile]);

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
      <div className="border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左側: ナビゲーション */}
          <div className="flex items-center gap-4">
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
            <nav className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
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
              <p className="text-sm text-muted-foreground">{config.description}</p>
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

        {/* モード切り替え */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant={currentMode === 'edit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentMode('edit')}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            編集
          </Button>
          <Button
            variant={currentMode === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentMode('preview')}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            プレビュー
          </Button>
          <Button
            variant={currentMode === 'diagram' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentMode('diagram')}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            図表
          </Button>
          <Button
            variant={currentMode === 'settings' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentMode('settings')}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            設定
          </Button>
        </div>
      </div>

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
  );
}