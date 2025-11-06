/**
 * パラソルドメイン言語パーサー
 * MD形式のドメイン言語定義からJSON構造を抽出
 */

export interface ParsedProperty {
  name: string
  type: string
  required: boolean
  description: string
}

export interface ParsedEntity {
  name: string
  displayName: string
  description: string
  identifiedBy: string
  lifecycle: string
  aggregateRoot: boolean
  aggregateName?: string
  stereotype: string[]
  properties: ParsedProperty[]
  businessRules?: string[]
}

export interface ParsedValueObject {
  name: string
  displayName: string
  description: string
  properties: ParsedProperty[]
  constraints?: string[]
}

export interface ParsedAggregate {
  name: string
  aggregateRoot: string
  includedEntities: string[]
  invariants: string[]
}

export interface ParsedDomainService {
  name: string
  description: string
  methods: {
    name: string
    parameters: string
    returnType: string
    description: string
  }[]
}

export interface ParsedDomainEvent {
  name: string
  description: string
  occurredWhen: string
  payload: Record<string, any>
}

export interface ParsedBusinessRule {
  category: string
  rules: string[]
}

export interface ParsedDomainLanguage {
  version: string
  overview: string
  entities: ParsedEntity[]
  valueObjects: ParsedValueObject[]
  aggregates: ParsedAggregate[]
  domainServices: ParsedDomainService[]
  domainEvents: ParsedDomainEvent[]
  businessRules: ParsedBusinessRule[]
}

/**
 * MD形式のドメイン言語定義をパース
 */
export function parseDomainLanguage(content: string): ParsedDomainLanguage {
  const lines = content.split('\n')

  // バージョンを抽出
  const version = extractVersion(lines)

  // パラソルドメイン概要を抽出
  const overview = extractOverview(content)

  // エンティティを抽出
  const entities = extractEntities(content)

  // 値オブジェクトを抽出
  const valueObjects = extractValueObjects(content)

  // 集約を抽出
  const aggregates = extractAggregates(content)

  // ドメインサービスを抽出
  const domainServices = extractDomainServices(content)

  // ドメインイベントを抽出
  const domainEvents = extractDomainEvents(content)

  // ビジネスルールを抽出
  const businessRules = extractBusinessRules(content)

  return {
    version,
    overview,
    entities,
    valueObjects,
    aggregates,
    domainServices,
    domainEvents,
    businessRules,
  }
}

/**
 * バージョンを抽出
 */
function extractVersion(lines: string[]): string {
  for (const line of lines) {
    const match = line.match(/\*\*バージョン\*\*:\s*(.+)/)
    if (match) {
      return match[1].trim()
    }
  }
  return 'v1.0.0'
}

/**
 * パラソルドメイン概要を抽出
 */
