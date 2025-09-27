// Markdown形式の設計情報から各種ダイアグラムコードを生成する

interface Entity {
  name: string;
  attributes: Array<{
    name: string;
    type: string;
    required?: boolean;
  }>;
  relationships?: Array<{
    target: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
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
    
    let mermaid = 'classDiagram\n';
    
    // エンティティ
    parseResult.entities.forEach(entity => {
      // クラス定義
      mermaid += `  class ${entity.name} {\n`;
      if (entity.isAggregate) {
        mermaid += '    <<aggregate>>\n';
      }
      entity.attributes.forEach(attr => {
        // Mermaidの正しい属性構文: type name
        mermaid += `    ${attr.type} ${attr.name}\n`;
      });
      mermaid += '  }\n';
      
      // 関連の定義
      entity.relationships?.forEach(rel => {
        if (rel.type === 'one-to-one') {
          mermaid += `  ${entity.name} "1" -- "1" ${rel.target}\n`;
        } else if (rel.type === 'one-to-many') {
          mermaid += `  ${entity.name} "1" -- "*" ${rel.target}\n`;
        } else if (rel.type === 'many-to-many') {
          mermaid += `  ${entity.name} "*" -- "*" ${rel.target}\n`;
        }
      });
    });
    
    // 値オブジェクト
    parseResult.valueObjects.forEach(vo => {
      mermaid += `  class ${vo.name} {\n`;
      mermaid += '    <<value object>>\n';
      vo.attributes.forEach(attr => {
        mermaid += `    ${attr.type} ${attr.name}\n`;
      });
      mermaid += '  }\n';
    });
    
    // 集約の関係を追加
    parseResult.aggregates.forEach(agg => {
      agg.entities.forEach(entityName => {
        if (entityName !== agg.root) {
          // 集約内の関係を点線で表示
          mermaid += `  ${agg.root} ..> ${entityName} : contains\n`;
        }
      });
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
      const nextId = index < steps.length - 1 ? `step${index + 2}` : 'end';
      
      if (step.type === 'start') {
        mermaid += `  start((開始))\n`;
        mermaid += `  start --> ${nodeId}\n`;
      }
      
      if (step.type === 'decision') {
        mermaid += `  ${nodeId}{${step.label}}\n`;
      } else if (step.type === 'process') {
        mermaid += `  ${nodeId}[${step.label}]\n`;
      } else if (step.type === 'subprocess') {
        mermaid += `  ${nodeId}[[${step.label}]]\n`;
      }
      
      if (index === steps.length - 1) {
        mermaid += `  ${nodeId} --> end((終了))\n`;
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
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // セクション検出
      if (trimmed === '## エンティティ') {
        currentSection = 'entities';
        return;
      } else if (trimmed === '## 値オブジェクト') {
        currentSection = 'valueObjects';
        return;
      } else if (trimmed === '## 集約') {
        currentSection = 'aggregates';
        return;
      } else if (trimmed.startsWith('## ')) {
        currentSection = '';
        return;
      }
      
      // エンティティ解析
      if (currentSection === 'entities') {
        if (trimmed.startsWith('### ')) {
          const match = trimmed.match(/^###\s+(.+?)(?:\s*[（(](.+?)[）)])?$/);
          if (match) {
            currentEntity = {
              name: this.sanitizeForMermaid(match[1].trim()),
              attributes: [],
              relationships: []
            };
            result.entities.push(currentEntity);
            inTable = false;
          }
        } else if (currentEntity) {
          // テーブル開始
          if (trimmed.startsWith('|') && trimmed.includes('属性名')) {
            inTable = true;
            tableHeaders = trimmed.split('|').map(h => h.trim()).filter(h => h);
          } else if (trimmed.startsWith('|--')) {
            // テーブルヘッダー区切り線
          } else if (inTable && trimmed.startsWith('|')) {
            // テーブル行
            const cells = trimmed.split('|').map(c => c.trim()).filter(c => c);
            if (cells.length >= 2) {
              const name = cells[0];
              const type = cells[1];
              if (name && type && !['属性名', '型'].includes(name)) {
                currentEntity.attributes.push({
                  name: this.convertAttributeNameToEnglish(name),
                  type: this.convertParasolTypeToMermaid(type),
                  required: cells[2] === '○'
                });
              }
            }
          } else if (trimmed.startsWith('#### 集約ルート')) {
            currentEntity.isAggregate = true;
          } else if (!trimmed.startsWith('|')) {
            inTable = false;
          }
        }
      }
      
      // 値オブジェクト解析
      else if (currentSection === 'valueObjects') {
        if (trimmed.startsWith('### ')) {
          const match = trimmed.match(/^###\s+(.+?)(?:\s*[（(](.+?)[）)])?$/);
          if (match) {
            currentValueObject = {
              name: this.sanitizeForMermaid(match[1].trim()),
              attributes: [],
              relationships: []
            };
            result.valueObjects.push(currentValueObject);
          }
        } else if (currentValueObject && trimmed.startsWith('- ') && trimmed.includes(':')) {
          // 属性行
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
          const name = trimmed.substring(4).trim();
          currentAggregate = { name: this.sanitizeForMermaid(name), root: '', entities: [] };
          result.aggregates.push(currentAggregate);
        } else if (currentAggregate) {
          if (trimmed.startsWith('- **集約ルート**:')) {
            currentAggregate.root = this.sanitizeForMermaid(trimmed.split(':')[1].trim());
          } else if (trimmed.startsWith('- **含まれるエンティティ**:')) {
            const entities = trimmed.split(':')[1].trim().split(',').map(e => this.sanitizeForMermaid(e.trim()));
            currentAggregate.entities = entities;
          }
        }
      }
    });
    
    // リレーションシップの検出（簡易版）
    result.entities.forEach(entity => {
      entity.attributes.forEach(attr => {
        // 外部キー的な属性から関係を推測
        if (attr.name.endsWith('Id') && attr.name !== 'id') {
          const targetName = attr.name.substring(0, attr.name.length - 2);
          const targetEntity = result.entities.find(e => 
            e.name.toLowerCase() === targetName.toLowerCase()
          );
          if (targetEntity) {
            entity.relationships?.push({
              target: targetEntity.name,
              type: 'many-to-one'
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
      'STRING_20': 'String',
      'STRING_50': 'String',
      'STRING_100': 'String',
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
      'ENUM': 'String'
    };
    
    return typeMap[parasolType] || parasolType;
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