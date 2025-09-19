'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Circle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

type Project = {
  id: string
  name: string
  code: string
  status: string
  budget: number
  client: {
    name: string
  }
  _count: {
    projectMembers: number
  }
  latestMetrics: {
    progressRate: number
    margin: number
    utilization: number
  } | null
}

interface ProjectPortfolioProps {
  projects: Project[]
}

const statusConfig = {
  active: { label: '進行中', color: 'bg-green-100 text-green-800' },
  completed: { label: '完了', color: 'bg-gray-100 text-gray-800' },
  onhold: { label: '保留', color: 'bg-yellow-100 text-yellow-800' },
  planning: { label: '計画中', color: 'bg-blue-100 text-blue-800' },
}

export function ProjectPortfolio({ projects }: ProjectPortfolioProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.planning
        const progressRate = project.latestMetrics?.progressRate || 0
        const marginRate = project.budget > 0 
          ? ((project.latestMetrics?.margin || 0) / project.budget) * 100 
          : 0

        return (
          <Card key={project.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {project.code}
                  </CardDescription>
                </div>
                <Badge className={`${status.color} text-xs`}>
                  {status.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">進捗</span>
                    <span className="font-medium">{progressRate.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressRate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      メンバー
                    </p>
                    <p className="font-medium">{project._count.projectMembers}名</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      {marginRate > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      利益率
                    </p>
                    <p className={`font-medium ${marginRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {marginRate.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Circle className={`h-2 w-2 ${project.status === 'active' ? 'fill-green-500' : 'fill-gray-400'}`} />
                    <span className="text-muted-foreground">
                      使用率 {((project.latestMetrics?.utilization || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    詳細
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}