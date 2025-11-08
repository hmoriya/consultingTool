'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DomainLanguageDefinition, DomainEntity, ValueObject, DomainService } from '@/types/parasol';
import { EntityEditor } from './EntityEditor';
import { ValueObjectEditor } from './ValueObjectEditor';
import { DomainServiceEditor } from './DomainServiceEditor';

interface DomainLanguageEditorProps {
  value: DomainLanguageDefinition;
  onChange: (value: DomainLanguageDefinition) => void;
  readonly?: boolean;
}

export function DomainLanguageEditor({
  value,
  onChange,
  readonly = false
}: DomainLanguageEditorProps) {
  const [selectedEntity, setSelectedEntity] = useState<DomainEntity | null>(null);
  const [selectedValueObject, setSelectedValueObject] = useState<ValueObject | null>(null);
  const [selectedDomainService, setSelectedDomainService] = useState<DomainService | null>(null);
  const [editMode, setEditMode] = useState<'entity' | 'valueObject' | 'domainService' | null>(null);

  const handleAddEntity = () => {
    const newEntity: DomainEntity = {
      name: '新規エンティティ',
      japaneseNotation: '新規エンティティ',
      englishNotation: 'NewEntity',
      constantNotation: 'NEW_ENTITY',
      attributes: []
    };
    onChange({
      ...value,
      entities: [...value.entities, newEntity]
    });
    setSelectedEntity(newEntity);
    setEditMode('entity');
  };

  const handleUpdateEntity = (index: number, entity: DomainEntity) => {
    const newEntities = [...value.entities];
    newEntities[index] = entity;
    onChange({
      ...value,
      entities: newEntities
    });
  };

  const handleDeleteEntity = (index: number) => {
    const newEntities = value.entities.filter((_, i) => i !== index);
    onChange({
      ...value,
      entities: newEntities
    });
    setSelectedEntity(null);
  };

  const handleAddValueObject = () => {
    const newValueObject: ValueObject = {
      name: '新規値オブジェクト',
      japaneseNotation: '新規値オブジェクト',
      englishNotation: 'NewValueObject',
      constantNotation: 'NEW_VALUE_OBJECT',
      components: []
    };
    onChange({
      ...value,
      valueObjects: [...value.valueObjects, newValueObject]
    });
    setSelectedValueObject(newValueObject);
    setEditMode('valueObject');
  };

  const handleUpdateValueObject = (index: number,_value) => {
    const newValueObjects = [...value.valueObjects];
    newValueObjects[index] = valueObject;
    onChange({
      ...value,
      valueObjects: newValueObjects
    });
  };

  const handleDeleteValueObject = (index: number) => {
    const newValueObjects = value.valueObjects.filter((_, i) => i !== index);
    onChange({
      ...value,
      valueObjects: newValueObjects
    });
    setSelectedValueObject(null);
  };

  const handleAddDomainService = () => {
    const newDomainService: DomainService = {
      name: '新規ドメインサービス',
      japaneseNotation: '新規ドメインサービス',
      englishNotation: 'NewDomainService',
      constantNotation: 'NEW_DOMAIN_SERVICE',
      operations: []
    };
    onChange({
      ...value,
      domainServices: [...value.domainServices, newDomainService]
    });
    setSelectedDomainService(newDomainService);
    setEditMode('domainService');
  };

  const handleUpdateDomainService = (index: number, domainService: DomainService) => {
    const newDomainServices = [...value.domainServices];
    newDomainServices[index] = domainService;
    onChange({
      ...value,
      domainServices: newDomainServices
    });
  };

  const handleDeleteDomainService = (index: number) => {
    const newDomainServices = value.domainServices.filter((_, i) => i !== index);
    onChange({
      ...value,
      domainServices: newDomainServices
    });
    setSelectedDomainService(null);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="entities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entities">エンティティ</TabsTrigger>
          <TabsTrigger value="valueObjects">値オブジェクト</TabsTrigger>
          <TabsTrigger value="domainServices">ドメインサービス</TabsTrigger>
        </TabsList>

        <TabsContent value="entities" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">エンティティ一覧</h3>
            {!readonly && (
              <Button onClick={handleAddEntity} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                追加
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <Card>
                <ScrollArea className="h-[400px]">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {value.entities.map((entity, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md cursor-pointer transition-colors ${
                            selectedEntity === entity ? 'bg-primary/10 border-primary' : 'bg-secondary hover:bg-secondary/80'
                          } border`}
                          onClick={() => {
                            setSelectedEntity(entity);
                            setEditMode(null);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{entity.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {entity.japaneseNotation} [{entity.englishNotation}]
                              </div>
                            </div>
                            {!readonly && (
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditMode('entity');
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEntity(index);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>

            <div className="col-span-8">
              {selectedEntity && (
                <EntityEditor
                  entity={selectedEntity}
                  onChange={(updated) => {
                    const index = value.entities.findIndex(e => e === selectedEntity);
                    if (index >= 0) {
                      handleUpdateEntity(index, updated);
                      setSelectedEntity(updated);
                    }
                  }}
                  readonly={readonly || editMode !== 'entity'}
                  onEditToggle={() => setEditMode(editMode === 'entity' ? null : 'entity')}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="valueObjects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">値オブジェクト一覧</h3>
            {!readonly && (
              <Button onClick={handleAddValueObject} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                追加
              </Button>
            )}
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <Card>
                <ScrollArea className="h-[400px]">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {value.valueObjects.map((vo, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md cursor-pointer transition-colors ${
                            selectedValueObject === vo ? 'bg-primary/10 border-primary' : 'bg-secondary hover:bg-secondary/80'
                          } border`}
                          onClick={() => {
                            setSelectedValueObject(vo);
                            setEditMode(null);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{vo.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {vo.japaneseNotation} [{vo.englishNotation}]
                              </div>
                            </div>
                            {!readonly && (
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditMode('valueObject');
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteValueObject(index);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>

            <div className="col-span-8">
              {selectedValueObject && (
                <ValueObjectEditor
                  valueObject={selectedValueObject}
                  onChange={(updated) => {
                    const index = value.valueObjects.findIndex(vo => vo === selectedValueObject);
                    if (index >= 0) {
                      handleUpdateValueObject(index, updated);
                      setSelectedValueObject(updated);
                    }
                  }}
                  readonly={readonly || editMode !== 'valueObject'}
                  onEditToggle={() => setEditMode(editMode === 'valueObject' ? null : 'valueObject')}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="domainServices" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">ドメインサービス一覧</h3>
            {!readonly && (
              <Button onClick={handleAddDomainService} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                追加
              </Button>
            )}
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <Card>
                <ScrollArea className="h-[400px]">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {value.domainServices.map((ds, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md cursor-pointer transition-colors ${
                            selectedDomainService === ds ? 'bg-primary/10 border-primary' : 'bg-secondary hover:bg-secondary/80'
                          } border`}
                          onClick={() => {
                            setSelectedDomainService(ds);
                            setEditMode(null);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{ds.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {ds.japaneseNotation} [{ds.englishNotation}]
                              </div>
                            </div>
                            {!readonly && (
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditMode('domainService');
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDomainService(index);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>

            <div className="col-span-8">
              {selectedDomainService && (
                <DomainServiceEditor
                  domainService={selectedDomainService}
                  onChange={(updated) => {
                    const index = value.domainServices.findIndex(ds => ds === selectedDomainService);
                    if (index >= 0) {
                      handleUpdateDomainService(index, updated);
                      setSelectedDomainService(updated);
                    }
                  }}
                  readonly={readonly || editMode !== 'domainService'}
                  onEditToggle={() => setEditMode(editMode === 'domainService' ? null : 'domainService')}
                />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}