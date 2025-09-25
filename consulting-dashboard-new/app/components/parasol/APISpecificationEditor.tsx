'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, Code, FileJson } from 'lucide-react';
import { APISpecification } from '@/types/parasol';

interface APISpecificationEditorProps {
  value: APISpecification;
  onChange: (value: APISpecification) => void;
  readonly?: boolean;
}

interface EndpointDefinition {
  method: string;
  summary: string;
  description?: string;
  parameters?: any[];
  requestBody?: any;
  responses: Record<string, any>;
}

export function APISpecificationEditor({ value, onChange, readonly = false }: APISpecificationEditorProps) {
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [yamlView, setYamlView] = useState(false);

  const handleAddPath = () => {
    const newPath = '/api/v1/new-endpoint';
    const newPaths = {
      ...value.paths,
      [newPath]: {
        get: {
          summary: '新規エンドポイント',
          responses: {
            '200': {
              description: '成功',
              content: {
                'application/json': {
                  schema: {
                    type: 'object'
                  }
                }
              }
            }
          }
        }
      }
    };
    onChange({
      ...value,
      paths: newPaths
    });
    setSelectedPath(newPath);
    setEditMode(true);
  };

  const handleUpdatePath = (path: string, newPath: string) => {
    if (path === newPath) return;
    
    const newPaths = { ...value.paths };
    newPaths[newPath] = newPaths[path];
    delete newPaths[path];
    
    onChange({
      ...value,
      paths: newPaths
    });
    setSelectedPath(newPath);
  };

  const handleDeletePath = (path: string) => {
    const newPaths = { ...value.paths };
    delete newPaths[path];
    onChange({
      ...value,
      paths: newPaths
    });
    setSelectedPath('');
  };

  const handleUpdateEndpoint = (path: string, method: string, endpoint: EndpointDefinition) => {
    const newPaths = {
      ...value.paths,
      [path]: {
        ...value.paths[path],
        [method]: endpoint
      }
    };
    onChange({
      ...value,
      paths: newPaths
    });
  };

  const handleAddMethod = (path: string, method: string) => {
    const newPaths = {
      ...value.paths,
      [path]: {
        ...value.paths[path],
        [method]: {
          summary: `${method.toUpperCase()} ${path}`,
          responses: {
            '200': {
              description: '成功',
              content: {
                'application/json': {
                  schema: {
                    type: 'object'
                  }
                }
              }
            }
          }
        }
      }
    };
    onChange({
      ...value,
      paths: newPaths
    });
  };

  const formatYaml = () => {
    // 簡易的なYAML形式の表示（実際のアプリケーションではjs-yamlなどのライブラリを使用）
    return `openapi: ${value.openapi}
info:
  title: ${value.info.title}
  version: ${value.info.version}
  description: ${value.info.description || ''}

paths:
${Object.entries(value.paths).map(([path, methods]) => `  ${path}:
${Object.entries(methods).map(([method, endpoint]: [string, any]) => `    ${method}:
      summary: ${endpoint.summary}
      responses:
        200:
          description: Success`).join('\n')}`).join('\n')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">API仕様定義</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setYamlView(!yamlView)}
          >
            {yamlView ? <FileJson className="h-4 w-4 mr-1" /> : <Code className="h-4 w-4 mr-1" />}
            {yamlView ? 'エディタ表示' : 'YAML表示'}
          </Button>
          {!readonly && (
            <Button onClick={handleAddPath} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              エンドポイント追加
            </Button>
          )}
        </div>
      </div>

      {yamlView ? (
        <Card>
          <CardContent className="p-4">
            <pre className="text-sm overflow-auto bg-muted p-4 rounded-md">
              {formatYaml()}
            </pre>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {/* エンドポイント一覧 */}
          <div className="col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">エンドポイント</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(value.paths).map(([path, methods]) => (
                  <div
                    key={path}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedPath === path ? 'bg-primary/10 border-primary' : 'bg-secondary hover:bg-secondary/80'
                    } border`}
                    onClick={() => setSelectedPath(path)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-mono text-sm font-medium">{path}</div>
                        <div className="flex gap-1 mt-1">
                          {Object.keys(methods).map(method => (
                            <span
                              key={method}
                              className={`text-xs px-2 py-0.5 rounded font-medium ${
                                method === 'get' ? 'bg-blue-100 text-blue-700' :
                                method === 'post' ? 'bg-green-100 text-green-700' :
                                method === 'put' ? 'bg-yellow-100 text-yellow-700' :
                                method === 'delete' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {method.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                      {!readonly && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePath(path);
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

          {/* エンドポイント詳細 */}
          <div className="col-span-8">
            {selectedPath && value.paths[selectedPath] && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">エンドポイント詳細</CardTitle>
                  <CardDescription>{selectedPath}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={Object.keys(value.paths[selectedPath])[0] || 'get'}>
                    <div className="flex justify-between items-center mb-4">
                      <TabsList>
                        {Object.keys(value.paths[selectedPath]).map(method => (
                          <TabsTrigger key={method} value={method}>
                            {method.toUpperCase()}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {!readonly && (
                        <Select
                          onValueChange={(method) => handleAddMethod(selectedPath, method)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="メソッド追加" />
                          </SelectTrigger>
                          <SelectContent>
                            {['get', 'post', 'put', 'delete', 'patch'].map(method => (
                              <SelectItem
                                key={method}
                                value={method}
                                disabled={!!value.paths[selectedPath][method]}
                              >
                                {method.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {Object.entries(value.paths[selectedPath]).map(([method, endpoint]: [string, any]) => (
                      <TabsContent key={method} value={method} className="space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>概要</Label>
                            <Input
                              value={endpoint.summary || ''}
                              onChange={(e) => handleUpdateEndpoint(selectedPath, method, {
                                ...endpoint,
                                summary: e.target.value
                              })}
                              disabled={readonly}
                              placeholder="エンドポイントの概要"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>説明</Label>
                            <Textarea
                              value={endpoint.description || ''}
                              onChange={(e) => handleUpdateEndpoint(selectedPath, method, {
                                ...endpoint,
                                description: e.target.value
                              })}
                              disabled={readonly}
                              placeholder="エンドポイントの詳細説明"
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>レスポンス</Label>
                            <Card>
                              <CardContent className="p-3">
                                <div className="space-y-2">
                                  {Object.entries(endpoint.responses || {}).map(([status, response]: [string, any]) => (
                                    <div key={status} className="flex items-center gap-2">
                                      <span className="font-mono text-sm font-medium w-12">{status}</span>
                                      <span className="text-sm">{response.description}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {(method === 'post' || method === 'put' || method === 'patch') && (
                            <div className="space-y-2">
                              <Label>リクエストボディ</Label>
                              <Card>
                                <CardContent className="p-3">
                                  <div className="text-sm text-muted-foreground">
                                    application/json
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}