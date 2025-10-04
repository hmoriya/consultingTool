'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UseCase {
  id: string;
  name: string;
  displayName: string;
  description?: string | null;
  definition?: string | null;
  actors?: string | null;
  preconditions?: string | null;
  postconditions?: string | null;
  basicFlow?: string | null;
  alternativeFlow?: string | null;
  exceptionFlow?: string | null;
  order?: number;
}

interface PageDefinition {
  id: string;
  name: string;
  displayName: string;
  content?: string | null;
  order?: number;
}

interface TestDefinition {
  id: string;
  name: string;
  displayName: string;
  content?: string | null;
  order?: number;
}

interface UseCaseListViewProps {
  operationId: string;
  useCases: UseCase[];
  pageDefinitions: PageDefinition[];
  testDefinitions: TestDefinition[];
  onAddUseCase: () => void;
  onEditUseCase: (useCase: UseCase) => void;
  onDeleteUseCase?: (useCaseId: string) => void;
  onViewUseCase?: (useCase: UseCase) => void;
  className?: string;
}

export function UseCaseListView({
  operationId,
  useCases,
  pageDefinitions,
  testDefinitions,
  onAddUseCase,
  onEditUseCase,
  onDeleteUseCase,
  onViewUseCase,
  className
}: UseCaseListViewProps) {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);

  // ユースケースを表示順序でソート
  const sortedUseCases = [...useCases].sort((a, b) => (a.order || 0) - (b.order || 0));

  // 選択されたユースケースに関連するページとテストを取得
  const getRelatedPages = (useCaseId: string) => {
    return pageDefinitions
      .filter(page => page.name.includes(useCaseId) || page.displayName.includes(useCaseId))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const getRelatedTests = (useCaseId: string) => {
    return testDefinitions
      .filter(test => test.name.includes(useCaseId) || test.displayName.includes(useCaseId))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  if (useCases.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">ユースケース</CardTitle>
            <CardDescription>このオペレーションに含まれるユースケース</CardDescription>
          </div>
          <Button size="sm" onClick={onAddUseCase}>
            <Plus className="h-4 w-4 mr-2" />
            ユースケース追加
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">まだユースケースが登録されていません</p>
            <p className="text-xs text-muted-foreground mt-1">
              「ユースケース追加」ボタンをクリックして新しいユースケースを作成してください
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg">ユースケース</CardTitle>
          <CardDescription>
            {useCases.length}件のユースケースが登録されています
          </CardDescription>
        </div>
        <Button size="sm" onClick={onAddUseCase}>
          <Plus className="h-4 w-4 mr-2" />
          ユースケース追加
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {sortedUseCases.map((useCase, index) => {
            const relatedPages = getRelatedPages(useCase.id);
            const relatedTests = getRelatedTests(useCase.id);
            const isSelected = selectedUseCase?.id === useCase.id;

            return (
              <div
                key={useCase.id}
                className={cn(
                  "border rounded-lg p-4 transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-muted-foreground hover:shadow-sm"
                )}
                onClick={() => setSelectedUseCase(isSelected ? null : useCase)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        UC-{String(index + 1).padStart(2, '0')}
                      </Badge>
                      <FileText className="h-4 w-4 text-orange-600" />
                      <h4 className="font-medium text-sm">{useCase.displayName}</h4>
                    </div>

                    {useCase.description && (
                      <p className="text-xs text-muted-foreground">
                        {useCase.description}
                      </p>
                    )}

                    {/* 詳細情報（選択時のみ表示） */}
                    {isSelected && (
                      <div className="space-y-3 pt-2 border-t">
                        {/* 基本情報 */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-medium text-muted-foreground">システム名:</span>
                            <p className="text-foreground mt-1">{useCase.name}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">表示順:</span>
                            <p className="text-foreground mt-1">{useCase.order || '-'}</p>
                          </div>
                        </div>

                        {/* アクター情報 */}
                        {useCase.actors && (
                          <div>
                            <span className="font-medium text-muted-foreground text-xs">アクター:</span>
                            <p className="text-foreground text-xs mt-1">{useCase.actors}</p>
                          </div>
                        )}

                        {/* 事前条件・事後条件 */}
                        <div className="grid grid-cols-2 gap-4">
                          {useCase.preconditions && (
                            <div>
                              <span className="font-medium text-muted-foreground text-xs">事前条件:</span>
                              <p className="text-foreground text-xs mt-1 line-clamp-2">{useCase.preconditions}</p>
                            </div>
                          )}
                          {useCase.postconditions && (
                            <div>
                              <span className="font-medium text-muted-foreground text-xs">事後条件:</span>
                              <p className="text-foreground text-xs mt-1 line-clamp-2">{useCase.postconditions}</p>
                            </div>
                          )}
                        </div>

                        {/* 関連要素 */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-muted-foreground text-xs">関連ページ:</span>
                            <div className="mt-1 space-y-1">
                              {relatedPages.length > 0 ? (
                                relatedPages.map(page => (
                                  <Badge key={page.id} variant="secondary" className="text-xs mr-1">
                                    {page.displayName}
                                  </Badge>
                                ))
                              ) : (
                                <p className="text-muted-foreground text-xs">なし</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground text-xs">関連テスト:</span>
                            <div className="mt-1 space-y-1">
                              {relatedTests.length > 0 ? (
                                relatedTests.map(test => (
                                  <Badge key={test.id} variant="secondary" className="text-xs mr-1">
                                    {test.displayName}
                                  </Badge>
                                ))
                              ) : (
                                <p className="text-muted-foreground text-xs">なし</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 定義の一部を表示 */}
                        {useCase.definition && (
                          <div>
                            <span className="font-medium text-muted-foreground text-xs">定義（抜粋）:</span>
                            <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                              <p className="line-clamp-3">{useCase.definition.substring(0, 200)}...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* アクションボタン */}
                  <div className="flex gap-1 ml-4">
                    {onViewUseCase && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewUseCase(useCase);
                        }}
                        title="詳細表示"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditUseCase(useCase);
                      }}
                      title="編集"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {onDeleteUseCase && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`ユースケース「${useCase.displayName}」を削除しますか？`)) {
                            onDeleteUseCase(useCase.id);
                          }
                        }}
                        title="削除"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 統計情報 */}
        <div className="pt-4 border-t">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              ユースケース: {useCases.length}件
            </span>
            <span>
              ページ定義: {pageDefinitions.length}件 | テスト定義: {testDefinitions.length}件
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}