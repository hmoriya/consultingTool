'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Database, Link2, Trash2, Save } from 'lucide-react';
import { DBSchema, DBTable, DBColumn, DBRelation } from '@/types/parasol';

interface DBSchemaEditorProps {
  value: DBSchema;
  onChange: (value: DBSchema) => void;
  readonly?: boolean;
}

const columnTypes = [
  'VARCHAR(255)',
  'VARCHAR(100)',
  'VARCHAR(50)',
  'TEXT',
  'INTEGER',
  'BIGINT',
  'DECIMAL(10,2)',
  'BOOLEAN',
  'DATE',
  'TIMESTAMP',
  'JSON',
  'UUID'
];

export function DBSchemaEditor({ value, onChange, readonly = false }: DBSchemaEditorProps) {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [editingColumn, setEditingColumn] = useState<{ table: string; index: number } | null>(null);

  const handleAddTable = () => {
    const newTable: DBTable = {
      name: 'new_table',
      columns: [
        {
          name: 'id',
          type: 'UUID',
          nullable: false,
          unique: true
        }
      ],
      primaryKey: ['id']
    };
    onChange({
      ...value,
      tables: [...value.tables, newTable]
    });
    setSelectedTable(newTable.name);
  };

  const handleUpdateTable = (index: number, table: DBTable) => {
    const newTables = [...value.tables];
    newTables[index] = table;
    onChange({
      ...value,
      tables: newTables
    });
  };

  const handleDeleteTable = (index: number) => {
    const tableName = value.tables[index].name;
    const newTables = value.tables.filter((_, i) => i !== index);
    const newRelations = value.relations.filter(
      rel => rel.from.table !== tableName && rel.to.table !== tableName
    );
    onChange({
      ...value,
      tables: newTables,
      relations: newRelations
    });
    setSelectedTable('');
  };

  const handleAddColumn = (tableIndex: number) => {
    const table = value.tables[tableIndex];
    const newColumn: DBColumn = {
      name: 'new_column',
      type: 'VARCHAR(255)',
      nullable: true
    };
    handleUpdateTable(tableIndex, {
      ...table,
      columns: [...table.columns, newColumn]
    });
  };

  const handleUpdateColumn = (tableIndex: number, columnIndex: number, column: DBColumn) => {
    const table = value.tables[tableIndex];
    const newColumns = [...table.columns];
    newColumns[columnIndex] = column;
    handleUpdateTable(tableIndex, {
      ...table,
      columns: newColumns
    });
  };

  const handleDeleteColumn = (tableIndex: number, columnIndex: number) => {
    const table = value.tables[tableIndex];
    const newColumns = table.columns.filter((_, i) => i !== columnIndex);
    handleUpdateTable(tableIndex, {
      ...table,
      columns: newColumns
    });
  };

  const handleAddRelation = () => {
    if (value.tables.length < 2) return;
    
    const newRelation: DBRelation = {
      from: {
        table: value.tables[0].name,
        column: 'id'
      },
      to: {
        table: value.tables[1].name,
        column: 'id'
      },
      type: 'one-to-many'
    };
    onChange({
      ...value,
      relations: [...value.relations, newRelation]
    });
  };

  const _handleUpdateRelation = (index: number, relation: DBRelation) => {
    const newRelations = [...value.relations];
    newRelations[index] = relation;
    onChange({
      ...value,
      relations: newRelations
    });
  };

  const handleDeleteRelation = (index: number) => {
    const newRelations = value.relations.filter((_, i) => i !== index);
    onChange({
      ...value,
      relations: newRelations
    });
  };

  const getTableByName = (name: string) => {
    return value.tables.find(t => t.name === name);
  };

  return (
    <div className="space-y-6">
      {/* テーブル一覧と詳細 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">テーブル定義</h3>
          {!readonly && (
            <Button onClick={handleAddTable} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              テーブル追加
            </Button>
          )}
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* テーブル一覧 */}
          <div className="col-span-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">テーブル一覧</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {value.tables.map((table, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedTable === table.name ? 'bg-primary/10 border-primary' : 'bg-secondary hover:bg-secondary/80'
                    } border`}
                    onClick={() => setSelectedTable(table.name)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span className="font-mono text-sm">{table.name}</span>
                      </div>
                      {!readonly && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTable(index);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* テーブル詳細 */}
          <div className="col-span-8">
            {selectedTable && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">テーブル詳細: {selectedTable}</CardTitle>
                  <CardDescription>カラム定義とインデックス</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>カラム一覧</Label>
                      {!readonly && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const tableIndex = value.tables.findIndex(t => t.name === selectedTable);
                            if (tableIndex >= 0) handleAddColumn(tableIndex);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          カラム追加
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {getTableByName(selectedTable)?.columns.map((column, columnIndex) => {
                        const tableIndex = value.tables.findIndex(t => t.name === selectedTable);
                        const isEditing = editingColumn?.table === selectedTable && editingColumn?.index === columnIndex;
                        
                        return (
                          <div key={columnIndex} className="p-3 border rounded-md">
                            {isEditing && !readonly ? (
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <Input
                                    value={column.name}
                                    onChange={(e) => handleUpdateColumn(tableIndex, columnIndex, {
                                      ...column,
                                      name: e.target.value
                                    })}
                                    placeholder="カラム名"
                                  />
                                  <Select
                                    value={column.type}
                                    onValueChange={(type) => handleUpdateColumn(tableIndex, columnIndex, {
                                      ...column,
                                      type
                                    })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {columnTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex gap-4">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`nullable-${columnIndex}`}
                                      checked={!column.nullable}
                                      onCheckedChange={(checked) => handleUpdateColumn(tableIndex, columnIndex, {
                                        ...column,
                                        nullable: !checked
                                      })}
                                    />
                                    <Label htmlFor={`nullable-${columnIndex}`}>NOT NULL</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`unique-${columnIndex}`}
                                      checked={column.unique || false}
                                      onCheckedChange={(checked) => handleUpdateColumn(tableIndex, columnIndex, {
                                        ...column,
                                        unique: !!checked
                                      })}
                                    />
                                    <Label htmlFor={`unique-${columnIndex}`}>UNIQUE</Label>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => setEditingColumn(null)}
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  保存
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-mono text-sm font-medium">{column.name}</span>
                                  <span className="text-sm text-muted-foreground ml-2">{column.type}</span>
                                  {!column.nullable && (
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded ml-2">NOT NULL</span>
                                  )}
                                  {column.unique && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-1">UNIQUE</span>
                                  )}
                                  {column.foreignKey && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded ml-1">
                                      FK → {column.foreignKey.table}.{column.foreignKey.column}
                                    </span>
                                  )}
                                </div>
                                {!readonly && (
                                  <div className="flex gap-1">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6"
                                      onClick={() => setEditingColumn({ table: selectedTable, index: columnIndex })}
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 text-destructive"
                                      onClick={() => handleDeleteColumn(tableIndex, columnIndex)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* リレーション */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">リレーション定義</h3>
          {!readonly && value.tables.length >= 2 && (
            <Button onClick={handleAddRelation} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              リレーション追加
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {value.relations.map((relation, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm">
                    {relation.from.table}.{relation.from.column}
                  </span>
                  <span className="text-sm text-muted-foreground">→</span>
                  <span className="font-mono text-sm">
                    {relation.to.table}.{relation.to.column}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {relation.type}
                  </span>
                  {!readonly && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-destructive ml-auto"
                      onClick={() => handleDeleteRelation(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {value.relations.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  リレーションが定義されていません
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}