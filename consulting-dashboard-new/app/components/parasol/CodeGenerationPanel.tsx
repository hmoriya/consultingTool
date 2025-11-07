'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileCode, Loader2, Settings, AlertTriangle } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { 
  GenerationScope, 
  GenerationTarget, 
  GenerationConfig,
  getGenerationOptionsByCategory
} from '@/lib/parasol/generation-config';
import { generateCode, GenerationResult } from '@/lib/parasol/code-generator';
import { BusinessCapability, BusinessOperation } from '@/types/parasol';
import { cn } from '@/lib/utils';

interface CodeGenerationPanelProps {
  serviceId: string;
  capabilities: BusinessCapability[];
  operations: BusinessOperation[];
  className?: string;
}

export function CodeGenerationPanel({
  serviceId,
  capabilities,
  operations,
  className
}: CodeGenerationPanelProps) {
  const { toast } = useToast();
  
  // 生成設定の状態
  const [scope, setScope] = useState<GenerationScope>('service');
  const [target, setTarget] = useState<GenerationTarget>('all');
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  
  // オプションの状態
  const [includeValueObjects, setIncludeValueObjects] = useState(true);
  const [includeDomainServices, setIncludeDomainServices] = useState(true);
  const [includeRepositories, setIncludeRepositories] = useState(true);
  const [includeEvents, setIncludeEvents] = useState(true);
  const [includeSwagger, setIncludeSwagger] = useState(true);
  const [includeValidation, setIncludeValidation] = useState(true);
  const [includePagination, setIncludePagination] = useState(true);
  const [includeIndexes, setIncludeIndexes] = useState(true);
  const [includeConstraints, setIncludeConstraints] = useState(true);
  const [databaseType, setDatabaseType] = useState<'sqlite' | 'postgresql' | 'mysql'>('sqlite');
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [generateTests, setGenerateTests] = useState(false);
  const [generateDocs, setGenerateDocs] = useState(true);
  
  // プリセット適用
  const applyPreset = (category: string) => {
    const options = getGenerationOptionsByCategory(category);
    if (options.domain) {
      setIncludeValueObjects(options.domain.includeValueObjects);
      setIncludeDomainServices(options.domain.includeDomainServices);
      setIncludeRepositories(options.domain.includeRepositories);
      setIncludeEvents(options.domain.includeEvents);
    }
    setGenerateTests(options.generateTests || false);
    setGenerateDocs(options.generateDocs || false);
  };
  
  // 生成実行
  const handleGenerate = async () => {
    if (scope === 'capability' && !selectedCapabilityId) {
      toast({
        title: 'エラー',
        description: 'ケーパビリティを選択してください',
        variant: 'destructive'
      });
      return;
    }
    
    setIsGenerating(true);
    setGenerationResult(null);
    
    const config: GenerationConfig = {
      scope,
      target,
      serviceId,
      capabilityId: selectedCapabilityId || undefined,
      options: {
        domain: {
          includeValueObjects,
          includeDomainServices,
          includeRepositories,
          includeEvents
        },
        api: {
          includeSwagger,
          includeValidation,
          includePagination
        },
        db: {
          includeIndexes,
          includeConstraints,
          includeTriggers: false,
          databaseType
        },
        overwriteExisting,
        generateTests,
        generateDocs
      }
    };
    
    try {
      const result = await generateCode(capabilities, operations, config);
      setGenerationResult(result);
      
      if (result.success) {
        toast({
          title: '生成完了',
          description: `${result.generatedFiles.length}個のファイルを生成しました`
        });
      } else {
        toast({
          title: 'エラー',
          description: result.errors.join(', '),
          variant: 'destructive'
        });
      }
    } catch (_error) {
      toast({
        title: 'エラー',
        description: '生成中にエラーが発生しました',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // ファイルのダウンロード
  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileCode className="h-5 w-5" />
          <CardTitle>コード生成</CardTitle>
        </div>
        <CardDescription>
          ケーパビリティとオペレーションからコードを自動生成します
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 生成スコープ */}
          <div className="space-y-4">
            <div>
              <Label>生成スコープ</Label>
              <RadioGroup value={scope} onValueChange={(v) => setScope(v as GenerationScope)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="capability" id="scope-capability" />
                  <Label htmlFor="scope-capability">ケーパビリティ単位</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="service" id="scope-service" />
                  <Label htmlFor="scope-service">サービス単位</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="scope-all" />
                  <Label htmlFor="scope-all">すべて</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* ケーパビリティ選択 */}
            {scope === 'capability' && (
              <div>
                <Label>対象ケーパビリティ</Label>
                <Select value={selectedCapabilityId} onValueChange={setSelectedCapabilityId}>
                  <SelectTrigger>
                    <SelectValue placeholder="ケーパビリティを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {capabilities.map(cap => (
                      <SelectItem key={cap.id} value={cap.id}>
                        {cap.displayName} ({cap.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* 生成ターゲット */}
          <div className="space-y-4">
            <div>
              <Label>生成ターゲット</Label>
              <RadioGroup value={target} onValueChange={(v) => setTarget(v as GenerationTarget)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="domain" id="target-domain" />
                  <Label htmlFor="target-domain">ドメイン層のみ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="api" id="target-api" />
                  <Label htmlFor="target-api">API層のみ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="db" id="target-db" />
                  <Label htmlFor="target-db">DB層のみ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="target-all" />
                  <Label htmlFor="target-all">すべて生成</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* プリセット適用 */}
            <div>
              <Label>プリセット適用</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset('core')}
                >
                  コア
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset('supporting')}
                >
                  サポート
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset('generic')}
                >
                  汎用
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 詳細オプション */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-4 w-4" />
            <Label>詳細オプション</Label>
          </div>
          
          <Tabs defaultValue="domain" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="domain">ドメイン</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="db">DB</TabsTrigger>
            </TabsList>
            
            <TabsContent value="domain" className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-value-objects"
                  checked={includeValueObjects}
                  onCheckedChange={(checked) => setIncludeValueObjects(!!checked)}
                />
                <Label htmlFor="include-value-objects">値オブジェクトを生成</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-domain-services"
                  checked={includeDomainServices}
                  onCheckedChange={(checked) => setIncludeDomainServices(!!checked)}
                />
                <Label htmlFor="include-domain-services">ドメインサービスを生成</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-repositories"
                  checked={includeRepositories}
                  onCheckedChange={(checked) => setIncludeRepositories(!!checked)}
                />
                <Label htmlFor="include-repositories">リポジトリインターフェースを生成</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-events"
                  checked={includeEvents}
                  onCheckedChange={(checked) => setIncludeEvents(!!checked)}
                />
                <Label htmlFor="include-events">ドメインイベントを生成</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-swagger"
                  checked={includeSwagger}
                  onCheckedChange={(checked) => setIncludeSwagger(!!checked)}
                />
                <Label htmlFor="include-swagger">Swagger仕様を生成</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-validation"
                  checked={includeValidation}
                  onCheckedChange={(checked) => setIncludeValidation(!!checked)}
                />
                <Label htmlFor="include-validation">バリデーションを含める</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-pagination"
                  checked={includePagination}
                  onCheckedChange={(checked) => setIncludePagination(!!checked)}
                />
                <Label htmlFor="include-pagination">ページネーションを含める</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="db" className="space-y-2">
              <div>
                <Label>データベースタイプ</Label>
                <Select value={databaseType} onValueChange={(v) => setDatabaseType(v as unknown)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-indexes"
                  checked={includeIndexes}
                  onCheckedChange={(checked) => setIncludeIndexes(!!checked)}
                />
                <Label htmlFor="include-indexes">インデックスを生成</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-constraints"
                  checked={includeConstraints}
                  onCheckedChange={(checked) => setIncludeConstraints(!!checked)}
                />
                <Label htmlFor="include-constraints">制約を生成</Label>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* 共通オプション */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="overwrite-existing"
              checked={overwriteExisting}
              onCheckedChange={(checked) => setOverwriteExisting(!!checked)}
            />
            <Label htmlFor="overwrite-existing">既存ファイルを上書き</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="generate-tests"
              checked={generateTests}
              onCheckedChange={(checked) => setGenerateTests(!!checked)}
            />
            <Label htmlFor="generate-tests">テストコードを生成</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="generate-docs"
              checked={generateDocs}
              onCheckedChange={(checked) => setGenerateDocs(!!checked)}
            />
            <Label htmlFor="generate-docs">ドキュメントを生成</Label>
          </div>
        </div>
        
        {/* 生成ボタン */}
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <FileCode className="mr-2 h-4 w-4" />
              コード生成を実行
            </>
          )}
        </Button>
        
        {/* 生成結果 */}
        {generationResult && (
          <div className="space-y-4">
            {generationResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {generationResult.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {generationResult.warnings.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>警告</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {generationResult.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {generationResult.generatedFiles.length > 0 && (
              <div>
                <Label>生成されたファイル</Label>
                <ScrollArea className="h-[300px] mt-2 border rounded-md p-4">
                  <div className="space-y-2">
                    {generationResult.generatedFiles.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <FileCode className="h-4 w-4" />
                          <span className="text-sm font-mono">{file.path}</span>
                          <span className="text-xs text-muted-foreground">
                            ({file.type})
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(
                            file.content,
                            file.path.split('/').pop() || 'generated.txt'
                          )}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}