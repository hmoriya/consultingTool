'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { upsertUserSkill, deleteUserSkill } from '../../../actions/skills'

interface Skill {
  id: string
  name: string
  categoryId: string
  category: {
    id: string
    name: string
  }
}

interface UserSkill {
  id: string
  userId: string
  skillId: string
  level: number
  experienceYears?: number | null
  certifications?: string | null
  lastUsedDate?: Date | null
  skill: Skill
}

interface Category {
  id: string
  name: string
  description?: string | null
}

interface MySkillsProps {
  mySkills: UserSkill[]
  categories: Category[]
  allSkills: Skill[]
}

export function MySkills({ mySkills, categories, allSkills }: MySkillsProps) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<UserSkill | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [selectedSkillId, setSelectedSkillId] = useState<string>('')
  const [level, setLevel] = useState<number>(3)
  const [experienceYears, setExperienceYears] = useState<string>('')
  const [certifications, setCertifications] = useState<string>('')

  // カテゴリごとにスキルをグループ化
  const skillsByCategory = categories.map(category => ({
    ...category,
    skills: mySkills.filter(userSkill => userSkill.skill.categoryId === category.id)
  }))

  const availableSkills = selectedCategoryId
    ? allSkills.filter(skill => 
        skill.categoryId === selectedCategoryId &&
        !mySkills.some(us => us.skillId === skill.id)
      )
    : []

  const handleSubmit = () => {
    if (!selectedSkillId) {
      toast.error('スキルを選択してください')
      return
    }

    const certArray = certifications
      .split('\n')
      .filter(cert => cert.trim())
      .map(cert => cert.trim())

    startTransition(async () => {
      try {
        await upsertUserSkill({
          skillId: editingSkill?.skillId || selectedSkillId,
          level,
          experienceYears: experienceYears ? parseFloat(experienceYears) : undefined,
          certifications: certArray.length > 0 ? certArray : undefined
        })
        
        toast.success(editingSkill ? 'スキルを更新しました' : 'スキルを追加しました')
        setOpen(false)
        resetForm()
      } catch (_error) {
        toast.error(error instanceof Error ? error.message : '処理に失敗しました')
      }
    })
  }

  const handleDelete = (userSkillId: string, skillName: string) => {
    if (!confirm(`スキル「${skillName}」を削除しますか？`)) return

    startTransition(async () => {
      try {
        await deleteUserSkill(userSkillId)
        toast.success('スキルを削除しました')
      } catch (_error) {
        toast.error(error instanceof Error ? error.message : '削除に失敗しました')
      }
    })
  }

  const handleEdit = (userSkill: UserSkill) => {
    setEditingSkill(userSkill)
    setSelectedCategoryId(userSkill.skill.categoryId)
    setSelectedSkillId(userSkill.skillId)
    setLevel(userSkill.level)
    setExperienceYears(userSkill.experienceYears?.toString() || '')
    setCertifications(
      userSkill.certifications 
        ? JSON.parse(userSkill.certifications).join('\n')
        : ''
    )
    setOpen(true)
  }

  const resetForm = () => {
    setEditingSkill(null)
    setSelectedCategoryId('')
    setSelectedSkillId('')
    setLevel(3)
    setExperienceYears('')
    setCertifications('')
  }

  const getLevelLabel = (level: number) => {
    const labels = ['初級', '中級', '上級', 'エキスパート', 'マスター']
    return labels[level - 1] || '不明'
  }

  const getLevelColor = (level: number) => {
    const colors = ['bg-gray-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500']
    return colors[level - 1] || 'bg-gray-500'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">マイスキル</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              スキルを追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? 'スキルを編集' : 'スキルを追加'}
              </DialogTitle>
              <DialogDescription>
                {editingSkill 
                  ? 'スキルレベルや経験年数を更新します' 
                  : '新しいスキルを追加します'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {!editingSkill && (
                <>
                  <div>
                    <Label>カテゴリ</Label>
                    <Select
                      value={selectedCategoryId}
                      onValueChange={setSelectedCategoryId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>スキル</Label>
                    <Select
                      value={selectedSkillId}
                      onValueChange={setSelectedSkillId}
                      disabled={!selectedCategoryId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="スキルを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSkills.map(skill => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <Label>レベル</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <Button
                      key={lvl}
                      variant={level === lvl ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLevel(lvl)}
                    >
                      {lvl}
                    </Button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {getLevelLabel(level)}
                  </span>
                </div>
              </div>

              <div>
                <Label>経験年数</Label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="例: 3.5"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                />
              </div>

              <div>
                <Label>資格・認定（1行に1つ）</Label>
                <Textarea
                  placeholder="AWS認定ソリューションアーキテクト&#10;PMP"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false)
                    resetForm()
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending || (!editingSkill && !selectedSkillId)}
                >
                  {editingSkill ? '更新' : '追加'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {skillsByCategory.map(category => {
        if (category.skills.length === 0) return null

        return (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-base">{category.name}</CardTitle>
              <CardDescription>
                {category.skills.length}個のスキル
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.skills.map(userSkill => {
                  const progressValue = (userSkill.level / 5) * 100
                  const certifications = userSkill.certifications
                    ? JSON.parse(userSkill.certifications)
                    : []

                  return (
                    <div key={userSkill.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{userSkill.skill.name}</span>
                          <Badge className={getLevelColor(userSkill.level)}>
                            {getLevelLabel(userSkill.level)}
                          </Badge>
                          {userSkill.experienceYears && (
                            <span className="text-sm text-muted-foreground">
                              {userSkill.experienceYears}年
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(userSkill)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(userSkill.id, userSkill.skill.name)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Progress value={progressValue} className="h-2" />
                      {certifications.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {certifications.map((cert: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {userSkill.lastUsedDate && (
                        <p className="text-xs text-muted-foreground">
                          最終使用: {new Date(userSkill.lastUsedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {mySkills.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              まだスキルが登録されていません。上のボタンからスキルを追加してください。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}