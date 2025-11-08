'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Edit,
  TrendingUp,
  Calendar,
  UserCheck,
  Users,
  MoreVertical,
  Trash2
} from 'lucide-react'
import {
  TeamMemberItem,
  getProjectTeamMembers,
  getTeamMemberStats,
  removeTeamMember
} from '@/actions/project-team'
import { 
  TeamMemberRole, 
  teamMemberRoleUtils 
} from '@/types/team-member'
import { TeamMemberAddForm } from './team-member-add-form'
import { TeamMemberEditForm } from './team-member-edit-form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface ProjectTeamProps {
  project: unknown
}

export function ProjectTeam({ project }: ProjectTeamProps) {
  const [members, setMembers] = useState<TeamMemberItem[]>([])
  const [stats, setStats] = useState<{
    totalMembers: number;
    averageAllocation: number;
    totalFTE: number;
    requiredFTE: number;
    fteUtilization: number;
    roleDistribution: Record<string, number>;
    pmCount: number;
    totalAllocation: number;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null)

  const loadTeamData = useCallback(async () => {
    try {
      setLoading(true)
      const [teamMembers, teamStats] = await Promise.all([
        getProjectTeamMembers(project.id),
        getTeamMemberStats(project.id)
      ])
      setMembers(teamMembers)
      setStats(teamStats)
    } catch (error) {
      console.error('Failed to load team data:', error)
    } finally {
      setLoading(false)
    }
  }, [project.id])

  useEffect(() => {
    loadTeamData()
  }, [loadTeamData])

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('このメンバーをプロジェクトから削除しますか？')) return
    
    try {
      await removeTeamMember(memberId)
      await loadTeamData()
    } catch (_error) {
      console.error('Failed to remove member:', error)
      alert('メンバーの削除に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* チーム統計 */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">総メンバー数</p>
                  <p className="text-2xl font-bold">{stats.totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">総FTE</p>
                  <p className="text-2xl font-bold">{stats.totalFTE?.toFixed(1) || 0}</p>
                  <p className="text-xs text-muted-foreground">フルタイム換算人数</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">平均稼働率</p>
                  <p className="text-2xl font-bold">{stats.averageAllocation?.toFixed(1) || 0}%</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">PM数</p>
                  <p className="text-2xl font-bold">{stats.pmCount || 0}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.pmCount === 0 ? 'PM未割当' : ''}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* チームメンバー管理 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>チームメンバー</CardTitle>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              メンバー追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">メンバーがまだ追加されていません</p>
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {member.user.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-sm text-muted-foreground">{member.user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(member.startDate), 'yyyy/MM/dd', { locale: ja })} 〜 
                        {member.endDate 
                          ? format(new Date(member.endDate), 'yyyy/MM/dd', { locale: ja })
                          : '継続中'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={teamMemberRoleUtils.getColor(member.role)}>
                      {teamMemberRoleUtils.getLabel(member.role)}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Progress value={member.allocation} className="w-24" />
                      <span className="text-sm font-medium w-12 text-right">{member.allocation}%</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingMember(member)}>
                          <Edit className="h-4 w-4 mr-2" />
                          編集
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* ロール分布 */}
      {stats && stats.roleDistribution && Object.keys(stats.roleDistribution).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ロール分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.roleDistribution).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={teamMemberRoleUtils.getColor(teamMemberRoleUtils.parseRole(role) || TeamMemberRole.CONSULTANT)}>
                      {teamMemberRoleUtils.getLabel(teamMemberRoleUtils.parseRole(role) || TeamMemberRole.CONSULTANT)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{count as number}名</span>
                    <Progress value={((count as number) / stats.totalMembers) * 100} className="w-24" />
                    <span className="text-xs text-muted-foreground w-8">
                      {(((count as number) / stats.totalMembers) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* メンバー追加フォーム */}
      {showAddForm && (
        <TeamMemberAddForm
          projectId={project.id}
          onClose={() => setShowAddForm(false)}
          onMemberAdded={loadTeamData}
        />
      )}

      {/* メンバー編集フォーム */}
      {editingMember && (
        <TeamMemberEditForm
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onMemberUpdated={loadTeamData}
        />
      )}
    </div>
  )
}