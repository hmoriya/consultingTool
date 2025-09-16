# ダッシュボード API定義

**更新日: 2025-01-09**

## API概要

各ロール向けダッシュボードの統計情報とKPIを提供するAPI。リアルタイムな経営指標の可視化をサポート。

## エンドポイント一覧

### 1. エグゼクティブダッシュボードデータ取得

**Server Action**: `getDashboardData`

#### リクエスト
なし（ユーザーロールに基づいて自動判定）

#### レスポンス
```typescript
interface DashboardData {
  summary: {
    activeProjects: number
    totalRevenue: number
    totalCost: number
    avgMargin: number
    totalClients: number
    totalMembers: number
    avgUtilization: number
    completionRate: number
  }
  recentProjects: {
    id: string
    name: string
    client: string
    status: string
    progress: number
    revenue: number
    manager: string
  }[]
  monthlyMetrics: {
    month: string
    revenue: number
    cost: number
    margin: number
    utilization: number
  }[]
  resourceAllocation: {
    role: string
    count: number
    avgUtilization: number
  }[]
  projectsByStatus: {
    status: string
    count: number
    percentage: number
  }[]
}
```

#### 処理フロー（エグゼクティブ）
1. ユーザー権限確認
2. サマリー統計の集計
   - アクティブプロジェクト数
   - 総収益（全プロジェクトの予算合計）
   - 総コスト（実績ベース）
   - 平均利益率
   - クライアント数
   - チームメンバー数
   - 平均稼働率
   - プロジェクト完了率
3. 直近プロジェクト情報取得（上位5件）
4. 月次メトリクス集計（過去6ヶ月）
5. リソース配分状況集計
6. プロジェクトステータス別集計

#### 処理フロー（PM）
1. 自身が管理するプロジェクトのみ対象
2. 管理プロジェクトのサマリー
3. チームメンバーの稼働状況
4. 今週のタスク状況
5. マイルストーン進捗

#### 処理フロー（コンサルタント）
1. 参画プロジェクトのみ対象
2. 自身のタスク一覧
3. 工数実績サマリー
4. 今週の予定

#### エラーケース
- `UNAUTHORIZED`: 認証が必要です

---

### 2. プロジェクト詳細データ取得

**Server Action**: `getProjectDetails`

#### リクエスト
```typescript
interface GetProjectDetailsRequest {
  projectId: string
}
```

#### レスポンス
```typescript
interface ProjectDetailsData {
  project: {
    id: string
    name: string
    status: string
    budget: number
    startDate: string
    endDate?: string
  }
  metrics: {
    progress: number
    budgetUsed: number
    daysRemaining: number
    riskLevel: 'low' | 'medium' | 'high'
  }
  teamPerformance: {
    avgVelocity: number
    taskCompletionRate: number
    onTimeDeliveryRate: number
  }
}
```

#### 処理フロー
1. プロジェクトアクセス権確認
2. プロジェクト基本情報取得
3. メトリクス計算
   - 進捗率（完了タスク / 全タスク）
   - 予算消化率
   - 残日数
   - リスクレベル判定
4. チームパフォーマンス指標計算

---

### 3. リソースデータ取得

**Server Action**: `getResourceData`

#### リクエスト
なし

#### レスポンス
```typescript
interface ResourceData {
  members: {
    id: string
    name: string
    role: string
    utilization: number
    availableHours: number
    projects: {
      name: string
      allocation: number
    }[]
  }[]
  skillMatrix: {
    skill: string
    members: {
      name: string
      level: 'beginner' | 'intermediate' | 'expert'
    }[]
  }[]
}
```

#### 処理フロー
1. 組織内メンバー一覧取得
2. 各メンバーの稼働率計算
3. 利用可能時間の算出
4. スキルマトリクス集計（将来実装）

---

## KPI定義

### エグゼクティブ向けKPI
```typescript
const EXECUTIVE_KPIS = {
  // 財務指標
  totalRevenue: '総収益',
  grossMargin: '粗利益率',
  operatingMargin: '営業利益率',
  
  // プロジェクト指標
  projectSuccessRate: 'プロジェクト成功率',
  onTimeDeliveryRate: '納期遵守率',
  clientSatisfaction: '顧客満足度',
  
  // リソース指標
  utilizationRate: '稼働率',
  billableHours: '請求可能時間',
  benchStrength: 'ベンチ強度'
}
```

