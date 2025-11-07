import { ApiSpecification } from '@/types/parasol';
import type { APIParameter, APIEndpoint } from '@/types/parasol-api';

/**
 * API仕様をMarkdown形式に変換
 */
export function apiSpecToMarkdown(apiSpec: ApiSpecification): string {
  const sections: string[] = [];
  
  // ヘッダー
  sections.push(`# API仕様書`);
  sections.push('');
  
  // 基本情報
  sections.push('## 基本情報');
  sections.push('');
  sections.push('| 項目 | 内容 |');
  sections.push('|------|------|');
  sections.push(`| タイトル | ${apiSpec.info.title} |`);
  sections.push(`| バージョン | ${apiSpec.info.version} |`);
  sections.push(`| 説明 | ${apiSpec.info.description || ''} |`);
  
  if (apiSpec.servers && apiSpec.servers.length > 0) {
    sections.push('');
    sections.push('### サーバー');
    sections.push('');
    apiSpec.servers.forEach(server => {
      sections.push(`- **${server.url}**${server.description ? `: ${server.description}` : ''}`);
    });
  }
  
  sections.push('');
  
  // パス（エンドポイント）
  if (apiSpec.paths) {
    sections.push('## エンドポイント');
    sections.push('');
    
    Object.entries(apiSpec.paths).forEach(([path, pathItem]) => {
      sections.push(`### ${path}`);
      sections.push('');
      
      // 各HTTPメソッド
      Object.entries(pathItem).forEach(([method, operation]) => {
        if (typeof operation === 'object' && operation !== null) {
          sections.push(`#### ${method.toUpperCase()}`);
          sections.push('');
          
          if (operation.summary) {
            sections.push(`**概要**: ${operation.summary}`);
            sections.push('');
          }
          
          if (operation.description) {
            sections.push(`**説明**: ${operation.description}`);
            sections.push('');
          }
          
          if (operation.tags && operation.tags.length > 0) {
            sections.push(`**タグ**: ${operation.tags.join(', ')}`);
            sections.push('');
          }
          
          // パラメータ
          if (operation.parameters && operation.parameters.length > 0) {
            sections.push('**パラメータ**:');
            sections.push('');
            sections.push('| 名前 | 場所 | 型 | 必須 | 説明 |');
            sections.push('|------|------|-----|------|------|');
            
            operation.parameters.forEach((param: APIParameter) => {
              const required = param.required ? '✓' : '-';
              const type = param.schema?.type || '-';
              sections.push(`| ${param.name} | ${param.in} | ${type} | ${required} | ${param.description || ''} |`);
            });
            sections.push('');
          }
          
          // リクエストボディ
          if (operation.requestBody) {
            sections.push('**リクエストボディ**:');
            sections.push('');
            
            const content = operation.requestBody.content;
            if (content && content['application/json']) {
              const schema = content['application/json'].schema;
              if (schema && schema.properties) {
                sections.push('```json');
                sections.push(JSON.stringify(generateExampleFromSchema(schema), null, 2));
                sections.push('```');
                sections.push('');
                
                // プロパティテーブル
                sections.push('| プロパティ | 型 | 必須 | 説明 |');
                sections.push('|------------|-----|------|------|');
                
                Object.entries(schema.properties).forEach(([prop, propSchema]) => {
                  const required = schema.required?.includes(prop) ? '✓' : '-';
                  const type = propSchema.type || '-';
                  sections.push(`| ${prop} | ${type} | ${required} | ${propSchema.description || ''} |`);
                });
                sections.push('');
              }
            }
          }
          
          // レスポンス
          if (operation.responses) {
            sections.push('**レスポンス**:');
            sections.push('');
            
            Object.entries(operation.responses).forEach(([statusCode, response]: [string, unknown]) => {
              sections.push(`- **${statusCode}**: ${response.description || ''}`);
              
              const content = response.content;
              if (content && content['application/json']) {
                const schema = content['application/json'].schema;
                if (schema) {
                  sections.push('');
                  sections.push('  ```json');
                  sections.push('  ' + JSON.stringify(generateExampleFromSchema(schema), null, 2).split('\n').join('\n  '));
                  sections.push('  ```');
                }
              }
            });
            sections.push('');
          }
        }
      });
    });
  }
  
  // コンポーネント（スキーマ定義）
  if (apiSpec.components?.schemas) {
    sections.push('## スキーマ定義');
    sections.push('');
    
    Object.entries(apiSpec.components.schemas).forEach(([schemaName, schema]: [string, unknown]) => {
      sections.push(`### ${schemaName}`);
      sections.push('');
      
      if (schema.description) {
        sections.push(schema.description);
        sections.push('');
      }
      
      if (schema.properties) {
        sections.push('| プロパティ | 型 | 必須 | 説明 |');
        sections.push('|------------|-----|------|------|');
        
        Object.entries(schema.properties).forEach(([prop, propSchema]: [string, unknown]) => {
          const required = schema.required?.includes(prop) ? '✓' : '-';
          const type = propSchema.type || '-';
          sections.push(`| ${prop} | ${type} | ${required} | ${propSchema.description || ''} |`);
        });
        sections.push('');
      }
    });
  }
  
  return sections.join('\n');
}

