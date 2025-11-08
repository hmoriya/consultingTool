'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { searchProjectExperiences } from '../../../actions/project-experience'
import { ProjectExperienceList } from './project-experience-list'

interface Skill {
  id: string
  name: string
  category: {
    id: string
    name: string
  }
  userCount?: number
}

interface User {
  id: string
  name: string
  email: string
}

interface ProjectExperience {
  id: string
  user: User
  [key: string]: unknown
}

interface SearchResult {
  user: User
  experiences: ProjectExperience[]
}

interface ProjectExperienceSearchProps {
  allSkills: Skill[]
}

export function ProjectExperienceSearch({ allSkills }: ProjectExperienceSearchProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    startTransition(async () => {
      try {
        const filters: { skillIds?: string[], role?: string } = {}
        if (selectedSkills.length > 0) filters.skillIds = selectedSkills
        if (selectedRole !== 'all') filters.role = selectedRole

        const results = await searchProjectExperiences(filters)
        
        // ユーザーごとにグループ化
        const groupedResults = results.reduce((acc: Record<string, SearchResult>, exp: ProjectExperience) => {
          const userId = exp.user.id
          if (!acc[userId]) {
            acc[userId] = {
              user: exp.user,
              experiences: []
            }
          }
          acc[userId].experiences.push(exp)
          return acc
        }, {})

        setSearchResults(Object.values(groupedResults))
        setHasSearched(true)
        
        if (results.length === 0) {
          toast.info('条件に合うプロジェクト経験が見つかりませんでした')
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

  // カテゴリごとにスキルをグループ化
  const skillsByCategory = allSkills.reduce((acc: Record<string, Skill[]>, skill) => {
    if (!acc[skill.category.name]) {
      acc[skill.category.name] = []
    }
    acc[skill.category.name].push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>プロジェクト経験検索</CardTitle>
          <CardDescription>
            スキルや役割でメンバーのプロジェクト経験を検索します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>スキルで検索</Label>
            <div className="mt-2 space-y-4">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant={selectedSkills.includes(skill.id) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleSkill(skill.id)}
                      >
                        {skill.name}
                        {skill.userCount > 0 && (
                          <span className="ml-1">({skill.userCount})</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>役割で絞り込み</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[300px] mt-2">
                <SelectValue placeholder="すべての役割" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての役割</SelectItem>
                <SelectItem value="pm">プロジェクトマネージャー</SelectItem>
                <SelectItem value="lead">リードコンサルタント</SelectItem>
                <SelectItem value="senior">シニアコンサルタント</SelectItem>
                <SelectItem value="consultant">コンサルタント</SelectItem>
                <SelectItem value="analyst">アナリスト</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={isPending}
            className="w-full"
          >
            <Search className="h-4 w-4 mr-2" />
            検索
          </Button>
        </CardContent>
      </Card>

      {/* 検索結果 */}
      {hasSearched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              検索結果 ({searchResults.length}名)
            </h3>
          </div>

          {searchResults.map(({ user, experiences }) => (
            <div key={user.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>
                        {user.email} • {user.role.name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <ProjectExperienceList
                experiences={experiences}
                allSkills={allSkills}
                isOwner={false}
              />
            </div>
          ))}

          {searchResults.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  条件に合うプロジェクト経験が見つかりませんでした
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}