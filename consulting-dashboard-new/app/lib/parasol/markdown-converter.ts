import { 
  DomainLanguageDefinition, 
  Entity, 
  ValueObject, 
  DomainService,
  Property,
  DomainEvent,
  Method
} from '@/types/parasol';

/**
 * ドメイン言語定義をMarkdown形式に変換
 */
export function domainLanguageToMarkdown(domain: DomainLanguageDefinition): string {
  const sections: string[] = [];
  
  // ヘッダー
  sections.push(`# ドメイン言語定義`);
  sections.push('');
  sections.push(`**バージョン**: ${domain.version}`);
  sections.push(`**最終更新**: ${new Date(domain.lastModified).toLocaleDateString('ja-JP')}`);
  sections.push('');
  
  // エンティティセクション
  if (domain.entities.length > 0) {
    sections.push('## エンティティ');
    sections.push('');
    
    domain.entities.forEach(entity => {
      sections.push(`### ${entity.displayName}（${entity.name}）`);
      if (entity.description) {
        sections.push(entity.description);
      }
      sections.push('');
      
      // プロパティテーブル
      sections.push('| プロパティ | 型 | 必須 | 説明 |');
      sections.push('|-----------|---|------|------|');
      
      entity.properties.forEach(prop => {
        const required = prop.required ? '✓' : '-';
        const type = prop.enumValues ? `ENUM(${prop.enumValues.join(', ')})` : prop.type;
        sections.push(`| ${prop.name} | ${type} | ${required} | ${prop.description || ''} |`);
      });
      sections.push('');
      
      // ビジネスルール
      if (entity.businessRules && entity.businessRules.length > 0) {
        sections.push('**ビジネスルール**:');
        entity.businessRules.forEach(rule => {
          sections.push(`- ${rule}`);
        });
        sections.push('');
      }
      
      // ドメインイベント
      if (entity.domainEvents && entity.domainEvents.length > 0) {
        sections.push('**ドメインイベント**:');
        entity.domainEvents.forEach(event => {
          sections.push(`- ${event.displayName}（${event.name}）`);
          if (event.properties && event.properties.length > 0) {
            sections.push(`  - プロパティ: ${event.properties.join(', ')}`);
          }
        });
        sections.push('');
      }
      
      if (entity.isAggregate) {
        sections.push('*このエンティティは集約ルートです*');
        sections.push('');
      }
    });
  }
  
  // 値オブジェクトセクション
  if (domain.valueObjects.length > 0) {
    sections.push('## 値オブジェクト');
    sections.push('');
    
    domain.valueObjects.forEach(vo => {
      sections.push(`### ${vo.displayName}（${vo.name}）`);
      if (vo.description) {
        sections.push(vo.description);
      }
      sections.push('');
      
      // プロパティテーブル
      sections.push('| プロパティ | 型 | 必須 | 説明 |');
      sections.push('|-----------|---|------|------|');
      
      vo.properties.forEach(prop => {
        const required = prop.required ? '✓' : '-';
        sections.push(`| ${prop.name} | ${prop.type} | ${required} | ${prop.description || ''} |`);
      });
      sections.push('');
      
      // バリデーションルール
      if (vo.validationRules && vo.validationRules.length > 0) {
        sections.push('**バリデーションルール**:');
        vo.validationRules.forEach(rule => {
          sections.push(`- ${rule}`);
        });
        sections.push('');
      }
    });
  }
  
  // ドメインサービスセクション
  if (domain.domainServices.length > 0) {
    sections.push('## ドメインサービス');
    sections.push('');
    
    domain.domainServices.forEach(service => {
      sections.push(`### ${service.displayName}（${service.name}）`);
      if (service.description) {
        sections.push(service.description);
      }
      sections.push('');
      
      if (service.methods && service.methods.length > 0) {
        sections.push('**メソッド**:');
        service.methods.forEach(method => {
          sections.push(`- ${method.displayName}（${method.name}）`);
          if (method.description) {
            sections.push(`  - ${method.description}`);
          }
          if (method.parameters && method.parameters.length > 0) {
            sections.push(`  - パラメータ: ${method.parameters.map(p => `${p.name}: ${p.type}`).join(', ')}`);
          }
          if (method.returnType) {
            sections.push(`  - 戻り値: ${method.returnType}`);
          }
        });
        sections.push('');
      }
    });
  }
  
  return sections.join('\n');
}

