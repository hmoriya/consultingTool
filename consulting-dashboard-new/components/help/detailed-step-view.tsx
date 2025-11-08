'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Link, 
  XCircle, 
  Keyboard,
  ArrowRight,
  MousePointer,
  GitBranch,
  FileText
} from 'lucide-react'
import type { DetailedStep } from '@/constants/use-case-details'

interface DetailedStepViewProps {
  step: DetailedStep
  className?: string
}

export function DetailedStepView({ step, className }: DetailedStepViewProps) {
  const hasAlternatives = step.details.alternatives && step.details.alternatives.length > 0

  return (
    <div className={className}>
      <Tabs defaultValue="prerequisites" className="w-full">
        <TabsList className={`grid w-full ${hasAlternatives ? 'grid-cols-5 lg:grid-cols-10' : 'grid-cols-3 lg:grid-cols-9'}`}>
          <TabsTrigger value="prerequisites" className="text-xs">前提条件</TabsTrigger>
          <TabsTrigger value="instructions" className="text-xs">操作手順</TabsTrigger>
          <TabsTrigger value="fields" className="text-xs">入力項目</TabsTrigger>
          <TabsTrigger value="ui" className="text-xs">画面要素</TabsTrigger>
          <TabsTrigger value="validation" className="text-xs">検証ルール</TabsTrigger>
          <TabsTrigger value="related" className="text-xs">関連機能</TabsTrigger>
          <TabsTrigger value="mistakes" className="text-xs">よくある間違い</TabsTrigger>
          <TabsTrigger value="shortcuts" className="text-xs">ショートカット</TabsTrigger>
          <TabsTrigger value="next" className="text-xs">次の操作</TabsTrigger>
          {hasAlternatives && (
            <TabsTrigger value="alternatives" className="text-xs">代替手段</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="prerequisites" className="space-y-2 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                前提条件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {step.details.prerequisites.map((prereq, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-0.5">•</span>
                    <span className="text-sm">{prereq}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions" className="space-y-2 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-green-500" />
                具体的な操作手順
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {step.details.detailedInstructions.map((instruction, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                      {idx + 1}
                    </span>
                    <span className="text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-2 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-500" />
                入力項目の詳細
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {step.details.fieldDescriptions.map((field, idx) => (
                  <div key={idx} className="border-l-2 border-primary/20 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{field.name}</h4>
                      {field.required && <Badge variant="destructive" className="text-xs">必須</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{field.description}</p>
                    {field.format && (
                      <p className="text-xs text-muted-foreground">形式: {field.format}</p>
                    )}
                    {field.example && (
                      <p className="text-xs text-blue-600 mt-1">例: {field.example}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ui" className="space-y-2 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-orange-500" />
                画面要素の説明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {step.details.uiElements.map((element, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{element.element}</h4>
                      <p className="text-sm text-muted-foreground">{element.description}</p>
                      <p className="text-xs text-blue-600 mt-1">場所: {element.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-2 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                バリデーションルール
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {step.details.validationRules.map((rule, idx) => (
                  <div key={idx} className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-1">{rule.field}</h4>
                    <p className="text-sm text-muted-foreground">{rule.rule}</p>
                    <p className="text-xs text-red-600 mt-1">エラー: {rule.errorMessage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="space-y-2 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Link className="h-4 w-4 text-blue-500" />
                関連機能
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {step.details.relatedFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Link className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">{feature.name}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                      {feature.link && (
                        <a href={feature.link} className="text-xs text-blue-600 hover:underline">
                          詳細を見る →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mistakes" className="space-y-2 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                よくある間違いと対処法
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {step.details.commonMistakes.map((mistake, idx) => (
                  <div key={idx} className="border-l-2 border-red-200 pl-4">
                    <h4 className="font-medium text-sm text-red-700 mb-1">問題: {mistake.issue}</h4>
                    <p className="text-sm text-green-700">解決: {mistake.solution}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortcuts" className="space-y-2 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-purple-500" />
                ショートカットとTips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {step.details.shortcuts.map((shortcut, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {shortcut.keys ? (
                        <Badge variant="secondary" className="font-mono text-xs">
                          {shortcut.keys}
                        </Badge>
                      ) : (
                        <Zap className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{shortcut.action}</h4>
                      <p className="text-sm text-muted-foreground">{shortcut.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="next" className="space-y-2 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-green-500" />
                次のアクション
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {step.details.nextActions.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {action.automatic ? (
                        <Badge variant="default" className="text-xs">自動</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">手動</Badge>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{action.action}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {hasAlternatives && (
          <TabsContent value="alternatives" className="space-y-2 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-indigo-500" />
                  代替手段
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {step.details.alternatives?.map((alternative, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">シナリオ: {alternative.scenario}</h4>
                        <p className="text-sm font-medium text-indigo-600">{alternative.method}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-xs font-medium text-muted-foreground mb-2">手順:</h5>
                        <ol className="space-y-1">
                          {alternative.steps.map((step, stepIdx) => (
                            <li key={stepIdx} className="flex gap-2 text-sm">
                              <span className="text-muted-foreground">{stepIdx + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {alternative.pros && alternative.pros.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-green-700 mb-1">メリット:</h5>
                            <ul className="space-y-1">
                              {alternative.pros.map((pro, proIdx) => (
                                <li key={proIdx} className="flex items-start gap-1">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span className="text-xs">{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {alternative.cons && alternative.cons.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-red-700 mb-1">デメリット:</h5>
                            <ul className="space-y-1">
                              {alternative.cons.map((con, conIdx) => (
                                <li key={conIdx} className="flex items-start gap-1">
                                  <span className="text-red-500 mt-0.5">✗</span>
                                  <span className="text-xs">{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}