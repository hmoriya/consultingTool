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
  DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from '@/components/ui/select'
import { updateTeamMember, TeamMemberItem } from '@/actions/team'
import { Loader2, Users, X, Save } from 'lucide-react'
import { Role } from '@prisma/client'

const memberSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  roleId: z.string().min(1, 'ロールを選択してください'),
})

interface TeamEditDialogProps {
  member: TeamMemberItem
  onClose: () => void
  onMemberUpdated: (member: TeamMemberItem) => void
}

export function TeamEditDialog({ member, onClose, onMemberUpdated }: TeamEditDialogProps) {
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
    defaultValues: {
      name: member.name,
      roleId: member.roleId,
    }
  })

  // ロールを取得
  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await fetch('/api/roles')
        if (!response.ok) throw new Error('Failed to fetch roles')
        const data = await response.json()
        setRoles(data.filter((role: Role) => ['executive', 'pm', 'consultant'].includes(role.name)))
      } catch (_error) {
        console.error('Failed to fetch roles:', error)
      }
    }
    fetchRoles()
  }, [])

  const onSubmit = async (values: z.infer<typeof memberSchema>) => {
    setLoading(true)
    try {
      const updatedMember = await updateTeamMember(member.id, {
        name: values.name,
        roleId: values.roleId,
      })
      
      onMemberUpdated(updatedMember as TeamMemberItem)
      onClose()
    } catch (_error) {
      console.error('Failed to update member:', error)
      alert(error instanceof Error ? error.message : 'メンバーの更新に失敗しました')
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
            メンバー情報編集
          </DialogTitle>
          <DialogDescription>
            メンバーの基本情報を更新します
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>メールアドレス</Label>
              <Input
                value={member.email}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                メールアドレスは変更できません
              </p>
            </div>

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

            {member._count && member._count.projectMembers > 0 && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">参加プロジェクト数</p>
                <p className="text-2xl font-bold">{member._count.projectMembers}件</p>
                <p className="text-sm text-muted-foreground mt-1">
                  プロジェクトに参加中のメンバーです
                </p>
              </div>
            )}
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
              更新
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}