import { DbDesign } from '@/types/parasol';

/**
 * DB設計をMarkdown形式に変換
 */
export function dbDesignToMarkdown(dbDesign: DbDesign): string {
  const sections: string[] = [];
  
  // ヘッダー
  sections.push(`# データベース設計書`);
  sections.push('');
  sections.push(`**最終更新**: ${new Date().toLocaleDateString('ja-JP')}`);
  sections.push('');
  
  // 概要
  if (dbDesign.description) {
    sections.push('## 概要');
    sections.push('');
    sections.push(dbDesign.description);
    sections.push('');
  }
  
  // テーブル定義
  if (dbDesign.tables && dbDesign.tables.length > 0) {
    sections.push('## テーブル定義');
    sections.push('');
    
    dbDesign.tables.forEach(table => {
      sections.push(`### ${table.displayName}（${table.name}）`);
      sections.push('');
      
      if (table.description) {
        sections.push(table.description);
        sections.push('');
      }
      
      // カラム定義
      sections.push('#### カラム定義');
      sections.push('');
      sections.push('| カラム名 | 型 | NULL許可 | デフォルト | 説明 |');
      sections.push('|----------|-----|----------|------------|------|');
      
      table.columns.forEach(column => {
        const nullable = column.nullable ? '✓' : '-';
        const defaultValue = column.defaultValue || '-';
        sections.push(`| ${column.name} | ${column.type} | ${nullable} | ${defaultValue} | ${column.description || ''} |`);
      });
      sections.push('');
      
      // インデックス
      if (table.indexes && table.indexes.length > 0) {
        sections.push('#### インデックス');
        sections.push('');
        sections.push('| インデックス名 | カラム | 種別 | 説明 |');
        sections.push('|--------------|--------|------|------|');
        
        table.indexes.forEach(index => {
          const columns = Array.isArray(index.columns) ? index.columns.join(', ') : index.columns;
          sections.push(`| ${index.name} | ${columns} | ${index.type} | ${index.description || ''} |`);
        });
        sections.push('');
      }
      
      // 制約
      if (table.constraints && table.constraints.length > 0) {
        sections.push('#### 制約');
        sections.push('');
        table.constraints.forEach(constraint => {
          sections.push(`- **${constraint.type}**: ${constraint.definition}`);
          if (constraint.description) {
            sections.push(`  - ${constraint.description}`);
          }
        });
        sections.push('');
      }
    });
  }
  
  // リレーション定義
  if (dbDesign.relations && dbDesign.relations.length > 0) {
    sections.push('## リレーション定義');
    sections.push('');
    sections.push('| 親テーブル | 子テーブル | 関係 | 外部キー | 説明 |');
    sections.push('|-----------|-----------|------|----------|------|');
    
    dbDesign.relations.forEach(relation => {
      sections.push(`| ${relation.fromTable} | ${relation.toTable} | ${relation.type} | ${relation.foreignKey} | ${relation.description || ''} |`);
    });
    sections.push('');
  }
  
  // ER図（テキスト表現）
  sections.push('## ER図（概念図）');
  sections.push('');
  sections.push('```mermaid');
  sections.push('erDiagram');
  
  // テーブルの定義
  if (dbDesign.tables) {
    dbDesign.tables.forEach(table => {
      sections.push(`    ${table.name} {`);
      table.columns.forEach(column => {
        const pk = column.primaryKey ? 'PK' : '';
        const fk = column.foreignKey ? 'FK' : '';
        const constraint = [pk, fk].filter(c => c).join(',');
        const constraintStr = constraint ? ` "${constraint}"` : '';
        sections.push(`        ${column.type} ${column.name}${constraintStr}`);
      });
      sections.push('    }');
    });
  }
  
  // リレーションの定義
  if (dbDesign.relations) {
    dbDesign.relations.forEach(relation => {
      const relSymbol = getRelationSymbol(relation.type);
      sections.push(`    ${relation.fromTable} ${relSymbol} ${relation.toTable} : "${relation.description || ''}"`);
    });
  }
  
  sections.push('```');
  sections.push('');
  
  return sections.join('\n');
}

/**
 * Markdown形式からDB設計に変換
 */
