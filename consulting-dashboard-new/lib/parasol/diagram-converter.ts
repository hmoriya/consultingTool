// Markdown形式の設計情報から各種ダイアグラムコードを生成する

interface Entity {
  name: string;
  stereotype?: 'entity' | 'value-object' | 'aggregate' | 'service' | 'repository' | 'factory' | 'event' | 'specification';
  attributes: Array<{
    name: string;
    type: string;
    required?: boolean;
  }>;
  relationships?: Array<{
    target: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many' | 'many-to-one' | 'value-object';
  }>;
}

interface Table {
  name: string;
  columns: Array<{
    name: string;
    type: string;
    primaryKey?: boolean;
    foreignKey?: { table: string; column: string };
  }>;
}

export class DiagramConverter {
  // ステレオタイプを自動判定
  private static detectStereotype(name: string, section: string): Entity['stereotype'] {
    const lowerName = name.toLowerCase();

    // Repository パターン
    if (lowerName.includes('repository') || lowerName.endsWith('repo')) {
      return 'repository';
    }

    // Service パターン
    if (lowerName.includes('service') || lowerName.includes('facilitator')) {
      return 'service';
    }

    // Factory パターン
    if (lowerName.includes('factory')) {
      return 'factory';
    }

    // Event パターン
    if (lowerName.includes('event') || lowerName.includes('occurred') || lowerName.includes('happened')) {
      return 'event';
    }

    // Specification パターン
    if (lowerName.includes('specification') || lowerName.includes('spec')) {
      return 'specification';
    }

    // Value Object パターン
    if (section === 'valueObjects' ||
        lowerName.includes('value') ||
        lowerName.includes('address') ||
        lowerName.includes('email') ||
        lowerName.includes('phone') ||
        lowerName.includes('money') ||
        lowerName.includes('period') ||
        lowerName.includes('range')) {
      return 'value-object';
    }

    // Aggregate Root パターン（後で集約定義から判定）
    if (lowerName.includes('aggregate')) {
      return 'aggregate';
    }

    // デフォルトはEntity
    return 'entity';
  }

