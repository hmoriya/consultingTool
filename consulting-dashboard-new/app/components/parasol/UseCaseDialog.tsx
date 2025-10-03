'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createUseCase, updateUseCase } from '@/app/actions/parasol';
import { useRouter } from 'next/navigation';

interface UseCaseDialogProps {
  operationId: string;
  useCase?: {
    id: string;
    name: string;
    displayName: string;
    description?: string | null;
    definition?: string | null;
    order?: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UseCaseDialog({
  operationId,
  useCase,
  isOpen,
  onClose,
}: UseCaseDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    definition: '',
    order: 0,
  });

  // useCaseが変更されたらフォームを初期化
  useEffect(() => {
    if (useCase) {
      setFormData({
        name: useCase.name,
        displayName: useCase.displayName,
        description: useCase.description || '',
        definition: useCase.definition || '',
        order: useCase.order || 0,
      });
    } else {
      setFormData({
        name: '',
        displayName: '',
        description: '',
        definition: '',
        order: 0,
      });
    }
  }, [useCase]);

  const handleSave = async () => {
    if (!formData.name || !formData.displayName) {
      alert('名前と表示名は必須です');
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (useCase?.id) {
        // 更新
        result = await updateUseCase(useCase.id, formData);
      } else {
        // 新規作成
        result = await createUseCase({
          operationId,
          ...formData,
        });
      }

      if (result.success) {
        router.refresh();
        onClose();
      } else {
        alert(result.error || 'エラーが発生しました');
      }
    } catch (error) {
      console.error('Failed to save useCase:', error);
      alert('保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {useCase ? 'ユースケースを編集' : '新しいユースケースを作成'}
          </DialogTitle>
          <DialogDescription>
            ユースケースの基本情報を入力してください。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前（英語）*</Label>
            <Input
              id="name"
              placeholder="例: register-user"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">表示名（日本語）*</Label>
            <Input
              id="displayName"
              placeholder="例: ユーザーを登録する"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              placeholder="ユースケースの説明を入力してください"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="definition">定義（Markdown形式）</Label>
            <Textarea
              id="definition"
              placeholder="MD形式のユースケース定義を入力してください"
              rows={10}
              className="font-mono text-sm"
              value={formData.definition}
              onChange={(e) =>
                setFormData({ ...formData, definition: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              ユースケース定義テンプレートに従って記述することを推奨します
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">表示順序</Label>
            <Input
              id="order"
              type="number"
              min="0"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
