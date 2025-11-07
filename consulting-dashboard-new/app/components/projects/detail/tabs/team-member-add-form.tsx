'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Save } from 'lucide-react'
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
  DialogFooter } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from '@/components/ui/select'
import { addTeamMember, getAvailableUsers, AvailableUser } from '@/actions/project-team'
import { 
  TeamMemberRole, 
  teamMemberRoleSchema,
  teamMemberRoleUtils 
} from '@/types/team-member'
import { Search } from 'lucide-react'

const memberSchema = z.object({
  userId: z.string().min(1, 'ユーザーを選択してください'),
  role: teamMemberRoleSchema,
  allocation: z.string().min(1, '稼働率は必須です'),
  startDate: z.string().min(1, '開始日は必須です'),
  endDate: z.string().optional()
})

type MemberFormData = z.infer<typeof memberSchema>

interface TeamMemberAddFormProps {
  projectId: string
  onClose: () => void
  onMemberAdded: () => void
}

export function TeamMemberAddForm({ projectId, onClose, onMemberAdded }: TeamMemberAddFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [usersLoading, setUsersLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      role: 'consultant',
      allocation: '50'
    }
  })

  const watchedUserId = watch('userId')
  const watchedRole = watch('role')
  const watchedAllocation = watch('allocation')

  useEffect(() => {
    loadAvailableUsers()
  }, [])

  const loadAvailableUsers = async () => {
    try {
      setUsersLoading(true)
      const users = await getAvailableUsers()
      setAvailableUsers(users)
    } catch (_error) {
      console.error('Failed to load available users:', error)
    } finally {
      setUsersLoading(false)
    }
  }

  const onSubmit = async (data: MemberFormData) => {
    setIsLoading(true)
    try {
      const memberData = {
        ...data,
        projectId,
        role: data.role as TeamMemberRole,
        allocation: parseInt(data.allocation)
      }
      
      await addTeamMember(memberData)
      onMemberAdded()
      onClose()
    } catch (_error) {
      console.error('Failed to add team member:', error)
      alert('メンバーの追加に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedUser = availableUsers.find(user => user.id === watchedUserId)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>チームメンバー追加</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ユーザー選択 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>ユーザー検索</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="名前またはメールアドレスで検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">ユーザー選択 *</Label>
              {usersLoading ? (
                <div className="h-40 bg-gray-100 rounded-lg animate-pulse" />
              ) : (
                <div className="max-h-40 overflow-y-auto border rounded-lg">
                  {filteredUsers.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      {searchQuery ? '該当するユーザーが見つかりません' : '利用可能なユーザーがいません'}
                    </div>
                  ) : (
                    filteredUsers.map(user => (
                      <div
                        key={user.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                          watchedUserId === user.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setValue('userId', user.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.role.name} • {user.organization.name}
                            </p>
                          </div>
                          {watchedUserId === user.id && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {errors.userId && (
                <p className="text-sm text-red-600">{errors.userId.message}</p>
              )}
            </div>

            {/* 選択されたユーザーの詳細 */}
            {selectedUser && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">選択中: {selectedUser.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ロール・稼働率設定 */}
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">ロール *</Label>
                <Select value={watchedRole} onValueChange={(value) => setValue('role', value as TeamMemberRole)}>
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

          {/* プレビュー */}
          {selectedUser && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">プレビュー</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">メンバー:</span>
                  <span className="text-sm">{selectedUser.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">ロール:</span>
                  <Badge className={roleColors[watchedRole as TeamMemberRole]}>
                    {roleLabels[watchedRole as TeamMemberRole]}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">稼働率:</span>
                  <span className="text-sm">{watchedAllocation}%</span>
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
              disabled={isLoading || !selectedUser}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  追加中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  メンバー追加
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}