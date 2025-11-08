'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Monitor,
  Keyboard,
  RotateCcw,
  Download,
  Upload,
  Save,
  FileText,
  Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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

interface SettingsPanelProps {
  metadata: FileMetadata;
  editorSettings: EditorSettings;
  onEditorSettingsChange: (settings: EditorSettings) => void;
  filePath: string;
}

export default function SettingsPanel({
  metadata,
  editorSettings,
  onEditorSettingsChange,
  filePath,
}: SettingsPanelProps) {
  const [localMetadata, setLocalMetadata] = useState<FileMetadata>(metadata);
  const [localEditorSettings, setLocalEditorSettings] = useState<EditorSettings>(editorSettings);

  // メタデータの更新
  const updateMetadata = (key: keyof FileMetadata,_value) => {
    setLocalMetadata(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // エディタ設定の更新
  const updateEditorSettings = (key: keyof EditorSettings,_value) => {
    const newSettings = {
      ...localEditorSettings,
      [key]: value,
    };
    setLocalEditorSettings(newSettings);
    onEditorSettingsChange(newSettings);
  };

  // 設定の保存
  const saveSettings = () => {
    // ここで実際の保存処理を実装
    toast.success('設定を保存しました');
  };

  // 設定のリセット
  const resetSettings = () => {
    const defaultSettings: EditorSettings = {
      theme: 'vs-dark',
      fontSize: 14,
      lineHeight: 1.5,
      wordWrap: 'on',
      minimap: true,
      lineNumbers: 'on',
      keyBindings: 'default',
    };
    setLocalEditorSettings(defaultSettings);
    onEditorSettingsChange(defaultSettings);
    toast.success('設定をリセットしました');
  };

  // 設定のエクスポート
  const exportSettings = () => {
    const settingsData = {
      metadata: localMetadata,
      editorSettings: localEditorSettings,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(settingsData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parasol-editor-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('設定をエクスポートしました');
  };

  // 設定のインポート
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.editorSettings) {
          setLocalEditorSettings(data.editorSettings);
          onEditorSettingsChange(data.editorSettings);
        }
        if (data.metadata) {
          setLocalMetadata(data.metadata);
        }
        toast.success('設定をインポートしました');
      } catch (_error) {
        toast.error('設定ファイルの読み込みに失敗しました');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <div className="border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <h2 className="font-semibold">ファイル設定</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetSettings}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              リセット
            </Button>

            <Button
              onClick={saveSettings}
              size="sm"
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              保存
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="file" className="gap-2">
              <FileText className="h-4 w-4" />
              ファイル
            </TabsTrigger>
            <TabsTrigger value="editor" className="gap-2">
              <Monitor className="h-4 w-4" />
              エディタ
            </TabsTrigger>
            <TabsTrigger value="keybinds" className="gap-2">
              <Keyboard className="h-4 w-4" />
              キーバインド
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Settings className="h-4 w-4" />
              詳細設定
            </TabsTrigger>
          </TabsList>

          {/* ファイルメタデータ */}
          <TabsContent value="file" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="title">タイトル</Label>
                  <Input
                    id="title"
                    value={localMetadata.title}
                    onChange={(e) => updateMetadata('title', e.target.value)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="description">説明</Label>
                  <Textarea
                    id="description"
                    value={localMetadata.description}
                    onChange={(e) => updateMetadata('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="version">バージョン</Label>
                    <Input
                      id="version"
                      value={localMetadata.version}
                      onChange={(e) => updateMetadata('version', e.target.value)}
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="author">作成者</Label>
                    <Input
                      id="author"
                      value={localMetadata.author}
                      onChange={(e) => updateMetadata('author', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="tags">タグ (カンマ区切り)</Label>
                  <Input
                    id="tags"
                    value={localMetadata.tags.join(', ')}
                    onChange={(e) => updateMetadata('tags', e.target.value.split(',').map(s => s.trim()))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ファイル情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>ファイルパス</Label>
                  <Badge variant="outline" className="font-mono text-xs">
                    {filePath}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <Label>カテゴリ</Label>
                  <Badge variant="secondary">
                    {localMetadata.category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <Label>最終更新</Label>
                  <span className="text-sm text-muted-foreground">
                    {localMetadata.lastModified.toLocaleString('ja-JP')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* エディタ設定 */}
          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>表示設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="theme">テーマ</Label>
                  <Select
                    value={localEditorSettings.theme}
                    onValueChange={(value) => updateEditorSettings('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vs-dark">ダーク</SelectItem>
                      <SelectItem value="vs-light">ライト</SelectItem>
                      <SelectItem value="hc-black">ハイコントラスト</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label>フォントサイズ: {localEditorSettings.fontSize}px</Label>
                  <Slider
                    value={[localEditorSettings.fontSize]}
                    onValueChange={([value]) => updateEditorSettings('fontSize', value)}
                    min={10}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label>行の高さ: {localEditorSettings.lineHeight}</Label>
                  <Slider
                    value={[localEditorSettings.lineHeight]}
                    onValueChange={([value]) => updateEditorSettings('lineHeight', value)}
                    min={1.0}
                    max={2.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <Label htmlFor="minimap">ミニマップ</Label>
                  <Switch
                    id="minimap"
                    checked={localEditorSettings.minimap}
                    onCheckedChange={(checked) => updateEditorSettings('minimap', checked)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="lineNumbers">行番号</Label>
                  <Select
                    value={localEditorSettings.lineNumbers}
                    onValueChange={(value) => updateEditorSettings('lineNumbers', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">表示</SelectItem>
                      <SelectItem value="off">非表示</SelectItem>
                      <SelectItem value="relative">相対表示</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="wordWrap">折り返し</Label>
                  <Select
                    value={localEditorSettings.wordWrap}
                    onValueChange={(value) => updateEditorSettings('wordWrap', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">有効</SelectItem>
                      <SelectItem value="off">無効</SelectItem>
                      <SelectItem value="wordWrapColumn">カラム位置</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* キーバインド設定 */}
          <TabsContent value="keybinds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>キーバインド</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="keyBindings">キーバインドモード</Label>
                  <Select
                    value={localEditorSettings.keyBindings}
                    onValueChange={(value) => updateEditorSettings('keyBindings', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">標準</SelectItem>
                      <SelectItem value="vim">Vim</SelectItem>
                      <SelectItem value="emacs">Emacs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">ショートカットキー</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>保存</span>
                      <Badge variant="outline" className="font-mono">Ctrl+S</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>プレビュー切り替え</span>
                      <Badge variant="outline" className="font-mono">Ctrl+Shift+P</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>図表モード</span>
                      <Badge variant="outline" className="font-mono">Ctrl+Shift+D</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>設定</span>
                      <Badge variant="outline" className="font-mono">Ctrl+,</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>フルスクリーン切り替え</span>
                      <Badge variant="outline" className="font-mono">F11</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 詳細設定 */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>設定のバックアップ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={exportSettings}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    エクスポート
                  </Button>

                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      インポート
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>その他</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>キャッシュクリア</Label>
                  <p className="text-sm text-muted-foreground">
                    エディタのキャッシュデータを削除します
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem('parasol-editor-settings');
                      toast.success('キャッシュをクリアしました');
                    }}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    キャッシュクリア
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}