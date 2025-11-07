'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen, Image, Settings, FileText } from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
  fileType?: 'usecase' | 'page' | 'api-usage';
  isExpanded?: boolean;
}

interface DirectoryPanelProps {
  currentPath: {
    service: string;
    capability: string;
    operation: string;
    usecase: string;
    fileType: 'usecase' | 'page' | 'api-usage';
  };
  onFileSelect: (path: {
    service: string;
    capability: string;
    operation: string;
    usecase: string;
    fileType: 'usecase' | 'page' | 'api-usage';
  }) => void;
  className?: string;
}

export function DirectoryPanel({ currentPath, onFileSelect, className = '' }: DirectoryPanelProps) {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration - in real implementation, this would fetch from API
  useEffect(() => {
    const loadFileTree = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockTree: FileNode[] = [
          {
            id: 'services',
            name: 'Services',
            type: 'directory',
            path: '/services',
            isExpanded: true,
            children: [
              {
                id: 'collaboration-facilitation-service',
                name: 'collaboration-facilitation-service',
                type: 'directory',
                path: '/services/collaboration-facilitation-service',
                children: [
                  {
                    id: 'communication-delivery',
                    name: 'communication-delivery',
                    type: 'directory',
                    path: '/services/collaboration-facilitation-service/communication-delivery',
                    children: [
                      {
                        id: 'send-notification',
                        name: 'send-notification',
                        type: 'directory',
                        path: '/services/collaboration-facilitation-service/communication-delivery/send-notification',
                        children: [
                          {
                            id: 'create-notification-content',
                            name: 'create-notification-content',
                            type: 'directory',
                            path: '/services/collaboration-facilitation-service/communication-delivery/send-notification/create-notification-content',
                            children: [
                              {
                                id: 'create-notification-content-usecase',
                                name: 'usecase.md',
                                type: 'file',
                                path: '/services/collaboration-facilitation-service/communication-delivery/send-notification/create-notification-content',
                                fileType: 'usecase'
                              },
                              {
                                id: 'create-notification-content-page',
                                name: 'page.md',
                                type: 'file',
                                path: '/services/collaboration-facilitation-service/communication-delivery/send-notification/create-notification-content',
                                fileType: 'page'
                              },
                              {
                                id: 'create-notification-content-api',
                                name: 'api-usage.md',
                                type: 'file',
                                path: '/services/collaboration-facilitation-service/communication-delivery/send-notification/create-notification-content',
                                fileType: 'api-usage'
                              }
                            ]
                          }
                        ]
                      },
                      {
                        id: 'manage-meetings',
                        name: 'manage-meetings',
                        type: 'directory',
                        path: '/services/collaboration-facilitation-service/communication-delivery/manage-meetings',
                        children: [
                          {
                            id: 'schedule-meeting',
                            name: 'schedule-meeting',
                            type: 'directory',
                            path: '/services/collaboration-facilitation-service/communication-delivery/manage-meetings/schedule-meeting',
                            children: [
                              {
                                id: 'schedule-meeting-usecase',
                                name: 'usecase.md',
                                type: 'file',
                                path: '/services/collaboration-facilitation-service/communication-delivery/manage-meetings/schedule-meeting',
                                fileType: 'usecase'
                              },
                              {
                                id: 'schedule-meeting-page',
                                name: 'page.md',
                                type: 'file',
                                path: '/services/collaboration-facilitation-service/communication-delivery/manage-meetings/schedule-meeting',
                                fileType: 'page'
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: 'knowledge-co-creation-service',
                name: 'knowledge-co-creation-service',
                type: 'directory',
                path: '/services/knowledge-co-creation-service',
                children: [
                  {
                    id: 'knowledge-management',
                    name: 'knowledge-management',
                    type: 'directory',
                    path: '/services/knowledge-co-creation-service/knowledge-management',
                    children: [
                      {
                        id: 'capture-knowledge',
                        name: 'capture-knowledge',
                        type: 'directory',
                        path: '/services/knowledge-co-creation-service/knowledge-management/capture-knowledge',
                        children: [
                          {
                            id: 'classify-knowledge',
                            name: 'classify-knowledge',
                            type: 'directory',
                            path: '/services/knowledge-co-creation-service/knowledge-management/capture-knowledge/classify-knowledge',
                            children: [
                              {
                                id: 'classify-knowledge-usecase',
                                name: 'usecase.md',
                                type: 'file',
                                path: '/services/knowledge-co-creation-service/knowledge-management/capture-knowledge/classify-knowledge',
                                fileType: 'usecase'
                              },
                              {
                                id: 'classify-knowledge-page',
                                name: 'page.md',
                                type: 'file',
                                path: '/services/knowledge-co-creation-service/knowledge-management/capture-knowledge/classify-knowledge',
                                fileType: 'page'
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ];

        setFileTree(mockTree);

        // Auto-expand to current path
        const currentPathStr = `/services/${currentPath.service}/${currentPath.capability}/${currentPath.operation}/${currentPath.usecase}`;
        const pathSegments = currentPathStr.split('/').filter(Boolean);
        const expandedPaths = new Set<string>();

        let currentBuiltPath = '';
        pathSegments.forEach(segment => {
          currentBuiltPath += '/' + segment;
          expandedPaths.add(currentBuiltPath);
        });

        setExpandedNodes(expandedPaths);

      } catch (_error) {
        console.error('Failed to load file tree:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFileTree();
  }, [currentPath]);

  const toggleNode = (nodeId: string, nodePath: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodePath)) {
      newExpanded.delete(nodePath);
    } else {
      newExpanded.add(nodePath);
    }
    setExpandedNodes(newExpanded);
  };

  const handleFileClick = (node: FileNode) => {
    if (node.type === 'file' && node.fileType) {
      const pathSegments = node.path.split('/').filter(Boolean);
      if (pathSegments.length >= 4 && pathSegments[0] === 'services') {
        const [, service, capability, operation, usecase] = pathSegments;
        onFileSelect({
          service,
          capability,
          operation,
          usecase,
          fileType: node.fileType
        });
      }
    }
  };

  const getFileIcon = (node: FileNode) => {
    if (node.type === 'directory') {
      const isExpanded = expandedNodes.has(node.path);
      return isExpanded ? (
        <FolderOpen className="w-4 h-4 text-blue-500" />
      ) : (
        <Folder className="w-4 h-4 text-blue-600" />
      );
    }

    switch (node.fileType) {
      case 'usecase':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'page':
        return <Image className="w-4 h-4 text-purple-500" />;
      case 'api-usage':
        return <Settings className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const isCurrentFile = (node: FileNode) => {
    if (node.type !== 'file' || !node.fileType) return false;

    const pathSegments = node.path.split('/').filter(Boolean);
    if (pathSegments.length >= 4 && pathSegments[0] === 'services') {
      const [, service, capability, operation, usecase] = pathSegments;
      return (
        service === currentPath.service &&
        capability === currentPath.capability &&
        operation === currentPath.operation &&
        usecase === currentPath.usecase &&
        node.fileType === currentPath.fileType
      );
    }
    return false;
  };

  const renderNode = (node: FileNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.path);
    const isCurrent = isCurrentFile(node);

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-1 px-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded ${
            isCurrent ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'directory') {
              toggleNode(node.id, node.path);
            } else {
              handleFileClick(node);
            }
          }}
        >
          {node.type === 'directory' && (
            <span className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </span>
          )}
          {node.type === 'file' && <span className="w-4" />}

          {getFileIcon(node)}

          <span className={`truncate ${isCurrent ? 'font-medium' : ''}`}>
            {node.name}
          </span>
        </div>

        {node.type === 'directory' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ${className}`}>
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
          📁 ファイルエクスプローラー
        </h3>
      </div>

      <div className="overflow-auto h-full pb-16">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-gray-500">
            読み込み中...
          </div>
        ) : (
          <div className="p-2">
            {fileTree.map(node => renderNode(node))}
          </div>
        )}
      </div>
    </div>
  );
}