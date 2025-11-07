'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Settings2, Package, ExternalLink } from 'lucide-react'
import { ServiceDocumentEditor } from '@/components/settings/service-document-editor'
import Link from 'next/link'

const services = [
  { value: 'auth-service', label: '認証サービス', domain: 'auth-domain' },
  { value: 'project-service', label: 'プロジェクトサービス', domain: 'project-domain' },
  { value: 'resource-service', label: 'リソースサービス', domain: 'resource-domain' },
  { value: 'timesheet-service', label: 'タイムシートサービス', domain: 'timesheet-domain' },
  { value: 'notification-service', label: '通知サービス', domain: 'notification-domain' },
  { value: 'knowledge-service', label: 'ナレッジサービス', domain: 'knowledge-domain' },
  { value: 'finance-service', label: '財務サービス', domain: 'finance-domain' },
  { value: 'parasol-service', label: 'パラソルサービス', domain: 'parasol-domain' },
]

export default function SettingsPage() {
  const [selectedService, setSelectedService] = useState('auth-service')
  const [activeTab, setActiveTab] = useState('general')

  const currentService = services.find(s => s.value === selectedService)

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">設定</h1>
        <p className="text-muted-foreground mt-2">
          システムの設定とドキュメント管理
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            一般設定
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            サービス定義
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>一般設定</CardTitle>
              <CardDescription>
                システムの基本設定を管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">システム情報</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">バージョン</dt>
                      <dd className="font-mono">1.0.0</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">環境</dt>
                      <dd className="font-mono">Development</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">マイクロサービス数</dt>
                      <dd className="font-mono">8</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">パラソルドメイン言語</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    実装言語に依存しない中間言語として、ドメインモデルを記述します。
                    この言語で定義されたモデルから、データベーススキーマやAPI仕様を自動生成できます。
                  </p>
                  <dl className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">設計思想</dt>
                      <dd>ドメイン駆動設計（DDD）</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">生成対象</dt>
                      <dd>DB、API、型定義</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">形式</dt>
                      <dd>Markdown</dd>
                    </div>
                  </dl>
                  <div className="flex justify-end">
                    <Link href="/settings/parasol">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        パラソルドメイン言語設定を開く
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">パラソルサービス設計情報</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    パラソルV4フレームワークの6概念レイヤーマッピングに基づいて、
                    各マイクロサービスのビジネスケーパビリティとオペレーションを管理します。
                  </p>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">登録サービス数</dt>
                      <dd className="font-mono">6</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">ビジネスケーパビリティ数</dt>
                      <dd className="font-mono">9</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">ビジネスオペレーション数</dt>
                      <dd className="font-mono">8</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">データモデル</dt>
                      <dd>Service → Capability → Operation</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">自動生成機能</dt>
                      <dd>オペレーション → ドメイン言語</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>サービス定義管理</CardTitle>
                  <CardDescription className="mt-2">
                    マイクロサービスごとのドメインモデル、API仕様、データベーススキーマを管理します
                  </CardDescription>
                </div>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="サービスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {currentService && (
                <ServiceDocumentEditor
                  service={selectedService}
                  domain={currentService.domain}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}