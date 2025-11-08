/**
 * アグリゲート分析ツール
 * 
 * エンティティ間のリレーションシップを分析し、DDDの集約（Aggregate）を自動的に識別する
 */

interface EntityDefinition {
  name: string;
  displayName: string;
  systemName: string;
  attributes: Array<{
    name: string;
    displayName: string;
    systemName: string;
    type: string;
    required: boolean;
  }>;
  businessRules: string[];
  states?: string[];
}

interface AggregateDefinition {
  name: string;
  displayName: string;
  systemName: string;
  rootEntity: string;
  entities: string[];
  businessRules: string[];
}

interface RelationshipInfo {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  isCascading?: boolean; // ライフサイクル依存
  isComposition?: boolean; // 強い所有関係
}

/**
 * エンティティ間のリレーションシップを分析
 */
export function analyzeRelationships(entities: EntityDefinition[]): RelationshipInfo[] {
  const relationships: RelationshipInfo[] = []
  
  entities.forEach(entity => {
    entity.attributes.forEach(attr => {
      // 外部キー（xxxId形式）を検出
      if (attr.name.endsWith('Id') && attr.name !== 'id') {
        const targetName = attr.name.substring(0, attr.name.length - 2)
        
        // 対象エンティティを検索（英語名で照合）
        const targetEntity = entities.find(e => 
          e.name.toLowerCase() === targetName.toLowerCase()
        )
        
        if (targetEntity) {
          // 強い所有関係の判定
          // 例: projectId → プロジェクトに強く依存
          const isComposition = isStrongOwnership(entity.name, targetEntity.name, attr.name)
          
          relationships.push({
            from: entity.name,
            to: targetEntity.name,
            type: 'many-to-one',
            isCascading: isComposition,
            isComposition
          })
        }
      }
    })
  })
  
  return relationships
}

/**
 * 強い所有関係（composition）を判定
 */
function isStrongOwnership(childEntity: string, parentEntity: string, _foreignKey: string): boolean {
  // 命名規則から所有関係を推測
  const strongOwnershipPatterns = [
    // 親エンティティ名が子エンティティ名の一部に含まれる
    childEntity.toLowerCase().includes(parentEntity.toLowerCase()),
    // 特定のパターン（Task → Project, Milestone → Project等）
    isKnownCompositionPattern(childEntity, parentEntity)
  ]
  
  return strongOwnershipPatterns.some(pattern => pattern)
}

/**
 * 既知のcompositionパターンを判定
 */
function isKnownCompositionPattern(child: string, parent: string): boolean {
  const compositionPatterns: Record<string, string[]> = {
    'Project': ['Task', 'Milestone', 'Risk', 'Issue', 'Deliverable'],
    'User': ['Session', 'AuditLog'],
    'Organization': ['User'],
    'Order': ['OrderItem', 'Payment'],
    'Invoice': ['InvoiceItem'],
    'Team': ['TeamMember']
  }
  
  const childPatterns = compositionPatterns[parent]
  return childPatterns ? childPatterns.includes(child) : false
}

/**
 * エンティティからアグリゲートを分析
 */
export function analyzeAggregates(entities: EntityDefinition[]): AggregateDefinition[] {
  const relationships = analyzeRelationships(entities)
  const aggregates: AggregateDefinition[] = []
  const processedEntities = new Set<string>()
  
  // ルートエンティティ候補を特定（他のエンティティから参照されないエンティティ）
  const referencedEntities = new Set(relationships.map(r => r.from))
  const rootCandidates = entities.filter(e => !referencedEntities.has(e.name))
  
  // 各ルート候補からアグリゲートを構築
  rootCandidates.forEach(rootEntity => {
    if (processedEntities.has(rootEntity.name)) return
    
    // このルートに強く依存するエンティティを収集
    const aggregateEntities = collectAggregateEntities(
      rootEntity.name,
      entities,
      relationships,
      processedEntities
    )
    
    if (aggregateEntities.length > 0) {
      aggregates.push({
        name: `${rootEntity.name}Aggregate`,
        displayName: `${rootEntity.displayName}集約`,
        systemName: `${rootEntity.systemName}_AGGREGATE`,
        rootEntity: rootEntity.name,
        entities: aggregateEntities,
        businessRules: generateAggregateRules(rootEntity.name, aggregateEntities)
      })
      
      // 処理済みとしてマーク
      processedEntities.add(rootEntity.name)
      aggregateEntities.forEach(e => processedEntities.add(e))
    }
  })
  
  return aggregates
}