### PM向けKPI
```typescript
const PM_KPIS = {
  // スケジュール指標
  scheduleVariance: 'スケジュール差異',
  milestoneAchievement: 'マイルストーン達成率',
  
  // コスト指標
  costVariance: 'コスト差異',
  earnedValue: 'アーンドバリュー',
  
  // 品質指標
  defectDensity: '欠陥密度',
  reworkRate: '手戻り率',
  
  // チーム指標
  teamVelocity: 'チーム速度',
  memberSatisfaction: 'メンバー満足度'
}
```

## グラフ・チャート実装

### 収益トレンドチャート
```typescript
const RevenueChart = ({ data }: { data: MonthlyMetric[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          name="収益" 
        />
        <Line 
          type="monotone" 
          dataKey="cost" 
          stroke="#ef4444" 
          name="コスト" 
        />
        <Line 
          type="monotone" 
          dataKey="margin" 
          stroke="#3b82f6" 
          name="利益" 
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

### リソース配分ヒートマップ
```typescript
const ResourceHeatmap = ({ data }: { data: ResourceAllocation[] }) => {
  return (
    <div className="grid grid-cols-7 gap-1">
      {data.map((allocation) => (
        <div
          key={allocation.id}
          className={cn(
            'h-8 rounded flex items-center justify-center text-xs',
            getUtilizationColor(allocation.utilization)
          )}
          title={`${allocation.member}: ${allocation.utilization}%`}
        >
          {allocation.utilization}%
        </div>
      ))}
    </div>
  )
}

const getUtilizationColor = (utilization: number) => {
  if (utilization > 100) return 'bg-red-500 text-white'
  if (utilization > 80) return 'bg-yellow-500'
  if (utilization > 60) return 'bg-green-500 text-white'
  return 'bg-gray-300'
}
```

## 実装例

### ダッシュボードデータ取得（app/actions/dashboard.ts）
```typescript
'use server'

import { db } from '@/lib/db'
import { getCurrentUser } from './auth'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'

export async function getDashboardData() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('認証が必要です')
  }
  
  // エグゼクティブの場合
  if (user.role.name === 'executive') {
    // アクティブプロジェクト数
    const activeProjects = await db.project.count({
      where: { status: 'active' }
    })
    
    // 総収益
    const projects = await db.project.findMany({
      select: { budget: true }
    })
    const totalRevenue = projects.reduce(
      (sum, p) => sum + p.budget, 
      0
    )
    
    // 月次メトリクス（過去6ヶ月）
    const monthlyMetrics = []
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const start = startOfMonth(date)
      const end = endOfMonth(date)
      
      const metrics = await db.projectMetric.aggregate({
        where: {
          date: { gte: start, lte: end }
        },
        _sum: {
          revenue: true,
          cost: true,
          margin: true
        },
        _avg: {
          utilization: true
        }
      })
      
      monthlyMetrics.push({
        month: format(date, 'yyyy-MM'),
        revenue: metrics._sum.revenue || 0,
        cost: metrics._sum.cost || 0,
        margin: metrics._sum.margin || 0,
        utilization: metrics._avg.utilization || 0
      })
    }
    
    // その他の統計情報を集計...
    
    return {
      summary: {
        activeProjects,
        totalRevenue,
        // ... 他の統計
      },
      monthlyMetrics,
      // ... 他のデータ
    }
  }
  
  // PM、コンサルタントの場合は別の処理
  // ...
}
```

## パフォーマンス最適化

### データキャッシュ
```typescript
// React Query を使用したキャッシュ
const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    staleTime: 5 * 60 * 1000, // 5分
    refetchInterval: 60 * 1000 // 1分ごとに更新
  })
}
```

### 集計の最適化
- Prismaの集計関数（_sum, _avg, _count）を活用
- 必要なフィールドのみselect
- インデックスの適切な設定

## セキュリティ考慮事項

### アクセス制御
- ロールベースのデータフィルタリング
- プロジェクトレベルの権限チェック
- 組織境界の厳密な管理

### データ保護
- 財務情報の適切なマスキング
- 個人情報の最小限の露出
- 監査ログの記録