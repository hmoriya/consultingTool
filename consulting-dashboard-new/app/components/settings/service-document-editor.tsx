'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import {
  Save,
  Layers,
  Code2,
  Database,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import {
  getDomainContent,
  saveDomainContent,
  getApiContent,
  saveApiContent,
  getSchemaContent,
  saveSchemaContent
} from '@/actions/settings'

interface ServiceDocumentEditorProps {
  service: string
  domain: string
}

type DocumentType = 'domain' | 'api' | 'database'
type ViewMode = 'preview' | 'edit'

export function ServiceDocumentEditor({ service, domain }: ServiceDocumentEditorProps) {
  const [activeTab, setActiveTab] = useState<DocumentType>('domain')
  const [viewMode, setViewMode] = useState<ViewMode>('preview') // デフォルトをpreviewに変更

  // 各ドキュメントタイプごとの状態管理
  const [domainContent, setDomainContent] = useState('')
  const [apiContent, setApiContent] = useState('')
  const [schemaContent, setSchemaContent] = useState('')

  const [originalDomainContent, setOriginalDomainContent] = useState('')
  const [originalApiContent, setOriginalApiContent] = useState('')
  const [originalSchemaContent, setOriginalSchemaContent] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // サービス変更時に全コンテンツを読み込み
  useEffect(() => {
    loadAllContent()
  }, [service, domain])

  const loadAllContent = async () => {
    setIsLoading(true)
    setSaveMessage(null)

    try {
      // ドメインコンテンツ読み込み
      const domainResult = await getDomainContent(domain)
      if (domainResult.success && domainResult.data) {
        setDomainContent(domainResult.data)
        setOriginalDomainContent(domainResult.data)
      } else {
        setDomainContent(getDefaultDomainTemplate())
        setOriginalDomainContent(getDefaultDomainTemplate())
      }

      // APIコンテンツ読み込み
      const apiResult = await getApiContent(service)
      if (apiResult.success && apiResult.data) {
        setApiContent(apiResult.data)
        setOriginalApiContent(apiResult.data)
      } else {
        setApiContent(getDefaultApiTemplate())
        setOriginalApiContent(getDefaultApiTemplate())
      }

      // スキーマコンテンツ読み込み
      const schemaResult = await getSchemaContent(service)
      if (schemaResult.success && schemaResult.data) {
        setSchemaContent(schemaResult.data)
        setOriginalSchemaContent(schemaResult.data)
      } else {
        setSchemaContent(getDefaultSchemaTemplate())
        setOriginalSchemaContent(getDefaultSchemaTemplate())
      }
    } catch (error) {
      console.error('Failed to load content:', error)
      setSaveMessage({ type: 'error', message: 'コンテンツの読み込みに失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'domain': return domainContent
      case 'api': return apiContent
      case 'database': return schemaContent
    }
  }

  const getOriginalContent = () => {
    switch (activeTab) {
      case 'domain': return originalDomainContent
      case 'api': return originalApiContent
      case 'database': return originalSchemaContent
    }
  }

  const setCurrentContent = (content: string) => {
    switch (activeTab) {
      case 'domain': setDomainContent(content); break
      case 'api': setApiContent(content); break
      case 'database': setSchemaContent(content); break
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      let result
      switch (activeTab) {
        case 'domain':
          result = await saveDomainContent(domain, domainContent)
          if (result.success) setOriginalDomainContent(domainContent)
          break
        case 'api':
          result = await saveApiContent(service, apiContent)
          if (result.success) setOriginalApiContent(apiContent)
          break
        case 'database':
          result = await saveSchemaContent(service, schemaContent)
          if (result.success) setOriginalSchemaContent(schemaContent)
          break
      }

      if (result?.success) {
        setSaveMessage({ type: 'success', message: '保存しました' })
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage({ type: 'error', message: result?.error || '保存に失敗しました' })
      }
    } catch (error) {
      console.error('Failed to save content:', error)
      setSaveMessage({ type: 'error', message: '保存中にエラーが発生しました' })
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = getCurrentContent() !== getOriginalContent()

  const getDefaultDomainTemplate = () => `# ${domain.replace('-domain', '')}ドメインモデル

## ドメイン概要
[ドメインの説明を記入]

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_N: 最大N文字の文字列
TEXT: 長文テキスト（制限なし）
[他の型定義...]
\`\`\`

## エンティティ（Entities）

## 値オブジェクト（Value Objects）

## 集約（Aggregates）

## ドメインサービス

## ドメインイベント

## ビジネスルール

## リポジトリインターフェース
`

  const getDefaultApiTemplate = () => `# ${service.replace('-service', '')} API仕様

## 基本情報
- ベースURL: \`/api/${service.replace('-service', '')}\`
- 認証: JWT Bearer Token
- Content-Type: application/json

## エンドポイント一覧

[APIエンドポイントの定義]
`

  const getDefaultSchemaTemplate = () => `# ${service.replace('-service', '')} データベーススキーマ

## テーブル定義

[テーブル定義を記述]
`

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DocumentType)}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="domain" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              ドメイン
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              データベース
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {saveMessage && (
              <Alert className={`border-0 p-2 ${saveMessage.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                <AlertDescription className="flex items-center gap-2 text-sm">
                  {saveMessage.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  {saveMessage.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('preview')}
                className="rounded-r-none"
              >
                <Eye className="h-4 w-4 mr-2" />
                プレビュー
              </Button>
              <Button
                variant={viewMode === 'edit' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('edit')}
                className="rounded-l-none"
              >
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Button>
            </div>

            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[500px] border rounded-lg">
            <div className="text-muted-foreground">読み込み中...</div>
          </div>
        ) : (
          <>
            <TabsContent value="domain" className="mt-0">
              <div className="border rounded-lg">
                {viewMode === 'edit' ? (
                  <Textarea
                    value={domainContent}
                    onChange={(e) => setDomainContent(e.target.value)}
                    className="min-h-[500px] font-mono text-sm border-0 focus-visible:ring-0"
                    placeholder="パラソルドメイン言語でドメインモデルを記述..."
                  />
                ) : (
                  <div className="p-6 min-h-[500px] overflow-auto">
                    <MarkdownRenderer content={domainContent} />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="api" className="mt-0">
              <div className="border rounded-lg">
                {viewMode === 'edit' ? (
                  <Textarea
                    value={apiContent}
                    onChange={(e) => setApiContent(e.target.value)}
                    className="min-h-[500px] font-mono text-sm border-0 focus-visible:ring-0"
                    placeholder="API仕様を記述..."
                  />
                ) : (
                  <div className="p-6 min-h-[500px] overflow-auto">
                    <MarkdownRenderer content={apiContent} />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="database" className="mt-0">
              <div className="border rounded-lg">
                {viewMode === 'edit' ? (
                  <Textarea
                    value={schemaContent}
                    onChange={(e) => setSchemaContent(e.target.value)}
                    className="min-h-[500px] font-mono text-sm border-0 focus-visible:ring-0"
                    placeholder="データベーススキーマを記述..."
                  />
                ) : (
                  <div className="p-6 min-h-[500px] overflow-auto">
                    <MarkdownRenderer content={schemaContent} />
                  </div>
                )}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {hasChanges && viewMode === 'edit' && (
        <div className="flex items-center gap-2 text-sm text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <span>未保存の変更があります</span>
        </div>
      )}
    </div>
  )
}