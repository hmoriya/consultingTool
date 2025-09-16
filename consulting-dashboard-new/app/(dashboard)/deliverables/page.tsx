import { Suspense } from 'react'
import { getDeliverables } from '@/actions/deliverables'
import { DeliverablesList } from './components/deliverables-list'
import { DeliverableHeader } from './components/deliverable-header'
import { Card } from '@/components/ui/card'

async function DeliverablesContent() {
  const result = await getDeliverables()

  if (!result.success) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          {result.error}
        </div>
      </Card>
    )
  }

  return <DeliverablesList deliverables={result.data} />
}

function DeliverablesLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-24 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse mt-2" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse mt-1" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function DeliverablesPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <DeliverableHeader />
      <Suspense fallback={<DeliverablesLoading />}>
        <DeliverablesContent />
      </Suspense>
    </div>
  )
}