  // Mermaid用に名前をサニタイズ（角括弧や特殊文字を除去）
  private static sanitizeNameForMermaid(name: string): string {
    // 角括弧内の内容を抽出し、最初の部分を使用
    const match = name.match(/^([^[]+)/);
    if (match) {
      return match[1].trim().replace(/[^a-zA-Z0-9_]/g, '');
    }
    return name.replace(/[^a-zA-Z0-9_]/g, '');
  }

  // ドメイン言語定義からMermaidクラス図を生成
  static domainToClassDiagram(markdown: string): string {
    console.log('=== DiagramConverter.domainToClassDiagram ===');
    console.log('Input markdown length:', markdown.length);
    console.log('First 300 chars:', markdown.substring(0, 300));
    
    const parseResult = this.parseDomainLanguageComplete(markdown);
    console.log('Parse result:', {
      entities: parseResult.entities.length,
      valueObjects: parseResult.valueObjects.length,
      aggregates: parseResult.aggregates.length
    });
    
    if (parseResult.entities.length === 0 && parseResult.valueObjects.length === 0) {
      // シンプルで確実に動作するMermaid構文を使用
      const placeholder = `classDiagram
  class NoEntity {
    string info
  }`;
      console.log('No entities found, returning placeholder');
      return placeholder;
    }
    
    // 集約ルートエンティティにマークを付ける（エンティティ生成前に実行）
    const processedAggregates = new Set<string>();
    parseResult.aggregates.forEach(agg => {
      const aggKey = `${agg.name}-${agg.root}`;
      if (!processedAggregates.has(aggKey)) {
        processedAggregates.add(aggKey);
        const rootEntity = parseResult.entities.find(e => e.name === agg.root);
        if (rootEntity && !rootEntity.isAggregate) {
          rootEntity.isAggregate = true;
          console.log(`Marked ${agg.root} as aggregate root`);
        }
      }
    });
    
    let mermaid = 'classDiagram\n';
    
    // エンティティ
    parseResult.entities.forEach(entity => {
      // クラス定義（名前をサニタイズ）
      const sanitizedName = this.sanitizeNameForMermaid(entity.name);
      mermaid += `  class ${sanitizedName} {\n`;
      // ステレオタイプの追加
      if (entity.isAggregate) {
        mermaid += '    <<aggregate root>>\n';
      } else if (entity.stereotype) {
        const stereotypeLabel = entity.stereotype === 'value-object' ? 'value object' : entity.stereotype;
        mermaid += `    <<${stereotypeLabel}>>\n`;
      }
      entity.attributes.forEach(attr => {
        // Mermaidの正しい属性構文: type name
        const mermaidType = this.convertParasolTypeToMermaid(attr.type);
        const sanitizedAttrName = this.sanitizeNameForMermaid(attr.name);
        mermaid += `    ${mermaidType} ${sanitizedAttrName}\n`;
      });
      mermaid += '  }\n';
      
      // 関連の定義
      entity.relationships?.forEach(rel => {
        const targetName = this.sanitizeNameForMermaid(rel.target);
        if (rel.type === 'one-to-one') {
          mermaid += `  ${sanitizedName} "1" -- "1" ${targetName}\n`;
        } else if (rel.type === 'one-to-many') {
          mermaid += `  ${sanitizedName} "1" -- "*" ${targetName}\n`;
        } else if (rel.type === 'many-to-one') {
          mermaid += `  ${sanitizedName} "*" --> "1" ${targetName}\n`;
        } else if (rel.type === 'many-to-many') {
          mermaid += `  ${sanitizedName} "*" -- "*" ${targetName}\n`;
        } else if ((rel.type as string) === 'value-object') {
          // Value Objectとの関連は合成関係として表現
          mermaid += `  ${sanitizedName} o-- ${targetName} : "uses"\n`;
        }
      });
    });
    
    // 値オブジェクト
    parseResult.valueObjects.forEach(vo => {
      const sanitizedVOName = this.sanitizeNameForMermaid(vo.name);
      mermaid += `  class ${sanitizedVOName} {\n`;
      mermaid += '    <<value object>>\n';
      vo.attributes.forEach(attr => {
        const mermaidType = this.convertParasolTypeToMermaid(attr.type);
        const sanitizedAttrName = this.sanitizeNameForMermaid(attr.name);
        mermaid += `    ${mermaidType} ${sanitizedAttrName}\n`;
      });
      mermaid += '  }\n';

      // 値オブジェクトと集約ルートの関係（コンポジション）
      if (parseResult.aggregates.length > 0 && parseResult.aggregates[0].root) {
        const sanitizedRoot = this.sanitizeNameForMermaid(parseResult.aggregates[0].root);
        mermaid += `  ${sanitizedRoot} o-- ${sanitizedVOName} : contains\n`;
      }
    });
    
    // 集約の関係を追加
    processedAggregates.clear();
    parseResult.aggregates.forEach(agg => {
      const aggKey = `${agg.name}-${agg.root}`;
      if (!processedAggregates.has(aggKey)) {
        processedAggregates.add(aggKey);
        console.log(`Adding aggregate relationships for: ${agg.name} (root: ${agg.root})`);
        
        agg.entities.forEach(entityName => {
          if (entityName !== agg.root) {
            // 集約内の関係を点線で表示
            const sanitizedRoot = this.sanitizeNameForMermaid(agg.root);
            const sanitizedEntity = this.sanitizeNameForMermaid(entityName);
            mermaid += `  ${sanitizedRoot} ..> ${sanitizedEntity} : contains\n`;
            console.log(`  Added relationship: ${agg.root} ..> ${entityName}`);
          }
        });
      } else {
        console.log(`Skipping duplicate aggregate: ${agg.name}`);
      }
    });
    
    console.log('Generated mermaid code:', mermaid);
    return mermaid;
  }

  // DB設計からER図を生成（Mermaid）
  static dbToERDiagram(markdown: string): string {
    const tables = this.parseDBSchema(markdown);
    
    if (tables.length === 0) {
      return 'erDiagram\n  PLACEHOLDER {\n    string info\n  }';
    }
    
    let mermaid = 'erDiagram\n';
    
    tables.forEach(table => {
      // テーブル定義
      mermaid += `  ${table.name} {\n`;
      table.columns.forEach(col => {
        let type = col.type.toUpperCase();
        if (col.primaryKey) {
          mermaid += `    ${type} ${col.name} PK\n`;
        } else if (col.foreignKey) {
          mermaid += `    ${type} ${col.name} FK\n`;
        } else {
          mermaid += `    ${type} ${col.name}\n`;
        }
      });
      mermaid += '  }\n';
      
      // 外部キー関係
      table.columns
        .filter(col => col.foreignKey)
        .forEach(col => {
          mermaid += `  ${table.name} ||--o{ ${col.foreignKey!.table} : "${col.name}"\n`;
        });
    });
    
    return mermaid;
  }

  // ビジネスオペレーションからBPMNフロー図を生成（Mermaid）
  static operationToFlowDiagram(markdown: string): string {
    const steps = this.parseOperationSteps(markdown);

    let mermaid = 'flowchart TB\n';

    steps.forEach((step, index) => {
      const nodeId = `step${index + 1}`;
      const nextId = index < steps.length - 1 ? `step${index + 2}` : 'endNode';

      if (step.type === 'start') {
        mermaid += `  startNode((開始))\n`;
        mermaid += `  startNode --> ${nodeId}\n`;
      }

      if (step.type === 'decision') {
        mermaid += `  ${nodeId}{${step.label}}\n`;
      } else if (step.type === 'process') {
        mermaid += `  ${nodeId}[${step.label}]\n`;
      } else if (step.type === 'subprocess') {
        mermaid += `  ${nodeId}[[${step.label}]]\n`;
      }

      if (index === steps.length - 1) {
        mermaid += `  ${nodeId} --> endNode((終了))\n`;
      } else {
        mermaid += `  ${nodeId} --> ${nextId}\n`;
      }
    });

    return mermaid;
  }

  // ユースケースからロバストネス図を生成（PlantUML）
  static useCaseToRobustnessDiagram(markdown: string): string {
    const elements = this.parseUseCaseElements(markdown);
    
    let plantuml = '@startuml\n';
    plantuml += '!define BOUNDARY boundary\n';
    plantuml += '!define CONTROL control\n';
    plantuml += '!define ENTITY entity\n\n';
    
    // アクター
    elements.actors.forEach(actor => {
      plantuml += `actor "${actor}" as ${actor.replace(/\s/g, '_')}\n`;
    });
    
    // バウンダリ（UI）
    elements.boundaries.forEach(boundary => {
      plantuml += `BOUNDARY "${boundary}" as ${boundary.replace(/\s/g, '_')}\n`;
    });
    
    // コントロール（ロジック）
    elements.controls.forEach(control => {
      plantuml += `CONTROL "${control}" as ${control.replace(/\s/g, '_')}\n`;
    });
    
    // エンティティ（データ）
    elements.entities.forEach(entity => {
      plantuml += `ENTITY "${entity}" as ${entity.replace(/\s/g, '_')}\n`;
    });
    
    // 関係の定義
    elements.flows.forEach(flow => {
      plantuml += `${flow.from.replace(/\s/g, '_')} --> ${flow.to.replace(/\s/g, '_')}\n`;
    });
    
    plantuml += '@enduml';
    
    return plantuml;
  }

  // 完全なドメイン言語解析
  private static parseDomainLanguageComplete(markdown: string): {
    entities: Array<Entity & { isAggregate?: boolean }>;
    valueObjects: Entity[];
    aggregates: Array<{ name: string; root: string; entities: string[] }>;
  } {
    const result = {
      entities: [] as Array<Entity & { isAggregate?: boolean }>,
      valueObjects: [] as Entity[],
      aggregates: [] as Array<{ name: string; root: string; entities: string[] }>
    };
    
    const lines = markdown.split('\n');
    let currentSection = '';
    let currentEntity: (Entity & { isAggregate?: boolean }) | null = null;
    let currentValueObject: Entity | null = null;
    let currentAggregate: { name: string; root: string; entities: string[] } | null = null;
    let inTable = false;
    let tableHeaders: string[] = [];
    let inAggregateRoot = false;
    let inAggregateEntities = false;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // セクション検出 - 様々な形式に対応
      if (trimmed === '## エンティティ（Entities）' ||
          trimmed === '## エンティティ' ||
          trimmed === '## 2. エンティティ定義' ||
          trimmed === '### エンティティ定義') {
        currentSection = 'entities';
        console.log('Found entities section at line', index, ':', trimmed);
        return;
      } else if (trimmed === '### コアエンティティ' && currentSection === 'entities') {
        // コアエンティティサブセクションは継続
        return;
      } else if (trimmed === '## 値オブジェクト（Value Objects）' ||
                 trimmed === '## 値オブジェクト' ||
                 trimmed === '## 3. 値オブジェクト定義' ||
                 trimmed === '## 値オブジェクト定義' ||
                 trimmed === '### 値オブジェクト定義') {
        currentSection = 'valueObjects';
        return;
      } else if (trimmed === '## ドメインサービス（Domain Services）' ||
                 trimmed === '## ドメインサービス' ||
                 trimmed === '## 5. ドメインサービス' ||
                 trimmed === '### ドメインサービス') {
        currentSection = 'domainServices';
        return;
      } else if (trimmed === '## 集約（Aggregates）' ||
                 trimmed === '## 集約' ||
                 trimmed === '## 4. 集約定義' ||
                 trimmed === '## 集約定義' ||
                 trimmed === '### 集約定義') {
        currentSection = 'aggregates';
        console.log('Found aggregates section at line', index);
        return;
      } else if (trimmed.startsWith('## ') && !trimmed.includes('エンティティ') && !trimmed.includes('値オブジェクト')) {
        // 他のセクションが始まったら現在のセクションをリセット
        currentSection = '';
        return;
      }
      
      // エンティティ解析
      if (currentSection === 'entities') {
        // エンティティ名の検出 - 4つのハッシュ(####)または3つのハッシュ(###)に対応
        if (trimmed.startsWith('#### ') || (trimmed.startsWith('### ') && !trimmed.includes('コアエンティティ'))) {
          // 新フォーマット例: #### Message（メッセージ）
          const entityMatch = trimmed.match(/^#{3,4}\s+([A-Za-z]+)[（(](.+?)[）)]/);
          if (entityMatch) {
            const englishName = entityMatch[1].trim();
            const japaneseName = entityMatch[2].trim();
            currentEntity = {
              name: englishName,  // 英語名をクラス名として使用
              stereotype: this.detectStereotype(englishName, currentSection),
              attributes: [],
              relationships: []
            };
            result.entities.push(currentEntity);
            inTable = false;
            console.log('Found entity:', englishName);
          } else {
            // フォールバック: #### エンティティ名 形式
            const simpleName = trimmed.replace(/^#{3,4}\s+/, '').trim();
            if (simpleName && simpleName !== 'コアエンティティ') {
              currentEntity = {
                name: this.sanitizeForMermaid(simpleName),
                stereotype: this.detectStereotype(simpleName, currentSection),
                attributes: [],
                relationships: []
              };
              result.entities.push(currentEntity);
              inTable = false;
              console.log('Found entity (fallback):', simpleName);
            }
          }
        } else if (currentEntity) {
          // テーブル開始の検出
          if (trimmed.startsWith('|') && trimmed.includes('属性名')) {
            inTable = true;
            tableHeaders = trimmed.split('|').map(h => h.trim()).filter(h => h);
            console.log('Table headers found:', tableHeaders);
          } else if (trimmed.startsWith('|--') || trimmed.startsWith('|-')) {
            // テーブルヘッダー区切り線 - スキップ
          } else if (inTable && trimmed.startsWith('|')) {
            // テーブル行のパース
            const cells = trimmed.split('|').map(c => c.trim()).filter(c => c);
            // フォーマット: | 属性名 | 型 | 必須 | 説明 |
            if (cells.length >= 3) {
              const attrName = cells[0];
              const attrType = cells[1];
              const required = cells[2] === '○';

              // ヘッダー行をスキップ
              if (attrName && attrType && attrName !== '属性名' && attrType !== '型') {
                currentEntity.attributes.push({
                  name: attrName,
                  type: attrType, // Keep original type for relationship detection
                  required: required
                });
                console.log(`Added attribute to ${currentEntity.name}: ${attrName} (${attrType})`);
              }
            }
          } else if (trimmed.startsWith('**識別性**') || trimmed.startsWith('**ライフサイクル**')) {
            // エンティティの説明行 - スキップ
          } else if (trimmed.startsWith('#### 集約ルート')) {
            currentEntity.isAggregate = true;
          } else if (!trimmed.startsWith('|') && !trimmed.startsWith('**')) {
            inTable = false;
          }
        }
      }
      
      // 値オブジェクト解析
      else if (currentSection === 'valueObjects') {
        if (trimmed.startsWith('### ')) {
          // 新フォーマット: ### メールアドレス [Email] [EMAIL]
          const nameMatch = trimmed.match(/^###\s+(.+?)\s*\[(.+?)\]\s*\[(.+?)\]$/);
          if (nameMatch) {
            const japaneseName = nameMatch[1].trim();
            const englishName = nameMatch[2].trim();
            const systemName = nameMatch[3].trim();
            currentValueObject = {
              name: englishName,  // 英語名をクラス名として使用
              attributes: [],
              relationships: []
            };
            result.valueObjects.push(currentValueObject);
          } else {
            // 旧フォーマットのフォールバック
            const match = trimmed.match(/^###\s+(.+?)(?:\s*[（(](.+?)[）)])?$/);
            if (match) {
              currentValueObject = {
                name: this.sanitizeForMermaid(match[1].trim()),
                attributes: [],
                relationships: []
              };
              result.valueObjects.push(currentValueObject);
            }
          }
        } else if (currentValueObject && trimmed.startsWith('- **')) {
          // 新フォーマット: - **値** [value] [VALUE]: STRING_255
          const attrMatch = trimmed.match(/^-\s*\*\*(.+?)\*\*\s*\[(.+?)\]\s*\[(.+?)\]:\s*(.+)/);
          if (attrMatch) {
            const japaneseName = attrMatch[1].trim();
            const englishName = attrMatch[2].trim();
            const systemName = attrMatch[3].trim();
            const type = attrMatch[4].trim();
            currentValueObject.attributes.push({
              name: englishName,
              type: this.convertParasolTypeToMermaid(type),
              required: true
            });
          }
        } else if (currentValueObject && trimmed.startsWith('- ') && trimmed.includes(':')) {
          // 旧フォーマットのフォールバック
          const colonIndex = trimmed.indexOf(':');
          if (colonIndex > 0) {
            const name = trimmed.substring(2, colonIndex).trim();
            const typeAndDesc = trimmed.substring(colonIndex + 1).trim();
            const typeMatch = typeAndDesc.match(/^(\S+)/);
            if (typeMatch) {
              currentValueObject.attributes.push({
                name: this.convertAttributeNameToEnglish(name),
                type: this.convertParasolTypeToMermaid(typeMatch[1]),
                required: true
              });
            }
          }
        }
      }
      
      // 集約解析
      else if (currentSection === 'aggregates') {
        if (trimmed.startsWith('### ')) {
          // 新しい集約定義の開始: ### プロジェクト集約 [ProjectAggregate] [PROJECT_AGGREGATE]
          const nameMatch = trimmed.match(/^###\s+(.+?)\s*\[(.+?)\]\s*\[(.+?)\]$/);
          if (nameMatch) {
            const japaneseName = nameMatch[1].trim();
            const englishName = nameMatch[2].trim();
            const systemName = nameMatch[3].trim();
            currentAggregate = { name: englishName, root: '', entities: [] };
            result.aggregates.push(currentAggregate);
            console.log('Found aggregate:', englishName);
          } else {
            // フォールバック
            const name = trimmed.substring(4).trim();
            currentAggregate = { name: this.sanitizeForMermaid(name), root: '', entities: [] };
            result.aggregates.push(currentAggregate);
            console.log('Found aggregate (fallback):', name);
          }
          inAggregateRoot = false;
          inAggregateEntities = false;
        } else if (currentAggregate) {
          if (trimmed.includes('集約ルート') || trimmed.startsWith('**集約ルート**')) {
            // 集約ルートの抽出
            const rootMatch = trimmed.match(/[:：]\s*(.+)/);
            if (rootMatch) {
              currentAggregate.root = rootMatch[1].trim();
              console.log('Set aggregate root from inline:', currentAggregate.root);
            }
            inAggregateRoot = true;
            inAggregateEntities = false;
            console.log('Found aggregate root section');
          } else if (trimmed === '#### 含まれるエンティティ' ||
                     trimmed.includes('包含エンティティ') ||
                     trimmed.startsWith('**包含エンティティ**')) {
            inAggregateRoot = false;
            inAggregateEntities = true;
            console.log('Found aggregate entities section');
          } else if (trimmed.startsWith('####')) {
            // 他のサブセクション開始
            inAggregateRoot = false;
            inAggregateEntities = false;
          } else if (trimmed.startsWith('- ')) {
            const value = trimmed.substring(2).trim();
            if (inAggregateRoot && value && !currentAggregate.root) {
              currentAggregate.root = value;
              console.log('Set aggregate root from list:', value);
            } else if (inAggregateEntities && value) {
              currentAggregate.entities.push(value);
              console.log('Added aggregate entity:', value);
            }
          }
        }
      }
    });
    
    // リレーションシップの検出（拡張版）
    result.entities.forEach(entity => {
      entity.attributes.forEach(attr => {
        // 外部キー的な属性から関係を推測
        if (attr.name.endsWith('Id') && attr.name !== 'id') {
          // xxxId形式から対象エンティティ名を推測
          let targetName = attr.name.substring(0, attr.name.length - 2);
          
          // 特殊なケースを処理
          const nameMap: Record<string, string> = {
            'organization': 'Organization',
            'user': 'User',
            'role': 'Role',
            'session': 'Session',
            'project': 'Project',
            'task': 'Task',
            'milestone': 'Milestone',
            'risk': 'Risk',
            'issue': 'Issue',
            'deliverable': 'Deliverable'
          };
          
          const mappedName = nameMap[targetName.toLowerCase()];
          if (mappedName) {
            targetName = mappedName;
          }
          
          const targetEntity = result.entities.find(e => 
            e.name.toLowerCase() === targetName.toLowerCase()
          );
          
          if (targetEntity) {
            // 重複チェック
            const exists = entity.relationships?.some(r => 
              r.target === targetEntity.name && r.type === 'many-to-one'
            );
            
            if (!exists) {
              entity.relationships?.push({
                target: targetEntity.name,
                type: 'many-to-one'
              });
            }
          }
        }
        
        // Value Object型の属性から関係を検出
        const valueObject = result.valueObjects.find(vo => 
          vo.name.toLowerCase() === attr.type.toLowerCase() ||
          vo.name === attr.type
        );
        
        if (valueObject) {
          // 重複チェック
          const exists = entity.relationships?.some(r => 
            r.target === valueObject.name && r.type === 'value-object'
          );
          
          if (!exists) {
            entity.relationships?.push({
              target: valueObject.name,
              type: 'value-object' as any
            });
          }
        }
      });
    });
    
    return result;
  }
  
  // 属性名を英語に変換
  private static convertAttributeNameToEnglish(japaneseName: string): string {
    const nameMap: Record<string, string> = {
      '記事ID': 'articleId',
      'タイトル': 'title',
      '本文': 'content',
      '要約': 'summary',
      'カテゴリ': 'category',
      'タグ': 'tags',
      '作成者ID': 'authorId',
      'ステータス': 'status',
      '公開日': 'publishedAt',
      '閲覧数': 'viewCount',
      '評価': 'rating',
      '作成日時': 'createdAt',
      '更新日時': 'updatedAt',
      'ID': 'id',
      '名称': 'name',
      '説明': 'description'
    };
    
    return nameMap[japaneseName] || this.sanitizeForMermaid(japaneseName);
  }

  // Mermaid用にクラス名やメンバー名をサニタイズ
  private static sanitizeForMermaid(name: string): string {
    // プレースホルダーのパターン（[エンティティ名]など）を検出して置換
    if (name.match(/^\[.+\]$/)) {
      // プレースホルダーの場合は、適切なデフォルト名に変換
      const placeholderMap: Record<string, string> = {
        '[エンティティ名]': 'Entity',
        '[値オブジェクト名]': 'ValueObject',
        '[集約名]': 'Aggregate',
        '[サービス名]': 'Service',
        '[イベント名]': 'Event',
        '[リポジトリ名]': 'Repository',
        '[属性名]': 'attribute',
        '[メソッド名]': 'method',
        '[ルール1]': 'rule1',
        '[ルール2]': 'rule2',
        '[イベント1]': 'event1',
        '[制約1]': 'constraint1',
        '[制約2]': 'constraint2'
      };
      
      if (placeholderMap[name]) {
        return placeholderMap[name];
      }
      
      // その他のプレースホルダーは内容を抽出してサニタイズ
      const inner = name.slice(1, -1); // []を除去
      return this.sanitizeForMermaid(inner);
    }
    
    // 英数字とアンダースコアのみを許可、それ以外は削除またはアンダースコアに変換
    let sanitized = name
      // 日本語を英語に変換（簡易的）
      .replace(/エンティティ/g, 'Entity')
      .replace(/値オブジェクト/g, 'ValueObject')
      .replace(/集約/g, 'Aggregate')
      .replace(/サービス/g, 'Service')
      .replace(/イベント/g, 'Event')
      .replace(/リポジトリ/g, 'Repository')
      .replace(/名/g, 'Name')
      .replace(/属性/g, 'Attribute')
      // 特殊文字を削除またはアンダースコアに変換
      .replace(/[（(]/g, '_')
      .replace(/[）)]/g, '')
      .replace(/[^\w]/g, '_') // 英数字とアンダースコア以外をアンダースコアに
      .replace(/_+/g, '_') // 連続するアンダースコアを1つに
      .replace(/^_|_$/g, ''); // 先頭と末尾のアンダースコアを削除
    
    // 空になった場合や数字で始まる場合の対処
    if (!sanitized || /^\d/.test(sanitized)) {
      sanitized = 'Item' + (sanitized || '');
    }
    
    return sanitized;
  }

  // Markdown解析ヘルパーメソッド（旧メソッドは互換性のため残す）
  private static parseDomainLanguage(markdown: string): Entity[] {
    console.log('=== parseDomainLanguage ===');
    const entities: Entity[] = [];
    const lines = markdown.split('\n');
    let currentEntity: Entity | null = null;
    let inEntitySection = false;
    let inAttributes = false;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // エンティティセクションの開始
      if (trimmed === '## エンティティ') {
        console.log(`Line ${index}: Found entity section`);
        inEntitySection = true;
        return;
      }
      
      // 他のセクションの開始
      if (trimmed.startsWith('## ') && trimmed !== '## エンティティ') {
        console.log(`Line ${index}: Found ${trimmed} section, ending entity section`);
        inEntitySection = false;
        currentEntity = null;
        return;
      }
      
      // エンティティ名の検出（### で始まる行）
      if (inEntitySection && trimmed.startsWith('### ')) {
        const name = trimmed.substring(4).trim();
        console.log(`Line ${index}: Found entity: "${name}"`);
        currentEntity = { 
          name: this.sanitizeForMermaid(name), 
          attributes: [],
          relationships: []
        };
        entities.push(currentEntity);
        inAttributes = false;
      }
      
      // 属性セクションの検出
      if (currentEntity && trimmed === '- **属性**:') {
        console.log(`Line ${index}: Found attributes section for ${currentEntity.name}`);
        inAttributes = true;
        return;
      }
      
      // 振る舞いセクションの検出（属性の終了）
      if (currentEntity && trimmed === '- **振る舞い**:') {
        console.log(`Line ${index}: Found behavior section for ${currentEntity.name}`);
        inAttributes = false;
        return;
      }
      
      // 属性の検出（- で始まるインデントされた行）
      if (currentEntity && inAttributes && trimmed.startsWith('- ') && line.match(/^\s{2,}/)) {
        const attrLine = trimmed.substring(2).trim();
        const colonIndex = attrLine.indexOf(':');
        if (colonIndex > 0) {
          const name = attrLine.substring(0, colonIndex).trim();
          const type = attrLine.substring(colonIndex + 1).trim();
          const mermaidType = this.convertParasolTypeToMermaid(type);
          
          currentEntity.attributes.push({
            name,
            type: mermaidType,
            required: true
          });
          console.log(`Line ${index}: Added attribute to ${currentEntity.name}: ${name}: ${mermaidType}`);
        }
      }
    });
    
    console.log('Final entities:', entities);
    return entities;
  }
  
  // パラソルドメイン言語の型をMermaid用の型に変換
  private static convertParasolTypeToMermaid(parasolType: string): string {
    const typeMap: Record<string, string> = {
      'UUID': 'String',
      'STRING': 'String',
      'STRING_20': 'String',
      'STRING_50': 'String',
      'STRING_100': 'String',
      'STRING_200': 'String',
      'STRING_255': 'String',
      'STRING_500': 'String',
      'TEXT': 'String',
      'EMAIL': 'String',
      'PASSWORD_HASH': 'String',
      'DATE': 'Date',
      'TIMESTAMP': 'DateTime',
      'DECIMAL': 'Decimal',
      'INTEGER': 'Integer',
      'PERCENTAGE': 'Integer',
      'MONEY': 'Decimal',
      'BOOLEAN': 'Boolean',
      'ENUM': 'String',
      'JSON': 'Object'
    };
    
    return typeMap[parasolType] || 'String';
  }

  private static parseDBSchema(markdown: string): Table[] {
    const tables: Table[] = [];
    const lines = markdown.split('\n');
    let currentTable: Table | null = null;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // テーブル名の検出
      if (trimmed.startsWith('## ') && trimmed.includes('テーブル')) {
        const name = trimmed.replace('##', '').replace('テーブル', '').trim();
        currentTable = { name, columns: [] };
        tables.push(currentTable);
      }
      
      // カラムの検出
      if (currentTable && trimmed.includes('|') && !trimmed.startsWith('|--')) {
        const parts = trimmed.split('|').filter(p => p.trim());
        if (parts.length >= 2 && parts[0] !== 'カラム名') {
          const column: any = {
            name: parts[0].trim(),
            type: parts[1].trim(),
          };
          
          if (parts[2]?.includes('PK')) {
            column.primaryKey = true;
          }
          
          if (parts[2]?.includes('FK')) {
            // FK情報の解析（簡易版）
            const fkMatch = parts[2].match(/FK\((.*?)\)/);
            if (fkMatch) {
              const [table, col] = fkMatch[1].split('.');
              column.foreignKey = { table, column: col };
            }
          }
          
          currentTable.columns.push(column);
        }
      }
    });
    
    return tables;
  }

