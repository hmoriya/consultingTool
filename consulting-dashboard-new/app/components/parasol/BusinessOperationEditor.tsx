'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface BusinessOperation {
  id?: string;
  name: string;
  displayName: string;
  pattern: 'CRUD' | 'Workflow' | 'Analytics' | 'Communication' | 'Administration';
  goal: string;
  roles?: string[];
  operations?: string[];
  businessStates?: string[];
}

interface BusinessOperationEditorProps {
  operation?: BusinessOperation;
  isOpen: boolean;
  onClose: () => void;
  onSave: (operation: BusinessOperation) => void;
  onDelete?: (operationId: string) => void;
}

export function BusinessOperationEditor({
  operation,
  isOpen,
  onClose,
  onSave,
  onDelete
}: BusinessOperationEditorProps) {
  const [formData, setFormData] = useState<BusinessOperation>(operation || {
    name: '',
    displayName: '',
    pattern: 'CRUD',
    goal: '',
    roles: [],
    operations: [],
    businessStates: []
  });

  // 入力用の一時的な値
  const [newRole, setNewRole] = useState('');
  const [newOperation, setNewOperation] = useState('');
  const [newState, setNewState] = useState('');

  if (!isOpen) return null;

  const patternOptions = [
    { value: 'CRUD', label: 'CRUD（作成・参照・更新・削除）' },
    { value: 'Workflow', label: 'ワークフロー' },
    { value: 'Analytics', label: '分析・レポート' },
    { value: 'Communication', label: 'コミュニケーション' },
    { value: 'Administration', label: '管理・設定' }
  ];

  const roleOptions = ['Executive', 'PM', 'Consultant', 'Client', 'Admin'];
  const operationOptions = ['create', 'read', 'update', 'delete', 'approve', 'reject', 'notify', 'analyze', 'report'];
  const stateOptions = ['draft', 'pending', 'active', 'approved', 'rejected', 'completed', 'archived'];

  const handleSave = () => {
    if (!formData.name || !formData.displayName || !formData.goal) {
      // バリデーションエラーの表示（後で実装）
      return;
    }
    onSave(formData);
  };

  const addRole = () => {
    if (newRole && !formData.roles?.includes(newRole)) {
      setFormData({
        ...formData,
        roles: [...(formData.roles || []), newRole]
      });
      setNewRole('');
    }
  };

  const removeRole = (role: string) => {
    setFormData({
      ...formData,
      roles: formData.roles?.filter(r => r !== role) || []
    });
  };

  const addOperation = () => {
    if (newOperation && !formData.operations?.includes(newOperation)) {
      setFormData({
        ...formData,
        operations: [...(formData.operations || []), newOperation]
      });
      setNewOperation('');
    }
  };

  const removeOperation = (op: string) => {
    setFormData({
      ...formData,
      operations: formData.operations?.filter(o => o !== op) || []
    });
  };

  const addState = () => {
    if (newState && !formData.businessStates?.includes(newState)) {
      setFormData({
        ...formData,
        businessStates: [...(formData.businessStates || []), newState]
      });
      setNewState('');
    }
  };

  const removeState = (state: string) => {
    setFormData({
      ...formData,
      businessStates: formData.businessStates?.filter(s => s !== state) || []
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-4 md:inset-10 lg:inset-20 overflow-hidden">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{operation ? 'ビジネスオペレーション編集' : '新規ビジネスオペレーション'}</CardTitle>
                <CardDescription>オペレーションの詳細情報を設定します</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">基本情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="op-name">オペレーション名（英語）</Label>
                    <Input
                      id="op-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="例: createProject"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="op-display">表示名（日本語）</Label>
                    <Input
                      id="op-display"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="例: プロジェクト作成"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="op-pattern">パターン</Label>
                  <Select
                    value={formData.pattern}
                    onValueChange={(value: unknown) => setFormData({ ...formData, pattern: value })}
                  >
                    <SelectTrigger id="op-pattern">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {patternOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="op-goal">目標</Label>
                  <Textarea
                    id="op-goal"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    placeholder="このオペレーションが達成する目標を記述"
                    rows={3}
                  />
                </div>
              </div>

              {/* ロール */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">実行可能ロール</h3>
                <div className="flex gap-2">
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="ロールを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addRole} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.roles?.map(role => (
                    <Badge key={role} variant="secondary">
                      {role}
                      <button
                        onClick={() => removeRole(role)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 操作 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">操作</h3>
                <div className="flex gap-2">
                  <Select value={newOperation} onValueChange={setNewOperation}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="操作を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {operationOptions.map(op => (
                        <SelectItem key={op} value={op}>
                          {op}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addOperation} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.operations?.map(op => (
                    <Badge key={op} variant="outline">
                      {op}
                      <button
                        onClick={() => removeOperation(op)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* ビジネス状態 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">ビジネス状態</h3>
                <div className="flex gap-2">
                  <Select value={newState} onValueChange={setNewState}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="状態を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateOptions.map(state => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addState} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.businessStates?.map(state => (
                    <Badge key={state} variant="default">
                      {state}
                      <button
                        onClick={() => removeState(state)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <div className="p-6 border-t flex justify-between">
            <div>
              {operation && onDelete && (
                <Button
                  variant="destructive"
                  onClick={() => onDelete(operation.id!)}
                >
                  削除
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button onClick={handleSave}>
                保存
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}