/**
 * Markdown形式からドメイン言語定義に変換
 */
export function markdownToDomainLanguage(markdown: string): DomainLanguageDefinition {
  const lines = markdown.split('\n');
  const domain: DomainLanguageDefinition = {
    entities: [],
    valueObjects: [],
    domainServices: [],
    version: '1.0.0',
    lastModified: new Date().toISOString()
  };
  
  let currentSection: 'entities' | 'valueObjects' | 'domainServices' | null = null;
  let currentItem: Entity | ValueObject | DomainService | null = null;
  let currentTable: 'properties' | 'events' | 'methods' | null = null;
  let tableLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // バージョン情報の抽出
    if (line.startsWith('**バージョン**:')) {
      domain.version = line.split(':')[1].trim();
      continue;
    }
    
    // セクションの判定
    if (line === '## エンティティ') {
      currentSection = 'entities';
      continue;
    } else if (line === '## 値オブジェクト') {
      currentSection = 'valueObjects';
      continue;
    } else if (line === '## ドメインサービス') {
      currentSection = 'domainServices';
      continue;
    }
    
    // アイテムの開始
    if (line.startsWith('### ')) {
      // 前のアイテムを保存
      if (currentItem && currentSection) {
        saveCurrentItem(domain, currentSection, currentItem);
      }
      
      // 新しいアイテムの作成
      const match = line.match(/### (.+)（(.+)）/);
      if (match) {
        const [, displayName, name] = match;
        
        if (currentSection === 'entities') {
          currentItem = {
            name,
            displayName,
            description: '',
            properties: [],
            businessRules: [],
            domainEvents: [],
            isAggregate: false
          };
        } else if (currentSection === 'valueObjects') {
          currentItem = {
            name,
            displayName,
            description: '',
            properties: [],
            validationRules: []
          };
        } else if (currentSection === 'domainServices') {
          currentItem = {
            name,
            displayName,
            description: '',
            methods: []
          };
        }
      }
      continue;
    }
    
    // 説明文の処理
    if (currentItem && !line.startsWith('|') && !line.startsWith('**') && 
        !line.startsWith('-') && line && !line.startsWith('*')) {
      currentItem.description = line;
      continue;
    }
    
    // テーブルの処理
    if (line.startsWith('| プロパティ |')) {
      currentTable = 'properties';
      tableLines = [];
      continue;
    }
    
    if (currentTable && line.startsWith('|') && !line.includes('---')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (currentTable === 'properties' && cells.length >= 4 && currentItem) {
        const [name, type, required, description] = cells;
        const property: Property = {
          name,
          type: type.startsWith('ENUM(') ? 'ENUM' : type,
          required: required === '✓',
          description: description || undefined
        };
        
        if (type.startsWith('ENUM(')) {
          const enumMatch = type.match(/ENUM\((.+)\)/);
          if (enumMatch) {
            property.enumValues = enumMatch[1].split(',').map(v => v.trim());
          }
        }
        
        if ('properties' in currentItem) {
          currentItem.properties.push(property);
        }
      }
    }
    
    // ビジネスルール、バリデーションルール、ドメインイベントの処理
    if (line.startsWith('**ビジネスルール**:')) {
      currentTable = null;
      continue;
    }
    
    if (line.startsWith('**バリデーションルール**:')) {
      currentTable = null;
      continue;
    }
    
    if (line.startsWith('**ドメインイベント**:')) {
      currentTable = 'events';
      continue;
    }
    
    if (line.startsWith('**メソッド**:')) {
      currentTable = 'methods';
      continue;
    }
    
    // リストアイテムの処理
    if (line.startsWith('- ')) {
      const content = line.substring(2);
      
      if (currentItem) {
        if ('businessRules' in currentItem && !currentTable) {
          currentItem.businessRules.push(content);
        } else if ('validationRules' in currentItem && !currentTable) {
          currentItem.validationRules.push(content);
        } else if (currentTable === 'events' && 'domainEvents' in currentItem) {
          // ドメインイベントのパース
          const eventMatch = content.match(/(.+)（(.+)）/);
          if (eventMatch) {
            const [, displayName, name] = eventMatch;
            const event: DomainEvent = { name, displayName, properties: [] };
            
            // プロパティの抽出（次の行をチェック）
            if (i + 1 < lines.length && lines[i + 1].trim().startsWith('- プロパティ:')) {
              const propLine = lines[i + 1].trim();
              const propMatch = propLine.match(/- プロパティ: (.+)/);
              if (propMatch) {
                event.properties = propMatch[1].split(',').map(p => p.trim());
                i++; // 次の行をスキップ
              }
            }
            
            currentItem.domainEvents.push(event);
          }
        } else if (currentTable === 'methods' && 'methods' in currentItem) {
          // メソッドのパース
          const methodMatch = content.match(/(.+)（(.+)）/);
          if (methodMatch) {
            const [, displayName, name] = methodMatch;
            const method: Method = {
              name,
              displayName,
              parameters: [],
              returnType: 'void'
            };
            
            // 詳細情報の抽出（次の行をチェック）
            let j = i + 1;
            while (j < lines.length && lines[j].trim().startsWith('- ')) {
              const detailLine = lines[j].trim();
              if (detailLine.includes('パラメータ:')) {
                // パラメータのパース（簡略化）
                const paramMatch = detailLine.match(/- パラメータ: (.+)/);
                if (paramMatch) {
                  // シンプルなパース（実際にはより複雑な処理が必要）
                  method.parameters = [];
                }
              } else if (detailLine.includes('戻り値:')) {
                const returnMatch = detailLine.match(/- 戻り値: (.+)/);
                if (returnMatch) {
                  method.returnType = returnMatch[1];
                }
              } else if (!detailLine.includes('（') && !detailLine.includes('）')) {
                method.description = detailLine.substring(2);
              }
              j++;
            }
            
            currentItem.methods.push(method);
          }
        }
      }
    }
    
    // 集約ルートの判定
    if (line === '*このエンティティは集約ルートです*' && currentItem && 'isAggregate' in currentItem) {
      currentItem.isAggregate = true;
    }
  }
  
  // 最後のアイテムを保存
  if (currentItem && currentSection) {
    saveCurrentItem(domain, currentSection, currentItem);
  }
  
  return domain;
}

