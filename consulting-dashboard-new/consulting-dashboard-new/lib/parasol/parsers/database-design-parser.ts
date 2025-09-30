/**
 * データベース設計書パーサー
 * MD形式のDB設計書からJSON構造を抽出
 */

export interface ParsedColumn {
  name: string
  dataType: string
  nullable: boolean
  default?: string
  constraints: string[]
  description: string
}

export interface ParsedIndex {
  name: string
  columns: string[]
  unique: boolean
  type?: string
}

export interface ParsedConstraint {
  type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK'
  definition: string
  columns?: string[]
  referencedTable?: string
  referencedColumns?: string[]
}

export interface ParsedTable {
  name: string
  purpose: string
  columns: ParsedColumn[]
  indexes: ParsedIndex[]
  constraints: ParsedConstraint[]
}

export interface ParsedDatabaseDesign {
  dbms: string
  tables: ParsedTable[]
  erDiagram?: string
}

/**
 * MD形式のDB設計書をパース
 */
export function parseDatabaseDesign(content: string): ParsedDatabaseDesign {
  // DBMSを抽出
  const dbms = extractDbms(content)

  // ER図を抽出
  const erDiagram = extractErDiagram(content)

  // テーブル定義を抽出
  const tables = extractTables(content)

  return {
    dbms,
    tables,
    erDiagram,
  }
}

/**
 * DBMSを抽出
 */
function extractDbms(content: string): string {
  const match = content.match(/\*\*DBMS\*\*:\s*(.+)/)
  if (match) {
    const dbmsText = match[1].trim()
    if (dbmsText.includes('SQLite')) return 'SQLite'
    if (dbmsText.includes('PostgreSQL')) return 'PostgreSQL'
    if (dbmsText.includes('MySQL')) return 'MySQL'
  }
  return 'SQLite' // デフォルト
}

/**
 * ER図（Mermaid）を抽出
 */
function extractErDiagram(content: string): string | undefined {
  const mermaidMatch = content.match(/```mermaid\s+(erDiagram[\s\S]*?)```/m)
  if (mermaidMatch) {
    return mermaidMatch[1].trim()
  }
  return undefined
}

/**
 * テーブル定義を抽出
 */
function extractTables(content: string): ParsedTable[] {
  const tables: ParsedTable[] = []

  // テーブルセクションを検索（#### {テーブル名}テーブル）
  const tablePattern = /####\s+(.+?)テーブル\s*\n([\s\S]*?)(?=####|##\s+[^\s]|$)/g
  let match

  while ((match = tablePattern.exec(content)) !== null) {
    const tableName = match[1].trim()
    const sectionContent = match[2]

    // テーブル名を抽出（**テーブル名**: `table_name`）
    const tableNameMatch = sectionContent.match(/\*\*テーブル名\*\*:\s*`(.+?)`/)
    const actualTableName = tableNameMatch ? tableNameMatch[1] : tableName.toLowerCase()

    // 目的を抽出
    const purposeMatch = sectionContent.match(/\*\*目的\*\*:\s*(.+)/)
    const purpose = purposeMatch ? purposeMatch[1].trim() : ''

    // カラム定義を抽出
    const columns = extractColumns(sectionContent)

    // インデックスを抽出
    const indexes = extractIndexes(sectionContent)

    // 制約を抽出
    const constraints = extractConstraints(sectionContent)

    tables.push({
      name: actualTableName,
      purpose,
      columns,
      indexes,
      constraints,
    })
  }

  return tables
}

/**
 * カラム定義を抽出
 */
function extractColumns(sectionContent: string): ParsedColumn[] {
  const columns: ParsedColumn[] = []

  // カラム定義のテーブルを探す
  const tableMatch = sectionContent.match(/\|\s*カラム名\s*\|([\s\S]*?)(?:\n\n|\*\*インデックス)/m)
  if (!tableMatch) return columns

  const tableContent = tableMatch[1]
  const rows = tableContent.split('\n').filter(line => line.trim() && !line.includes('---'))

  for (const row of rows) {
    const cells = row.split('|').map(cell => cell.trim()).filter(Boolean)
    if (cells.length >= 5) {
      const name = cells[0]
      const dataType = cells[1]
      const nullable = !cells[2].includes('NOT NULL')
      const defaultValue = cells[3] === '-' ? undefined : cells[3]
      const constraintText = cells[4]
      const description = cells[5] || ''

      const constraints: string[] = []
      if (constraintText.includes('PK')) constraints.push('PRIMARY KEY')
      if (constraintText.includes('FK')) constraints.push('FOREIGN KEY')
      if (constraintText.includes('UNIQUE')) constraints.push('UNIQUE')
      if (constraintText.includes('CHECK')) constraints.push('CHECK')

      columns.push({
        name,
        dataType,
        nullable,
        default: defaultValue,
        constraints,
        description,
      })
    }
  }

  return columns
}

