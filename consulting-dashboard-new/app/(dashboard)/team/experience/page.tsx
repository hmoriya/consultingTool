import { getUserProjectExperience } from '../../../actions/project-experience'
import { getCurrentUser } from '../../../actions/auth'
import { getSkills } from '../../../actions/skills'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectExperienceList } from './project-experience-list'
import { ProjectExperienceSearch } from './project-experience-search'
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react'

export default async function ProjectExperiencePage() {
  const [user, myExperiences, allSkills] = await Promise.all([
    getCurrentUser(),
    getUserProjectExperience(),
    getSkills()
  ])

  if (!user) {
    return null
  }

  const isPMOrExecutive = user.role.name === 'pm' || user.role.name === 'executive'

  // 統計情報の計算
  const totalProjects = myExperiences.length
  const activeProjects = myExperiences.filter(exp => !exp.endDate).length
  const totalMonths = myExperiences.reduce((sum, exp) => sum + exp.duration, 0)
  const uniqueSkills = new Set(
    myExperiences.flatMap(exp => exp.skills.map(s => s.skillId))
  ).size

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">プロジェクト経験</h1>
        <p className="text-muted-foreground">
          プロジェクトでの経験とスキルを管理します
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総プロジェクト数
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              現在 {activeProjects} 件進行中
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総経験期間
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMonths}ヶ月</div>
            <p className="text-xs text-muted-foreground">
              {Math.floor(totalMonths / 12)}年{totalMonths % 12}ヶ月
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              使用スキル数
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSkills}</div>
            <p className="text-xs text-muted-foreground">
              プロジェクトで活用
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              平均プロジェクト期間
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProjects > 0 ? Math.round(totalMonths / totalProjects) : 0}ヶ月
            </div>
            <p className="text-xs text-muted-foreground">
              プロジェクトあたり
            </p>
          </CardContent>
        </Card>
      </div>

      {/* タブ */}
      <Tabs defaultValue="my-experience" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-experience">マイ経験</TabsTrigger>
          {isPMOrExecutive && (
            <TabsTrigger value="search">メンバー検索</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="my-experience" className="space-y-4">
          <ProjectExperienceList 
            experiences={myExperiences}
            allSkills={allSkills}
            isOwner={true}
          />
        </TabsContent>

        {isPMOrExecutive && (
          <TabsContent value="search" className="space-y-4">
            <ProjectExperienceSearch allSkills={allSkills} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}