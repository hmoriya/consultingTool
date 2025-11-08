'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Search, 
  Building2,
  Edit,
  Briefcase,
  ExternalLink,
  MoreVertical,
  Trash2
} from 'lucide-react'
import { ClientItem, deleteClient } from '@/actions/clients'
import { ClientCreateDialog } from './client-create-dialog'
import { ClientEditDialog } from './client-edit-dialog'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'
import { useUser } from '@/contexts/user-context'
import { USER_ROLES } from '@/constants/roles'

interface ClientListProps {
  initialClients: ClientItem[]
}

export function ClientList({ initialClients }: ClientListProps) {
  const { user } = useUser()
  const [clients, setClients] = useState<ClientItem[]>(initialClients)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null)
  const [loading, setLoading] = useState(false)

  // クライアント作成・編集・削除権限のチェック
  const canManageClients = user?.role.name === USER_ROLES.EXECUTIVE || user?.role.name === USER_ROLES.PM

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('このクライアントを削除しますか？関連するプロジェクトがある場合は削除できません。')) return
    
    setLoading(true)
    try {
      await deleteClient(clientId)
      setClients(prev => prev.filter(c => c.id !== clientId))
    } catch (_error) {
      console.error('Failed to delete client:', error)
      alert('クライアントの削除に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleClientCreated = (newClient: ClientItem) => {
    setClients(prev => [...prev, newClient].sort((a, b) => a.name.localeCompare(b.name)))
  }

  const handleClientUpdated = (updatedClient: ClientItem) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c))
  }

  return (
    <div className="space-y-6">
      {/* アクションバー */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="クライアント名で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {canManageClients && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                新規クライアント
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">総クライアント数</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">総プロジェクト数</p>
                <p className="text-2xl font-bold">
                  {clients.reduce((sum, c) => sum + (c.projectCount || 0), 0)}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">アクティブプロジェクト</p>
                <p className="text-2xl font-bold">
                  {clients.reduce((sum, c) => sum + (c.activeProjectCount || 0), 0)}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* クライアント一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>クライアント一覧 ({filteredClients.length}件)</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? '該当するクライアントが見つかりません' : 'クライアントが登録されていません'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>クライアント名</TableHead>
                  <TableHead className="text-center">プロジェクト数</TableHead>
                  <TableHead className="text-center">アクティブ</TableHead>
                  <TableHead>登録日</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <Link 
                          href={`/clients/${client.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {client.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {client.projectCount || 0} 件
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {client.activeProjectCount ? (
                        <Badge className="bg-green-100 text-green-700">
                          {client.activeProjectCount} 件
                        </Badge>
                      ) : (
                        <Badge variant="outline">0 件</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(client.createdAt), 'yyyy/MM/dd', { locale: ja })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/clients/${client.id}`}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              詳細を見る
                            </Link>
                          </DropdownMenuItem>
                          {canManageClients && (
                            <>
                              <DropdownMenuItem onClick={() => setEditingClient(client)}>
                                <Edit className="h-4 w-4 mr-2" />
                                編集
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteClient(client.id)}
                                disabled={loading || (client.projectCount || 0) > 0}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                削除
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* クライアント作成ダイアログ */}
      {showCreateDialog && (
        <ClientCreateDialog
          onClose={() => setShowCreateDialog(false)}
          onClientCreated={handleClientCreated}
        />
      )}

      {/* クライアント編集ダイアログ */}
      {editingClient && (
        <ClientEditDialog
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onClientUpdated={handleClientUpdated}
        />
      )}
    </div>
  )
}