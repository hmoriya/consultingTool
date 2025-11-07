'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from '@/components/ui/table'
import {
  FileSpreadsheet,
  FileImage,
  FileArchive,
  Download,
  Upload,
  Search,
  Filter,
  FolderOpen,
  File,
  Eye,
  Edit,
  Share2,
  FileText,
  Trash2
} from 'lucide-react'

interface ProjectDocumentsProps {
  project: unknown
}

export function ProjectDocuments({ project }: ProjectDocumentsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // ダミーのドキュメントデータ
  const documents = [
    {
      id: '1',
      name: '要件定義書_v2.3.docx',
      category: 'requirement',
      type: 'docx',
      size: '2.4 MB',
      uploadedBy: '山田 太郎',
      uploadedAt: '2024-01-15',
      lastModified: '2024-01-20',
      version: 'v2.3',
      status: 'approved'
    },
    {
      id: '2',
      name: 'プロジェクト計画書.xlsx',
      category: 'plan',
      type: 'xlsx',
      size: '1.8 MB',
      uploadedBy: '鈴木 花子',
      uploadedAt: '2024-01-10',
      lastModified: '2024-01-18',
      version: 'v1.5',
      status: 'draft'
    },
    {
      id: '3',
      name: 'システム設計書_最終版.pdf',
      category: 'design',
      type: 'pdf',
      size: '5.2 MB',
      uploadedBy: '田中 一郎',
      uploadedAt: '2024-01-25',
      lastModified: '2024-01-25',
      version: 'v3.0',
      status: 'approved'
    },
    {
      id: '4',
      name: '進捗報告書_202401.pptx',
      category: 'report',
      type: 'pptx',
      size: '3.1 MB',
      uploadedBy: '佐藤 美穂',
      uploadedAt: '2024-01-30',
      lastModified: '2024-01-30',
      version: 'v1.0',
      status: 'review'
    }
  ]

  const categories = {
    all: '全て',
    requirement: '要件定義',
    design: '設計',
    plan: '計画',
    report: 'レポート',
    meeting: '会議録',
    other: 'その他'
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'docx':
      case 'doc':
      case 'pdf':
        return FileText
      case 'xlsx':
      case 'xls':
        return FileSpreadsheet
      case 'png':
      case 'jpg':
      case 'jpeg':
        return FileImage
      case 'zip':
      case 'rar':
        return FileArchive
      default:
        return File
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700'
      case 'review':
        return 'bg-yellow-100 text-yellow-700'
      case 'draft':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return '承認済み'
      case 'review':
        return 'レビュー中'
      case 'draft':
        return '下書き'
      default:
        return status
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* 検索とフィルタ */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ドキュメントを検索..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              フィルタ
            </Button>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              アップロード
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* カテゴリータブ */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          {Object.entries(categories).map(([key, label]) => (
            <TabsTrigger key={key} value={key}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ドキュメント一覧 */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ドキュメント名</TableHead>
                  <TableHead>カテゴリ</TableHead>
                  <TableHead>サイズ</TableHead>
                  <TableHead>更新日</TableHead>
                  <TableHead>アップロード者</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <FolderOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">ドキュメントが見つかりません</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => {
                    const Icon = getFileIcon(doc.type)
                    return (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Version {doc.version}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {categories[doc.category as keyof typeof categories]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {doc.size}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {doc.lastModified}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {doc.uploadedBy}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(doc.status)}>
                            {getStatusLabel(doc.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>

      {/* ストレージ使用状況 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ストレージ使用状況</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>使用中</span>
                <span className="font-medium">256 MB / 1 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25.6%' }} />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-muted-foreground">ドキュメント数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">共有中</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近の活動</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 mt-0.5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm">要件定義書が更新されました</p>
                  <p className="text-xs text-muted-foreground">山田 太郎 • 2時間前</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Upload className="h-4 w-4 mt-0.5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm">新しいレポートがアップロードされました</p>
                  <p className="text-xs text-muted-foreground">佐藤 美穂 • 5時間前</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Share2 className="h-4 w-4 mt-0.5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm">設計書が共有されました</p>
                  <p className="text-xs text-muted-foreground">田中 一郎 • 1日前</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}