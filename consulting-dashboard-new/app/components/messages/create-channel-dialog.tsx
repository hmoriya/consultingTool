'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Hash, Lock, Users } from 'lucide-react'
import { createChannel } from '@/actions/messages'
import { useRouter } from 'next/navigation'

interface CreateChannelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateChannelDialog({ open, onOpenChange }: CreateChannelDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [channelType, setChannelType] = useState<'PROJECT' | 'GROUP'>('GROUP')
  const [isPrivate, setIsPrivate] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!name.trim()) {
      toast({
        title: 'エラー',
        description: 'チャンネル名を入力してください',
        variant: 'destructive'
      })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await createChannel({
        name: name.trim(),
        description: description.trim(),
        type: channelType,
        isPrivate
      })

      if (result.success && result.data) {
        toast({
          title: '成功',
          description: 'チャンネルを作成しました'
        })
        onOpenChange(false)
        router.push(`/messages/${result.data.id}`)
      } else {
        throw new Error(result.error || 'チャンネルの作成に失敗しました')
      }
    } catch (_error) {
      console.error('Failed to create channel:', error)
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : 'チャンネルの作成に失敗しました',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新しいチャンネルを作成</DialogTitle>
          <DialogDescription>
            チームメンバーとコミュニケーションを取るための新しいチャンネルを作成します
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* チャンネル名 */}
            <div className="space-y-2">
              <Label htmlFor="name">
                チャンネル名 <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  placeholder="例: marketing-team"
                  className="pl-9"
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                英数字、ハイフン、アンダースコアが使用できます（スペースは自動的にハイフンに変換されます）
              </p>
            </div>

            {/* 説明 */}
            <div className="space-y-2">
              <Label htmlFor="description">説明（任意）</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="このチャンネルの目的を説明してください"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* チャンネルタイプ */}
            <div className="space-y-2">
              <Label>チャンネルタイプ</Label>
              <RadioGroup
                value={channelType}
                onValueChange={(value) => setChannelType(value as 'PROJECT' | 'GROUP')}
                disabled={isSubmitting}
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="GROUP" id="group" />
                  <div className="grid gap-1">
                    <Label htmlFor="group" className="font-normal cursor-pointer">
                      <Users className="inline h-4 w-4 mr-1" />
                      グループチャンネル
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      チームや部署での一般的なコミュニケーション用
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="PROJECT" id="project" />
                  <div className="grid gap-1">
                    <Label htmlFor="project" className="font-normal cursor-pointer">
                      <Hash className="inline h-4 w-4 mr-1" />
                      プロジェクトチャンネル
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      特定のプロジェクトに関連する議論用
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* プライベート設定 */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="private" className="text-base">
                  <Lock className="inline h-4 w-4 mr-1" />
                  プライベートチャンネル
                </Label>
                <p className="text-xs text-muted-foreground">
                  招待されたメンバーのみが参加できます
                </p>
              </div>
              <Switch
                id="private"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  作成中...
                </>
              ) : (
                'チャンネルを作成'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}