/**
 * インデックスを抽出
 */
function extractIndexes(sectionContent: string): ParsedIndex[] {
  const indexes: ParsedIndex[] = []

  // インデックスセクションを探す
  const indexMatch = sectionContent.match(/\*\*インデックス\*\*:\s*```sql([\s\S]*?)```/m)
  if (!indexMatch) return indexes

  const indexContent = indexMatch[1]
  const lines = indexContent.split('\n')

  for (const line of lines) {
    const trimmedLine = line.trim()

    // PRIMARY KEY
    if (trimmedLine.startsWith('PRIMARY KEY')) {
      const columnsMatch = trimmedLine.match(/PRIMARY KEY\s*\(([^)]+)\)/)
      if (columnsMatch) {
        const columns = columnsMatch[1].split(',').map(c => c.trim())
        indexes.push({
          name: 'PRIMARY',
          columns,
          unique: true,
          type: 'PRIMARY KEY',
        })
      }
    }

    // UNIQUE INDEX
    else if (trimmedLine.startsWith('UNIQUE INDEX')) {
      const nameMatch = trimmedLine.match(/UNIQUE INDEX\s+(\w+)/)
      const columnsMatch = trimmedLine.match(/\(([^)]+)\)/)
      if (nameMatch && columnsMatch) {
        const name = nameMatch[1]
        const columns = columnsMatch[1].split(',').map(c => c.trim())
        indexes.push({
          name,
          columns,
          unique: true,
          type: 'UNIQUE',
        })
      }
    }

    // INDEX
    else if (trimmedLine.startsWith('INDEX')) {
      const nameMatch = trimmedLine.match(/INDEX\s+(\w+)/)
      const columnsMatch = trimmedLine.match(/\(([^)]+)\)/)
      if (nameMatch && columnsMatch) {
        const name = nameMatch[1]
        const columns = columnsMatch[1].split(',').map(c => c.trim())
        indexes.push({
          name,
          columns,
          unique: false,
          type: 'INDEX',
        })
      }
    }
  }

  return indexes
}

/**
 * 制約を抽出
 */
function extractConstraints(sectionContent: string): ParsedConstraint[] {
  const constraints: ParsedConstraint[] = []

  // 制約セクションを探す
  const constraintMatch = sectionContent.match(/\*\*制約\*\*:\s*```sql([\s\S]*?)```/m)
  if (!constraintMatch) return constraints

  const constraintContent = constraintMatch[1]
  const lines = constraintContent.split('\n')

  for (const line of lines) {
    const trimmedLine = line.trim()

    // CHECK制約
    if (trimmedLine.startsWith('CHECK')) {
      constraints.push({
        type: 'CHECK',
        definition: trimmedLine,
      })
    }

    // FOREIGN KEY制約
    else if (trimmedLine.startsWith('FOREIGN KEY')) {
      const columnsMatch = trimmedLine.match(/FOREIGN KEY\s*\(([^)]+)\)/)
      const refMatch = trimmedLine.match(/REFERENCES\s+(\w+)\s*\(([^)]+)\)/)

      if (columnsMatch && refMatch) {
        constraints.push({
          type: 'FOREIGN KEY',
          definition: trimmedLine,
          columns: columnsMatch[1].split(',').map(c => c.trim()),
          referencedTable: refMatch[1],
          referencedColumns: refMatch[2].split(',').map(c => c.trim()),
        })
      }
    }
  }

  return constraints
}

/**
 * パース結果をJSON文字列に変換
 */
export function stringifyParsedData(parsed: ParsedDatabaseDesign): {
  tables: string
  indexes: string
  constraints: string
  erDiagram?: string
} {
  // テーブルごとのインデックスと制約を集約
  const allIndexes = parsed.tables.flatMap(table =>
    table.indexes.map(index => ({
      table: table.name,
      ...index,
    }))
  )

  const allConstraints = parsed.tables.flatMap(table =>
    table.constraints.map(constraint => ({
      table: table.name,
      ...constraint,
    }))
  )

  return {
    tables: JSON.stringify(parsed.tables, null, 2),
    indexes: JSON.stringify(allIndexes, null, 2),
    constraints: JSON.stringify(allConstraints, null, 2),
    erDiagram: parsed.erDiagram,
  }
}
