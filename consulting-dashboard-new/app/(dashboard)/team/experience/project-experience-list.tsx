'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Briefcase, ChevronDown, ChevronUp, Edit, Users } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ProjectExperienceDetail } from './project-experience-detail'

export interface Project {
  id: string
  name: string
  client?: {
    id: string
    name: string
  } | null
}

export interface ProjectSkill {
  id: string
  skillId: string
  usageLevel: number
  skill: {
    id: string
    name: string
    category: {
      id: string
      name: string
    }
  }
}

export interface ProjectExperience {
  id: string
  project: Project
  role: string
  startDate: string | Date
  endDate: string | Date | null
  allocation: number
  achievements?: string | null
  responsibilities?: string | null
  skills: ProjectSkill[]
  duration: number
}

interface Skill {
  id: string
  name: string
  category: {
    id: string
    name: string
  }
}

interface ProjectExperienceListProps {
  experiences: ProjectExperience[]
  allSkills: Skill[]
  isOwner: boolean
}

export function ProjectExperienceList({ experiences, allSkills, isOwner }: ProjectExperienceListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      pm: 'プロジェクトマネージャー',
      lead: 'リードコンサルタント',
      senior: 'シニアコンサルタント',
      consultant: 'コンサルタント',
      analyst: 'アナリスト'
    }
    return roles[role] || role
  }

  const getStatusVariant = (endDate: string | Date | null) => {
    return endDate ? 'secondary' : 'default'
  }

  if (experiences.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            まだプロジェクト経験が登録されていません。
            プロジェクトに参加すると自動的に記録されます。
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {experiences.map((exp) => {
        const isExpanded = expandedId === exp.id
        const isEditing = editingId === exp.id
        const skillCount = exp.skills.length
        const topSkills = exp.skills.slice(0, 3)

        return (
          <Card key={exp.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{exp.project.name}</CardTitle>
                    <Badge variant={getStatusVariant(exp.endDate)}>
                      {exp.endDate ? '完了' : '進行中'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {exp.project.client?.name || 'クライアント未設定'} • {getRoleLabel(exp.role)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(isEditing ? null : exp.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(exp.startDate), 'yyyy年MM月', { locale: ja })}
                    {' - '}
                    {exp.endDate 
                      ? format(new Date(exp.endDate), 'yyyy年MM月', { locale: ja })
                      : '現在'
                    }
                    {' ('}
                    {exp.duration}ヶ月
                    {')'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">稼働率 {exp.allocation}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {skillCount}個のスキルを使用
                  </span>
                </div>
              </div>

              {/* スキルサマリー */}
              {topSkills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {topSkills.map(ps => (
                    <Badge key={ps.id} variant="outline">
                      {ps.skill.name}
                      <span className="ml-1 text-xs">
                        Lv{ps.usageLevel}
                      </span>
                    </Badge>
                  ))}
                  {skillCount > 3 && (
                    <Badge variant="outline">
                      +{skillCount - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* 成果・担当業務（簡易表示） */}
              {(exp.achievements || exp.responsibilities) && !isExpanded && (
                <div className="mt-4 space-y-2">
                  {exp.achievements && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      <strong>成果:</strong> {exp.achievements}
                    </p>
                  )}
                  {exp.responsibilities && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      <strong>担当:</strong> {exp.responsibilities}
                    </p>
                  )}
                </div>
              )}

              {/* 詳細表示 */}
              {(isExpanded || isEditing) && (
                <div className="mt-6">
                  <ProjectExperienceDetail
                    experience={exp}
                    allSkills={allSkills}
                    isEditing={isEditing}
                    onClose={() => {
                      setEditingId(null)
                      setExpandedId(null)
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}