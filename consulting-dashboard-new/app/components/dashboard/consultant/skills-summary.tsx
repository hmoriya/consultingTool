'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface SkillsSummaryProps {
  skills: unknown[]
}

const skillCategories: Record<string, { label: string; color: string }> = {
  technical: { label: '技術', color: 'bg-blue-100 text-blue-700' },
  business: { label: 'ビジネス', color: 'bg-purple-100 text-purple-700' },
  industry: { label: '業界知識', color: 'bg-green-100 text-green-700' },
  soft: { label: 'ソフトスキル', color: 'bg-orange-100 text-orange-700' }
}

export function SkillsSummary({ skills }: SkillsSummaryProps) {
  const getProficiencyLabel = (level: number) => {
    if (level >= 4) return 'エキスパート'
    if (level >= 3) return '上級'
    if (level >= 2) return '中級'
    return '初級'
  }

  const getProficiencyColor = (level: number) => {
    if (level >= 4) return 'text-purple-600'
    if (level >= 3) return 'text-blue-600'
    if (level >= 2) return 'text-green-600'
    return 'text-gray-600'
  }

  const sortedSkills = [...skills].sort((a, b) => (b.proficiencyLevel || 0) - (a.proficiencyLevel || 0))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>スキル＆専門性</CardTitle>
            <CardDescription>登録されているスキルと熟練度</CardDescription>
          </div>
          <Link href="/team/skills">
            <Badge variant="ghost" className="cursor-pointer">
              編集
            </Badge>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
            <p>スキルが登録されていません</p>
            <Link href="/team/skills">
              <Badge variant="outline" className="mt-2 cursor-pointer">
                スキルを登録
              </Badge>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="border-muted">
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold">{skills.length}</div>
                  <div className="text-xs text-muted-foreground">登録スキル数</div>
                </CardContent>
              </Card>
              <Card className="border-muted">
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold">
                    {skills.length > 0 
                      ? Math.round(skills.reduce((sum, s) => sum + (s.proficiencyLevel || 0), 0) / skills.length * 10) / 10
                      : '0'
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">平均熟練度</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {sortedSkills.slice(0, 5).map((userSkill) => (
                <div key={userSkill.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{userSkill.skill.name}</span>
                      <Badge 
                        variant="secondary" 
                        className={skillCategories[userSkill.skill.category]?.color || 'bg-gray-100 text-gray-700'}
                      >
                        {skillCategories[userSkill.skill.category]?.label || userSkill.skill.category}
                      </Badge>
                    </div>
                    <span className={`text-xs font-medium ${getProficiencyColor(userSkill.proficiencyLevel)}`}>
                      {getProficiencyLabel(userSkill.proficiencyLevel)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={userSkill.proficiencyLevel * 20} className="h-2 flex-1" />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < userSkill.proficiencyLevel
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-muted text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {skills.length > 5 && (
              <div className="text-center pt-2">
                <Link href="/team/skills">
                  <Badge variant="outline" className="cursor-pointer">
                    他 {skills.length - 5} 件のスキル
                  </Badge>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}