'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { createClient, ClientItem } from '@/actions/clients'
import { X, Save, Building2 } from 'lucide-react'

const clientSchema = z.object({
  name: z.string().min(1, 'クライアント名は必須です').max(100, '100文字以内で入力してください')
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientCreateDialogProps {
  onClose: () => void
  onClientCreated: (client: ClientItem) => void
}

export function ClientCreateDialog({ onClose, onClientCreated }: ClientCreateDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema)
  })

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true)
    try {
      const newClient = await createClient(data)
      onClientCreated({
        ...newClient,
        projectCount: 0,
        activeProjectCount: 0
      })
      onClose()
    } catch (error: any) {
      console.error('Failed to create client:', error)
      alert(error.message || 'クライアントの作成に失敗しました')
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
            新規クライアント作成
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  作成中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  作成
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}