export function markdownToDbDesign(markdown: string): Partial<DbDesign> {
  const lines = markdown.split('\n');
  const dbDesign: Partial<DbDesign> = {
    tables: [],
    relations: []
  };
  
  let currentSection: string | null = null;
  let currentTable: any = null;
  let inTable = false;
  let skipNextLine = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (skipNextLine) {
      skipNextLine = false;
      continue;
    }
    
    // セクションの判定
    if (line === '## 概要') {
      currentSection = 'overview';
      continue;
    } else if (line === '## テーブル定義') {
      currentSection = 'tables';
      continue;
    } else if (line === '## リレーション定義') {
      currentSection = 'relations';
      continue;
    }
    
    // 概要の処理
    if (currentSection === 'overview' && line && !line.startsWith('#')) {
      dbDesign.description = line;
    }
    
    // テーブル名の抽出
    if (currentSection === 'tables' && line.match(/^### (.+)（(.+)）$/)) {
      const match = line.match(/^### (.+)（(.+)）$/);
      if (match) {
        // 前のテーブルを保存
        if (currentTable) {
          dbDesign.tables!.push(currentTable);
        }
        
        currentTable = {
          name: match[2],
          displayName: match[1],
          columns: [],
          indexes: [],
          constraints: []
        };
      }
      continue;
    }
    
    // テーブル説明の処理
    if (currentTable && !inTable && line && !line.startsWith('#') && !line.startsWith('|')) {
      currentTable.description = line;
      continue;
    }
    
    // カラム定義テーブルの開始
    if (line === '| カラム名 | 型 | NULL許可 | デフォルト | 説明 |') {
      inTable = true;
      skipNextLine = true;
      continue;
    }
    
    // カラムの処理
    if (inTable && line.startsWith('|') && currentTable) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length >= 5) {
        const column: any = {
          name: cells[0],
          type: cells[1],
          nullable: cells[2] === '✓',
          defaultValue: cells[3] === '-' ? null : cells[3],
          description: cells[4]
        };
        
        // 主キーの判定（通常idカラム）
        if (column.name === 'id') {
          column.primaryKey = true;
        }
        
        currentTable.columns.push(column);
      }
    }
    
    // インデックステーブルの開始
    if (line === '| インデックス名 | カラム | 種別 | 説明 |') {
      inTable = false;
      skipNextLine = true;
      continue;
    }
    
    // リレーションテーブルの処理
    if (currentSection === 'relations' && line.startsWith('|') && !line.includes('---')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length >= 5 && cells[0] !== '親テーブル') {
        dbDesign.relations!.push({
          fromTable: cells[0],
          toTable: cells[1],
          type: cells[2],
          foreignKey: cells[3],
          description: cells[4]
        });
      }
    }
  }
  
  // 最後のテーブルを保存
  if (currentTable) {
    dbDesign.tables!.push(currentTable);
  }
  
  return dbDesign;
}

/**
 * DB設計Markdownの妥当性をチェック
 */
export function validateDbDesignMarkdown(markdown: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!markdown.includes('# データベース設計書')) {
    errors.push('ヘッダー「# データベース設計書」が必要です');
  }
  
  if (!markdown.includes('## テーブル定義')) {
    errors.push('「## テーブル定義」セクションが必要です');
  }
  
  // テーブルのチェック
  const tableMatches = markdown.match(/### .+（.+）/g);
  if (!tableMatches || tableMatches.length === 0) {
    errors.push('少なくとも1つのテーブル定義が必要です');
  }
  
  // 各テーブルにカラム定義があるかチェック
  const hasColumnHeaders = markdown.includes('| カラム名 | 型 | NULL許可 | デフォルト | 説明 |');
  if (!hasColumnHeaders) {
    errors.push('カラム定義テーブルが必要です');
  }
  
  // テーブル名の重複チェック
  if (tableMatches) {
    const tableNames = tableMatches.map(m => {
      const match = m.match(/### (.+)（(.+)）/);
      return match ? match[2] : '';
    });
    
    const duplicates = tableNames.filter((name, index) => tableNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`重複するテーブル名があります: ${duplicates.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * リレーションタイプをMermaid記法に変換
 */
function getRelationSymbol(type: string): string {
  switch (type) {
    case '1:1':
      return '||--||';
    case '1:N':
    case '1:多':
      return '||--o{';
    case 'N:N':
    case '多:多':
      return '}o--o{';
    default:
      return '||--||';
  }
}