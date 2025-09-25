'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Save, X, Edit2 } from 'lucide-react';
import { DomainEntity, DomainAttribute, DomainType } from '@/types/parasol';

interface EntityEditorProps {
  entity: DomainEntity;
  onChange: (entity: DomainEntity) => void;
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

export function EntityEditor({ entity, onChange, readonly = false, onEditToggle }: EntityEditorProps) {
  const [editingAttribute, setEditingAttribute] = useState<number | null>(null);

  const handleBasicInfoChange = (field: keyof DomainEntity, value: string) => {
    onChange({
      ...entity,
      [field]: value
    });
  };

  const handleAddAttribute = () => {
    const newAttribute: DomainAttribute = {
      name: 'newAttribute',
      japaneseNotation: '新規属性',
      englishNotation: 'NewAttribute',
      constantNotation: 'NEW_ATTRIBUTE',
      type: 'STRING_50',
      required: true
    };
    onChange({
      ...entity,
      attributes: [...entity.attributes, newAttribute]
    });
    setEditingAttribute(entity.attributes.length);
  };

  const handleUpdateAttribute = (index: number, attribute: DomainAttribute) => {
    const newAttributes = [...entity.attributes];
    newAttributes[index] = attribute;
    onChange({
      ...entity,
      attributes: newAttributes
    });
  };

  const handleDeleteAttribute = (index: number) => {
    const newAttributes = entity.attributes.filter((_, i) => i !== index);
    onChange({
      ...entity,
      attributes: newAttributes
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>エンティティ詳細</CardTitle>
            <CardDescription>
              {entity.name} - {entity.japaneseNotation}
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
              <Label htmlFor="name">エンティティ名</Label>
              <Input
                id="name"
                value={entity.name}
                onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                disabled={readonly}
                placeholder="User"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="japaneseNotation">日本語記法</Label>
              <Input
                id="japaneseNotation"
                value={entity.japaneseNotation}
                onChange={(e) => handleBasicInfoChange('japaneseNotation', e.target.value)}
                disabled={readonly}
                placeholder="ユーザー"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="englishNotation">英語記法</Label>
              <Input
                id="englishNotation"
                value={entity.englishNotation}
                onChange={(e) => handleBasicInfoChange('englishNotation', e.target.value)}
                disabled={readonly}
                placeholder="User"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="constantNotation">定数記法</Label>
              <Input
                id="constantNotation"
                value={entity.constantNotation}
                onChange={(e) => handleBasicInfoChange('constantNotation', e.target.value)}
                disabled={readonly}
                placeholder="USER"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={entity.description || ''}
              onChange={(e) => handleBasicInfoChange('description', e.target.value)}
              disabled={readonly}
              placeholder="このエンティティの説明を入力してください"
              rows={3}
            />
          </div>
        </div>

        {/* 属性一覧 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold">属性一覧</h4>
            {!readonly && (
              <Button onClick={handleAddAttribute} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                属性追加
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {entity.attributes.map((attr, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-3">
                {editingAttribute === index && !readonly ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={attr.name}
                        onChange={(e) => handleUpdateAttribute(index, { ...attr, name: e.target.value })}
                        placeholder="属性名"
                      />
                      <Input
                        value={attr.japaneseNotation}
                        onChange={(e) => handleUpdateAttribute(index, { ...attr, japaneseNotation: e.target.value })}
                        placeholder="日本語名"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={attr.englishNotation}
                        onChange={(e) => handleUpdateAttribute(index, { ...attr, englishNotation: e.target.value })}
                        placeholder="英語名"
                      />
                      <Input
                        value={attr.constantNotation}
                        onChange={(e) => handleUpdateAttribute(index, { ...attr, constantNotation: e.target.value })}
                        placeholder="定数名"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Select
                        value={attr.type}
                        onValueChange={(value) => handleUpdateAttribute(index, { ...attr, type: value as DomainType })}
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
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${index}`}
                          checked={attr.required}
                          onCheckedChange={(checked) => handleUpdateAttribute(index, { ...attr, required: !!checked })}
                        />
                        <Label htmlFor={`required-${index}`}>必須</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`unique-${index}`}
                          checked={attr.unique || false}
                          onCheckedChange={(checked) => handleUpdateAttribute(index, { ...attr, unique: !!checked })}
                        />
                        <Label htmlFor={`unique-${index}`}>一意</Label>
                      </div>
                    </div>
                    <Textarea
                      value={attr.description || ''}
                      onChange={(e) => handleUpdateAttribute(index, { ...attr, description: e.target.value })}
                      placeholder="説明"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setEditingAttribute(null)}
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
                        {attr.name} ({attr.type})
                        {attr.required && <span className="text-red-500 ml-1">*</span>}
                        {attr.unique && <span className="text-blue-500 ml-1">[unique]</span>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {attr.japaneseNotation} [{attr.englishNotation}] [{attr.constantNotation}]
                      </div>
                      {attr.description && (
                        <div className="text-sm text-muted-foreground">{attr.description}</div>
                      )}
                    </div>
                    {!readonly && (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => setEditingAttribute(index)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDeleteAttribute(index)}
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