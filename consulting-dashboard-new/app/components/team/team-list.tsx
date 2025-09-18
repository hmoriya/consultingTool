'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Search, 
  Users,
  Edit,
  Trash2,
  MoreVertical,
  UserCheck,
  Briefcase,
  Percent,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { TeamMemberItem, deleteTeamMember, getMemberUtilization } from '@/actions/team'
import { TeamCreateDialog } from './team-create-dialog'
import { TeamEditDialog } from './team-edit-dialog'
import { cn } from '@/lib/utils'

interface TeamListProps {
  initialMembers: TeamMemberItem[]
  currentUserRole: string
}

const roleColors = {
  Executive: 'bg-purple-100 text-purple-700',
  PM: 'bg-blue-100 text-blue-700',
  Consultant: 'bg-green-100 text-green-700'
}

const roleLabels = {
  Executive: 'エグゼクティブ',
  PM: 'PM',
  Consultant: 'コンサルタント'
}

export function TeamList({ initialMembers, currentUserRole }: TeamListProps) {
  const [members, setMembers] = useState<TeamMemberItem[]>(initialMembers)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set())
  const [memberUtilization, setMemberUtilization] = useState<Record<string, any>>({})

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('このメンバーを削除しますか？アクティブなプロジェクトに参加している場合は削除できません。')) return
    
    setLoading(true)
    try {
      await deleteTeamMember(memberId)
      setMembers(prev => prev.filter(m => m.id !== memberId))
    } catch (error) {
      console.error('Failed to delete member:', error)
      alert(error instanceof Error ? error.message : 'メンバーの削除に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleMemberCreated = (newMember: TeamMemberItem) => {
    setMembers(prev => [...prev, newMember].sort((a, b) => {
      if (a.role.name !== b.role.name) {
        return a.role.name.localeCompare(b.role.name)
      }
      return a.name.localeCompare(b.name)
    }))
  }

  const handleMemberUpdated = (updatedMember: TeamMemberItem) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m))
  }

  const toggleMemberExpansion = async (memberId: string) => {
    const newExpanded = new Set(expandedMembers)
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId)
    } else {
      newExpanded.add(memberId)
      // 稼働率データを取得
      if (!memberUtilization[memberId]) {
        try {
          const utilization = await getMemberUtilization(memberId)
          setMemberUtilization(prev => ({ ...prev, [memberId]: utilization[0] }))
        } catch (error) {
          console.error('Failed to fetch utilization:', error)
        }
      }
    }
    setExpandedMembers(newExpanded)
  }

  // ロール別統計
  const roleStats = members.reduce((acc, member) => {
    const role = member.role.name
    if (!acc[role]) {
      acc[role] = { count: 0, activeProjects: 0 }
    }
    acc[role].count++
    acc[role].activeProjects += member.projectCount || 0
    return acc
  }, {} as Record<string, { count: number; activeProjects: number }>)

  const canManageMembers = currentUserRole === 'Executive' || currentUserRole === 'PM'

  return (
    <div className="space-y-6">
      {/* アクションバー */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="名前またはメールアドレスで検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {canManageMembers && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                新規メンバー追加
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(roleStats).map(([role, stats]) => (
          <Card key={role}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{roleLabels[role as keyof typeof roleLabels]}</p>
                  <p className="text-2xl font-bold">{stats.count}名</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    計{stats.activeProjects}プロジェクト参加中
                  </p>
                </div>
                <Users className={cn("h-8 w-8", {
                  "text-purple-600": role === 'Executive',
                  "text-blue-600": role === 'PM',
                  "text-green-600": role === 'Consultant'
                })} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* メンバー一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>チームメンバー一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? '該当するメンバーが見つかりません' : 'メンバーが登録されていません'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>名前</TableHead>
                  <TableHead>メールアドレス</TableHead>
                  <TableHead>ロール</TableHead>
                  <TableHead className="text-center">プロジェクト数</TableHead>
                  <TableHead className="text-center">稼働率</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => {
                  const isExpanded = expandedMembers.has(member.id)
                  const utilization = memberUtilization[member.id]
                  const totalAllocation = member.projects?.reduce((sum, p) => sum + (p.allocation || 0), 0) || 0

                  return (
                    <React.Fragment key={member.id}>
                      <TableRow>
                        <TableCell>
                          {member.role.name !== 'Executive' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleMemberExpansion(member.id)}
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge className={roleColors[member.role.name as keyof typeof roleColors]}>
                            {roleLabels[member.role.name as keyof typeof roleLabels]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {member.projectCount || 0} 件
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={totalAllocation} className="flex-1" />
                            <span className="text-sm font-medium w-12 text-right">
                              {totalAllocation}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {canManageMembers && (
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
                                {currentUserRole === 'Executive' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDeleteMember(member.id)}
                                      disabled={loading || (member.projectCount || 0) > 0}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      削除
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                      {isExpanded && utilization && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-muted/30">
                            <div className="p-6">
                              <h4 className="font-medium mb-4 text-sm">アクティブプロジェクト</h4>
                              {utilization.projects.length === 0 ? (
                                <p className="text-sm text-muted-foreground pl-6">現在プロジェクトに参加していません</p>
                              ) : (
                                <div className="space-y-3">
                                  {utilization.projects.map((project: any) => (
                                    <div key={project.id} className="flex items-center justify-between pl-6 pr-4">
                                      <Link 
                                        href={`/projects/${project.id}`}
                                        className="flex items-center gap-3 group hover:text-primary transition-colors flex-1"
                                      >
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium group-hover:underline">
                                          {project.name}
                                        </span>
                                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </Link>
                                      <div className="flex items-center gap-3 ml-4">
                                        <Progress value={project.allocation} className="w-32" />
                                        <span className="text-sm font-medium w-12 text-right text-muted-foreground">
                                          {project.allocation}%
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* メンバー作成ダイアログ */}
      {showCreateDialog && canManageMembers && (
        <TeamCreateDialog
          onClose={() => setShowCreateDialog(false)}
          onMemberCreated={handleMemberCreated}
        />
      )}

      {/* メンバー編集ダイアログ */}
      {editingMember && canManageMembers && (
        <TeamEditDialog
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onMemberUpdated={handleMemberUpdated}
        />
      )}
    </div>
  )
}