// ヘルパー関数
function saveCurrentItem(
  domain: DomainLanguageDefinition,
  section: 'entities' | 'valueObjects' | 'domainServices',
  item: Entity | ValueObject | DomainService
) {
  if (section === 'entities') {
    domain.entities.push(item as Entity);
  } else if (section === 'valueObjects') {
    domain.valueObjects.push(item as ValueObject);
  } else if (section === 'domainServices') {
    domain.domainServices.push(item as DomainService);
  }
}

/**
 * Markdownの妥当性をチェック
 */
export function validateDomainLanguageMarkdown(markdown: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  try {
    const domain = markdownToDomainLanguage(markdown);
    
    // 基本的な検証
    if (!domain.version) {
      errors.push('バージョン情報が必要です');
    }
    
    if (domain.entities.length === 0 && 
        domain.valueObjects.length === 0 && 
        domain.domainServices.length === 0) {
      errors.push('少なくとも1つのエンティティ、値オブジェクト、またはドメインサービスが必要です');
    }
    
    // エンティティの検証
    domain.entities.forEach(entity => {
      if (!entity.name || !entity.displayName) {
        errors.push('エンティティには名前と表示名が必要です');
      }
      if (entity.properties.length === 0) {
        errors.push(`エンティティ「${entity.displayName}」にはプロパティが必要です`);
      }
    });
    
    // 値オブジェクトの検証
    domain.valueObjects.forEach(vo => {
      if (!vo.name || !vo.displayName) {
        errors.push('値オブジェクトには名前と表示名が必要です');
      }
      if (vo.properties.length === 0) {
        errors.push(`値オブジェクト「${vo.displayName}」にはプロパティが必要です`);
      }
    });
    
  } catch (_error) {
    errors.push('Markdownの解析中にエラーが発生しました');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}