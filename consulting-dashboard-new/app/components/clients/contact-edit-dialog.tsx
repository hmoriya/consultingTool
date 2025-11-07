'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { updateOrganizationContact, OrganizationContactItem } from '@/actions/organization-contacts'
import { X, Save, UserCheck } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(1, '担当者名は必須です').max(100, '100文字以内で入力してください'),
  title: z.string().optional(),
  department: z.string().optional(),
  email: z.string().email('正しいメールアドレスを入力してください').optional().or(z.literal('')),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  isPrimary: z.boolean().default(false),
  notes: z.string().optional()
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactEditDialogProps {
  contact: OrganizationContactItem
  organizationName: string
  onClose: () => void
  onContactUpdated: (contact: OrganizationContactItem) => void
}

export function ContactEditDialog({ 
  contact, 
  organizationName, 
  onClose, 
  onContactUpdated 
}: ContactEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact.name,
      title: contact.title || '',
      department: contact.department || '',
      email: contact.email || '',
      phone: contact.phone || '',
      mobile: contact.mobile || '',
      isPrimary: contact.isPrimary,
      notes: contact.notes || ''
    }
  })

  const watchedData = watch()

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    try {
      const updatedContact = await updateOrganizationContact(contact.id, data)
      onContactUpdated(updatedContact)
      onClose()
    } catch (error: unknown) {
      console.error('Failed to update contact:', error)
      alert(error.message || '担当者の更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = JSON.stringify(watchedData) !== JSON.stringify({
    name: contact.name,
    title: contact.title || '',
    department: contact.department || '',
    email: contact.email || '',
    phone: contact.phone || '',
    mobile: contact.mobile || '',
    isPrimary: contact.isPrimary,
    notes: contact.notes || ''
  })

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            担当者編集 - {organizationName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">担当者名 *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="例：田中 太郎"
                autoFocus
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">役職</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="例：部長"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">部署</Label>
              <Input
                id="department"
                {...register('department')}
                placeholder="例：システム開発部"
              />
              {errors.department && (
                <p className="text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                {...register('email')}
                placeholder="例：tanaka@example.com"
                type="email"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
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
              <Label htmlFor="mobile">携帯電話</Label>
              <Input
                id="mobile"
                {...register('mobile')}
                placeholder="例：090-1234-5678"
                type="tel"
              />
              {errors.mobile && (
                <p className="text-sm text-red-600">{errors.mobile.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrimary"
                  checked={watchedData.isPrimary}
                  onCheckedChange={(checked) => setValue('isPrimary', !!checked)}
                />
                <Label htmlFor="isPrimary" className="font-medium">
                  主担当者として設定
                </Label>
              </div>
              {watchedData.isPrimary && !contact.isPrimary && (
                <p className="text-sm text-muted-foreground">
                  この担当者を主担当者に設定します。既存の主担当者がいる場合は更新されます。
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">備考</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="担当者に関する備考や特記事項を入力してください"
                rows={3}
              />
              {errors.notes && (
                <p className="text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>
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
              disabled={isLoading || !hasChanges}
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