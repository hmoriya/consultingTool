'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  name: z.string().min(1, 'クライアント名は必須です').max(100, '100文字以内で入力してください'),
  industry: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
  employeeCount: z.number().min(1, '1以上の数値を入力してください').optional(),
  foundedYear: z.number().min(1800, '1800年以降の年を入力してください').max(new Date().getFullYear(), '未来の年は入力できません').optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('正しいメールアドレスを入力してください').optional().or(z.literal(''))
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
      name: client.name,
      industry: client.industry || '',
      description: client.description || '',
      website: client.website || '',
      employeeCount: client.employeeCount || undefined,
      foundedYear: client.foundedYear || undefined,
      address: client.address || '',
      phone: client.phone || '',
      email: client.email || ''
    }
  })

  const watchedData = watch()

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
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

            <div className="space-y-2">
              <Label htmlFor="industry">業界</Label>
              <Input
                id="industry"
                {...register('industry')}
                placeholder="例：製造業"
              />
              {errors.industry && (
                <p className="text-sm text-red-600">{errors.industry.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">ウェブサイト</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="例：https://example.com"
                type="url"
              />
              {errors.website && (
                <p className="text-sm text-red-600">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCount">従業員数</Label>
              <Input
                id="employeeCount"
                {...register('employeeCount', { valueAsNumber: true })}
                placeholder="例：100"
                type="number"
                min="1"
              />
              {errors.employeeCount && (
                <p className="text-sm text-red-600">{errors.employeeCount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedYear">設立年</Label>
              <Input
                id="foundedYear"
                {...register('foundedYear', { valueAsNumber: true })}
                placeholder="例：2000"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
              />
              {errors.foundedYear && (
                <p className="text-sm text-red-600">{errors.foundedYear.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="例：03-1234-5678"
                type="tel"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">代表メールアドレス</Label>
              <Input
                id="email"
                {...register('email')}
                placeholder="例：info@example.com"
                type="email"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">住所</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="例：東京都千代田区丸の内1-1-1"
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">企業概要</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="企業の概要や事業内容を入力してください"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* 変更プレビュー */}
          {JSON.stringify(watchedData) !== JSON.stringify({
            name: client.name,
            industry: client.industry || '',
            description: client.description || '',
            website: client.website || '',
            employeeCount: client.employeeCount || undefined,
            foundedYear: client.foundedYear || undefined,
            address: client.address || '',
            phone: client.phone || '',
            email: client.email || ''
          }) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-3">
                <p className="text-sm font-medium mb-2">変更内容プレビュー:</p>
                <div className="space-y-1 text-sm">
                  {watchedData.name !== client.name && (
                    <div>
                      <span className="font-medium">クライアント名:</span> {client.name} → {watchedData.name}
                    </div>
                  )}
                  {watchedData.industry !== (client.industry || '') && (
                    <div>
                      <span className="font-medium">業界:</span> {client.industry || '(未設定)'} → {watchedData.industry || '(未設定)'}
                    </div>
                  )}
                  {watchedData.website !== (client.website || '') && (
                    <div>
                      <span className="font-medium">ウェブサイト:</span> {client.website || '(未設定)'} → {watchedData.website || '(未設定)'}
                    </div>
                  )}
                </div>
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
              disabled={isLoading || JSON.stringify(watchedData) === JSON.stringify({
                name: client.name,
                industry: client.industry || '',
                description: client.description || '',
                website: client.website || '',
                employeeCount: client.employeeCount || undefined,
                foundedYear: client.foundedYear || undefined,
                address: client.address || '',
                phone: client.phone || '',
                email: client.email || ''
              })}
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