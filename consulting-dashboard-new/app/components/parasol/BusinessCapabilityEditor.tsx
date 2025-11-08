'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, ChevronRight, Briefcase, Sparkles, Trash2 } from 'lucide-react';

interface BusinessCapability {
  id?: string;
  name: string;
  displayName: string;
  description?: string;
  category: 'Core' | 'Supporting' | 'Generic';
  businessOperations?: BusinessOperation[];
}

interface BusinessOperation {
  id?: string;
  name: string;
  displayName: string;
  pattern: 'CRUD' | 'Workflow' | 'Analytics' | 'Communication' | 'Administration';
  goal: string;
}

interface BusinessCapabilityEditorProps {
  serviceId: string;
  capabilities: BusinessCapability[];
  onSave: (capabilities: BusinessCapability[]) => void;
  onOperationClick: (capability: BusinessCapability, operation: BusinessOperation) => void;
  onGenerateOperations?: (capability: BusinessCapability, operations: BusinessOperation[]) => void;
  onAddOperation?: (capability: BusinessCapability) => void;
  onEditOperation?: (capability: BusinessCapability, operation: BusinessOperation) => void;
  onDeleteOperation?: (capability: BusinessCapability, operation: BusinessOperation) => void;
}

export function BusinessCapabilityEditor({ 
  serviceId: _serviceId, 
  capabilities, 
  onSave,
  onOperationClick,
  onGenerateOperations,
  onAddOperation,
  onEditOperation,
  onDeleteOperation
}: BusinessCapabilityEditorProps) {
  const [localCapabilities, setLocalCapabilities] = useState<BusinessCapability[]>(capabilities);
  const [editingCapability, setEditingCapability] = useState<BusinessCapability | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // propsのcapabilitiesが変更されたらlocalCapabilitiesを更新
  useEffect(() => {
    console.log('BusinessCapabilityEditor received capabilities:', capabilities);
    setLocalCapabilities(capabilities);
  }, [capabilities]);

  // カテゴリーごとにグループ化
  const groupedCapabilities = localCapabilities.reduce((acc, cap) => {
    if (!acc[cap.category]) {
      acc[cap.category] = [];
    }
    acc[cap.category].push(cap);
    return acc;
  }, {} as Record<string, BusinessCapability[]>);

  const handleAdd = () => {
    const newCapability: BusinessCapability = {
      name: '',
      displayName: '',
      description: '',
      category: 'Core',
      businessOperations: []
    };
    setEditingCapability(newCapability);
    setIsAddingNew(true);
  };

  const handleSaveCapability = () => {
    if (!editingCapability) return;

    if (isAddingNew) {
      setLocalCapabilities([...localCapabilities, editingCapability]);
    } else {
      setLocalCapabilities(localCapabilities.map(cap => 
        cap.id === editingCapability.id ? editingCapability : cap
      ));
    }
    
    setEditingCapability(null);
    setIsAddingNew(false);
    onSave(localCapabilities);
  };

  // ケーパビリティからビジネスオペレーションを生成
  const generateOperationsFromCapability = (capability: BusinessCapability): BusinessOperation[] => {
    const operations: BusinessOperation[] = [];
    
    // ケーパビリティ名から適切なパターンを推測
    const name = capability.name.toLowerCase();
    
    if (name.includes('management') || name.includes('admin')) {
      // 管理系ケーパビリティ
      operations.push({
        name: `create${capability.name}`,
        displayName: `${capability.displayName}作成`,
        pattern: 'CRUD',
        goal: `新規${capability.displayName}を作成し、システムに登録する`
      });
      operations.push({
        name: `update${capability.name}`,
        displayName: `${capability.displayName}更新`,
        pattern: 'CRUD',
        goal: `既存の${capability.displayName}情報を更新する`
      });
      operations.push({
        name: `delete${capability.name}`,
        displayName: `${capability.displayName}削除`,
        pattern: 'CRUD',
        goal: `不要な${capability.displayName}を削除する`
      });
      operations.push({
        name: `list${capability.name}`,
        displayName: `${capability.displayName}一覧`,
        pattern: 'CRUD',
        goal: `${capability.displayName}の一覧を表示する`
      });
    }
    
    if (name.includes('analytics') || name.includes('report')) {
      // 分析系ケーパビリティ
      operations.push({
        name: `analyze${capability.name}Data`,
        displayName: `${capability.displayName}分析`,
        pattern: 'Analytics',
        goal: `${capability.displayName}のデータを分析し、洞察を得る`
      });
      operations.push({
        name: `generate${capability.name}Report`,
        displayName: `${capability.displayName}レポート生成`,
        pattern: 'Analytics',
        goal: `${capability.displayName}のレポートを生成する`
      });
    }
    
    if (name.includes('workflow') || name.includes('process')) {
      // ワークフロー系ケーパビリティ
      operations.push({
        name: `initiate${capability.name}`,
        displayName: `${capability.displayName}開始`,
        pattern: 'Workflow',
        goal: `${capability.displayName}プロセスを開始する`
      });
      operations.push({
        name: `approve${capability.name}`,
        displayName: `${capability.displayName}承認`,
        pattern: 'Workflow',
        goal: `${capability.displayName}を承認する`
      });
      operations.push({
        name: `reject${capability.name}`,
        displayName: `${capability.displayName}却下`,
        pattern: 'Workflow',
        goal: `${capability.displayName}を却下する`
      });
    }
    
    if (name.includes('communication') || name.includes('notification')) {
      // コミュニケーション系ケーパビリティ
      operations.push({
        name: `send${capability.name}Notification`,
        displayName: `${capability.displayName}通知送信`,
        pattern: 'Communication',
        goal: `${capability.displayName}に関する通知を送信する`
      });
    }
    
    // デフォルトオペレーション（すべてのケーパビリティに共通）
    if (operations.length === 0) {
      operations.push({
        name: `manage${capability.name}`,
        displayName: `${capability.displayName}管理`,
        pattern: 'Administration',
        goal: `${capability.displayName}を管理する`
      });
    }
    
    return operations;
  };

  const handleDelete = (capabilityId: string) => {
    if (!confirm('このケーパビリティを削除しますか？')) return;
    
    const updated = localCapabilities.filter(cap => cap.id !== capabilityId);
    setLocalCapabilities(updated);
    onSave(updated);
  };

  const categoryLabels = {
    Core: 'コア（中核）',
    Supporting: 'サポート',
    Generic: '汎用'
  };

  const patternLabels = {
    CRUD: 'CRUD（作成・参照・更新・削除）',
    Workflow: 'ワークフロー',
    Analytics: '分析・レポート',
    Communication: 'コミュニケーション',
    Administration: '管理・設定'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">ビジネスケーパビリティ</h3>
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          ケーパビリティ追加
        </Button>
      </div>

      {/* カテゴリーごとの表示 */}
      {Object.entries(categoryLabels).map(([category, label]) => {
        const capsInCategory = groupedCapabilities[category] || [];
        
        return (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
            {capsInCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground ml-4">
                {label}ケーパビリティが未定義です
              </p>
            ) : (
              <div className="space-y-2 ml-4">
                {capsInCategory.map(capability => (
                  <Card key={capability.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <h5 className="font-medium">{capability.displayName}</h5>
                          <span className="text-sm text-muted-foreground">
                            ({capability.name})
                          </span>
                        </div>
                        {capability.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {capability.description}
                          </p>
                        )}
                        
                        {/* オペレーション一覧 */}
                        {capability.businessOperations && capability.businessOperations.length > 0 ? (
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium">
                                ビジネスオペレーション ({capability.businessOperations.length})
                              </p>
                              {onAddOperation && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => onAddOperation(capability)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  追加
                                </Button>
                              )}
                            </div>
                            {capability.businessOperations.map(op => (
                              <div
                                key={op.id || op.name}
                                className="group flex items-center gap-2 p-2 rounded hover:bg-secondary"
                              >
                                <ChevronRight className="h-3 w-3" />
                                <span 
                                  className="text-sm flex-1 cursor-pointer"
                                  onClick={() => onOperationClick(capability, op)}
                                >
                                  {op.displayName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  [{patternLabels[op.pattern]}]
                                </span>
                                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                  {onEditOperation && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEditOperation(capability, op);
                                      }}
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                  {onDeleteOperation && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('このオペレーションを削除しますか？')) {
                                          onDeleteOperation(capability, op);
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-3">
                            {onAddOperation && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAddOperation(capability)}
                                className="w-full"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                オペレーションを追加
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {(!capability.businessOperations || capability.businessOperations.length === 0) && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              const generatedOps = generateOperationsFromCapability(capability);
                              if (onGenerateOperations) {
                                onGenerateOperations(capability, generatedOps);
                              }
                            }}
                            title="オペレーションを自動生成"
                          >
                            <Sparkles className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingCapability(capability);
                            setIsAddingNew(false);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(capability.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* 編集ダイアログ */}
      {editingCapability && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>{isAddingNew ? '新規ケーパビリティ' : 'ケーパビリティ編集'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cap-name">ケーパビリティ名（英語）</Label>
                  <Input
                    id="cap-name"
                    value={editingCapability.name}
                    onChange={(e) => setEditingCapability({
                      ...editingCapability,
                      name: e.target.value
                    })}
                    placeholder="例: ProjectManagement"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cap-display">表示名（日本語）</Label>
                  <Input
                    id="cap-display"
                    value={editingCapability.displayName}
                    onChange={(e) => setEditingCapability({
                      ...editingCapability,
                      displayName: e.target.value
                    })}
                    placeholder="例: プロジェクト管理"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cap-category">カテゴリ</Label>
                <Select
                  value={editingCapability.category}
                  onValueChange={(value: 'Core' | 'Supporting' | 'Generic') =>
                    setEditingCapability({ ...editingCapability, category: value })
                  }
                >
                  <SelectTrigger id="cap-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cap-desc">説明</Label>
                <Textarea
                  id="cap-desc"
                  value={editingCapability.description || ''}
                  onChange={(e) => setEditingCapability({
                    ...editingCapability,
                    description: e.target.value
                  })}
                  placeholder="このケーパビリティの説明を入力"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingCapability(null);
                    setIsAddingNew(false);
                  }}
                >
                  キャンセル
                </Button>
                <Button onClick={handleSaveCapability}>
                  保存
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}