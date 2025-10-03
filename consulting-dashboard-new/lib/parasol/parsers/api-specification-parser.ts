/**
 * API仕様書パーサー
 * MD形式のAPI仕様書からJSON構造を抽出
 */

export interface ParsedEndpoint {
  path: string
  method: string
  summary: string
  authentication: boolean
  permission?: string
  parameters?: {
    name: string
    type: string
    required: boolean
    location: 'path' | 'query' | 'header' | 'body'
    description: string
  }[]
  requestBody?: {
    contentType: string
    schema: any
    example?: string
  }
  responses: {
    status: number
    description: string
    schema?: any
    example?: string
  }[]
}

export interface ParsedErrorCode {
  code: string
  httpStatus: number
  message: string
  description?: string
}

export interface ParsedRateLimit {
  type: string
  limit: number
  window: string // e.g., "1時間", "1分"
}

export interface ParsedApiSpecification {
  version: string
  baseUrl: string
  authMethod: string
  endpoints: ParsedEndpoint[]
  errorCodes: ParsedErrorCode[]
  rateLimits: ParsedRateLimit[]
}

/**
 * MD形式のAPI仕様書をパース
 */
export function parseApiSpecification(content: string): ParsedApiSpecification {
  const lines = content.split('\n')

  // メタデータの抽出
  const version = extractVersion(lines)
  const baseUrl = extractBaseUrl(lines)
  const authMethod = extractAuthMethod(lines)

  // エンドポイントの抽出
  const endpoints = extractEndpoints(content)

  // エラーコードの抽出
  const errorCodes = extractErrorCodes(content)

  // レート制限の抽出
  const rateLimits = extractRateLimits(content)

  return {
    version,
    baseUrl,
    authMethod,
    endpoints,
    errorCodes,
    rateLimits,
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
  return 'v1.0.0' // デフォルト
}

/**
 * ベースURLを抽出
 */
function extractBaseUrl(lines: string[]): string {
  for (const line of lines) {
    const match = line.match(/\*\*ベースURL\*\*:\s*`(.+)`/)
    if (match) {
      return match[1].trim()
    }
  }
  return '' // デフォルト
}

/**
 * 認証方式を抽出
 */
function extractAuthMethod(lines: string[]): string {
  for (const line of lines) {
    const match = line.match(/\*\*認証方式\*\*:\s*(.+)/)
    if (match) {
      return match[1].trim()
    }
  }
  return 'JWT Bearer Token' // デフォルト
}

/**
 * エンドポイントを抽出
 */
function extractEndpoints(content: string): ParsedEndpoint[] {
  const endpoints: ParsedEndpoint[] = []

  // エンドポイントセクションを検索（### または #### で始まる）
  const endpointPattern = /####?\s+(GET|POST|PUT|PATCH|DELETE)\s+\/([^\n]+)/g
  let match

  while ((match = endpointPattern.exec(content)) !== null) {
    const method = match[1]
    const path = '/' + match[2].trim()
    const startIndex = match.index

    // 次のエンドポイントまたはセクションの終わりを見つける
    const nextEndpointMatch = content.substring(startIndex + 1).search(/####?\s+(GET|POST|PUT|PATCH|DELETE)/)
    const endIndex = nextEndpointMatch === -1
      ? content.length
      : startIndex + 1 + nextEndpointMatch

    const sectionContent = content.substring(startIndex, endIndex)

    // 概要を抽出
    const summaryMatch = sectionContent.match(/\*\*概要\*\*:\s*(.+)/)
    const summary = summaryMatch ? summaryMatch[1].trim() : ''

    // 認証を抽出
    const authMatch = sectionContent.match(/\*\*認証\*\*:\s*(.+)/)
    const authentication = authMatch ? authMatch[1].includes('必須') : false

    // 権限を抽出
    const permMatch = sectionContent.match(/\*\*権限\*\*:\s*`(.+)`/)
    const permission = permMatch ? permMatch[1].trim() : undefined

    // パラメータを抽出（簡略版）
    const parameters = extractParameters(sectionContent)

    // レスポンスを抽出
    const responses = extractResponses(sectionContent)

    endpoints.push({
      path,
      method,
      summary,
      authentication,
      permission,
      parameters,
      responses,
    })
  }

  return endpoints
}

/**
 * パラメータを抽出（簡略版）
 */
function extractParameters(sectionContent: string): ParsedEndpoint['parameters'] {
  const parameters: NonNullable<ParsedEndpoint['parameters']> = []

  // クエリパラメータのテーブルを探す
  const tableMatch = sectionContent.match(/\*\*クエリパラメータ\*\*:[\s\S]*?\n\|([\s\S]*?)(?:\n\n|\n##|\n---)/m)
  if (!tableMatch) return parameters

  const tableContent = tableMatch[1]
  const rows = tableContent.split('\n').filter(line => line.trim() && !line.includes('---'))

  for (const row of rows) {
    const cells = row.split('|').map(cell => cell.trim()).filter(Boolean)
    if (cells.length >= 4) {
      parameters.push({
        name: cells[0],
        type: cells[1],
        required: cells[2].includes('○'),
        location: 'query',
        description: cells[cells.length - 1],
      })
    }
  }

  return parameters
}

/**
 * レスポンスを抽出
 */
function extractResponses(sectionContent: string): ParsedEndpoint['responses'] {
  const responses: ParsedEndpoint['responses'] = []

  // 成功レスポンスを抽出（200, 201等）
  const successMatch = sectionContent.match(/\*\*レスポンス（(\d+)\s+[^)]+\)\*\*:/)
  if (successMatch) {
    const status = parseInt(successMatch[1])
    responses.push({
      status,
      description: '成功',
    })
  }

  // エラーレスポンスを抽出
  const errorPattern = /`(\d+)\s+([^`]+)`:/g
  let errorMatch
  while ((errorMatch = errorPattern.exec(sectionContent)) !== null) {
    const status = parseInt(errorMatch[1])
    const description = errorMatch[2].trim()
    responses.push({
      status,
      description,
    })
  }

  return responses
}

/**
 * エラーコードを抽出
 */
function extractErrorCodes(content: string): ParsedErrorCode[] {
  const errorCodes: ParsedErrorCode[] = []

  // エラーコード一覧のテーブルを探す
  const tableMatch = content.match(/##\s+エラーコード一覧[\s\S]*?\n\|([\s\S]*?)(?:\n\n##|\n---)/m)
  if (!tableMatch) return errorCodes

  const tableContent = tableMatch[1]
  const rows = tableContent.split('\n').filter(line => line.trim() && !line.includes('---'))

  for (const row of rows) {
    const cells = row.split('|').map(cell => cell.trim()).filter(Boolean)
    if (cells.length >= 3) {
      errorCodes.push({
        code: cells[0].replace(/`/g, ''),
        httpStatus: parseInt(cells[1]),
        message: cells[2],
        description: cells[3] || undefined,
      })
    }
  }

  return errorCodes
}

/**
 * レート制限を抽出
 */
function extractRateLimits(content: string): ParsedRateLimit[] {
  const rateLimits: ParsedRateLimit[] = []

  // レート制限セクションを探す
  const sectionMatch = content.match(/##\s+レート制限[\s\S]*?###\s+制限値([\s\S]*?)(?:\n###|\n##)/m)
  if (!sectionMatch) return rateLimits

  const sectionContent = sectionMatch[1]

  // 各制限を抽出
  const limitPattern = /\*\*(.+?)\*\*:\s*(\d+)リクエスト\/(.+)/g
  let match

  while ((match = limitPattern.exec(sectionContent)) !== null) {
    rateLimits.push({
      type: match[1].trim(),
      limit: parseInt(match[2]),
      window: match[3].trim(),
    })
  }

  return rateLimits
}

/**
 * パース結果をJSON文字列に変換
 */
export function stringifyParsedData(parsed: ParsedApiSpecification): {
  endpoints: string
  errorCodes: string
  rateLimits: string
} {
  return {
    endpoints: JSON.stringify(parsed.endpoints, null, 2),
    errorCodes: JSON.stringify(parsed.errorCodes, null, 2),
    rateLimits: JSON.stringify(parsed.rateLimits, null, 2),
  }
}
