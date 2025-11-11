import { getSkillCategories, getSkills, getUserSkills } from '../../../actions/skills'
import { getCurrentUser } from '../../../actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SkillManagement } from './skill-management'
import { MySkills } from './my-skills'
import { SkillSearch } from './skill-search'
import { BookOpen, Award, Users } from 'lucide-react'
import { USER_ROLES } from '@/constants/roles'

export default async function SkillsPage() {
  const [user, categories, allSkills, mySkills] = await Promise.all([
    getCurrentUser(),
    getSkillCategories(),
    getSkills(),
    getUserSkills()
  ])

  if (!user) {
    return null
  }

  // 統計情報の計算
  const totalSkills = allSkills.length
  const totalUsers = new Set(
    allSkills.flatMap((skill: { users: Array<{ userId: string }> }) => 
      skill.users.map((u: { userId: string }) => u.userId)
    )
  ).size
  const mySkillsCount = mySkills.length

  const isPMOrExecutive = user.role.name === USER_ROLES.PM || user.role.name === USER_ROLES.EXECUTIVE

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">スキル管理</h1>
        <p className="text-muted-foreground">
          チームメンバーのスキルと専門性を管理します
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総スキル数
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSkills}</div>
            <p className="text-xs text-muted-foreground">
              {categories.length}カテゴリ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              スキル保有者
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              組織内メンバー
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              マイスキル
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mySkillsCount}</div>
            <p className="text-xs text-muted-foreground">
              登録済みスキル
            </p>
          </CardContent>
        </Card>
      </div>

      {/* タブ */}
      <Tabs defaultValue="my-skills" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-skills">マイスキル</TabsTrigger>
          {isPMOrExecutive && (
            <>
              <TabsTrigger value="skills">スキル一覧</TabsTrigger>
              <TabsTrigger value="search">メンバー検索</TabsTrigger>
              {user.role.name === USER_ROLES.EXECUTIVE && (
                <TabsTrigger value="manage">管理</TabsTrigger>
              )}
            </>
          )}
        </TabsList>

        {/* マイスキル */}
        <TabsContent value="my-skills" className="space-y-4">
          <MySkills 
            mySkills={mySkills} 
            categories={categories}
            allSkills={allSkills}
          />
        </TabsContent>

        {/* スキル一覧 */}
        {isPMOrExecutive && (
          <TabsContent value="skills" className="space-y-4">
            <div className="space-y-6">
              {categories.map((category: { id: string; name: string }) => {
                const categorySkills = allSkills.filter((s: { categoryId: string }) => s.categoryId === category.id)
                
                return (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>
                        {categorySkills.length}個のスキル
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categorySkills.map((skill: { 
                          id: string; 
                          name: string; 
                          userCount: number; 
                          averageLevel: number 
                        }) => {
                          const avgLevel = skill.averageLevel
                          const progressValue = (avgLevel / 5) * 100

                          return (
                            <div key={skill.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{skill.name}</span>
                                  <Badge variant="secondary">
                                    {skill.userCount}名
                                  </Badge>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  平均レベル: {avgLevel.toFixed(1)}
                                </span>
                              </div>
                              <Progress value={progressValue} className="h-2" />
                            </div>
                          )
                        })}
                        {categorySkills.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            このカテゴリにはまだスキルが登録されていません
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        )}

        {/* メンバー検索 */}
        {isPMOrExecutive && (
          <TabsContent value="search" className="space-y-4">
            <SkillSearch skills={allSkills} categories={categories} />
          </TabsContent>
        )}

        {/* 管理 */}
        {user.role.name === USER_ROLES.EXECUTIVE && (
          <TabsContent value="manage" className="space-y-4">
            <SkillManagement categories={categories} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}