'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area
} from 'recharts'

interface RevenueChartProps {
  data: {
    month: string
    revenue: number
    cost: number
    margin: number
    marginRate: number
  }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', { 
      style: 'currency', 
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value)
  }

  const formatPercent = (value: number) => `${value.toFixed(0)}%`

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>収益性推移</CardTitle>
        <CardDescription>月次の収益・コスト・利益率の推移</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                yAxisId="left"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={formatCurrency}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={formatPercent}
              />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  if (name === '利益率') {
                    return formatPercent(value)
                  }
                  return formatCurrency(value)
                }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="収益"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--primary))"
                fillOpacity={0.2}
              />
              <Bar
                yAxisId="left"
                dataKey="cost"
                name="コスト"
                fill="hsl(var(--destructive))"
                opacity={0.8}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="marginRate"
                name="利益率"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-3))' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}