function extractOverview(content: string): string {
  const match = content.match(/##\s+パラソルドメイン概要\s*\n([\s\S]*?)(?=\n##|###)/m)
  if (match) {
    return match[1].trim()
  }
  return ''
}

/**
 * エンティティを抽出
 */
function extractEntities(content: string): ParsedEntity[] {
  const entities: ParsedEntity[] = []

  // エンティティ定義セクションを探す
  const entityPattern = /####\s+(.+?)（(.+?)）<<(.+?)>>\s*\n([\s\S]*?)(?=####|###\s+値オブジェクト定義|##\s+[^\s]|$)/g
  let match

  while ((match = entityPattern.exec(content)) !== null) {
    const name = match[1].trim()
    const displayName = match[2].trim()
    const stereotypeText = match[3].trim()
    const sectionContent = match[4]

    // ステレオタイプを分解
    const stereotype = stereotypeText.split(',').map(s => s.trim())
    const aggregateRoot = stereotype.includes('aggregate root')

    // 概要を抽出
    const descriptionMatch = sectionContent.match(/\*\*概要\*\*:\s*(.+)/)
    const description = descriptionMatch ? descriptionMatch[1].trim() : ''

    // 識別性を抽出
    const identifiedByMatch = sectionContent.match(/\*\*識別性\*\*:\s*(.+)/)
    const identifiedBy = identifiedByMatch ? identifiedByMatch[1].trim() : ''

    // ライフサイクルを抽出
    const lifecycleMatch = sectionContent.match(/\*\*ライフサイクル\*\*:\s*(.+)/)
    const lifecycle = lifecycleMatch ? lifecycleMatch[1].trim() : ''

    // 集約所属を抽出
    const aggregateMatch = sectionContent.match(/\*\*集約所属\*\*:\s*(.+?)(?:\(|（)/)
    const aggregateName = aggregateMatch ? aggregateMatch[1].trim() : undefined

    // プロパティを抽出
    const properties = extractProperties(sectionContent)

    // ビジネスルールを抽出（エンティティレベル）
    const businessRulesMatch = sectionContent.match(/\*\*ビジネスルール\*\*:\s*\n([\s\S]*?)(?=\n####|###|##|$)/m)
    const businessRules: string[] = []
    if (businessRulesMatch) {
      const rulesText = businessRulesMatch[1]
      const ruleLines = rulesText.split('\n').filter(line => line.trim().startsWith('-'))
      businessRules.push(...ruleLines.map(line => line.replace(/^-\s*/, '').trim()))
    }

    entities.push({
      name,
      displayName,
      description,
      identifiedBy,
      lifecycle,
      aggregateRoot,
      aggregateName,
      stereotype,
      properties,
      businessRules: businessRules.length > 0 ? businessRules : undefined,
    })
  }

  return entities
}

/**
 * プロパティを抽出（エンティティ・値オブジェクト共通）
 */
function extractProperties(sectionContent: string): ParsedProperty[] {
  const properties: ParsedProperty[] = []

  // プロパティテーブルを探す
  const tableMatch = sectionContent.match(/\|\s*属性名\s*\|([\s\S]*?)(?=\n\n|\*\*ビジネスルール|\*\*制約)/m)
  if (!tableMatch) return properties

  const tableContent = tableMatch[1]
  const rows = tableContent.split('\n').filter(line => line.trim() && !line.includes('---'))

  for (const row of rows) {
    const cells = row.split('|').map(cell => cell.trim()).filter(Boolean)
    if (cells.length >= 4) {
      properties.push({
        name: cells[0],
        type: cells[1],
        required: cells[2].includes('○'),
        description: cells[3],
      })
    }
  }

  return properties
}

/**
 * 値オブジェクトを抽出
 */
function extractValueObjects(content: string): ParsedValueObject[] {
  const valueObjects: ParsedValueObject[] = []

  // 値オブジェクト定義セクションを探す
  const voPattern = /####\s+(.+?)（(.+?)）\s*\n([\s\S]*?)(?=####|###\s+集約定義|##\s+[^\s]|$)/g
  const voSectionMatch = content.match(/###\s+値オブジェクト定義([\s\S]*?)(?=###\s+集約定義|##\s+[^\s]|$)/m)

  if (!voSectionMatch) return valueObjects

  const voSectionContent = voSectionMatch[1]
  let match

  const pattern = /####\s+(.+?)（(.+?)）\s*\n([\s\S]*?)(?=####|###|##|$)/g
  while ((match = pattern.exec(voSectionContent)) !== null) {
    const name = match[1].trim()
    const displayName = match[2].trim()
    const sectionContent = match[3]

    // 概要を抽出
    const descriptionMatch = sectionContent.match(/\*\*概要\*\*:\s*(.+)/)
    const description = descriptionMatch ? descriptionMatch[1].trim() : ''

    // プロパティを抽出
    const properties = extractProperties(sectionContent)

    // 制約を抽出
    const constraintsMatch = sectionContent.match(/\*\*制約\*\*:\s*\n([\s\S]*?)(?=\n####|###|##|$)/m)
    const constraints: string[] = []
    if (constraintsMatch) {
      const constraintsText = constraintsMatch[1]
      const constraintLines = constraintsText.split('\n').filter(line => line.trim().startsWith('-'))
      constraints.push(...constraintLines.map(line => line.replace(/^-\s*/, '').trim()))
    }

    valueObjects.push({
      name,
      displayName,
      description,
      properties,
      constraints: constraints.length > 0 ? constraints : undefined,
    })
  }

  return valueObjects
}

/**
 * 集約を抽出
 */
function extractAggregates(content: string): ParsedAggregate[] {
  const aggregates: ParsedAggregate[] = []

  // 集約定義セクションを探す
  const aggregatePattern = /####\s+(.+?)（(.+?)）\s*\n([\s\S]*?)(?=####|###|##|$)/g
  const aggregateSectionMatch = content.match(/###\s+集約定義([\s\S]*?)(?=###\s+ドメインサービス|##\s+[^\s]|$)/m)

  if (!aggregateSectionMatch) return aggregates

  const aggregateSectionContent = aggregateSectionMatch[1]
  let match

  while ((match = aggregatePattern.exec(aggregateSectionContent)) !== null) {
    const name = match[1].trim()
    const sectionContent = match[3]

    // 集約ルートを抽出
    const rootMatch = sectionContent.match(/\*\*集約ルート\*\*:\s*(.+)/)
    const aggregateRoot = rootMatch ? rootMatch[1].trim() : ''

    // 境界（含まれるエンティティ）を抽出
    const boundaryMatch = sectionContent.match(/\*\*境界\*\*:\s*(.+)/)
    const includedEntities: string[] = []
    if (boundaryMatch) {
      const entitiesText = boundaryMatch[1]
      includedEntities.push(...entitiesText.split(/[、,]/).map(e => e.trim()))
    }

    // 不変条件を抽出
    const invariantsMatch = sectionContent.match(/\*\*不変条件\*\*:\s*\n([\s\S]*?)(?=\n####|###|##|$)/m)
    const invariants: string[] = []
    if (invariantsMatch) {
      const invariantsText = invariantsMatch[1]
      const invariantLines = invariantsText.split('\n').filter(line => line.trim().startsWith('-'))
      invariants.push(...invariantLines.map(line => line.replace(/^-\s*/, '').trim()))
    }

    aggregates.push({
      name,
      aggregateRoot,
      includedEntities,
      invariants,
    })
  }

  return aggregates
}

/**
 * ドメインサービスを抽出
 */
function extractDomainServices(content: string): ParsedDomainService[] {
  const domainServices: ParsedDomainService[] = []

  // ドメインサービスセクションを探す
  const servicePattern = /####\s+(.+?)\s*\n([\s\S]*?)(?=####|###|##|$)/g
  const serviceSectionMatch = content.match(/###\s+ドメインサービス([\s\S]*?)(?=###\s+ドメインイベント|##\s+[^\s]|$)/m)

  if (!serviceSectionMatch) return domainServices

  const serviceSectionContent = serviceSectionMatch[1]
  let match

  while ((match = servicePattern.exec(serviceSectionContent)) !== null) {
    const name = match[1].trim()
    const sectionContent = match[2]

    // 概要を抽出
    const descriptionMatch = sectionContent.match(/\*\*概要\*\*:\s*(.+)/)
    const description = descriptionMatch ? descriptionMatch[1].trim() : ''

    // 操作（メソッド）を抽出
    const operationsMatch = sectionContent.match(/\*\*操作\*\*:\s*\n([\s\S]*?)(?=\n####|###|##|$)/m)
    const methods: ParsedDomainService['methods'] = []

    if (operationsMatch) {
      const operationsText = operationsMatch[1]
      const operationLines = operationsText.split('\n').filter(line => line.trim().startsWith('-'))

      for (const line of operationLines) {
        const methodMatch = line.match(/`(.+?)\((.+?)\)\s*->\s*(.+?)`:\s*(.+)/)
        if (methodMatch) {
          methods.push({
            name: methodMatch[1].trim(),
            parameters: methodMatch[2].trim(),
            returnType: methodMatch[3].trim(),
            description: methodMatch[4].trim(),
          })
        }
      }
    }

    domainServices.push({
      name,
      description,
      methods,
    })
  }

  return domainServices
}

/**
 * ドメインイベントを抽出
 */
function extractDomainEvents(content: string): ParsedDomainEvent[] {
  const domainEvents: ParsedDomainEvent[] = []

  // ドメインイベントセクションを探す
  const eventPattern = /####\s+(.+?)\s*\n([\s\S]*?)(?=####|###|##|$)/g
  const eventSectionMatch = content.match(/###\s+ドメインイベント([\s\S]*?)(?=###\s+リポジトリ|##\s+[^\s]|$)/m)

  if (!eventSectionMatch) return domainEvents

  const eventSectionContent = eventSectionMatch[1]
  let match

  while ((match = eventPattern.exec(eventSectionContent)) !== null) {
    const name = match[1].trim()
    const sectionContent = match[2]

    // 発生条件を抽出
    const occurredWhenMatch = sectionContent.match(/\*\*発生条件\*\*:\s*(.+)/)
    const occurredWhen = occurredWhenMatch ? occurredWhenMatch[1].trim() : ''

    // 概要を抽出（descriptionとして使用）
    const descriptionMatch = sectionContent.match(/\*\*概要\*\*:\s*(.+)/)
    const description = descriptionMatch ? descriptionMatch[1].trim() : occurredWhen

    // ペイロードを抽出
    const payloadMatch = sectionContent.match(/\*\*ペイロード\*\*:\s*```\s*([\s\S]*?)```/m)
    let payload
    if (payloadMatch) {
      try {
        payload = JSON.parse(payloadMatch[1])
      } catch (e) {
        payload = payloadMatch[1]
      }
    }

    domainEvents.push({
      name,
      description,
      occurredWhen,
      payload,
    })
  }

  return domainEvents
}

/**
 * ビジネスルールを抽出
 */
function extractBusinessRules(content: string): ParsedBusinessRule[] {
  const businessRules: ParsedBusinessRule[] = []

  // ビジネスルールセクションを探す
  const rulePattern = /####\s+(.+?)\s*\n([\s\S]*?)(?=####|###|##|$)/g
  const ruleSectionMatch = content.match(/###\s+ビジネスルール([\s\S]*?)(?=###\s+リポジトリ|##\s+[^\s]|$)/m)

  if (!ruleSectionMatch) return businessRules

  const ruleSectionContent = ruleSectionMatch[1]
  let match

  while ((match = rulePattern.exec(ruleSectionContent)) !== null) {
    const category = match[1].trim()
    const sectionContent = match[2]

    const rules: string[] = []
    const ruleLines = sectionContent.split('\n').filter(line => line.trim().startsWith('-'))
    rules.push(...ruleLines.map(line => line.replace(/^-\s*/, '').trim()))

    if (rules.length > 0) {
      businessRules.push({
        category,
        rules,
      })
    }
  }

  return businessRules
}

/**
 * パース結果をJSON文字列に変換
 */
export function stringifyParsedData(parsed: ParsedDomainLanguage): {
  entities: string
  valueObjects: string
  aggregates: string
  domainServices: string
  domainEvents: string
  businessRules: string
} {
  return {
    entities: JSON.stringify(parsed.entities, null, 2),
    valueObjects: JSON.stringify(parsed.valueObjects, null, 2),
    aggregates: JSON.stringify(parsed.aggregates, null, 2),
    domainServices: JSON.stringify(parsed.domainServices, null, 2),
    domainEvents: JSON.stringify(parsed.domainEvents, null, 2),
    businessRules: JSON.stringify(parsed.businessRules, null, 2),
  }
}
