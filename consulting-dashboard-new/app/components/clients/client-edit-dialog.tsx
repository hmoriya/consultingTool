'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { updateClient, ClientItem } from '@/actions/clients'
import { X, Save, Building2, Briefcase } from 'lucide-react'

const clientSchema = z.object({
  name: z.string().min(1, 'クライアント名は必須です').max(100, '100文字以内で入力してください')
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientEditDialogProps {
  client: ClientItem
  onClose: () => void
  onClientUpdated: (client: ClientItem) => void
}

export function ClientEditDialog({ client, onClose, onClientUpdated }: ClientEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client.name
    }
  })

  const watchedName = watch('name')

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true)
    try {
      const updatedClient = await updateClient(client.id, data)
      onClientUpdated({
        ...updatedClient,
        projectCount: client.projectCount,
        activeProjectCount: client.activeProjectCount
      })
      onClose()
    } catch (error: any) {
      console.error('Failed to update client:', error)
      alert(error.message || 'クライアントの更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            クライアント編集
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 現在のクライアント情報 */}
          <Card className="bg-gray-50">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">クライアント情報</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    プロジェクト数: {client.projectCount || 0} 件
                    {client.activeProjectCount ? (
                      <Badge className="ml-2 bg-green-100 text-green-700" variant="secondary">
                        アクティブ: {client.activeProjectCount}件
                      </Badge>
                    ) : null}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="name">クライアント名 *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="例：株式会社ABC商事"
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* 変更プレビュー */}
          {watchedName !== client.name && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-3">
                <p className="text-sm">
                  <span className="font-medium">変更前:</span> {client.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">変更後:</span> {watchedName}
                </p>
              </CardContent>
            </Card>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isLoading || watchedName === client.name}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  更新中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  更新
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}