  private static parseOperationSteps(markdown: string): Array<{ type: string; label: string }> {
    const steps: Array<{ type: string; label: string }> = [];
    const lines = markdown.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // ステップの検出（番号付きリスト）
      if (/^\d+\./.test(trimmed)) {
        const label = trimmed.replace(/^\d+\.\s*/, '');
        let type = 'process';
        
        if (label.includes('判定') || label.includes('確認')) {
          type = 'decision';
        } else if (label.includes('処理') || label.includes('実行')) {
          type = 'subprocess';
        }
        
        steps.push({ type, label });
      }
    });
    
    return steps;
  }

  private static parseUseCaseElements(markdown: string) {
    const elements = {
      actors: [] as string[],
      boundaries: [] as string[],
      controls: [] as string[],
      entities: [] as string[],
      flows: [] as Array<{ from: string; to: string }>,
    };
    
    const lines = markdown.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // アクターの検出
      if (trimmed.includes('アクター:') || trimmed.includes('Actor:')) {
        const actor = trimmed.split(':')[1]?.trim();
        if (actor) elements.actors.push(actor);
      }
      
      // UI要素の検出
      if (trimmed.includes('画面:') || trimmed.includes('UI:')) {
        const ui = trimmed.split(':')[1]?.trim();
        if (ui) elements.boundaries.push(ui);
      }
      
      // 処理の検出
      if (trimmed.includes('処理:') || trimmed.includes('Controller:')) {
        const control = trimmed.split(':')[1]?.trim();
        if (control) elements.controls.push(control);
      }
      
      // エンティティの検出
      if (trimmed.includes('エンティティ:') || trimmed.includes('Entity:')) {
        const entity = trimmed.split(':')[1]?.trim();
        if (entity) elements.entities.push(entity);
      }
    });
    
    // 基本的なフローの生成（簡易版）
    if (elements.actors.length > 0 && elements.boundaries.length > 0) {
      elements.flows.push({ from: elements.actors[0], to: elements.boundaries[0] });
    }
    
    if (elements.boundaries.length > 0 && elements.controls.length > 0) {
      elements.flows.push({ from: elements.boundaries[0], to: elements.controls[0] });
    }
    
    if (elements.controls.length > 0 && elements.entities.length > 0) {
      elements.flows.push({ from: elements.controls[0], to: elements.entities[0] });
    }
    
    return elements;
  }
}