/**
 * アグリゲートに含まれるエンティティを収集
 */
function collectAggregateEntities(
  rootEntity: string,
  allEntities: EntityDefinition[],
  relationships: RelationshipInfo[],
  processedEntities: Set<string>
): string[] {
  const aggregateEntities: string[] = []
  const visited = new Set<string>()
  
  function traverse(entityName: string) {
    if (visited.has(entityName) || processedEntities.has(entityName)) return
    visited.add(entityName)
    
    // このエンティティからの強い所有関係を探す
    relationships
      .filter(r => r.from === entityName && r.isComposition)
      .forEach(rel => {
        aggregateEntities.push(rel.from)
        traverse(rel.from)
      })
    
    // このエンティティを参照する強い所有関係を探す
    relationships
      .filter(r => r.to === entityName && r.isComposition)
      .forEach(rel => {
        aggregateEntities.push(rel.from)
        traverse(rel.from)
      })
  }
  
  traverse(rootEntity)
  
  return [...new Set(aggregateEntities)]
}

/**
 * アグリゲートのビジネスルールを生成
 */
function generateAggregateRules(rootEntity: string, entities: string[]): string[] {
  const rules: string[] = []
  
  // 基本ルール
  rules.push(`${rootEntity}は集約ルートとして、集約全体の整合性を保証する`)
  
  if (entities.length > 0) {
    rules.push(`${entities.join('、')}は${rootEntity}を通じてのみアクセス可能`)
    rules.push(`${rootEntity}の削除時は、関連する${entities.join('、')}も連動して削除される`)
  }
  
  rules.push(`トランザクション境界は集約単位で設定される`)
  rules.push(`集約外部からは集約ルートのみを参照する`)
  
  return rules
}

/**
 * アグリゲート定義をMarkdown形式で生成
 */
export function generateAggregateMarkdown(aggregates: AggregateDefinition[]): string {
  if (aggregates.length === 0) {
    return ''
  }
  
  let markdown = '\n## 集約（Aggregates）\n\n'
  
  aggregates.forEach(aggregate => {
    markdown += `### ${aggregate.displayName} [${aggregate.name}] [${aggregate.systemName}]\n\n`
    markdown += `#### 集約ルート\n`
    markdown += `- ${aggregate.rootEntity}\n\n`
    
    if (aggregate.entities.length > 0) {
      markdown += `#### 含まれるエンティティ\n`
      aggregate.entities.forEach(entity => {
        markdown += `- ${entity}\n`
      })
      markdown += '\n'
    }
    
    markdown += `#### ビジネスルール\n`
    aggregate.businessRules.forEach(rule => {
      markdown += `- ${rule}\n`
    })
    markdown += '\n'
  })
  
  return markdown
}

/**
 * エンティティリストからアグリゲート定義を含む完全なMarkdownを生成
 */
export function generateDomainLanguageWithAggregates(
  serviceName: string,
  entities: EntityDefinition[],
  existingMarkdown: string
): string {
  // アグリゲートを分析
  const aggregates = analyzeAggregates(entities)
  
  // 既存のMarkdownに集約セクションが含まれているか確認
  const hasAggregateSection = existingMarkdown.includes('## 集約')
  
  if (hasAggregateSection) {
    // 既存の集約セクションを置換
    const aggregateMarkdown = generateAggregateMarkdown(aggregates)
    return existingMarkdown.replace(
      /## 集約（Aggregates）[\s\S]*?(?=##|$)/,
      aggregateMarkdown
    )
  } else {
    // 集約セクションを追加（値オブジェクトの前に挿入）
    const aggregateMarkdown = generateAggregateMarkdown(aggregates)
    
    if (existingMarkdown.includes('## 値オブジェクト')) {
      return existingMarkdown.replace(
        '## 値オブジェクト',
        `${aggregateMarkdown}## 値オブジェクト`
      )
    } else if (existingMarkdown.includes('## ドメインサービス')) {
      return existingMarkdown.replace(
        '## ドメインサービス',
        `${aggregateMarkdown}## ドメインサービス`
      )
    } else {
      // 末尾に追加
      return existingMarkdown + aggregateMarkdown
    }
  }
}