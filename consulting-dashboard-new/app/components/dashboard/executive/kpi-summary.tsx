'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Briefcase,
  Activity
} from 'lucide-react'

interface KpiSummaryProps {
  stats: {
    total: number
    active: number
    completed: number
    onhold: number
  }
  financials: {
    revenue: number
    cost: number
    margin: number
    marginRate: number
    revenueChangeRate?: number
  }
  resources: {
    utilization: number
    totalMembers: number
  }
}

export function KpiSummary({ stats, financials, resources }: KpiSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', { 
      style: 'currency', 
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const kpis = [
    {
      title: '総収益',
      value: formatCurrency(financials.revenue),
      description: '今月の収益',
      icon: DollarSign,
      trend: financials.revenueChangeRate && financials.revenueChangeRate > 0 ? 'up' : 
             financials.revenueChangeRate && financials.revenueChangeRate < 0 ? 'down' : 'neutral',
      trendValue: financials.revenueChangeRate 
        ? `${financials.revenueChangeRate > 0 ? '+' : ''}${financials.revenueChangeRate.toFixed(1)}% 前月比`
        : `${financials.marginRate.toFixed(1)}% 利益率`,
    },
    {
      title: 'アクティブプロジェクト',
      value: stats.active,
      description: `全${stats.total}件中`,
      icon: Briefcase,
      trend: 'neutral',
      trendValue: `${stats.completed}件完了`,
    },
    {
      title: 'リソース使用率',
      value: `${resources.utilization.toFixed(0)}%`,
      description: '平均稼働率',
      icon: Activity,
      trend: resources.utilization > 80 ? 'up' : resources.utilization < 60 ? 'down' : 'neutral',
      trendValue: `${resources.totalMembers}名稼働中`,
    },
    {
      title: '営業利益',
      value: formatCurrency(financials.margin),
      description: '収益 - コスト',
      icon: TrendingUp,
      trend: financials.margin > 0 ? 'up' : 'down',
      trendValue: financials.margin > 0 ? '黒字' : '赤字',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {kpi.title}
            </CardTitle>
            <kpi.icon className={`h-4 w-4 ${
              kpi.trend === 'up' ? 'text-green-600' : 
              kpi.trend === 'down' ? 'text-red-600' : 
              'text-muted-foreground'
            }`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpi.description}
            </p>
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
              kpi.trend === 'up' ? 'text-green-600' : 
              kpi.trend === 'down' ? 'text-red-600' : 
              'text-muted-foreground'
            }`}>
              {kpi.trend === 'up' && <TrendingUp className="h-3 w-3" />}
              {kpi.trend === 'down' && <TrendingDown className="h-3 w-3" />}
              {kpi.trendValue}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}