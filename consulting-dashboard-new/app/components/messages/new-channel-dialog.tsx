'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { createChannel } from '@/actions/messages'
import { getAllUsers } from '@/actions/users'
import { getActiveProjects } from '@/actions/projects'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Channel } from '@/lib/utils/message-converter'

interface NewChannelDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: (channel: Channel) => void
}

interface User {
  id: string
  name: string
  email: string
}

interface Project {
  id: string
  name: string
}

export function NewChannelDialog({ open, onClose, onSuccess }: NewChannelDialogProps) {
  const [type, setType] = useState<'channel' | 'direct'>('channel')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    if (open) {
      // ユーザーとプロジェクトのリストを取得
      Promise.all([
        getAllUsers(),
        getActiveProjects()
      ]).then(([usersResult, projectsResult]) => {
        if (usersResult.success) {
          setUsers(usersResult.data || [])
        }
        if (projectsResult.success) {
          setProjects(projectsResult.data || [])
        }
      })
    }
  }, [open])

  const handleSubmit = async () => {
    if (type === 'channel' && !name) {
      toast.error('チャンネル名を入力してください')
      return
    }
    if (type === 'direct' && !selectedUserId) {
      toast.error('ユーザーを選択してください')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createChannel({
        type: type === 'direct' ? 'DIRECT' : (projectId && projectId !== 'none') ? 'PROJECT' : 'GROUP',
        name: type === 'channel' ? name : undefined,
        description: type === 'channel' ? description : undefined,
        projectId: projectId === 'none' ? undefined : projectId || undefined,
        isPrivate,
        memberIds: type === 'direct' ? [selectedUserId] : undefined
      })

      if (result.success) {
        toast.success(type === 'direct' ? 'ダイレクトメッセージを開始しました' : 'チャンネルを作成しました')
        onSuccess(result.data)
        handleClose()
      } else {
        toast.error(result.error || '作成に失敗しました')
      }
    } catch (_error) {
      toast.error('エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setType('channel')
    setName('')
    setDescription('')
    setProjectId('')
    setIsPrivate(false)
    setSelectedUserId('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新規作成</DialogTitle>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setType(v as 'channel' | 'direct')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="channel">チャンネル</TabsTrigger>
            <TabsTrigger value="direct">ダイレクトメッセージ</TabsTrigger>
          </TabsList>

          <TabsContent value="channel" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">チャンネル名</Label>
              <Input
                id="name"
                placeholder="例: マーケティング戦略"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明（任意）</Label>
              <Textarea
                id="description"
                placeholder="このチャンネルの目的を説明してください"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">プロジェクト（任意）</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="プロジェクトを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">なし</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="private"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
              <Label htmlFor="private">プライベートチャンネル</Label>
            </div>
          </TabsContent>

          <TabsContent value="direct" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">ユーザーを選択</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="ユーザーを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <span>{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({user.email})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClose}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            作成
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}