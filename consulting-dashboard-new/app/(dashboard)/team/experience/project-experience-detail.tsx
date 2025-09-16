'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Trash2, Save, X } from 'lucide-react'
import { updateProjectExperience, addProjectSkill, removeProjectSkill } from '../../../actions/project-experience'

interface ProjectExperienceDetailProps {
  experience: any
  allSkills: any[]
  isEditing: boolean
  onClose: () => void
}

export function ProjectExperienceDetail({ 
  experience, 
  allSkills, 
  isEditing, 
  onClose 
}: ProjectExperienceDetailProps) {
  const [isPending, startTransition] = useTransition()
  const [achievements, setAchievements] = useState(experience.achievements || '')
  const [responsibilities, setResponsibilities] = useState(experience.responsibilities || '')
  const [selectedSkillId, setSelectedSkillId] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('3')

  // 使用可能なスキル（まだ追加していないスキル）
  const availableSkills = allSkills.filter(skill => 
    !experience.skills.some((ps: any) => ps.skillId === skill.id)
  )

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateProjectExperience(experience.id, {
          achievements,
          responsibilities
        })
        toast.success('プロジェクト経験を更新しました')
        onClose()
      } catch (error) {
        toast.error('更新に失敗しました')
      }
    })
  }

  const handleAddSkill = () => {
    if (!selectedSkillId) {
      toast.error('スキルを選択してください')
      return
    }

    startTransition(async () => {
      try {
        await addProjectSkill(
          experience.id,
          selectedSkillId,
          parseInt(selectedLevel)
        )
        toast.success('スキルを追加しました')
        setSelectedSkillId('')
        setSelectedLevel('3')
      } catch (error) {
        toast.error('スキルの追加に失敗しました')
      }
    })
  }

  const handleRemoveSkill = (skillId: string) => {
    startTransition(async () => {
      try {
        await removeProjectSkill(experience.id, skillId)
        toast.success('スキルを削除しました')
      } catch (error) {
        toast.error('スキルの削除に失敗しました')
      }
    })
  }

  const getUsageLevelLabel = (level: number) => {
    const labels = ['ほとんど使用せず', '基本的な使用', '通常使用', '高度な使用', '中心的に使用']
    return labels[level - 1] || '不明'
  }

  const getUsageLevelColor = (level: number) => {
    const colors = ['bg-gray-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500']
    return colors[level - 1] || 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* 成果・担当業務 */}
      <div className="grid gap-4">
        <div>
          <Label>担当業務・役割</Label>
          {isEditing ? (
            <Textarea
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="プロジェクトでの主な担当業務や役割を記載してください"
              rows={3}
              className="mt-2"
            />
          ) : (
            <p className="mt-2 text-sm whitespace-pre-wrap">
              {experience.responsibilities || '記載なし'}
            </p>
          )}
        </div>

        <div>
          <Label>成果・貢献</Label>
          {isEditing ? (
            <Textarea
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              placeholder="プロジェクトでの成果や貢献内容を記載してください"
              rows={3}
              className="mt-2"
            />
          ) : (
            <p className="mt-2 text-sm whitespace-pre-wrap">
              {experience.achievements || '記載なし'}
            </p>
          )}
        </div>
      </div>

      {/* 使用スキル */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">使用スキル</CardTitle>
            {isEditing && (
              <div className="flex items-center gap-2">
                <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="スキルを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills.map(skill => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.category.name} - {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Lv1: 基本使用</SelectItem>
                    <SelectItem value="2">Lv2: 通常使用</SelectItem>
                    <SelectItem value="3">Lv3: 活発使用</SelectItem>
                    <SelectItem value="4">Lv4: 高度使用</SelectItem>
                    <SelectItem value="5">Lv5: 中心的使用</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleAddSkill}
                  disabled={!selectedSkillId || isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {experience.skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              使用したスキルを登録してください
            </p>
          ) : (
            <div className="space-y-2">
              {experience.skills.map((ps: any) => (
                <div key={ps.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {ps.skill.category.name}
                    </Badge>
                    <span className="font-medium">{ps.skill.name}</span>
                    <Badge className={getUsageLevelColor(ps.usageLevel)}>
                      Lv{ps.usageLevel} - {getUsageLevelLabel(ps.usageLevel)}
                    </Badge>
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSkill(ps.skillId)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 編集時のアクションボタン */}
      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>
      )}
    </div>
  )
}