'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from '@/components/ui/table'
import { searchClients, getClients, ClientItem } from '@/actions/clients'
import { Search, Building2, Check, Plus, X } from 'lucide-react'
import { ClientCreateDialog } from './client-create-dialog'

interface ClientSelectDialogProps {
  selectedClientId?: string
  onSelect: (client: { id: string; name: string }) => void
  onClose: () => void
}

export function ClientSelectDialog({ selectedClientId, onSelect, onClose }: ClientSelectDialogProps) {
  const [clients, setClients] = useState<ClientItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const clientList = await getClients()
      setClients(clientList)
    } catch (_error) {
      console.error('Failed to load clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      await loadClients()
      return
    }
    
    try {
      setLoading(true)
      const results = await searchClients(query)
      setClients(results.map(c => ({ ...c, type: 'client', createdAt: new Date(), updatedAt: new Date() })))
    } catch (_error) {
      console.error('Failed to search clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClientCreated = (newClient: ClientItem) => {
    setClients(prev => [...prev, newClient].sort((a, b) => a.name.localeCompare(b.name)))
    setShowCreateDialog(false)
    onSelect({ id: newClient.id, name: newClient.name })
  }

  const filteredClients = searchQuery
    ? clients
    : clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              クライアント選択
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 検索バー */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="クライアント名で検索"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                新規作成
              </Button>
            </div>

            {/* クライアント一覧 */}
            <div className="border rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="mt-4 text-muted-foreground">読み込み中...</p>
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="p-8 text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery ? '該当するクライアントが見つかりません' : 'クライアントがありません'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>クライアント名</TableHead>
                      <TableHead className="text-center">プロジェクト数</TableHead>
                      <TableHead className="text-center">アクティブ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => {
                      const isSelected = selectedClientId === client.id
                      return (
                        <TableRow
                          key={client.id}
                          className={`cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                          onClick={() => onSelect({ id: client.id, name: client.name })}
                        >
                          <TableCell>
                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{client.name}</span>
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
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              キャンセル
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* クライアント作成ダイアログ */}
      {showCreateDialog && (
        <ClientCreateDialog
          onClose={() => setShowCreateDialog(false)}
          onClientCreated={handleClientCreated}
        />
      )}
    </>
  )
}