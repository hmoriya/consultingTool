'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createService, updateService } from '@/app/actions/parasol';
import type { ServiceFormProps, ServiceFormData } from '@/app/types/parasol-components';
import type { DomainLanguageDefinition, ApiSpecification, DbDesign } from '@/app/types/parasol';

// Types imported from parasol-components.ts

export function ServiceForm({ service, onClose, onSuccess }: ServiceFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: service?.name || '',
    displayName: service?.displayName || '',
    description: service?.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        domainLanguage: (service?.domainLanguage || {
          entities: [],
          valueObjects: [],
          domainServices: [],
          version: '1.0.0',
          lastModified: new Date().toISOString()
        }) as DomainLanguageDefinition,
        apiSpecification: (service?.apiSpecification || {
          openapi: '3.0.0',
          info: {
            title: formData.displayName + ' API',
            version: '1.0.0',
            description: formData.description || ''
          },
          paths: {}
        }) as ApiSpecification,
        dbSchema: (service?.dbSchema || {
          tables: [],
          relations: [],
          indexes: []
        }) as DbDesign
      };

      const result = service
        ? await updateService(service.id, data)
        : await createService(data);

      if (result.success) {
        toast({
          title: service ? 'サービスを更新しました' : 'サービスを作成しました',
          description: formData.displayName,
        });
        onSuccess(result.data);
      } else {
        toast({
          title: 'エラー',
          description: result.error || '処理に失敗しました',
          variant: 'destructive',
        });
      }
    } catch (_error) {
      toast({
        title: 'エラー',
        description: 'サービスの保存中にエラーが発生しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{service ? 'サービスを編集' : '新規サービス作成'}</DialogTitle>
            <DialogDescription>
              サービスの基本情報を入力してください
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">サービス識別子</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: project-service"
                required
                disabled={!!service}
              />
              <p className="text-xs text-muted-foreground">
                システム内部で使用される一意の識別子です（変更不可）
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">表示名</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="例: プロジェクトサービス"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="サービスの説明を入力してください"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : service ? '更新' : '作成'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}