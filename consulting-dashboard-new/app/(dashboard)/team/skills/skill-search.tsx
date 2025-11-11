'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Search, Users } from 'lucide-react'
import { searchMembersBySkill } from '../../../actions/skills'

interface Skill {
  id: string
  name: string
  categoryId: string
  userCount?: number
}

interface Category {
  id: string
  name: string
}

interface UserSkill {
  id: string
  level: number
  experienceYears?: number | null
  certifications?: string | null
  lastUsedDate?: Date | null
  skill: {
    id: string
    name: string
    category: {
      name: string
    }
  }
}

interface SearchResult {
  id: string
  name: string
  email: string
  role: {
    name: string
  }
  skills: UserSkill[]
  totalAllocation?: number
  matchingSkills?: UserSkill[]
  currentProjects?: Array<{
    id: string
    name: string
  }>
}

interface SkillSearchProps {
  skills: Skill[]
  categories: Category[]
}

export function SkillSearch({ skills, categories }: SkillSearchProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [minLevel, setMinLevel] = useState<string>('0')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    if (selectedSkills.length === 0) {
      toast.error('検索するスキルを選択してください')
      return
    }

    startTransition(async () => {
      try {
        const results = await searchMembersBySkill(
          selectedSkills,
          minLevel !== '0' ? parseInt(minLevel) : undefined
        )
        setSearchResults(results)
        setHasSearched(true)
        
        if (results.length === 0) {
          toast.info('条件に合うメンバーが見つかりませんでした')
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '検索に失敗しました')
      }
    })
  }

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    )
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
    <div className="space-y-6">
      {/* 検索条件 */}
      <Card>
        <CardHeader>
          <CardTitle>スキル検索</CardTitle>
          <CardDescription>
            必要なスキルを持つメンバーを検索します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>スキルを選択</Label>
            <div className="space-y-4 mt-2">
              {categories.map(category => {
                const categorySkills = skills.filter(s => s.categoryId === category.id)
                if (categorySkills.length === 0) return null

                return (
                  <div key={category.id}>
                    <p className="text-sm font-medium mb-2">{category.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map(skill => (
                        <Badge
                          key={skill.id}
                          variant={selectedSkills.includes(skill.id) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleSkill(skill.id)}
                        >
                          {skill.name}
                          {(skill.userCount ?? 0) > 0 && (
                            <span className="ml-1 text-xs">({skill.userCount ?? 0})</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <Label>最低レベル</Label>
            <Select value={minLevel} onValueChange={setMinLevel}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="指定なし" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">指定なし</SelectItem>
                <SelectItem value="2">中級以上</SelectItem>
                <SelectItem value="3">上級以上</SelectItem>
                <SelectItem value="4">エキスパート以上</SelectItem>
                <SelectItem value="5">マスターのみ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={isPending || selectedSkills.length === 0}
            className="w-full"
          >
            <Search className="h-4 w-4 mr-2" />
            検索
          </Button>
        </CardContent>
      </Card>

      {/* 検索結果 */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              検索結果 ({searchResults.length}名)
            </h3>
          </div>

          {searchResults.map(member => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {member.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription>{member.email}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{member.role.name}</Badge>
                    {(member.totalAllocation ?? 0) > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        稼働率: {member.totalAllocation ?? 0}%
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* マッチしたスキル */}
                  <div>
                    <p className="text-sm font-medium mb-2">該当スキル</p>
                    <div className="space-y-2">
                      {member.matchingSkills?.map((userSkill) => {
                        const progressValue = (userSkill.level / 5) * 100
                        return (
                          <div key={userSkill.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{userSkill.skill.name}</span>
                              <Badge 
                                variant="default" 
                                className={`${getLevelColor(userSkill.level)} text-white`}
                              >
                                {getLevelLabel(userSkill.level)}
                              </Badge>
                            </div>
                            <Progress value={progressValue} className="h-1" />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* 現在のプロジェクト */}
                  {member.currentProjects && member.currentProjects.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">参加中のプロジェクト</p>
                      <div className="flex flex-wrap gap-2">
                        {member.currentProjects.map((project) => (
                          <Badge key={project.id} variant="outline">
                            {project.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {searchResults.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p>条件に合うメンバーが見つかりませんでした</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}