/**
 * 統合仕様書パーサー
 * MD形式の統合仕様書からJSON構造を抽出
 */

export interface ParsedDependency {
  serviceName: string
  dependencyType: 'sync-api' | 'event-subscription' | 'db-reference'
  criticality: 'high' | 'medium' | 'low'
  fallbackStrategy?: string
}

export interface ParsedDomainEvent {
  eventName: string
  eventType: string
  description: string
  occurredAt: string
  payload?: Record<string, any>
  subscribers?: string[]
}

export interface ParsedSyncApi {
  targetService: string
  endpoint: string
  method: string
  purpose: string
  frequency?: string
  retryStrategy?: string
}

export interface ParsedAsyncPattern {
  patternType: 'saga' | 'event-driven' | 'message-queue'
  description: string
  services: string[]
  compensationActions?: string[]
}

export interface ParsedIntegrationSpecification {
  dependencies: ParsedDependency[]
  providedEvents: ParsedDomainEvent[]
  consumedEvents: ParsedDomainEvent[]
  syncApis: ParsedSyncApi[]
  asyncPatterns: ParsedAsyncPattern[]
}

/**
 * MD形式の統合仕様書をパース
 */
export function parseIntegrationSpecification(content: string): ParsedIntegrationSpecification {
  // 依存関係を抽出
  const dependencies = extractDependencies(content)

  // 提供するドメインイベントを抽出
  const providedEvents = extractProvidedEvents(content)

  // 購読するドメインイベントを抽出
  const consumedEvents = extractConsumedEvents(content)

  // 同期API呼び出しを抽出
  const syncApis = extractSyncApis(content)

  // 非同期パターンを抽出
  const asyncPatterns = extractAsyncPatterns(content)

  return {
    dependencies,
    providedEvents,
    consumedEvents,
    syncApis,
    asyncPatterns,
  }
}

/**
 * 依存サービスを抽出
 */
function extractDependencies(content: string): ParsedDependency[] {
  const dependencies: ParsedDependency[] = []

  // 依存先サービス一覧セクションを探す
  const sectionPattern = /####\s+\d+\.\s+\{?(.+?)\}?\s*\n([\s\S]*?)(?=####|\n---|\n##)/g
  let match

  while ((match = sectionPattern.exec(content)) !== null) {
    const serviceName = match[1].trim()
    const sectionContent = match[2]

    // 依存タイプを抽出
    const typeMatch = sectionContent.match(/\*\*依存タイプ\*\*:\s*(.+)/)
    let dependencyType: ParsedDependency['dependencyType'] = 'sync-api'

    if (typeMatch) {
      const typeText = typeMatch[1]
      if (typeText.includes('同期API')) dependencyType = 'sync-api'
      else if (typeText.includes('イベント購読')) dependencyType = 'event-subscription'
      else if (typeText.includes('DB参照')) dependencyType = 'db-reference'
    }

    // クリティカリティを抽出
    const criticalityMatch = sectionContent.match(/\*\*クリティカリティ\*\*:\s*(.+)/)
    let criticality: ParsedDependency['criticality'] = 'medium'

    if (criticalityMatch) {
      const criticalityText = criticalityMatch[1]
      if (criticalityText.includes('高')) criticality = 'high'
      else if (criticalityText.includes('中')) criticality = 'medium'
      else if (criticalityText.includes('低')) criticality = 'low'
    }

    // フォールバック戦略を抽出
    const fallbackMatch = sectionContent.match(/\*\*フォールバック戦略\*\*:\s*\n([\s\S]*?)(?=\n\*\*|\n\n)/)
    const fallbackStrategy = fallbackMatch ? fallbackMatch[1].trim() : undefined

    // 依存先サービス一覧のセクション内でのみ抽出
    if (content.indexOf(match[0]) > content.indexOf('### 依存先サービス一覧') &&
        content.indexOf(match[0]) < content.indexOf('### 依存元サービス一覧')) {
      dependencies.push({
        serviceName,
        dependencyType,
        criticality,
        fallbackStrategy,
      })
    }
  }

  return dependencies
}

/**
 * 提供するドメインイベントを抽出
 */
