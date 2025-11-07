'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Eye, FileText } from 'lucide-react';
import { DomainLanguageDefinition } from '@/types/parasol';
import { 
  domainLanguageToMarkdown, 
  markdownToDomainLanguage,
  validateDomainLanguageMarkdown 
} from '@/lib/parasol/markdown-converter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DomainLanguageMarkdownEditorProps {
  value: DomainLanguageDefinition;
  onChange: (value: DomainLanguageDefinition) => void;
}

export function DomainLanguageMarkdownEditor({
  value,
  onChange
}: DomainLanguageMarkdownEditorProps) {
  const [markdown, setMarkdown] = useState('');
  const [activeTab, setActiveTab] = useState<'markdown' | 'preview'>('preview');
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  // 初期値の設定
  useEffect(() => {
    setMarkdown(domainLanguageToMarkdown(value));
  }, [value]);

  // Markdown変更時の処理
  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
    
    // リアルタイムバリデーションと変換
    try {
      const validation = validateDomainLanguageMarkdown(newMarkdown);
      setErrors(validation.errors);
      
      if (validation.isValid) {
        const parsed = markdownToDomainLanguage(newMarkdown);
        onChange(parsed);
      }
    } catch (_error) {
      // パースエラーは無視（バリデーションエラーで表示）
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as unknown)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="markdown" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Markdown
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            プレビュー
          </TabsTrigger>
        </TabsList>

        <TabsContent value="markdown" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Markdown編集</CardTitle>
              <CardDescription>
                Markdown形式でドメイン言語を編集します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={markdown}
                  onChange={(e) => handleMarkdownChange(e.target.value)}
                  className="min-h-[600px] font-mono text-sm"
                  placeholder="# ドメイン言語定義..."
                />
                
                {errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>検証エラー</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>プレビュー</CardTitle>
              <CardDescription>
                Markdown形式のドメイン言語定義のプレビューです
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdown}
                  </ReactMarkdown>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}