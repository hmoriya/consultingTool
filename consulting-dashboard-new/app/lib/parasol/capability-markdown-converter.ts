import { 
  BusinessCapability,
  BusinessOperation 
} from '@/types/parasol';

/**
 * ビジネスケーパビリティをMarkdown形式に変換
 */
export function capabilitiesToMarkdown(
  capabilities: BusinessCapability[],
  operations?: BusinessOperation[]
): string {
  const sections: string[] = [];
  
  // ヘッダー
  sections.push(`# ビジネスケーパビリティ定義`);
  sections.push('');
  sections.push(`**最終更新**: ${new Date().toLocaleDateString('ja-JP')}`);
  sections.push('');
  
  // カテゴリ別にグループ化
  const grouped = capabilities.reduce((acc, cap) => {
    const category = cap.category || '未分類';
    if (!acc[category]) acc[category] = [];
    acc[category].push(cap);
    return acc;
  }, {} as Record<string, BusinessCapability[]>);
  
  // カテゴリ順序の定義
  const categoryOrder = ['Core', 'Supporting', 'Generic', '未分類'];
  const categoryLabels: Record<string, string> = {
    'Core': 'コア（中核）',
    'Supporting': 'サポート',
    'Generic': '汎用',
    '未分類': '未分類'
  };
  
  // カテゴリごとに出力
  categoryOrder.forEach(category => {
    const caps = grouped[category];
    if (!caps || caps.length === 0) return;
    
    sections.push(`## ${categoryLabels[category] || category}`);
    sections.push('');
    
    caps.forEach(cap => {
      sections.push(`### ${cap.displayName}（${cap.name}）`);
      
      if (cap.description) {
        sections.push(cap.description);
      }
      sections.push('');
      
      // このケーパビリティのオペレーションを取得
      const capOperations = operations?.filter(op => op.capabilityId === cap.id) || [];
      
      if (capOperations.length > 0) {
        sections.push('**ビジネスオペレーション:**');
        sections.push('');
        sections.push('| オペレーション | パターン | ゴール |');
        sections.push('|-------------|---------|-------|');
        
        capOperations.forEach(op => {
          const patternLabels: Record<string, string> = {
            'CRUD': 'CRUD（作成・参照・更新・削除）',
            'Workflow': 'ワークフロー',
            'Analytics': '分析',
            'Communication': 'コミュニケーション'
          };
          
          const pattern = patternLabels[op.pattern] || op.pattern;
          sections.push(`| ${op.displayName} | ${pattern} | ${op.goal || ''} |`);
        });
        sections.push('');
      } else {
        sections.push('*オペレーションが未定義です*');
        sections.push('');
      }
    });
  });
  
  return sections.join('\n');
}

/**
 * Markdown形式からビジネスケーパビリティに変換
 */
export function markdownToCapabilities(
  markdown: string,
  serviceId: string
): { capabilities: Partial<BusinessCapability>[], operations: Partial<BusinessOperation>[] } {
  const lines = markdown.split('\n');
  const capabilities: Partial<BusinessCapability>[] = [];
  const operations: Partial<BusinessOperation>[] = [];
  
  let currentCategory: string | null = null;
  let currentCapability: Partial<BusinessCapability> | null = null;
  let inOperationTable = false;
  let skipNextLine = false;
  
  const categoryMap: Record<string, string> = {
    'コア（中核）': 'Core',
    'サポート': 'Supporting',
    '汎用': 'Generic',
    '未分類': ''
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (skipNextLine) {
      skipNextLine = false;
      continue;
    }
    
    // カテゴリの判定
    if (line.startsWith('## ')) {
      const categoryLabel = line.substring(3);
      currentCategory = categoryMap[categoryLabel] || '';
      inOperationTable = false;
      continue;
    }
    
    // ケーパビリティの開始
    if (line.startsWith('### ')) {
      // 前のケーパビリティを保存
      if (currentCapability) {
        capabilities.push(currentCapability);
      }
      
      // 新しいケーパビリティの作成
      const match = line.match(/### (.+)（(.+)）/);
      if (match) {
        const [, displayName, name] = match;
        currentCapability = {
          name,
          displayName,
          serviceId,
          category: currentCategory || 'Generic',
          description: ''
        };
      }
      inOperationTable = false;
      continue;
    }
    
    // 説明文の処理
    if (currentCapability && !line.startsWith('*') && !line.startsWith('**') && 
        !line.startsWith('|') && line && !inOperationTable) {
      currentCapability.description = line;
      continue;
    }
    
    // オペレーションテーブルの開始
    if (line === '**ビジネスオペレーション:**') {
      inOperationTable = true;
      continue;
    }
    
    // テーブルヘッダーのスキップ
    if (inOperationTable && line.startsWith('| オペレーション |')) {
      skipNextLine = true; // セパレータ行をスキップ
      continue;
    }
    
    // オペレーションの処理
    if (inOperationTable && line.startsWith('|') && currentCapability) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length >= 3) {
        const [displayName, patternLabel, goal] = cells;
        
        // パターンの逆引き
        const patternMap: Record<string, string> = {
          'CRUD（作成・参照・更新・削除）': 'CRUD',
          'ワークフロー': 'Workflow',
          '分析': 'Analytics',
          'コミュニケーション': 'Communication'
        };
        
        const pattern = patternMap[patternLabel] || 'CRUD';
        
        // オペレーション名をdisplayNameから生成
        const name = displayName
          .replace(/[ァ-ヶー]/g, '') // カタカナを除去
          .replace(/[ぁ-ん]/g, '') // ひらがなを除去
          .replace(/[一-龯]/g, '') // 漢字を除去
          .replace(/\s+/g, '')
          .toLowerCase() || `operation${operations.length + 1}`;
        
        operations.push({
          name,
          displayName,
          serviceId,
          capabilityId: '', // 後で設定
          pattern,
          goal,
          roles: [],
          operations: [],
          businessStates: []
        });
      }
    }
    
    // オペレーション未定義の処理
    if (line === '*オペレーションが未定義です*') {
      inOperationTable = false;
    }
  }
  
  // 最後のケーパビリティを保存
  if (currentCapability) {
    capabilities.push(currentCapability);
  }
  
  return { capabilities, operations };
}

/**
 * ビジネスケーパビリティMarkdownの妥当性をチェック
 */
export function validateCapabilityMarkdown(markdown: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!markdown.includes('# ビジネスケーパビリティ定義')) {
    errors.push('ヘッダー「# ビジネスケーパビリティ定義」が必要です');
  }
  
  // カテゴリのチェック
  const hasCategory = markdown.includes('## コア（中核）') ||
                     markdown.includes('## サポート') ||
                     markdown.includes('## 汎用');
  
  if (!hasCategory) {
    errors.push('少なくとも1つのカテゴリセクションが必要です');
  }
  
  // ケーパビリティのチェック
  const capabilityMatches = markdown.match(/### .+（.+）/g);
  if (!capabilityMatches || capabilityMatches.length === 0) {
    errors.push('少なくとも1つのケーパビリティが必要です');
  }
  
  // ケーパビリティ名の重複チェック
  if (capabilityMatches) {
    const names = capabilityMatches.map(m => {
      const match = m.match(/### (.+)（(.+)）/);
      return match ? match[2] : '';
    });
    
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`重複するケーパビリティ名があります: ${duplicates.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}