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

interface Relationship {
  from: string;        // 参照元テーブル
  to: string;          // 参照先テーブル
  fromColumn: string;  // 参照元カラム
  toColumn: string;    // 参照先カラム
  cardinality: string; // "||--o{" (1:N), "||--||" (1:1), "}o--o{" (N:M)
  label?: string;      // リレーションシップのラベル
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
      // 日本語と英数字を保持し、スペースはアンダースコアに変換
      return match[1].trim().replace(/\s+/g, '_').replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
    }
    // 日本語と英数字を保持し、スペースはアンダースコアに変換
    return name.replace(/\s+/g, '_').replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
  }

  // より柔軟な名前マッチング用のヘルパー関数
  private static fuzzyNameMatch(name1: string, name2: string): boolean {
    const normalize = (name: string) => name.toLowerCase().replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
    return normalize(name1) === normalize(name2) ||
           normalize(name1).includes(normalize(name2)) ||
           normalize(name2).includes(normalize(name1));
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

    if (parseResult.aggregates.length === 0 && parseResult.entities.length === 0 && parseResult.valueObjects.length === 0) {
      // シンプルで確実に動作するMermaid構文を使用
      const placeholder = `classDiagram
  class NoEntity {
    string info
  }`;
      console.log('No entities found, returning placeholder');
      return placeholder;
    }

    // 集約ルートエンティティにマークを付ける
    const aggregateRoots = new Set<string>();
    const aggregateMembers = new Map<string, string[]>(); // aggregate root -> member entities

    parseResult.aggregates.forEach(agg => {
      // 集約ルートから英語名を抽出（例: "組織 [Organization]" -> "Organization"）
      let rootName = agg.root;
      const englishMatch = agg.root.match(/\[([A-Za-z_]+)\]/);
      if (englishMatch) {
        rootName = englishMatch[1];
      } else if (agg.root.includes(' ')) {
        // 日本語名の場合、対応するエンティティを探す
        rootName = agg.root.split(' ')[0];
      }

      aggregateRoots.add(rootName);

      // 集約メンバーをマップに追加
      if (!aggregateMembers.has(rootName)) {
        aggregateMembers.set(rootName, []);
      }

      agg.entities.forEach(entityName => {
        if (entityName !== rootName && entityName !== agg.root) {
          aggregateMembers.get(rootName)?.push(entityName);
        }
      });

      // エンティティにマークを付ける
      const rootEntity = parseResult.entities.find(e =>
        e.name === rootName ||
        this.fuzzyNameMatch(e.name, rootName)
      );

      if (rootEntity) {
        rootEntity.isAggregate = true;
        console.log(`✓ Marked ${rootEntity.name} as aggregate root`);
      }
    });

    let mermaid = 'classDiagram\n';

    // アグリゲートが存在する場合は、アグリゲートを最上位で表示
    if (parseResult.aggregates.length > 0) {
      // 1. まず集約ルートを表示
      parseResult.entities.filter(e => e.isAggregate).forEach(entity => {
        const sanitizedName = this.sanitizeNameForMermaid(entity.name);
        mermaid += `  class ${sanitizedName} {\n`;
        mermaid += '    <<aggregate root>>\n';
        entity.attributes.forEach(attr => {
          const mermaidType = this.convertParasolTypeToMermaid(attr.type);
          const sanitizedAttrName = this.sanitizeNameForMermaid(attr.name);
          mermaid += `    ${mermaidType} ${sanitizedAttrName}\n`;
        });
        mermaid += `  }\n`;
      });

      // 2. 次に集約メンバーエンティティを表示
      parseResult.entities.filter(e => !e.isAggregate).forEach(entity => {
        const sanitizedName = this.sanitizeNameForMermaid(entity.name);
        mermaid += `  class ${sanitizedName} {\n`;
        if (entity.stereotype) {
          const stereotypeLabel = entity.stereotype === 'value-object' ? 'value object' : entity.stereotype;
          mermaid += `    <<${stereotypeLabel}>>\n`;
        }
        entity.attributes.forEach(attr => {
          const mermaidType = this.convertParasolTypeToMermaid(attr.type);
          const sanitizedAttrName = this.sanitizeNameForMermaid(attr.name);
          mermaid += `    ${mermaidType} ${sanitizedAttrName}\n`;
        });
        mermaid += `  }\n`;
      });
    } else {
      // 集約が無い場合は通常のエンティティ表示
      parseResult.entities.forEach(entity => {
        const sanitizedName = this.sanitizeNameForMermaid(entity.name);
        mermaid += `  class ${sanitizedName} {\n`;
        if (entity.stereotype) {
          const stereotypeLabel = entity.stereotype === 'value-object' ? 'value object' : entity.stereotype;
          mermaid += `    <<${stereotypeLabel}>>\n`;
        }
        entity.attributes.forEach(attr => {
          const mermaidType = this.convertParasolTypeToMermaid(attr.type);
          const sanitizedAttrName = this.sanitizeNameForMermaid(attr.name);
          mermaid += `    ${mermaidType} ${sanitizedAttrName}\n`;
        });
        mermaid += `  }\n`;
      });
    }

    // 値オブジェクト（クラス定義のみ）
    parseResult.valueObjects.forEach(vo => {
      const sanitizedVOName = this.sanitizeNameForMermaid(vo.name);
      mermaid += `  class ${sanitizedVOName} {\n`;
      mermaid += '    <<value object>>\n';
      vo.attributes.forEach(attr => {
        const mermaidType = this.convertParasolTypeToMermaid(attr.type);
        const sanitizedAttrName = this.sanitizeNameForMermaid(attr.name);
        mermaid += `    ${mermaidType} ${sanitizedAttrName}\n`;
      });
      mermaid += `  }\n`;
    });

    // エンティティ間の関係（全クラス定義後に記述）
    console.log(`Processing entity relationships for ${parseResult.entities.length} entities`);
    parseResult.entities.forEach(entity => {
      const sanitizedName = this.sanitizeNameForMermaid(entity.name);
      console.log(`Processing relationships for entity: ${entity.name} -> ${sanitizedName}`);

      if (entity.relationships && entity.relationships.length > 0) {
        console.log(`  Found ${entity.relationships.length} relationships`);
        entity.relationships.forEach(rel => {
          const targetName = this.sanitizeNameForMermaid(rel.target);
          console.log(`  Checking relationship: ${entity.name} -> ${rel.target} (${rel.type})`);

          // 関係先が定義済みかチェック（柔軟なマッチング使用）
          const targetExists = parseResult.entities.some(e =>
            this.fuzzyNameMatch(e.name, rel.target) || this.sanitizeNameForMermaid(e.name) === targetName
          ) || parseResult.valueObjects.some(vo =>
            this.fuzzyNameMatch(vo.name, rel.target) || this.sanitizeNameForMermaid(vo.name) === targetName
          );

          if (targetExists) {
            if (rel.type === 'one-to-one') {
              mermaid += `  ${sanitizedName} "1" -- "1" ${targetName}\n`;
            } else if (rel.type === 'one-to-many') {
              mermaid += `  ${sanitizedName} "1" -- "*" ${targetName}\n`;
            } else if (rel.type === 'many-to-one') {
              mermaid += `  ${sanitizedName} "*" --> "1" ${targetName}\n`;
            } else if (rel.type === 'many-to-many') {
              mermaid += `  ${sanitizedName} "*" -- "*" ${targetName}\n`;
            } else if ((rel.type as string) === 'value-object') {
              // Value Objectとの関連
              mermaid += `  ${sanitizedName} --> ${targetName} : uses\n`;
            }
            console.log(`  ✓ Added entity relationship: ${sanitizedName} -> ${targetName} (${rel.type})`);
          } else {
            console.log(`  ✗ Skipping relationship: ${rel.target} -> ${targetName} not found in entities or value objects`);
          }
        });
      } else {
        console.log(`  No relationships found for ${entity.name}`);
      }
    });

    // 値オブジェクトと集約ルートの関係（全クラス定義後に記述）
    parseResult.valueObjects.forEach(vo => {
      const sanitizedVOName = this.sanitizeNameForMermaid(vo.name);
      if (parseResult.aggregates.length > 0 && parseResult.aggregates[0].root) {
        const sanitizedRoot = this.sanitizeNameForMermaid(parseResult.aggregates[0].root);
        // 定義済みのエンティティにのみ関係を追加（柔軟なマッチング使用）
        const rootEntityExists = parseResult.entities.some(e =>
          this.fuzzyNameMatch(e.name, parseResult.aggregates[0].root) || this.sanitizeNameForMermaid(e.name) === sanitizedRoot
        );
        if (rootEntityExists) {
          mermaid += `  ${sanitizedRoot} --> ${sanitizedVOName} : contains\n`;
          console.log(`Added VO relationship: ${sanitizedRoot} --> ${sanitizedVOName}`);
        } else {
          console.log(`Skipping VO relationship: ${sanitizedRoot} not found in entities`);
        }
      }
    });

    // 集約の関係を追加
    const processedAggregateRelations = new Set<string>();
    parseResult.aggregates.forEach(agg => {
      const aggKey = `${agg.name}-${agg.root}`;
      if (!processedAggregateRelations.has(aggKey)) {
        processedAggregateRelations.add(aggKey);
        console.log(`Adding aggregate relationships for: ${agg.name} (root: ${agg.root})`);

        agg.entities.forEach(entityName => {
          if (entityName !== agg.root) {
            // 集約内のエンティティが定義済みかチェック
            const entityExists = parseResult.entities.some(e =>
              this.fuzzyNameMatch(e.name, entityName)
            ) || parseResult.valueObjects.some(vo =>
              this.fuzzyNameMatch(vo.name, entityName)
            );

            if (entityExists) {
              // 集約内の関係を点線で表示
              const sanitizedRoot = this.sanitizeNameForMermaid(agg.root);
              const sanitizedEntity = this.sanitizeNameForMermaid(entityName);
              mermaid += `  ${sanitizedRoot} ..> ${sanitizedEntity} : contains\n`;
              console.log(`  Added aggregate relationship: ${agg.root} ..> ${entityName}`);
            } else {
              console.log(`  Skipping aggregate relationship: ${entityName} not found in entities or value objects`);
            }
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
    const { tables, relationships, hasMermaidERDiagram, mermaidContent } = this.parseDBSchema(markdown);

    // Mermaid ER図が既に存在する場合は、そのまま返す
    if (hasMermaidERDiagram && mermaidContent) {
      console.log('[DEBUG] Using existing Mermaid ER diagram from markdown');
      return mermaidContent;
    }

    // Markdownテーブル形式からMermaid ER図を生成
    if (tables.length === 0) {
      return 'erDiagram\n  PLACEHOLDER {\n    string info\n  }';
    }

    let mermaid = 'erDiagram\n';

    // テーブル定義
    tables.forEach(table => {
      mermaid += `  ${table.name} {\n`;
      table.columns.forEach(col => {
        // Mermaidでは型名を小文字にする必要がある
        let type = col.type.toLowerCase();
        let constraint = '';

        if (col.primaryKey) {
          constraint = ' PK';
        } else if (col.unique) {
          constraint = ' UK';
        } else if (col.foreignKey) {
          constraint = ' FK';
        }

        mermaid += `    ${type} ${col.name}${constraint}\n`;
      });
      mermaid += `  }\n`;
    });

    // リレーションシップ（親テーブル ||--o{ 子テーブル）
    if (relationships.length > 0) {
      mermaid += '\n';
      relationships.forEach(rel => {
        // Mermaidの構文: 親テーブル カーディナリティ 子テーブル : "関係名"
        // ラベルが存在する場合は使用、なければデフォルトの"references"を使用
        const label = rel.label || 'references';
        mermaid += `  ${rel.to} ${rel.cardinality} ${rel.from} : "${label}"\n`;
      });
    }

    console.log('[DEBUG] Generated Mermaid ER diagram from Markdown tables:');
    console.log(mermaid);
    return mermaid;
  }

  // ビジネスオペレーションからBPMNフロー図を生成（Mermaid）
  static operationToFlowDiagram(markdown: string): string {
    console.log('[DiagramConverter] Generating flowchart from business operation');

    // プロセスフローを抽出
    const processFlowMatch = markdown.match(/##\s*プロセスフロー\s*\n([\s\S]*?)(?=\n##|$)/);
    const processFlowText = processFlowMatch ? processFlowMatch[1] : '';

    // 代替フローを抽出
    const alternativeFlowMatch = markdown.match(/##\s*代替フロー\s*\n([\s\S]*?)(?=\n##|$)/);
    const alternativeFlowText = alternativeFlowMatch ? alternativeFlowMatch[1] : '';

    // 例外フローを抽出
    const exceptionFlowMatch = markdown.match(/##\s*例外処理\s*\n([\s\S]*?)(?=\n##|$)/);
    const exceptionFlowText = exceptionFlowMatch ? exceptionFlowMatch[1] : '';

    console.log('[DiagramConverter] Process flow found:', processFlowText.length > 0);
    console.log('[DiagramConverter] Alternative flow found:', alternativeFlowText.length > 0);
    console.log('[DiagramConverter] Exception flow found:', exceptionFlowText.length > 0);

    if (!processFlowText) {
      console.log('[DiagramConverter] No process flow found in business operation');
      return '';
    }

    // プロセスフローにMermaidブロックがあるかチェック
    const hasMermaidBlock = processFlowText.includes('```mermaid');
    console.log('[DiagramConverter] Process flow has Mermaid block:', hasMermaidBlock);

    if (hasMermaidBlock) {
      // Mermaid形式の場合：Mermaidブロックをそのまま返す
      console.log('[DiagramConverter] Using Mermaid flowchart from process flow');
      const mermaidMatch = processFlowText.match(/```mermaid\s*\n([\s\S]*?)```/);
      if (mermaidMatch && mermaidMatch[1]) {
        return mermaidMatch[1].trim();
      }
      console.log('[DiagramConverter] Failed to extract Mermaid block');
      return '';
    }

    // テキスト形式の場合：プロセスフローをパース
    console.log('[DiagramConverter] Generating flowchart from text-based process flow');
    const processSteps = this.parseFlowSteps(processFlowText);

    console.log('[DiagramConverter] Parsed process steps:', processSteps.length);
    console.log('[DiagramConverter] Process steps:', processSteps);

    // 代替フローをパース
    const alternativeFlows = this.parseAlternativeFlows(alternativeFlowText);

    // 例外フローをパース
    const exceptionFlows = this.parseExceptionFlows(exceptionFlowText);

    // Mermaidフローチャートを生成
    let flowchart = 'flowchart TD\n';
    flowchart += '    Start([開始])\n';

    // プロセスフローのステップを追加
    if (processSteps.length > 0) {
      processSteps.forEach((step, index) => {
        const nodeId = `Step${index + 1}`;
        const stepText = this.escapeText(`${step.step}. ${step.text}`);
        flowchart += `    ${nodeId}[${stepText}]\n`;
      });

      flowchart += '    End([完了])\n\n';

      // 接続を追加
      flowchart += `    Start --> Step1\n`;
      processSteps.forEach((step, index) => {
        const nodeId = `Step${index + 1}`;
        const nextNodeId = index < processSteps.length - 1 ? `Step${index + 2}` : 'End';
        flowchart += `    ${nodeId} --> ${nextNodeId}\n`;
      });

      flowchart += '\n';
    } else {
      // プロセスステップがない場合は、直接完了へ
      flowchart += '    End([完了])\n';
      flowchart += '    Start --> End\n\n';
    }

    // 代替フローを追加
    if (alternativeFlows.length > 0) {
      flowchart += '\n    %% 代替フロー\n';
      alternativeFlows.forEach((alternative, index) => {
        const altId = `Alt${index + 1}`;
        const altText = this.escapeText(alternative.condition);
        flowchart += `    ${altId}{${altText}}\n`;

        // 代替フローのステップを追加
        alternative.steps.forEach((step, stepIndex) => {
          const altStepId = `${altId}_${stepIndex + 1}`;
          const altStepText = this.escapeText(step);
          flowchart += `    ${altStepId}[${altStepText}]\n`;
        });

        // プロセスステップから代替フローへの接続（点線）
        const fromStepId = `Step${Math.min(index + 2, processSteps.length)}`;
        flowchart += `    ${fromStepId} -.-> ${altId}\n`;

        // 代替フローの接続
        alternative.steps.forEach((step, stepIndex) => {
          const altStepId = `${altId}_${stepIndex + 1}`;
          if (stepIndex === 0) {
            flowchart += `    ${altId} -->|条件成立| ${altStepId}\n`;
          } else {
            const prevStepId = `${altId}_${stepIndex}`;
            flowchart += `    ${prevStepId} --> ${altStepId}\n`;
          }
        });

        // 代替フローから基本フローに戻る
        const lastAltStepId = `${altId}_${alternative.steps.length}`;
        const returnStepId = index + 3 <= processSteps.length ? `Step${index + 3}` : 'End';
        flowchart += `    ${lastAltStepId} -.-> ${returnStepId}\n`;
        flowchart += `    ${altId} -->|条件不成立| ${returnStepId}\n`;
      });
    }

    // 例外フローを追加
    if (exceptionFlows.length > 0) {
      flowchart += '\n    %% 例外フロー\n';
      exceptionFlows.forEach((exception, index) => {
        const exId = `Ex${index + 1}`;
        const exText = this.escapeText(exception.condition);
        flowchart += `    ${exId}{{${exText}}}\n`;

        // 例外フローのステップを追加
        exception.steps.forEach((step, stepIndex) => {
          const exStepId = `${exId}_${stepIndex + 1}`;
          const exStepText = this.escapeText(step);
          flowchart += `    ${exStepId}[${exStepText}]\n`;
        });

        // プロセスステップから例外フローへの接続（点線）
        const fromStepId = `Step${Math.min(index + 1, processSteps.length)}`;
        flowchart += `    ${fromStepId} -.-> ${exId}\n`;

        // 例外フローの接続
        exception.steps.forEach((step, stepIndex) => {
          const exStepId = `${exId}_${stepIndex + 1}`;
          if (stepIndex === 0) {
            flowchart += `    ${exId} -->|例外発生| ${exStepId}\n`;
          } else {
            const prevStepId = `${exId}_${stepIndex}`;
            flowchart += `    ${prevStepId} --> ${exStepId}\n`;
          }
        });

        // 例外フローの終了（例外終了ノードへ）
        const lastExStepId = `${exId}_${exception.steps.length}`;
        flowchart += `    ${lastExStepId} --> ErrorEnd${index + 1}([例外終了])\n`;
      });
    }

    // スタイル定義（ユースケースと同じ色合い）
    flowchart += '\n    classDef startEnd fill:#e1f5e1,stroke:#4caf50,stroke-width:2px\n';
    flowchart += '    classDef normal fill:#e3f2fd,stroke:#2196f3,stroke-width:2px\n';
    flowchart += '    classDef alternative fill:#fff9c4,stroke:#fbc02d,stroke-width:2px\n';
    flowchart += '    classDef exception fill:#fff3e0,stroke:#ff9800,stroke-width:2px\n';
    flowchart += '    class Start,End startEnd\n';

    const stepIds = processSteps.map((_, i) => `Step${i + 1}`).join(',');
    if (stepIds) {
      flowchart += `    class ${stepIds} normal\n`;
    }

    const altStepIds = alternativeFlows.flatMap((alt, altIndex) =>
      alt.steps.map((_, stepIndex) => `Alt${altIndex + 1}_${stepIndex + 1}`)
    ).join(',');
    if (altStepIds) {
      flowchart += `    class ${altStepIds} alternative\n`;
    }

    const exStepIds = exceptionFlows.flatMap((ex, exIndex) =>
      ex.steps.map((_, stepIndex) => `Ex${exIndex + 1}_${stepIndex + 1}`)
    ).join(',');
    if (exStepIds) {
      flowchart += `    class ${exStepIds} exception\n`;
    }

    // 例外終了ノードのスタイル
    const errorEndIds = exceptionFlows.map((_, i) => `ErrorEnd${i + 1}`).join(',');
    if (errorEndIds) {
      flowchart += `    class ${errorEndIds} exception\n`;
    }

    console.log('[DiagramConverter] Generated flowchart length:', flowchart.length);
    return flowchart;
  }

  // ロバストネス図からMermaidダイアグラムを抽出
  static extractMermaidFromRobustness(markdown: string): string {
    console.log('[DiagramConverter] Extracting Mermaid from robustness diagram');
    console.log('[DiagramConverter] Markdown length:', markdown.length);

    // Mermaidコードブロックを抽出（より柔軟な正規表現）
    // ```mermaid の後に改行、その後任意の文字列、最後に ``` で終わる
    const mermaidBlockRegex = /```mermaid\s*\n([\s\S]*?)```/;
    const match = markdown.match(mermaidBlockRegex);

    if (match && match[1]) {
      console.log('[DiagramConverter] Found Mermaid code block, length:', match[1].length);
      return match[1].trim();
    }

    console.log('[DiagramConverter] No Mermaid code block found in robustness diagram');
    return '';
  }

  // ユースケース定義からMermaidダイアグラムを抽出または生成
  static extractMermaidFromUseCase(markdown: string): string {
    console.log('[DiagramConverter] Extracting or generating Mermaid from use case definition');
    console.log('[DiagramConverter] Markdown length:', markdown.length);

    // Mermaidコードブロックを抽出
    const mermaidBlockRegex = /```mermaid\s*\n([\s\S]*?)```/;
    const match = markdown.match(mermaidBlockRegex);

    if (match && match[1]) {
      console.log('[DiagramConverter] Found Mermaid code block, length:', match[1].length);
      return match[1].trim();
    }

    // Mermaidコードがない場合、基本フローと例外フローからフローチャートを生成
    console.log('[DiagramConverter] No Mermaid code found, generating flowchart from flows');
    return this.generateFlowchartFromUseCase(markdown);
  }

  // ユースケース定義から基本フロー・例外フローをパースしてMermaidフローチャートを生成
  static generateFlowchartFromUseCase(markdown: string): string {
    console.log('[DiagramConverter] Generating flowchart from use case flows');

    // 基本フローを抽出
    const basicFlowMatch = markdown.match(/##\s*基本フロー\s*\n([\s\S]*?)(?=\n##|$)/);
    const basicFlowText = basicFlowMatch ? basicFlowMatch[1] : '';

    // 例外フローを抽出
    const exceptionFlowMatch = markdown.match(/##\s*例外フロー\s*\n([\s\S]*?)(?=\n##|$)/);
    const exceptionFlowText = exceptionFlowMatch ? exceptionFlowMatch[1] : '';

    console.log('[DiagramConverter] Basic flow found:', basicFlowText.length > 0);
    console.log('[DiagramConverter] Exception flow found:', exceptionFlowText.length > 0);

    if (!basicFlowText && !exceptionFlowText) {
      console.log('[DiagramConverter] No flows found in use case definition');
      return '';
    }

    // 基本フローをパース
    const basicSteps = this.parseFlowSteps(basicFlowText);

    // 例外フローをパース
    const exceptionSteps = this.parseExceptionFlows(exceptionFlowText);

    // Mermaidフローチャートを生成
    let flowchart = 'flowchart TD\n';
    flowchart += '    Start([開始])\n';

    // 基本フローのステップを追加
    basicSteps.forEach((step, index) => {
      const nodeId = `Step${index + 1}`;
      const nextNodeId = index < basicSteps.length - 1 ? `Step${index + 2}` : 'End';
      const stepText = this.escapeText(`${step.step}. ${step.text}`);
      flowchart += `    ${nodeId}[${stepText}]\n`;

      if (index === 0) {
        flowchart += `    Start --> ${nodeId}\n`;
      }

      flowchart += `    ${nodeId} --> ${nextNodeId}\n`;
    });

    flowchart += '    End([完了])\n\n';

    // 例外フローを追加
    if (exceptionSteps.length > 0) {
      exceptionSteps.forEach((exception, index) => {
        const exId = `Ex${index + 1}`;
        const exText = this.escapeText(exception.condition);
        flowchart += `    ${exId}{${exText}}\n`;

        // 例外フローのステップを追加
        exception.steps.forEach((step, stepIndex) => {
          const exStepId = `${exId}_${stepIndex + 1}`;
          const exStepText = this.escapeText(step);
          flowchart += `    ${exStepId}[${exStepText}]\n`;

          if (stepIndex === 0) {
            flowchart += `    ${exId} -->|はい| ${exStepId}\n`;
          } else {
            const prevStepId = `${exId}_${stepIndex}`;
            flowchart += `    ${prevStepId} --> ${exStepId}\n`;
          }
        });

        // 例外フローの終了
        const lastStepId = `${exId}_${exception.steps.length}`;
        flowchart += `    ${lastStepId} --> End\n`;
        flowchart += `    ${exId} -->|いいえ| Step${Math.min(index + 2, basicSteps.length)}\n`;
      });
    }

    // スタイル定義
    flowchart += '\n    classDef startEnd fill:#e1f5e1,stroke:#4caf50,stroke-width:2px\n';
    flowchart += '    classDef normal fill:#e3f2fd,stroke:#2196f3,stroke-width:2px\n';
    flowchart += '    classDef exception fill:#fff3e0,stroke:#ff9800,stroke-width:2px\n';
    flowchart += '    class Start,End startEnd\n';

    const stepIds = basicSteps.map((_, i) => `Step${i + 1}`).join(',');
    if (stepIds) {
      flowchart += `    class ${stepIds} normal\n`;
    }

    const exIds = exceptionSteps.map((_, i) => `Ex${i + 1}`).join(',');
    if (exIds) {
      flowchart += `    class ${exIds} exception\n`;
    }

    console.log('[DiagramConverter] Generated flowchart length:', flowchart.length);
    return flowchart;
  }

  // フローステップをパース
  private static parseFlowSteps(flowText: string): Array<{ step: number; text: string }> {
    const steps: Array<{ step: number; text: string }> = [];

    // 番号付きリストを抽出（1. 2. 3. の形式）
    const stepRegex = /^\s*(\d+)\.\s+(.+)$/gm;
    let match;

    while ((match = stepRegex.exec(flowText)) !== null) {
      const stepNumber = parseInt(match[1]);
      const stepText = match[2].trim();
      steps.push({ step: stepNumber, text: stepText });
    }

    console.log('[DiagramConverter] Parsed basic flow steps:', steps.length);
    return steps;
  }

  // 代替フローをパース
  private static parseAlternativeFlows(alternativeText: string): Array<{
    condition: string;
    steps: string[]
  }> {
    const alternatives: Array<{ condition: string; steps: string[] }> = [];

    // 代替フローのセクションを抽出（###で始まるセクション）
    const alternativeSections = alternativeText.split(/###\s+/);

    alternativeSections.forEach(section => {
      if (!section.trim()) return;

      // 代替フロータイトル（条件）を抽出
      const titleMatch = section.match(/^(.+?)\n/);
      if (!titleMatch) return;

      const condition = titleMatch[1].trim().replace(/代替フロー\d+:\s*/, '');

      // 代替フローのステップを抽出
      const steps: string[] = [];
      // 番号付きリスト形式（- 2-1. 形式）に対応
      const stepRegex = /^\s*-\s+(\d+-\d+)\.\s+(.+)$/gm;
      let stepMatch;

      while ((stepMatch = stepRegex.exec(section)) !== null) {
        const stepText = stepMatch[2].trim();
        if (stepText && !stepText.startsWith('代替フロー')) {
          steps.push(stepText);
        }
      }

      if (steps.length > 0) {
        alternatives.push({ condition, steps });
      }
    });

    console.log('[DiagramConverter] Parsed alternative flows:', alternatives.length);
    console.log('[DiagramConverter] Alternative flows:', JSON.stringify(alternatives, null, 2));
    return alternatives;
  }

  // 例外フローをパース
  private static parseExceptionFlows(exceptionText: string): Array<{
    condition: string;
    steps: string[]
  }> {
    const exceptions: Array<{ condition: string; steps: string[] }> = [];

    // 例外フローのセクションを抽出（###で始まるセクション）
    const exceptionSections = exceptionText.split(/###\s+/);

    exceptionSections.forEach(section => {
      if (!section.trim()) return;

      // 例外タイトル（条件）を抽出
      const titleMatch = section.match(/^(.+?)\n/);
      if (!titleMatch) return;

      const condition = titleMatch[1].trim().replace(/例外\d+:\s*/, '');

      // 例外フローのステップを抽出
      const steps: string[] = [];
      // 単純なリスト形式（- で始まる行）に対応
      const stepRegex = /^\s*-\s+(.+)$/gm;
      let stepMatch;

      while ((stepMatch = stepRegex.exec(section)) !== null) {
        const stepText = stepMatch[1].trim();
        if (stepText && !stepText.startsWith('例外')) {
          steps.push(stepText);
        }
      }

      if (steps.length > 0) {
        exceptions.push({ condition, steps });
      }
    });

    console.log('[DiagramConverter] Parsed exception flows:', exceptions.length);
    console.log('[DiagramConverter] Exception flows:', JSON.stringify(exceptions, null, 2));
    return exceptions;
  }

  // テキストをMermaid用にエスケープ
  private static escapeText(text: string): string {
    // 空文字チェック
    if (!text || text.trim() === '') {
      return 'Empty';
    }

    // 文字数制限を70文字に拡大（より多くの情報を保持）
    let escaped = text.trim();
    const maxLength = 70;

    if (escaped.length > maxLength) {
      // より賢い切り詰め: 句読点や区切り文字で自然に分割
      let cutPoint = maxLength - 3; // "..."のためのスペース

      // 理想的な切り詰め点を探す（句読点、スペース、日本語の区切り）
      const breakPoints = [cutPoint, cutPoint - 5, cutPoint - 10];
      for (const point of breakPoints) {
        const char = escaped.charAt(point);
        if (char === '。' || char === '、' || char === ' ' || char === '）' || char === ')') {
          cutPoint = point + 1;
          break;
        }
      }

      // Unicode文字境界を考慮して安全に切り詰め
      escaped = escaped.substring(0, cutPoint);

      // 末尾が不完全な文字になる可能性をチェック
      const lastChar = escaped.charAt(escaped.length - 1);
      if (lastChar && lastChar.charCodeAt(0) >= 0xD800 && lastChar.charCodeAt(0) <= 0xDFFF) {
        escaped = escaped.substring(0, escaped.length - 1);
      }

      escaped += '...';
    }

    // 最小限のMermaid特殊文字のみエスケープ（可読性を重視）
    escaped = escaped
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/"/g, '&#34;')
      .replace(/\[/g, '&#91;')
      .replace(/\]/g, '&#93;')
      .trim();

    return escaped;
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
    let inAttributeSection = false;
    let currentAttributeName: string | null = null;
    let currentAttributeType: string | null = null;
    const processedEntities = new Set<string>();
    
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

            // 重複チェック
            if (!processedEntities.has(englishName)) {
              processedEntities.add(englishName);
              currentEntity = {
                name: englishName,  // 英語名をクラス名として使用
                stereotype: this.detectStereotype(englishName, currentSection),
                attributes: [],
                relationships: []
              };
              result.entities.push(currentEntity);
              inTable = false;
              inAttributeSection = false;
              console.log('Found entity:', englishName);
            } else {
              currentEntity = result.entities.find(e => e.name === englishName) || null;
              console.log('Found duplicate entity, using existing:', englishName);
            }
          } else {
            // フォールバック: #### エンティティ名 形式
            const simpleName = trimmed.replace(/^#{3,4}\s+/, '').trim();
            // DDDコンセプト用語を除外
            const excludedTerms = [
              'コアエンティティ', '集約ルート', 'ドメインイベント',
              '値オブジェクト', 'エンティティ', 'サービス',
              'リポジトリ', 'ファクトリ', '仕様', 'イベント',
              'Aggregate', 'Event', 'Service', 'Repository'
            ];
            const isExcluded = excludedTerms.some(term =>
              simpleName.toLowerCase().includes(term.toLowerCase()) ||
              simpleName === term
            );

            if (simpleName && !isExcluded) {
              const sanitizedName = this.sanitizeForMermaid(simpleName);
              if (!processedEntities.has(sanitizedName)) {
                processedEntities.add(sanitizedName);
                currentEntity = {
                  name: sanitizedName,
                  stereotype: this.detectStereotype(simpleName, currentSection),
                  attributes: [],
                  relationships: []
                };
                result.entities.push(currentEntity);
                inTable = false;
                inAttributeSection = false;
                console.log('Found entity (fallback):', simpleName);
              }
            }
          }
        } else if (currentEntity) {
          // 属性セクションの開始を検出
          if (trimmed === '属性:' || trimmed === '**属性:**') {
            inAttributeSection = true;
            inTable = false;
            console.log('Found attribute section for', currentEntity.name);
          }
          // テーブル開始の検出
          else if (trimmed.startsWith('|') && trimmed.includes('属性名')) {
            inTable = true;
            inAttributeSection = false;
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
                console.log(`Added table attribute to ${currentEntity.name}: ${attrName} (${attrType})`);
              }
            }
          }
          // リスト形式の属性パース
          else if (inAttributeSection && trimmed.startsWith('- ')) {
            // 形式: - ユーザーID [UserId] [USER_ID]
            const attrMatch = trimmed.match(/^-\s+(.+?)\s+\[([A-Za-z_]+)\]\s+\[([A-Z_]+)\]$/);
            if (attrMatch) {
              const japaneseName = attrMatch[1].trim();
              const englishName = attrMatch[2].trim();
              const systemName = attrMatch[3].trim();

              // 既に追加済みかチェック
              const exists = currentEntity.attributes.some(a => a.name === englishName);
              if (!exists) {
                currentEntity.attributes.push({
                  name: englishName,
                  type: 'String', // デフォルト型、後で型情報が見つかれば更新
                  required: true
                });
                console.log(`Added list attribute to ${currentEntity.name}: ${englishName}`);
                currentAttributeName = englishName;
              }
            }
          }
          // 属性の型情報（インデントされた行）
          else if (inAttributeSection && currentAttributeName && trimmed.startsWith('- 型:')) {
            const typeMatch = trimmed.match(/^-\s+型:\s+(.+?)\s+\[([A-Za-z_]+)\]/);
            if (typeMatch) {
              const japaneseType = typeMatch[1].trim();
              const englishType = typeMatch[2].trim();

              // 最後に追加した属性の型を更新
              const lastAttr = currentEntity.attributes[currentEntity.attributes.length - 1];
              if (lastAttr && lastAttr.name === currentAttributeName) {
                lastAttr.type = englishType;
                console.log(`Updated type for ${currentAttributeName}: ${englishType}`);
              }
            }
          }
          // その他のセクション開始で属性セクション終了
          else if (trimmed.startsWith('**') || trimmed.startsWith('###') || trimmed.startsWith('####')) {
            if (trimmed.startsWith('#### 集約ルート')) {
              currentEntity.isAggregate = true;
            }
            inAttributeSection = false;
            inTable = false;
            currentAttributeName = null;
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
        if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
          // 新しい集約定義の開始
          // Format 1: ### プロジェクト集約 [ProjectAggregate] [PROJECT_AGGREGATE]
          // Format 2: #### KnowledgeAggregate
          const nameMatch = trimmed.match(/^#{3,4}\s+(.+?)\s*\[(.+?)\]\s*\[(.+?)\]$/);
          if (nameMatch) {
            const japaneseName = nameMatch[1].trim();
            const englishName = nameMatch[2].trim();
            const systemName = nameMatch[3].trim();
            currentAggregate = { name: englishName, root: '', entities: [] };
            result.aggregates.push(currentAggregate);
            console.log('Found aggregate (bracketed format):', englishName);
          } else {
            // Simple format: #### KnowledgeAggregate
            const headerLevel = trimmed.startsWith('#### ') ? 4 : 3;
            const name = trimmed.substring(headerLevel + 1).trim();

            // Check if this is actually an aggregate (not just any #### header)
            if (name.toLowerCase().includes('aggregate') || name.endsWith('集約')) {
              currentAggregate = { name: this.sanitizeForMermaid(name), root: '', entities: [] };
              result.aggregates.push(currentAggregate);
              console.log('Found aggregate (simple format):', name);
            }
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
                     trimmed.startsWith('**包含エンティティ**') ||
                     trimmed.includes('境界') ||
                     trimmed.startsWith('**境界**')) {
            // Handle inline boundary definition: **境界**: Knowledge, Document, KnowledgeRating
            const boundaryMatch = trimmed.match(/[:：]\s*(.+)/);
            if (boundaryMatch) {
              const entitiesList = boundaryMatch[1].trim();
              if (entitiesList && currentAggregate) {
                // Split by comma and clean up entity names
                const entities = entitiesList.split(',').map(e => e.trim()).filter(e => e);
                entities.forEach(entity => {
                  currentAggregate.entities.push(entity);
                  console.log('Added boundary entity (inline):', entity);
                });
              }
            }
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
    console.log('=== Relationship Detection ===');
    result.entities.forEach(entity => {
      console.log(`Checking relationships for entity: ${entity.name}`);
      console.log(`  Entity attributes:`, entity.attributes.map(a => `${a.name}: ${a.type}`));

      entity.attributes.forEach(attr => {
        console.log(`  Processing attribute: ${attr.name} (type: ${attr.type})`);

        // 1. 外部キー的な属性から関係を推測（xxxId形式）
        if (attr.name.endsWith('Id') && attr.name !== 'id') {
          let targetName = attr.name.substring(0, attr.name.length - 2);
          console.log(`    Found foreign key pattern: ${attr.name} -> target: ${targetName}`);

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
            console.log(`    Mapped to: ${targetName}`);
          }

          const targetEntity = result.entities.find(e =>
            e.name.toLowerCase() === targetName.toLowerCase() ||
            this.fuzzyNameMatch(e.name, targetName)
          );

          if (targetEntity && targetEntity.name !== entity.name) {
            const exists = entity.relationships?.some(r =>
              r.target === targetEntity.name && r.type === 'many-to-one'
            );

            if (!exists) {
              entity.relationships?.push({
                target: targetEntity.name,
                type: 'many-to-one'
              });
              console.log(`    ✓ Added FK relationship: ${entity.name} -> ${targetEntity.name}`);
            } else {
              console.log(`    - Relationship already exists: ${entity.name} -> ${targetEntity.name}`);
            }
          } else {
            console.log(`    ✗ Target entity not found: ${targetName}`);
          }
        }

        // 2. パラソルドメイン言語の特殊な参照形式を処理
        // 例: "組織リファレンス [OrganizationRef] [ORGANIZATION_REF]"
        if (attr.name.includes('リファレンス') || attr.name.includes('Ref')) {
          const refMatch = attr.name.match(/^([^リ\[]+)/);
          if (refMatch) {
            const targetName = refMatch[1].trim();
            console.log(`    Found reference pattern: ${attr.name} -> target: ${targetName}`);

            const targetEntity = result.entities.find(e =>
              this.fuzzyNameMatch(e.name, targetName) ||
              e.name.includes(targetName) ||
              targetName.includes(e.name.split('_')[0])
            );

            if (targetEntity && targetEntity.name !== entity.name) {
              const exists = entity.relationships?.some(r =>
                r.target === targetEntity.name && r.type === 'many-to-one'
              );

              if (!exists) {
                entity.relationships?.push({
                  target: targetEntity.name,
                  type: 'many-to-one'
                });
                console.log(`    ✓ Added reference relationship: ${entity.name} -> ${targetEntity.name}`);
              }
            } else {
              console.log(`    ✗ Reference target not found: ${targetName}`);
            }
          }
        }

        // 3. Value Object型の属性から関係を検出
        const valueObject = result.valueObjects.find(vo =>
          vo.name.toLowerCase() === attr.type.toLowerCase() ||
          vo.name === attr.type ||
          this.fuzzyNameMatch(vo.name, attr.type) ||
          attr.type.includes(vo.name)
        );

        if (valueObject) {
          const exists = entity.relationships?.some(r =>
            r.target === valueObject.name && r.type === 'value-object'
          );

          if (!exists) {
            entity.relationships?.push({
              target: valueObject.name,
              type: 'value-object' as any
            });
            console.log(`    ✓ Added value object relationship: ${entity.name} -> ${valueObject.name}`);
          }
        }

        // 4. 型に他のエンティティ名が含まれている場合（日本語/英語名での参照）
        const typeEntity = result.entities.find(e =>
          attr.type.includes(e.name) ||
          this.fuzzyNameMatch(attr.type, e.name) ||
          // 日本語名でのマッチングも試行
          (attr.type.includes('組織') && e.name.includes('Organization')) ||
          (attr.type.includes('ユーザー') && e.name.includes('User')) ||
          (attr.type.includes('ロール') && e.name.includes('Role'))
        );

        if (typeEntity && typeEntity.name !== entity.name) {
          const exists = entity.relationships?.some(r =>
            r.target === typeEntity.name
          );

          if (!exists) {
            entity.relationships?.push({
              target: typeEntity.name,
              type: 'many-to-one'
            });
            console.log(`    ✓ Added type-based relationship: ${entity.name} -> ${typeEntity.name}`);
          }
        }
      });

      console.log(`  Final relationships for ${entity.name}:`, entity.relationships?.length || 0);
    });

    // 基本的なドメインモデルの関係を追加（明示的に定義されていない場合）
    console.log('=== Adding Basic Domain Relationships ===');

    // よく知られたエンティティ間の関係を自動追加
    const addBasicRelationship = (fromPattern: string, toPattern: string, type: 'one-to-many' | 'many-to-one' = 'many-to-one') => {
      const fromEntity = result.entities.find(e =>
        e.name.toLowerCase().includes(fromPattern.toLowerCase()) ||
        this.fuzzyNameMatch(e.name, fromPattern)
      );
      const toEntity = result.entities.find(e =>
        e.name.toLowerCase().includes(toPattern.toLowerCase()) ||
        this.fuzzyNameMatch(e.name, toPattern)
      );

      if (fromEntity && toEntity && fromEntity !== toEntity) {
        const exists = fromEntity.relationships?.some(r => r.target === toEntity.name);
        if (!exists) {
          fromEntity.relationships?.push({
            target: toEntity.name,
            type: type
          });
          console.log(`  ✓ Added basic relationship: ${fromEntity.name} -> ${toEntity.name} (${type})`);
        }
      }
    };

    // 典型的なドメインモデルの関係を追加
    addBasicRelationship('User', 'Organization', 'many-to-one');
    addBasicRelationship('User', 'Role', 'many-to-many');
    addBasicRelationship('Organization', 'User', 'one-to-many');
    addBasicRelationship('Role', 'User', 'many-to-many');

    // 集約関係の強化
    result.aggregates.forEach(agg => {
      console.log(`Processing aggregate relationships for: ${agg.name} (root: ${agg.root})`);

      const rootEntity = result.entities.find(e =>
        this.fuzzyNameMatch(e.name, agg.root) ||
        e.name.includes(agg.root) ||
        agg.root.includes(e.name.split('_')[0])
      );

      if (rootEntity) {
        // 集約内の他のエンティティとの関係を追加
        agg.entities.forEach(entityName => {
          const childEntity = result.entities.find(e =>
            this.fuzzyNameMatch(e.name, entityName) ||
            e.name.includes(entityName) ||
            entityName.includes(e.name.split('_')[0])
          );

          if (childEntity && childEntity !== rootEntity) {
            const exists = rootEntity.relationships?.some(r => r.target === childEntity.name);
            if (!exists) {
              rootEntity.relationships?.push({
                target: childEntity.name,
                type: 'one-to-many'
              });
              console.log(`  ✓ Added aggregate relationship: ${rootEntity.name} -> ${childEntity.name}`);
            }
          }
        });
      }
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

  private static parseDBSchema(markdown: string): { tables: Table[]; relationships: Relationship[]; hasMermaidERDiagram: boolean; mermaidContent: string } {
    const tables: Table[] = [];
    const relationships: Relationship[] = [];
    const lines = markdown.split('\n');
    let currentTable: Table | null = null;
    let inCodeBlock = false;
    let inPhysicalDesignSection = false;
    let inMermaidERDiagram = false;
    let inMermaidTableDefinition = false;
    let hasMermaidERDiagram = false;
    let mermaidContent = '';
    let mermaidLines: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();

      // コードブロック（```）の開始/終了を検出
      if (trimmed.startsWith('```')) {
        // erDiagramブロックの開始を検出
        if (!inCodeBlock && (trimmed.includes('mermaid') || trimmed.includes('erDiagram'))) {
          inMermaidERDiagram = true;
          hasMermaidERDiagram = true;
          mermaidLines = [];
          console.log('[DEBUG] Entered Mermaid ER diagram block');
        } else if (inCodeBlock && inMermaidERDiagram) {
          // Mermaid ERダイアグラムブロックの終了
          inMermaidERDiagram = false;
          inMermaidTableDefinition = false;
          currentTable = null;
          mermaidContent = mermaidLines.join('\n');
          console.log('[DEBUG] Exited Mermaid ER diagram block');
          console.log('[DEBUG] Captured Mermaid content:', mermaidContent);
        }
        inCodeBlock = !inCodeBlock;
        return;
      }

      // Mermaid ERダイアグラム内の処理
      if (inMermaidERDiagram && inCodeBlock) {
        // Mermaidコンテンツを保存
        mermaidLines.push(trimmed);
        // テーブル定義の開始検出: "EntityName {"
        const tableStartMatch = trimmed.match(/^(\w+)\s*\{$/);
        if (tableStartMatch) {
          const tableName = tableStartMatch[1];
          console.log(`[DEBUG] Mermaid table definition started: ${tableName}`);
          currentTable = { name: tableName, columns: [] };
          tables.push(currentTable);
          inMermaidTableDefinition = true;
          return;
        }

        // テーブル定義の終了検出: "}"
        if (trimmed === '}' && inMermaidTableDefinition) {
          console.log(`[DEBUG] Mermaid table definition ended: ${currentTable?.name}`);
          inMermaidTableDefinition = false;
          currentTable = null;
          return;
        }

        // テーブル定義内のカラム解析
        if (inMermaidTableDefinition && currentTable) {
          // カラム定義のパターン: "型 カラム名 PK/UK/FK"
          const columnMatch = trimmed.match(/^(\w+)\s+(\w+)(?:\s+(PK|UK|FK))?$/);
          if (columnMatch) {
            const [, type, columnName, constraint] = columnMatch;
            const column: any = {
              name: columnName,
              type: type,
            };

            // 制約の判定
            if (constraint === 'PK') {
              column.primaryKey = true;
              console.log(`[DEBUG] Column ${columnName} is PRIMARY KEY`);
            } else if (constraint === 'UK') {
              column.unique = true;
              console.log(`[DEBUG] Column ${columnName} is UNIQUE`);
            } else if (constraint === 'FK') {
              column.foreignKey = { table: '', column: '' }; // 詳細はリレーション行から解析
              console.log(`[DEBUG] Column ${columnName} is FOREIGN KEY`);
            }

            currentTable.columns.push(column);
            return;
          }
        }

        // リレーションの解析
        // workspaces ||--o{ channels : "contains" のような形式を検出
        const relMatch = trimmed.match(/^(\w+)\s+([\|\}o\-\{]+)\s+(\w+)\s*:\s*"([^"]+)"/);
        if (relMatch) {
          const [, fromTable, cardinality, toTable, label] = relMatch;
          console.log(`[DEBUG] Mermaid relationship found: ${fromTable} ${cardinality} ${toTable} : "${label}"`);
          relationships.push({
            from: toTable,  // 子テーブル
            to: fromTable,   // 親テーブル
            fromColumn: '',  // Mermaidには列情報がない
            toColumn: '',
            cardinality: cardinality,
            label: label  // ラベルを保存
          });
        }
        return;
      }

      // コードブロック内の行はスキップ（Mermaid以外）
      if (inCodeBlock) {
        return;
      }

      // 物理設計セクションの開始を検出
      if (trimmed.startsWith('## ') && (trimmed.includes('物理設計') || trimmed.toLowerCase().includes('physical design'))) {
        inPhysicalDesignSection = true;
        return;
      }

      // 物理設計セクション終了を検出（次の## セクション）
      if (inPhysicalDesignSection && trimmed.startsWith('## ') &&
          !trimmed.includes('物理設計') && !trimmed.toLowerCase().includes('physical design')) {
        inPhysicalDesignSection = false;
        currentTable = null;
        return;
      }

      // 物理設計セクション内でのみテーブルを解析
      if (!inPhysicalDesignSection) {
        return;
      }

      // テーブル名の検出（### または #### で始まる見出し）
      if ((trimmed.startsWith('### ') || trimmed.startsWith('#### ')) &&
          (trimmed.includes('テーブル') || trimmed.toLowerCase().includes('table'))) {
        let name = trimmed.replace(/^#{3,4}\s+/, '').replace(/テーブル.*$/, '').trim();
        // 番号プレフィックス（"1. ", "2. " など）を削除
        name = name.replace(/^\d+\.\s*/, '');
        // SQL関連のキーワードを含む行を除外
        if (!name.includes('作成SQL') && !name.includes('CREATE') && name.length > 0) {
          currentTable = { name, columns: [] };
          tables.push(currentTable);
        }
      }

      // カラムの検出（マークダウン表形式のみ）
      if (currentTable && trimmed.includes('|') && !trimmed.startsWith('|--')) {
        const parts = trimmed.split('|').map(p => p.trim()).filter(p => p);
        // ヘッダー行をスキップ
        if (parts.length >= 2 && parts[0] !== 'カラム名' && parts[0] !== 'カラム' && parts[0] !== '属性名' && parts[0] !== 'データ種別') {
          const column: any = {
            name: parts[0],
            type: parts[1],
          };

          // PRIMARY KEY判定
          if (parts[2]?.includes('PK') || parts[3]?.includes('PK')) {
            column.primaryKey = true;
          }

          // FOREIGN KEY判定
          if (parts[2]?.includes('FK') || parts[3]?.includes('FK')) {
            // FK情報の解析（簡易版）
            const fkText = parts.find(p => p.includes('FK'));
            if (fkText) {
              const fkMatch = fkText.match(/FK\s*\((.*?)\)/);
              if (fkMatch) {
                const [table, col] = fkMatch[1].split('.');
                column.foreignKey = { table: table?.trim(), column: col?.trim() };
              }
            }
          }

          currentTable.columns.push(column);
        }
      }
    });

    // FK情報からリレーションを生成
    tables.forEach(table => {
      table.columns.forEach(col => {
        if (col.foreignKey) {
          console.log(`[DEBUG] FK found in ${table.name}.${col.name} -> ${col.foreignKey.table}.${col.foreignKey.column}`);
          relationships.push({
            from: table.name,
            to: col.foreignKey.table,
            fromColumn: col.name,
            toColumn: col.foreignKey.column,
            cardinality: '||--o{' // デフォルトは1:N
          });
        }
      });
    });

    console.log(`[DEBUG] Total relationships generated: ${relationships.length}`);
    if (relationships.length > 0) {
      console.log('[DEBUG] Relationships:', relationships);
    }

    return { tables, relationships, hasMermaidERDiagram, mermaidContent };
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