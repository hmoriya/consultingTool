import { getDashboardData, getResourceData } from '@/actions/dashboard'
import { KpiSummary } from '@/components/dashboard/executive/kpi-summary'
import { ProjectPortfolio } from '@/components/dashboard/executive/project-portfolio'
import { RevenueChart } from '@/components/dashboard/executive/revenue-chart'
import { ResourceOptimization } from '@/components/dashboard/executive/resource-optimization'

export default async function ExecutiveDashboard() {
  const [dashboardData, resourceData] = await Promise.all([
    getDashboardData(),
    getResourceData()
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">エグゼクティブダッシュボード</h1>
        <p className="text-muted-foreground mt-2">
          全社のプロジェクトポートフォリオと経営指標を俯瞰的に管理します。
        </p>
      </div>

      {/* KPI Summary Cards */}
      <KpiSummary 
        stats={dashboardData.stats}
        financials={dashboardData.financials}
        resources={dashboardData.resources}
      />

      {/* Revenue Analysis and Resource Optimization */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RevenueChart data={dashboardData.revenueData} />
        <ResourceOptimization data={resourceData} />
      </div>

      {/* Project Portfolio */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">プロジェクトポートフォリオ</h2>
        <ProjectPortfolio projects={dashboardData.projects} />
      </div>
    </div>
  )
}