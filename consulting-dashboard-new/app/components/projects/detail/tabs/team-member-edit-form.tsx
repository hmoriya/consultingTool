'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateTeamMember, TeamMemberItem } from '@/actions/project-team'
import { 
  TeamMemberRole, 
  teamMemberRoleSchema,
  teamMemberRoleUtils 
} from '@/types/team-member'
import { X, Save } from 'lucide-react'
import { format } from 'date-fns'

const memberSchema = z.object({
  role: teamMemberRoleSchema,
  allocation: z.string().min(1, '稼働率は必須です'),
  startDate: z.string().min(1, '開始日は必須です'),
  endDate: z.string().optional()
})

type MemberFormData = z.infer<typeof memberSchema>

interface TeamMemberEditFormProps {
  member: TeamMemberItem
  onClose: () => void
  onMemberUpdated: () => void
}

export function TeamMemberEditForm({ member, onClose, onMemberUpdated }: TeamMemberEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      role: member.role,
      allocation: member.allocation.toString(),
      startDate: format(new Date(member.startDate), 'yyyy-MM-dd'),
      endDate: member.endDate ? format(new Date(member.endDate), 'yyyy-MM-dd') : ''
    }
  })

  const watchedRole = watch('role')
  const watchedAllocation = watch('allocation')

  const onSubmit = async (data: MemberFormData) => {
    setIsLoading(true)
    try {
      const updateData = {
        role: data.role as TeamMemberRole,
        allocation: parseInt(data.allocation),
        startDate: data.startDate,
        endDate: data.endDate || undefined
      }
      
      await updateTeamMember(member.id, updateData)
      onMemberUpdated()
      onClose()
    } catch (error) {
      console.error('Failed to update team member:', error)
      alert('メンバー情報の更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>メンバー情報編集</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* メンバー情報表示 */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm">編集対象メンバー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {member.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.user.name}</p>
                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ロール・稼働率設定 */}
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">ロール *</Label>
                <Select value={watchedRole} onValueChange={(value) => setValue('role', value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMemberRoleUtils.getSelectOptions().map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Badge className={teamMemberRoleUtils.getColor(value)}>
                            {label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allocation">稼働率 (%) *</Label>
                <Input
                  id="allocation"
                  type="number"
                  min="1"
                  max="100"
                  {...register('allocation')}
                  placeholder="50"
                />
                {errors.allocation && (
                  <p className="text-sm text-red-600">{errors.allocation.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 期間設定 */}
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">開始日 *</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">終了日</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                />
                <p className="text-xs text-muted-foreground">
                  空白の場合は無期限となります
                </p>
              </div>
            </div>
          </div>

          {/* 変更プレビュー */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm">変更プレビュー</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <span className="text-sm font-medium">変更前:</span>
                  <div className="mt-1 space-y-1">
                    <Badge className={teamMemberRoleUtils.getColor(member.role)}>
                      {teamMemberRoleUtils.getLabel(member.role)}
                    </Badge>
                    <p className="text-sm text-muted-foreground">稼働率: {member.allocation}%</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">変更後:</span>
                  <div className="mt-1 space-y-1">
                    <Badge className={teamMemberRoleUtils.getColor(watchedRole as TeamMemberRole)}>
                      {teamMemberRoleUtils.getLabel(watchedRole as TeamMemberRole)}
                    </Badge>
                    <p className="text-sm text-muted-foreground">稼働率: {watchedAllocation}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
              className="min-w-[120px]"
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