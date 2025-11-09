'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { Eye, Edit, AlertCircle, CheckCircle, Save } from 'lucide-react'
import { getSchemaContent, saveSchemaContent } from '@/actions/settings'

const services = [
  { value: 'auth-service', label: '認証サービス' },
  { value: 'project-service', label: 'プロジェクトサービス' },
  { value: 'resource-service', label: 'リソースサービス' },
  { value: 'timesheet-service', label: 'タイムシートサービス' },
  { value: 'notification-service', label: '通知サービス' },
  { value: 'knowledge-service', label: 'ナレッジサービス' },
]

export function SchemaEditor() {
  const [selectedService, setSelectedService] = useState('auth-service')
  const [content, setContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview')

  const loadContent = useCallback(async () => {
    setIsLoading(true)
    setSaveMessage(null)
    try {
      const result = await getSchemaContent(selectedService)
      if (result.success && result.data) {
        setContent(result.data)
        setOriginalContent(result.data)
      } else {
        // ファイルが存在しない場合は空のテンプレートを設定
        const template = `# ${services.find(s => s.value === selectedService)?.label} データベーススキーマ

## 概要
[サービスの説明を記入]

## テーブル構成

### [テーブル名]
[テーブルの説明]

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PRIMARY KEY | レコードID |
| ... | ... | ... | ... |

## リレーションシップ

\`\`\`mermaid
erDiagram
    Table1 ||--o{ Table2 : relation
\`\`\`

## インデックス

- \`idx_table_column\`: Table.column

## 統計情報

- レコード数: ~XXX
- 平均サイズ: XXX KB

## 注意事項

- [重要な注意点を記入]
`
        setContent(template)
        setOriginalContent(template)
      }
    } catch (_error) {
      console.error('Failed to load content:', _error)
      setSaveMessage({ type: 'error', message: 'コンテンツの読み込みに失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }, [selectedService])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const result = await saveSchemaContent(selectedService, content)
      if (result.success) {
        setSaveMessage({ type: 'success', message: '保存しました' })
        setOriginalContent(content)
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage({ type: 'error', message: result.error || '保存に失敗しました' })
      }
    } catch (_error) {
      console.error('Failed to save content:', _error)
      setSaveMessage({ type: 'error', message: '保存中にエラーが発生しました' })
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = content !== originalContent

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="サービスを選択" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.value} value={service.value}>
                {service.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-muted-foreground">読み込み中...</div>
        </div>
      ) : (
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'edit' | 'preview')}>
          <TabsList>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              編集
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              プレビュー
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[500px] font-mono text-sm"
              placeholder="Markdown形式でスキーマ情報を記述..."
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <Card className="p-6 min-h-[500px] overflow-auto">
              <MarkdownRenderer content={content} />
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {hasChanges && (
        <div className="flex items-center gap-2 text-sm text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <span>未保存の変更があります</span>
        </div>
      )}
    </div>
  )
}