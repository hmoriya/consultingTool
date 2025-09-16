'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createTeamMember, TeamMemberItem } from '@/actions/team'
import { X, Save, Users, Loader2 } from 'lucide-react'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/db'

const memberSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  name: z.string().min(1, '名前を入力してください'),
  roleId: z.string().min(1, 'ロールを選択してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  confirmPassword: z.string().min(8, '確認用パスワードを入力してください')
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
})

interface TeamCreateDialogProps {
  onClose: () => void
  onMemberCreated: (member: TeamMemberItem) => void
}

export function TeamCreateDialog({ onClose, onMemberCreated }: TeamCreateDialogProps) {
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
  })

  // ロールを取得
  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await fetch('/api/roles')
        if (!response.ok) throw new Error('Failed to fetch roles')
        const data = await response.json()
        setRoles(data.filter((role: Role) => ['executive', 'pm', 'consultant'].includes(role.name)))
      } catch (error) {
        console.error('Failed to fetch roles:', error)
      }
    }
    fetchRoles()
  }, [])

  const onSubmit = async (values: z.infer<typeof memberSchema>) => {
    setLoading(true)
    try {
      const member = await createTeamMember({
        email: values.email,
        name: values.name,
        roleId: values.roleId,
        password: values.password
      })
      
      onMemberCreated(member as TeamMemberItem)
      onClose()
    } catch (error) {
      console.error('Failed to create member:', error)
      alert(error instanceof Error ? error.message : 'メンバーの作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const selectedRoleId = watch('roleId')

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            新規メンバー追加
          </DialogTitle>
          <DialogDescription>
            コンサルティングファームの新しいメンバーを追加します
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">名前 *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="山田太郎"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">メールアドレス *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="yamada@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">ロール *</Label>
              <Select
                value={selectedRoleId}
                onValueChange={(value) => setValue('roleId', value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="ロールを選択" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId && (
                <p className="text-sm text-red-500">{errors.roleId.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">パスワード *</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="8文字以上のパスワード"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">パスワード（確認） *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                placeholder="パスワードを再入力"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              作成
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}