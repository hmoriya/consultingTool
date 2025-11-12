'use client'

import { useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { MemberUtilization } from '../../../actions/utilization'

interface UtilizationChartProps {
  data: MemberUtilization[]
  type: 'distribution' | 'by-role' | 'trend' | 'weekly' | 'monthly'
}

// const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export function UtilizationChart({ data, type }: UtilizationChartProps) {
  const chartData = useMemo(() => {
    switch (type) {
      case 'distribution': {
        // 稼働率の分布（0-20%, 20-40%, etc.）
        const ranges = [
          { range: '0-20%', count: 0, fill: '#ef4444' },
          { range: '20-40%', count: 0, fill: '#f59e0b' },
          { range: '40-60%', count: 0, fill: '#eab308' },
          { range: '60-80%', count: 0, fill: '#22c55e' },
          { range: '80-100%', count: 0, fill: '#0ea5e9' },
          { range: '100%+', count: 0, fill: '#8b5cf6' }
        ]

        data.forEach(member => {
          const util = member.currentAllocation
          if (util <= 20) ranges[0]!.count++
          else if (util <= 40) ranges[1]!.count++
          else if (util <= 60) ranges[2]!.count++
          else if (util <= 80) ranges[3]!.count++
          else if (util <= 100) ranges[4]!.count++
          else ranges[5]!.count++
        })

        return ranges.filter(r => r.count > 0)
      }

      case 'by-role': {
        // ロール別平均稼働率
        const roleData = data.reduce((acc, member) => {
          if (!acc[member.role]) {
            acc[member.role] = { total: 0, count: 0 }
          }
          acc[member.role]!.total += member.currentAllocation
          acc[member.role]!.count++
          return acc
        }, {} as Record<string, { total: number; count: number }>)

        return Object.entries(roleData).map(([role, data]) => ({
          role,
          utilization: Math.round(data.total / data.count),
          members: data.count
        }))
      }

      case 'trend': {
        // 月次トレンド（全体平均）
        const monthlyData: Record<string, { total: number; count: number }> = {}

        data.forEach(member => {
          member.monthlyUtilization.forEach(month => {
            if (!monthlyData[month.month]) {
              monthlyData[month.month] = { total: 0, count: 0 }
            }
            monthlyData[month.month]!.total += month.utilization
            monthlyData[month.month]!.count++
          })
        })

        return Object.entries(monthlyData)
          .map(([month, data]) => ({
            month,
            utilization: Math.round(data.total / data.count)
          }))
          .sort((a, b) => a.month.localeCompare(b.month))
      }

      case 'weekly': {
        // 週次推移（全体平均）
        const weeklyData: Record<string, { total: number; count: number }> = {}

        data.forEach(member => {
          member.weeklyUtilization.forEach(week => {
            if (!weeklyData[week.weekStart]) {
              weeklyData[week.weekStart] = { total: 0, count: 0 }
            }
            const weekData = weeklyData[week.weekStart]
            if (weekData) {
              weekData.total += week.utilization
              weekData.count++
            }
          })
        })

        return Object.entries(weeklyData)
          .map(([weekStart, data]) => ({
            week: new Date(weekStart).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
            utilization: Math.round(data.total / data.count)
          }))
          .sort((a, b) => a.week.localeCompare(b.week))
      }

      case 'monthly': {
        // メンバー数別の月次稼働率
        if (data.length === 0 || !data[0]) return []
        
        const months = data[0].monthlyUtilization.map(m => m.month)
        return months.map(month => {
          const ranges = {
            month,
            '0-50%': 0,
            '50-80%': 0,
            '80-100%': 0,
            '100%+': 0
          }

          data.forEach(member => {
            const monthData = member.monthlyUtilization.find(m => m.month === month)
            if (monthData) {
              const util = monthData.utilization
              if (util < 50) ranges['0-50%']++
              else if (util < 80) ranges['50-80%']++
              else if (util <= 100) ranges['80-100%']++
              else ranges['100%+']++
            }
          })

          return ranges
        })
      }

      default:
        return []
    }
  }, [data, type])

  if (type === 'distribution') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" name="人数">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={'fill' in entry ? entry.fill : '#8884d8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'by-role') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="role" />
          <YAxis />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                return (
                  <div className="bg-background border rounded p-2 shadow-sm">
                    <p className="text-sm font-medium">{payload[0].payload.role}</p>
                    <p className="text-sm">稼働率: {payload[0].value}%</p>
                    <p className="text-sm text-muted-foreground">
                      メンバー: {payload[0].payload.members}名
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="utilization" fill="#0ea5e9" name="平均稼働率" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'trend' || type === 'weekly') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={type === 'trend' ? 'month' : 'week'} />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="utilization" 
            stroke="#0ea5e9" 
            strokeWidth={2}
            name="平均稼働率"
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'monthly') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="0-50%" stackId="a" fill="#ef4444" />
          <Bar dataKey="50-80%" stackId="a" fill="#f59e0b" />
          <Bar dataKey="80-100%" stackId="a" fill="#22c55e" />
          <Bar dataKey="100%+" stackId="a" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return null
}