function extractProvidedEvents(content: string): ParsedDomainEvent[] {
  const events: ParsedDomainEvent[] = []

  // 提供するドメインイベントセクションを探す
  const sectionMatch = content.match(/###\s+提供するドメインイベント([\s\S]*?)(?=###\s+購読するドメインイベント|##\s+[^\s]|$)/m)
  if (!sectionMatch) return events

  const sectionContent = sectionMatch[1]

  // 各イベントを抽出
  const eventPattern = /####\s+イベント\d+:\s+(.+?)\s*\n([\s\S]*?)(?=####|###|##|$)/g
  let match

  while ((match = eventPattern.exec(sectionContent)) !== null) {
    const eventName = match[1].trim()
    const eventContent = match[2]

    // 概要を抽出
    const descriptionMatch = eventContent.match(/\*\*概要\*\*:\s*(.+)/)
    const description = descriptionMatch ? descriptionMatch[1].trim() : ''

    // 発生タイミングを抽出
    const occurredAtMatch = eventContent.match(/\*\*発生タイミング\*\*:\s*(.+)/)
    const occurredAt = occurredAtMatch ? occurredAtMatch[1].trim() : ''

    // ペイロードを抽出（簡略版）
    const payloadMatch = eventContent.match(/\*\*ペイロード\*\*:\s*```json\s*([\s\S]*?)```/m)
    let payload
    if (payloadMatch) {
      try {
        payload = JSON.parse(payloadMatch[1])
      } catch (e) {
        payload = payloadMatch[1]
      }
    }

    // 購読者を抽出
    const subscribersMatch = eventContent.match(/\*\*購読者\*\*:([\s\S]*?)(?=\n\*\*|\n\n)/m)
    const subscribers: string[] = []
    if (subscribersMatch) {
      const tableContent = subscribersMatch[1]
      const rows = tableContent.split('\n').filter(line => line.includes('|') && !line.includes('---'))
      for (const row of rows) {
        const cells = row.split('|').map(c => c.trim()).filter(Boolean)
        if (cells.length > 0 && cells[0] !== 'サービス') {
          subscribers.push(cells[0])
        }
      }
    }

    events.push({
      eventName,
      eventType: eventName,
      description,
      occurredAt,
      payload,
      subscribers,
    })
  }

  return events
}

/**
 * 購読するドメインイベントを抽出
 */
function extractConsumedEvents(content: string): ParsedDomainEvent[] {
  const events: ParsedDomainEvent[] = []

  // 購読するドメインイベントセクションを探す
  const sectionMatch = content.match(/###\s+購読するドメインイベント([\s\S]*?)(?=##\s+データ連携|##\s+[^\s]|$)/m)
  if (!sectionMatch) return events

  const sectionContent = sectionMatch[1]

  // 各イベントを抽出
  const eventPattern = /####\s+イベント\d+:\s+(.+?)\s*\n([\s\S]*?)(?=####|###|##|$)/g
  let match

  while ((match = eventPattern.exec(sectionContent)) !== null) {
    const eventFullName = match[1].trim()
    const eventContent = match[2]

    // イベント名とソースサービスを分離
    const nameMatch = eventFullName.match(/(.+?)\s*\(from\s+(.+?)\)/)
    const eventName = nameMatch ? nameMatch[1].trim() : eventFullName
    const sourceService = nameMatch ? nameMatch[2].trim() : ''

    // 概要を抽出
    const descriptionMatch = eventContent.match(/\*\*概要\*\*:\s*(.+)/)
    const description = descriptionMatch ? descriptionMatch[1].trim() : ''

    // 購読理由を抽出
    const reasonMatch = eventContent.match(/\*\*購読理由\*\*:\s*(.+)/)
    const occurredAt = reasonMatch ? reasonMatch[1].trim() : ''

    events.push({
      eventName,
      eventType: eventName,
      description,
      occurredAt,
      subscribers: sourceService ? [sourceService] : [],
    })
  }

  return events
}

/**
 * 同期API呼び出しを抽出
 */
function extractSyncApis(content: string): ParsedSyncApi[] {
  const syncApis: ParsedSyncApi[] = []

  // 他サービスへのAPI呼び出しセクションを探す
  const sectionMatch = content.match(/###\s+他サービスへのAPI呼び出し([\s\S]*?)(?=###\s+他サービスからのAPI呼び出し|##\s+非同期イベント統合|$)/m)
  if (!sectionMatch) return syncApis

  const sectionContent = sectionMatch[1]

  // 各エンドポイントを抽出
  const endpointPattern = /#####\s+エンドポイント\d+:\s+(GET|POST|PUT|PATCH|DELETE)\s+(.+?)\s*\n([\s\S]*?)(?=#####|####|###|##|$)/g
  let match

  while ((match = endpointPattern.exec(sectionContent)) !== null) {
    const method = match[1].trim()
    const endpoint = match[2].trim()
    const endpointContent = match[3]

    // 目的を抽出
    const purposeMatch = endpointContent.match(/\*\*目的\*\*:\s*(.+)/)
    const purpose = purposeMatch ? purposeMatch[1].trim() : ''

    // 頻度を抽出
    const frequencyMatch = endpointContent.match(/\*\*頻度\*\*:\s*(.+)/)
    const frequency = frequencyMatch ? frequencyMatch[1].trim() : undefined

    // リトライ戦略を抽出
    const retryMatch = endpointContent.match(/\*\*リトライ戦略\*\*:\s*\n([\s\S]*?)(?=\n\*\*|\n\n)/)
    const retryStrategy = retryMatch ? retryMatch[1].trim() : undefined

    // 呼び出し先サービスを推測（セクション名から）
    const serviceMatch = content.substring(0, match.index).match(/####\s+呼び出し先:\s+\{(.+?)\}/)
    const targetService = serviceMatch ? serviceMatch[1].trim() : 'Unknown'

    syncApis.push({
      targetService,
      endpoint,
      method,
      purpose,
      frequency,
      retryStrategy,
    })
  }

  return syncApis
}

/**
 * 非同期パターンを抽出
 */
function extractAsyncPatterns(content: string): ParsedAsyncPattern[] {
  const patterns: ParsedAsyncPattern[] = []

  // Sagaパターンを探す
  const sagaMatch = content.match(/###\s+Saga例:\s+(.+?)\s*\n([\s\S]*?)(?=###|##|$)/m)
  if (sagaMatch) {
    const description = sagaMatch[1].trim()
    const sagaContent = sagaMatch[2]

    // 関連サービスを抽出（Mermaid図から）
    const mermaidMatch = sagaContent.match(/```mermaid\s+sequenceDiagram([\s\S]*?)```/m)
    const services: string[] = []
    if (mermaidMatch) {
      const participantPattern = /participant\s+\w+\s+as\s+(.+)/g
      let participantMatch
      while ((participantMatch = participantPattern.exec(mermaidMatch[1])) !== null) {
        services.push(participantMatch[1].trim())
      }
    }

    // 補償アクションを抽出
    const compensationMatch = sagaContent.match(/\*\*補償イベント一覧\*\*:([\s\S]*?)(?=\n##|\n---)/m)
    const compensationActions: string[] = []
    if (compensationMatch) {
      const tableContent = compensationMatch[1]
      const rows = tableContent.split('\n').filter(line => line.includes('|') && !line.includes('---'))
      for (const row of rows) {
        const cells = row.split('|').map(c => c.trim()).filter(Boolean)
        if (cells.length >= 2 && cells[0] !== '失敗イベント') {
          compensationActions.push(`${cells[0]} -> ${cells[1]}`)
        }
      }
    }

    patterns.push({
      patternType: 'saga',
      description,
      services,
      compensationActions,
    })
  }

  return patterns
}

/**
 * パース結果をJSON文字列に変換
 */
export function stringifyParsedData(parsed: ParsedIntegrationSpecification): {
  dependencies: string
  providedEvents: string
  consumedEvents: string
  syncApis: string
  asyncPatterns: string
} {
  return {
    dependencies: JSON.stringify(parsed.dependencies, null, 2),
    providedEvents: JSON.stringify(parsed.providedEvents, null, 2),
    consumedEvents: JSON.stringify(parsed.consumedEvents, null, 2),
    syncApis: JSON.stringify(parsed.syncApis, null, 2),
    asyncPatterns: JSON.stringify(parsed.asyncPatterns, null, 2),
  }
}
