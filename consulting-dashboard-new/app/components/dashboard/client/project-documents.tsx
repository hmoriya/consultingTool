'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, File, FileText } from 'lucide-react'
import { getProjectDocuments } from '@/actions/client-portal'

interface ProjectDocumentsProps {
  projectId: string
}

interface DocumentInfo {
  id: string
  type: string
  name: string
  size: string
  uploadedAt: string
  uploadedBy: string
}

export function ProjectDocuments({ projectId }: ProjectDocumentsProps) {
  const [documents, setDocuments] = useState<DocumentInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await getProjectDocuments(projectId)
        setDocuments(docs)
      } catch (_error) {
        console.error('Failed to load documents:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDocuments()
  }, [projectId])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="h-4 w-4 text-red-600" />
      case 'docx':
        return <File className="h-4 w-4 text-blue-600" />
      case 'xlsx':
        return <File className="h-4 w-4 text-green-600" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <h4 className="font-medium text-sm">プロジェクト資料</h4>
        <div className="text-center py-4 text-sm text-muted-foreground">
          読み込み中...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">プロジェクト資料</h4>
        <span className="text-xs text-muted-foreground">
          {documents.length}件のドキュメント
        </span>
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">
          ドキュメントはありません
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(doc.type)}
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{formatDate(doc.uploadedAt)}</span>
                    <span>•</span>
                    <span>{doc.uploadedBy}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}