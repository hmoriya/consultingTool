'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { Save, FileText, Eye, Edit, AlertCircle, CheckCircle } from 'lucide-react'
import { getDomainContent, saveDomainContent } from '@/actions/settings'

const domains = [
  { value: 'auth-domain', label: '認証ドメイン' },
  { value: 'project-domain', label: 'プロジェクトドメイン' },
  { value: 'resource-domain', label: 'リソースドメイン' },
  { value: 'timesheet-domain', label: 'タイムシートドメイン' },
  { value: 'notification-domain', label: '通知ドメイン' },
  { value: 'knowledge-domain', label: 'ナレッジドメイン' },
]

export function DomainEditor() {
  const [selectedDomain, setSelectedDomain] = useState('auth-domain')
  const [content, setContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview')

  useEffect(() => {
    loadContent()
  }, [selectedDomain])

  const loadContent = async () => {
    setIsLoading(true)
    setSaveMessage(null)
    try {
      const result = await getDomainContent(selectedDomain)
      if (result.success && result.data) {
        setContent(result.data)
        setOriginalContent(result.data)
      } else {
        // ファイルが存在しない場合は空のテンプレートを設定
        const template = `# ${domains.find(d => d.value === selectedDomain)?.label} モデル

## ドメイン概要
[ドメインの説明を記入]

## エンティティ (Entities)

### [エンティティ名]
[エンティティの説明]

\`\`\`typescript
class Entity {
  id: UUID
  // プロパティ定義

  // ビジネスロジック
}
\`\`\`

## 値オブジェクト (Value Objects)

### [値オブジェクト名]
\`\`\`typescript
class ValueObject {
  private readonly value: type

  constructor(value: type) {
    // バリデーション
  }
}
\`\`\`

## 集約 (Aggregates)

### [集約名]
- Root: [ルートエンティティ]
- Entities: [含まれるエンティティ]
- Value Objects: [含まれる値オブジェクト]

## ドメインサービス

### [サービス名]
[サービスの説明]

\`\`\`typescript
class DomainService {
  // サービスメソッド
}
\`\`\`

## ドメインイベント

### [イベント名]
\`\`\`typescript
class DomainEvent {
  constructor(
    public readonly field: type
  ) {}
}
\`\`\`

## ビジネスルール

### [ルールカテゴリ]
1. **ルール1**: 説明
2. **ルール2**: 説明
3. **ルール3**: 説明

## リポジトリインターフェース

### [リポジトリ名]
\`\`\`typescript
interface Repository {
  findById(id: string): Promise<Entity | null>
  save(entity: Entity): Promise<void>
}
\`\`\`
`
        setContent(template)
        setOriginalContent(template)
      }
    } catch (error) {
      console.error('Failed to load content:', error)
      setSaveMessage({ type: 'error', message: 'コンテンツの読み込みに失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const result = await saveDomainContent(selectedDomain, content)
      if (result.success) {
        setSaveMessage({ type: 'success', message: '保存しました' })
        setOriginalContent(content)
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage({ type: 'error', message: result.error || '保存に失敗しました' })
      }
    } catch (error) {
      console.error('Failed to save content:', error)
      setSaveMessage({ type: 'error', message: '保存中にエラーが発生しました' })
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = content !== originalContent

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={selectedDomain} onValueChange={setSelectedDomain}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="ドメインを選択" />
          </SelectTrigger>
          <SelectContent>
            {domains.map((domain) => (
              <SelectItem key={domain.value} value={domain.value}>
                {domain.label}
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
              placeholder="Markdown形式でドメインモデルを記述..."
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