/**
 * Markdown形式からAPI仕様に変換
 */
export function markdownToApiSpec(markdown: string): Partial<ApiSpecification> {
  const lines = markdown.split('\n');
  const apiSpec: Partial<ApiSpecification> = {
    openapi: '3.0.0',
    info: {
      title: '',
      version: '1.0.0'
    },
    paths: {},
    components: {
      schemas: {}
    }
  };
  
  let currentSection: string | null = null;
  let currentPath: string | null = null;
  let currentMethod: string | null = null;
  let currentSchema: string | null = null;
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // コードブロックの処理
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock && codeBlockContent.length > 0) {
        // コードブロックの内容を処理
        codeBlockContent = [];
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }
    
    // 基本情報テーブルの処理
    if (currentSection === 'info' && line.startsWith('|') && !line.includes('---')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length >= 2) {
        if (cells[0] === 'タイトル') {
          apiSpec.info!.title = cells[1];
        } else if (cells[0] === 'バージョン') {
          apiSpec.info!.version = cells[1];
        } else if (cells[0] === '説明') {
          apiSpec.info!.description = cells[1];
        }
      }
    }
    
    // セクションの判定
    if (line === '## 基本情報') {
      currentSection = 'info';
      continue;
    } else if (line === '## エンドポイント') {
      currentSection = 'endpoints';
      continue;
    } else if (line === '## スキーマ定義') {
      currentSection = 'schemas';
      continue;
    }
    
    // エンドポイントパスの抽出
    if (currentSection === 'endpoints' && line.startsWith('### /')) {
      currentPath = line.substring(4);
      if (!apiSpec.paths![currentPath]) {
        apiSpec.paths![currentPath] = {};
      }
      continue;
    }
    
    // HTTPメソッドの抽出
    if (currentSection === 'endpoints' && currentPath && line.startsWith('#### ')) {
      currentMethod = line.substring(5).toLowerCase();
      if (!apiSpec.paths![currentPath][currentMethod]) {
        apiSpec.paths![currentPath][currentMethod] = {
          responses: {}
        };
      }
      continue;
    }
    
    // スキーマ名の抽出
    if (currentSection === 'schemas' && line.startsWith('### ')) {
      currentSchema = line.substring(4);
      if (!apiSpec.components!.schemas![currentSchema]) {
        apiSpec.components!.schemas![currentSchema] = {
          type: 'object',
          properties: {},
          required: []
        };
      }
      continue;
    }
  }
  
  return apiSpec;
}

/**
 * API仕様Markdownの妥当性をチェック
 */
export function validateApiSpecMarkdown(markdown: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!markdown.includes('# API仕様書')) {
    errors.push('ヘッダー「# API仕様書」が必要です');
  }
  
  if (!markdown.includes('## 基本情報')) {
    errors.push('「## 基本情報」セクションが必要です');
  }
  
  if (!markdown.includes('| タイトル |')) {
    errors.push('タイトル情報が必要です');
  }
  
  if (!markdown.includes('| バージョン |')) {
    errors.push('バージョン情報が必要です');
  }
  
  if (!markdown.includes('## エンドポイント')) {
    errors.push('「## エンドポイント」セクションが必要です');
  }
  
  // 少なくとも1つのエンドポイントが必要
  const endpointMatches = markdown.match(/### \/\S+/g);
  if (!endpointMatches || endpointMatches.length === 0) {
    errors.push('少なくとも1つのエンドポイントが必要です');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * スキーマから例を生成するヘルパー関数
 */
function generateExampleFromSchema(schema: Record<string, unknown>): Record<string, unknown> {
  if (schema.example) {
    return schema.example;
  }
  
  if (schema.type === 'object' && schema.properties) {
    const example: Record<string, unknown> = {};
    Object.entries(schema.properties).forEach(([key, prop]) => {
      example[key] = generateExampleFromSchema(prop);
    });
    return example;
  }
  
  if (schema.type === 'array' && schema.items) {
    return [generateExampleFromSchema(schema.items)];
  }
  
  // デフォルト値
  switch (schema.type) {
    case 'string':
      return schema.format === 'uuid' ? 'uuid-example' : 'string';
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return true;
    default:
      return null;
  }
}