'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Target, FileText, MessageSquare, ZoomIn } from 'lucide-react'
import { USE_CASES, USE_CASE_CATEGORIES } from '@/constants/use-cases'
import type { UseCase } from '@/constants/use-cases'

const categoryIcons = {
  executive: Target,
  pm: Users,
  consultant: FileText,
  client: BookOpen,
  common: MessageSquare
}

export default function HelpPage() {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ヘルプ - ユースケース一覧</h1>
        <p className="text-muted-foreground mt-2">
          システムの使い方を機能別・ロール別に説明します
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="executive">エグゼクティブ</TabsTrigger>
          <TabsTrigger value="pm">PM</TabsTrigger>
          <TabsTrigger value="consultant">コンサルタント</TabsTrigger>
          <TabsTrigger value="client">クライアント</TabsTrigger>
          <TabsTrigger value="common">共通</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {Object.entries(USE_CASE_CATEGORIES).map(([category, info]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons]
            const useCases = USE_CASES.filter(uc => uc.category === category)
            
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">{info.label}</h2>
                  <Badge variant="secondary">{useCases.length}</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {useCases.map(useCase => (
                    <Card 
                      key={useCase.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedUseCase(useCase)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{useCase.title}</CardTitle>
                        <CardDescription>{useCase.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 flex-wrap">
                          {useCase.actors.map(actor => (
                            <Badge key={actor} variant="outline" className="text-xs">
                              {actor}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </TabsContent>

        {Object.entries(USE_CASE_CATEGORIES).map(([category, info]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              {(() => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons]
                return <Icon className="h-5 w-5 text-muted-foreground" />
              })()}
              <h2 className="text-xl font-semibold">{info.label}</h2>
              <Badge variant="secondary">
                {USE_CASES.filter(uc => uc.category === category).length}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-6">{info.description}</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {USE_CASES
                .filter(uc => uc.category === category)
                .map(useCase => (
                  <Card 
                    key={useCase.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedUseCase(useCase)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{useCase.title}</CardTitle>
                      <CardDescription>{useCase.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        {useCase.actors.map(actor => (
                          <Badge key={actor} variant="outline" className="text-xs">
                            {actor}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* ユースケース詳細モーダル */}
      {selectedUseCase && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setSelectedUseCase(null)}
        >
          <div 
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{selectedUseCase.title}</h2>
                <p className="text-muted-foreground mt-1">{selectedUseCase.description}</p>
              </div>
              <button
                onClick={() => setSelectedUseCase(null)}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <span className="sr-only">閉じる</span>
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">対象ユーザー</h3>
                <div className="flex gap-2">
                  {selectedUseCase.actors.map(actor => (
                    <Badge key={actor} variant="secondary">
                      {actor}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">実行手順</h3>
                <ol className="space-y-6">
                  {selectedUseCase.steps.map((step, index) => {
                    // PNGを優先、なければSVG
                    const pngPath = `/captures/${selectedUseCase.category}/${selectedUseCase.id}/step-${index + 1}.png`
                    const svgPath = `/captures/${selectedUseCase.category}/${selectedUseCase.id}/step-${index + 1}.svg`
                    const imagePath = pngPath // PNGを使用
                    const hasImage = true // すべてのステップで画像を表示
                    
                    return (
                      <li key={index} className="flex gap-4">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                          {index + 1}
                        </span>
                        <div className="flex-1 space-y-2">
                          <span className="text-sm">{step}</span>
                          {hasImage && (
                            <div className="relative w-full max-w-md">
                              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted cursor-pointer hover:shadow-md transition-shadow"
                                   onClick={() => setExpandedImage(imagePath)}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={imagePath}
                                  alt={`${selectedUseCase.title} - ステップ ${index + 1}`}
                                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                  onError={(e) => {
                                    // PNGが見つからない場合はSVGにフォールバック
                                    const img = e.target as HTMLImageElement
                                    if (img.src.endsWith('.png')) {
                                      img.src = img.src.replace('.png', '.svg')
                                    } else {
                                      // SVGも見つからない場合は親要素を非表示
                                      const parent = img.closest('.relative')
                                      if (parent) {
                                        (parent as HTMLElement).style.display = 'none'
                                      }
                                    }
                                  }}
                                />
                                <button
                                  className="absolute bottom-2 right-2 p-1 bg-background/80 rounded hover:bg-background/90 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setExpandedImage(imagePath)
                                  }}
                                >
                                  <ZoomIn className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedUseCase(null)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 画像拡大モーダル */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={expandedImage}
              alt="拡大画像"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background/90 transition-colors"
            >
              <span className="sr-only">閉じる</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}