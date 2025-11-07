'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Settings } from 'lucide-react'
import { createSkillCategory, createSkill } from '../../../actions/skills'

interface Category {
  id: string
  name: string
  description?: string | null
  order?: number | null
  _count?: {
    skills: number
  }
  skills?: Array<{
    id: string
    name: string
    _count?: {
      userSkills: number
    }
  }>
}

interface SkillManagementProps {
  categories: Category[]
}

export function SkillManagement({ categories }: SkillManagementProps) {
  const [isPending, startTransition] = useTransition()
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [skillOpen, setSkillOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryOrder, setCategoryOrder] = useState('')
  const [skillName, setSkillName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  const handleCreateCategory = () => {
    if (!categoryName) {
      toast.error('カテゴリ名を入力してください')
      return
    }

    startTransition(async () => {
      try {
        await createSkillCategory({
          name: categoryName,
          order: categoryOrder ? parseInt(categoryOrder) : undefined
        })
        toast.success('カテゴリを作成しました')
        setCategoryOpen(false)
        setCategoryName('')
        setCategoryOrder('')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'カテゴリの作成に失敗しました')
      }
    })
  }

  const handleCreateSkill = () => {
    if (!skillName || !selectedCategoryId) {
      toast.error('必須項目を入力してください')
      return
    }

    startTransition(async () => {
      try {
        await createSkill({
          name: skillName,
          categoryId: selectedCategoryId
        })
        toast.success('スキルを作成しました')
        setSkillOpen(false)
        setSkillName('')
        setSelectedCategoryId('')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'スキルの作成に失敗しました')
      }
    })
  }

  const defaultCategories = [
    { name: 'プログラミング言語', skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go'] },
    { name: 'フレームワーク', skills: ['React', 'Next.js', 'Vue.js', 'Spring Boot', 'Django'] },
    { name: 'クラウドサービス', skills: ['AWS', 'Azure', 'GCP', 'Heroku', 'Vercel'] },
    { name: 'データベース', skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle'] },
    { name: 'ビジネススキル', skills: ['プロジェクト管理', 'プレゼンテーション', '要件定義', '提案書作成', 'ファシリテーション'] },
    { name: '業界知識', skills: ['金融', '製造業', 'ヘルスケア', '小売', '物流'] }
  ]

  const initializeDefaultData = () => {
    startTransition(async () => {
      try {
        // カテゴリの作成
        for (let i = 0; i < defaultCategories.length; i++) {
          const category = defaultCategories[i]
          const createdCategory = await createSkillCategory({
            name: category.name,
            order: i + 1
          })

          // スキルの作成
          for (const skillName of category.skills) {
            await createSkill({
              name: skillName,
              categoryId: createdCategory.id
            })
          }
        }
        toast.success('初期データを作成しました')
      } catch {
        toast.error('初期データの作成中にエラーが発生しました')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* アクションボタン */}
      <div className="flex gap-2">
        <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              カテゴリを追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>カテゴリを追加</DialogTitle>
              <DialogDescription>
                新しいスキルカテゴリを作成します
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>カテゴリ名</Label>
                <Input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="例: プログラミング言語"
                />
              </div>
              <div>
                <Label>表示順序</Label>
                <Input
                  type="number"
                  value={categoryOrder}
                  onChange={(e) => setCategoryOrder(e.target.value)}
                  placeholder="例: 1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCategoryOpen(false)
                    setCategoryName('')
                    setCategoryOrder('')
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleCreateCategory}
                  disabled={isPending || !categoryName}
                >
                  作成
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={skillOpen} onOpenChange={setSkillOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              スキルを追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>スキルを追加</DialogTitle>
              <DialogDescription>
                新しいスキルを作成します
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
                <Label>スキル名</Label>
                <Input
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="例: React"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSkillOpen(false)
                    setSkillName('')
                    setSelectedCategoryId('')
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleCreateSkill}
                  disabled={isPending || !skillName || !selectedCategoryId}
                >
                  作成
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {categories.length === 0 && (
          <Button
            variant="secondary"
            onClick={initializeDefaultData}
            disabled={isPending}
          >
            <Settings className="h-4 w-4 mr-2" />
            初期データを作成
          </Button>
        )}
      </div>

      {/* カテゴリ一覧 */}
      <div className="space-y-4">
        {categories.map(category => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                  <CardDescription>
                    {category._count?.skills || 0}個のスキル
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  順序: {category.order}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.skills?.map((skill) => (
                  <Badge key={skill.id} variant="outline">
                    {skill.name}
                    {skill._count?.userSkills && skill._count.userSkills > 0 && (
                      <span className="ml-1 text-xs">({skill._count.userSkills})</span>
                    )}
                  </Badge>
                ))}
                {(!category.skills || category.skills.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    スキルが登録されていません
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>まだカテゴリが作成されていません</p>
                <p className="text-sm mt-1">
                  上のボタンから初期データを作成するか、カテゴリを追加してください
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}