'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, ArrowRight, Save, Trash2 } from 'lucide-react';
import { DomainService, DomainServiceOperation, OperationParameter } from '@/types/parasol';

interface DomainServiceEditorProps {
  domainService: DomainService;
  onChange: (domainService: DomainService) => void;
  readonly?: boolean;
  onEditToggle?: () => void;
}

export function DomainServiceEditor({ domainService, onChange, readonly = false, onEditToggle }: DomainServiceEditorProps) {
  const [editingOperation, setEditingOperation] = useState<number | null>(null);

  const handleBasicInfoChange = (field: keyof DomainService,_value) => {
    onChange({
      ...domainService,
      [field]: value
    });
  };

  const handleAddOperation = () => {
    const newOperation: DomainServiceOperation = {
      name: 'newOperation',
      japaneseNotation: '新規操作',
      englishNotation: 'NewOperation',
      constantNotation: 'NEW_OPERATION',
      inputs: [],
      outputs: []
    };
    onChange({
      ...domainService,
      operations: [...domainService.operations, newOperation]
    });
    setEditingOperation(domainService.operations.length);
  };

  const handleUpdateOperation = (index: number, operation: DomainServiceOperation) => {
    const newOperations = [...domainService.operations];
    newOperations[index] = operation;
    onChange({
      ...domainService,
      operations: newOperations
    });
  };

  const handleDeleteOperation = (index: number) => {
    const newOperations = domainService.operations.filter((_, i) => i !== index);
    onChange({
      ...domainService,
      operations: newOperations
    });
  };

  const handleAddParameter = (opIndex: number, type: 'inputs' | 'outputs') => {
    const operation = domainService.operations[opIndex];
    const newParameter: OperationParameter = {
      name: 'param',
      type: 'string',
      description: ''
    };
    handleUpdateOperation(opIndex, {
      ...operation,
      [type]: [...operation[type], newParameter]
    });
  };

  const handleUpdateParameter = (opIndex: number, type: 'inputs' | 'outputs', paramIndex: number, param: OperationParameter) => {
    const operation = domainService.operations[opIndex];
    const newParams = [...operation[type]];
    newParams[paramIndex] = param;
    handleUpdateOperation(opIndex, {
      ...operation,
      [type]: newParams
    });
  };

  const handleDeleteParameter = (opIndex: number, type: 'inputs' | 'outputs', paramIndex: number) => {
    const operation = domainService.operations[opIndex];
    const newParams = operation[type].filter((_, i) => i !== paramIndex);
    handleUpdateOperation(opIndex, {
      ...operation,
      [type]: newParams
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>ドメインサービス詳細</CardTitle>
            <CardDescription>
              {domainService.name} - {domainService.japaneseNotation}
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
              <Label htmlFor="name">サービス名</Label>
              <Input
                id="name"
                value={domainService.name}
                onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                disabled={readonly}
                placeholder="AuthenticationService"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="japaneseNotation">日本語記法</Label>
              <Input
                id="japaneseNotation"
                value={domainService.japaneseNotation}
                onChange={(e) => handleBasicInfoChange('japaneseNotation', e.target.value)}
                disabled={readonly}
                placeholder="認証サービス"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="englishNotation">英語記法</Label>
              <Input
                id="englishNotation"
                value={domainService.englishNotation}
                onChange={(e) => handleBasicInfoChange('englishNotation', e.target.value)}
                disabled={readonly}
                placeholder="AuthenticationService"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="constantNotation">定数記法</Label>
              <Input
                id="constantNotation"
                value={domainService.constantNotation}
                onChange={(e) => handleBasicInfoChange('constantNotation', e.target.value)}
                disabled={readonly}
                placeholder="AUTHENTICATION_SERVICE"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={domainService.description || ''}
              onChange={(e) => handleBasicInfoChange('description', e.target.value)}
              disabled={readonly}
              placeholder="このドメインサービスの説明を入力してください"
              rows={3}
            />
          </div>
        </div>

        {/* 操作一覧 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold">操作一覧</h4>
            {!readonly && (
              <Button onClick={handleAddOperation} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                操作追加
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {domainService.operations.map((op, opIndex) => (
              <div key={opIndex} className="p-4 border rounded-lg space-y-4">
                {editingOperation === opIndex && !readonly ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={op.name}
                        onChange={(e) => handleUpdateOperation(opIndex, { ...op, name: e.target.value })}
                        placeholder="操作名"
                      />
                      <Input
                        value={op.japaneseNotation}
                        onChange={(e) => handleUpdateOperation(opIndex, { ...op, japaneseNotation: e.target.value })}
                        placeholder="日本語名"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={op.englishNotation}
                        onChange={(e) => handleUpdateOperation(opIndex, { ...op, englishNotation: e.target.value })}
                        placeholder="英語名"
                      />
                      <Input
                        value={op.constantNotation}
                        onChange={(e) => handleUpdateOperation(opIndex, { ...op, constantNotation: e.target.value })}
                        placeholder="定数名"
                      />
                    </div>
                    <Textarea
                      value={op.description || ''}
                      onChange={(e) => handleUpdateOperation(opIndex, { ...op, description: e.target.value })}
                      placeholder="説明"
                      rows={2}
                    />

                    {/* 入力パラメータ */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">入力パラメータ</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddParameter(opIndex, 'inputs')}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {op.inputs.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex gap-2">
                          <Input
                            value={param.name}
                            onChange={(e) => handleUpdateParameter(opIndex, 'inputs', paramIndex, { ...param, name: e.target.value })}
                            placeholder="パラメータ名"
                            className="flex-1"
                          />
                          <Input
                            value={param.type}
                            onChange={(e) => handleUpdateParameter(opIndex, 'inputs', paramIndex, { ...param, type: e.target.value })}
                            placeholder="型"
                            className="w-32"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDeleteParameter(opIndex, 'inputs', paramIndex)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* 出力パラメータ */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">出力パラメータ</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddParameter(opIndex, 'outputs')}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {op.outputs.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex gap-2">
                          <Input
                            value={param.name}
                            onChange={(e) => handleUpdateParameter(opIndex, 'outputs', paramIndex, { ...param, name: e.target.value })}
                            placeholder="パラメータ名"
                            className="flex-1"
                          />
                          <Input
                            value={param.type}
                            onChange={(e) => handleUpdateParameter(opIndex, 'outputs', paramIndex, { ...param, type: e.target.value })}
                            placeholder="型"
                            className="w-32"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDeleteParameter(opIndex, 'outputs', paramIndex)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setEditingOperation(null)}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        完了
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-medium">{op.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {op.japaneseNotation} [{op.englishNotation}] [{op.constantNotation}]
                        </div>
                        {op.description && (
                          <div className="text-sm text-muted-foreground">{op.description}</div>
                        )}
                      </div>
                      {!readonly && (
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => setEditingOperation(opIndex)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleDeleteOperation(opIndex)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">入力: </span>
                        {op.inputs.length > 0 ? op.inputs.map(p => `${p.name}: ${p.type}`).join(', ') : 'なし'}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">出力: </span>
                        {op.outputs.length > 0 ? op.outputs.map(p => `${p.name}: ${p.type}`).join(', ') : 'なし'}
                      </div>
                    </div>
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