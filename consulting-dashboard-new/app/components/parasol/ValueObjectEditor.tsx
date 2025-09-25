'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, X, Edit2 } from 'lucide-react';
import { ValueObject, ValueObjectComponent, DomainType } from '@/types/parasol';

interface ValueObjectEditorProps {
  valueObject: ValueObject;
  onChange: (valueObject: ValueObject) => void;
  readonly?: boolean;
  onEditToggle?: () => void;
}

const domainTypes: DomainType[] = [
  'UUID',
  'STRING_20',
  'STRING_50',
  'STRING_100',
  'STRING_255',
  'TEXT',
  'EMAIL',
  'PASSWORD_HASH',
  'DATE',
  'TIMESTAMP',
  'DECIMAL',
  'INTEGER',
  'PERCENTAGE',
  'MONEY',
  'BOOLEAN',
  'ENUM'
];

export function ValueObjectEditor({ valueObject, onChange, readonly = false, onEditToggle }: ValueObjectEditorProps) {
  const [editingComponent, setEditingComponent] = useState<number | null>(null);

  const handleBasicInfoChange = (field: keyof ValueObject, value: string) => {
    onChange({
      ...valueObject,
      [field]: value
    });
  };

  const handleAddComponent = () => {
    const newComponent: ValueObjectComponent = {
      name: 'newComponent',
      japaneseNotation: '新規コンポーネント',
      englishNotation: 'NewComponent',
      constantNotation: 'NEW_COMPONENT',
      type: 'STRING_50'
    };
    onChange({
      ...valueObject,
      components: [...valueObject.components, newComponent]
    });
    setEditingComponent(valueObject.components.length);
  };

  const handleUpdateComponent = (index: number, component: ValueObjectComponent) => {
    const newComponents = [...valueObject.components];
    newComponents[index] = component;
    onChange({
      ...valueObject,
      components: newComponents
    });
  };

  const handleDeleteComponent = (index: number) => {
    const newComponents = valueObject.components.filter((_, i) => i !== index);
    onChange({
      ...valueObject,
      components: newComponents
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>値オブジェクト詳細</CardTitle>
            <CardDescription>
              {valueObject.name} - {valueObject.japaneseNotation}
            </CardDescription>
          </div>
          {onEditToggle && (
            <Button
              size="sm"
              variant={readonly ? "outline" : "default"}
              onClick={onEditToggle}
            >
              {readonly ? (
                <>
                  <Edit2 className="h-4 w-4 mr-1" />
                  編集
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  保存
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 基本情報 */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">値オブジェクト名</Label>
              <Input
                id="name"
                value={valueObject.name}
                onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                disabled={readonly}
                placeholder="Address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="japaneseNotation">日本語記法</Label>
              <Input
                id="japaneseNotation"
                value={valueObject.japaneseNotation}
                onChange={(e) => handleBasicInfoChange('japaneseNotation', e.target.value)}
                disabled={readonly}
                placeholder="住所"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="englishNotation">英語記法</Label>
              <Input
                id="englishNotation"
                value={valueObject.englishNotation}
                onChange={(e) => handleBasicInfoChange('englishNotation', e.target.value)}
                disabled={readonly}
                placeholder="Address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="constantNotation">定数記法</Label>
              <Input
                id="constantNotation"
                value={valueObject.constantNotation}
                onChange={(e) => handleBasicInfoChange('constantNotation', e.target.value)}
                disabled={readonly}
                placeholder="ADDRESS"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={valueObject.description || ''}
              onChange={(e) => handleBasicInfoChange('description', e.target.value)}
              disabled={readonly}
              placeholder="この値オブジェクトの説明を入力してください"
              rows={3}
            />
          </div>
        </div>

        {/* コンポーネント一覧 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold">コンポーネント一覧</h4>
            {!readonly && (
              <Button onClick={handleAddComponent} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                コンポーネント追加
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {valueObject.components.map((comp, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-3">
                {editingComponent === index && !readonly ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={comp.name}
                        onChange={(e) => handleUpdateComponent(index, { ...comp, name: e.target.value })}
                        placeholder="コンポーネント名"
                      />
                      <Input
                        value={comp.japaneseNotation}
                        onChange={(e) => handleUpdateComponent(index, { ...comp, japaneseNotation: e.target.value })}
                        placeholder="日本語名"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={comp.englishNotation}
                        onChange={(e) => handleUpdateComponent(index, { ...comp, englishNotation: e.target.value })}
                        placeholder="英語名"
                      />
                      <Input
                        value={comp.constantNotation}
                        onChange={(e) => handleUpdateComponent(index, { ...comp, constantNotation: e.target.value })}
                        placeholder="定数名"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        value={comp.type}
                        onValueChange={(value) => handleUpdateComponent(index, { ...comp, type: value as DomainType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {domainTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={comp.validation || ''}
                        onChange={(e) => handleUpdateComponent(index, { ...comp, validation: e.target.value })}
                        placeholder="バリデーションルール"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setEditingComponent(null)}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        完了
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {comp.name} ({comp.type})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {comp.japaneseNotation} [{comp.englishNotation}] [{comp.constantNotation}]
                      </div>
                      {comp.validation && (
                        <div className="text-sm text-muted-foreground">検証: {comp.validation}</div>
                      )}
                    </div>
                    {!readonly && (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => setEditingComponent(index)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDeleteComponent(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}