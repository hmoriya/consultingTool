import { BusinessOperation, UseCase, PageDefinition, TestDefinition, PageField } from '@/app/types/parasol';

/**
 * ビジネスオペレーションをMarkdown形式に変換
 */
export function operationToMarkdown(operation: BusinessOperation): string {
  const sections: string[] = [];
  
  // ヘッダー
  sections.push(`# ビジネスオペレーション詳細`);
  sections.push('');
  sections.push(`## ${operation.displayName}（${operation.name}）`);
  sections.push('');
  
  // 基本情報
  sections.push('### 基本情報');
  sections.push('');
  sections.push('| 項目 | 内容 |');
  sections.push('|------|------|');
  
  const patternLabels: Record<string, string> = {
    'CRUD': 'CRUD（作成・参照・更新・削除）',
    'Workflow': 'ワークフロー',
    'Analytics': '分析',
    'Communication': 'コミュニケーション'
  };
  
  sections.push(`| パターン | ${patternLabels[operation.pattern] || operation.pattern} |`);
  sections.push(`| ゴール | ${operation.goal || ''} |`);
  sections.push('');
  
  // ロール
  if (operation.roles && operation.roles.length > 0) {
    sections.push('### 実行可能ロール');
    sections.push('');
    const roles = typeof operation.roles === 'string' 
      ? JSON.parse(operation.roles) 
      : operation.roles;
    roles.forEach((role: string) => {
      sections.push(`- ${role}`);
    });
    sections.push('');
  }
  
  // オペレーション（アクション）
  if (operation.operations && operation.operations.length > 0) {
    sections.push('### 処理フロー');
    sections.push('');
    const ops = typeof operation.operations === 'string'
      ? JSON.parse(operation.operations)
      : operation.operations;
    ops.forEach((op: string, index: number) => {
      sections.push(`${index + 1}. ${op}`);
    });
    sections.push('');
  }
  
  // ビジネスステート
  if (operation.businessStates && operation.businessStates.length > 0) {
    sections.push('### ビジネスステート');
    sections.push('');
    sections.push('| 状態 | 説明 |');
    sections.push('|------|------|');
    
    const states = typeof operation.businessStates === 'string'
      ? JSON.parse(operation.businessStates)
      : operation.businessStates;
    
    states.forEach((state: string) => {
      // 状態の説明を生成（実際の実装では詳細な説明を別途管理）
      const descriptions: Record<string, string> = {
        'draft': '下書き状態',
        'submitted': '提出済み',
        'pending': '承認待ち',
        'approved': '承認済み',
        'rejected': '却下',
        'active': 'アクティブ',
        'completed': '完了',
        'closed': 'クローズ'
      };
      
      sections.push(`| ${state} | ${descriptions[state] || ''} |`);
    });
    sections.push('');
  }
  
  // ユースケース
  if (operation.useCases && operation.useCases.length > 0) {
    sections.push('### ユースケース');
    sections.push('');
    const useCases = typeof operation.useCases === 'string'
      ? JSON.parse(operation.useCases)
      : operation.useCases;
    
    useCases.forEach((useCase: UseCase, index: number) => {
      sections.push(`#### ${index + 1}. ${useCase.title || 'ユースケース' + (index + 1)}`);
      if (useCase.description) {
        sections.push(useCase.description);
      }
      if (useCase.preconditions && useCase.preconditions.length > 0) {
        sections.push('');
        sections.push('**事前条件:**');
        useCase.preconditions.forEach((condition: string) => {
          sections.push(`- ${condition}`);
        });
      }
      if (useCase.postconditions && useCase.postconditions.length > 0) {
        sections.push('');
        sections.push('**事後条件:**');
        useCase.postconditions.forEach((condition: string) => {
          sections.push(`- ${condition}`);
        });
      }
      sections.push('');
    });
  }
  
  // UI定義
  if (operation.uiDefinitions && operation.uiDefinitions.length > 0) {
    sections.push('### UI定義');
    sections.push('');
    const uiDefs = typeof operation.uiDefinitions === 'string'
      ? JSON.parse(operation.uiDefinitions)
      : operation.uiDefinitions;
    
    uiDefs.forEach((ui: PageDefinition) => {
      sections.push(`#### ${ui.screenName || '画面'}`);
      if (ui.description) {
        sections.push(ui.description);
      }
      if (ui.fields && ui.fields.length > 0) {
        sections.push('');
        sections.push('**フィールド:**');
        sections.push('');
        sections.push('| フィールド名 | 型 | 必須 | 説明 |');
        sections.push('|------------|---|------|------|');
        ui.fields?.forEach((field: PageField) => {
          const required = field.required ? '✓' : '-';
          sections.push(`| ${field.name} | ${field.type} | ${required} | ${field.description || ''} |`);
        });
      }
      sections.push('');
    });
  }
  
  // テストケース
  if (operation.testCases && operation.testCases.length > 0) {
    sections.push('### テストケース');
    sections.push('');
    const testCases = typeof operation.testCases === 'string'
      ? JSON.parse(operation.testCases)
      : operation.testCases;
    
    testCases.forEach((test: TestDefinition, index: number) => {
      sections.push(`#### ${index + 1}. ${test.name || 'テストケース' + (index + 1)}`);
      if (test.scenario) {
        sections.push('');
        sections.push('**シナリオ:**');
        sections.push(test.scenario);
      }
      if (test.expectedResult) {
        sections.push('');
        sections.push('**期待結果:**');
        sections.push(test.expectedResult);
      }
      sections.push('');
    });
  }
  
  return sections.join('\n');
}

/**
 * Markdown形式からビジネスオペレーションに変換
 */
export function markdownToOperation(
  markdown: string,
  serviceId: string,
  capabilityId: string
): Partial<BusinessOperation> {
  const lines = markdown.split('\n');
  const operation: Partial<BusinessOperation> = {
    serviceId,
    capabilityId,
    roles: [],
    operations: [],
    businessStates: [],
    useCases: [],
    uiDefinitions: [],
    testCases: []
  };
  
  let currentSection: string | null = null;
  const currentSubSection: { name: string; content: string[] } | null = null;
  let inTable = false;
  let skipNextLine = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (skipNextLine) {
      skipNextLine = false;
      continue;
    }
    
    // オペレーション名の抽出
    if (line.match(/^## (.+)（(.+)）$/)) {
      const match = line.match(/^## (.+)（(.+)）$/);
      if (match) {
        operation.displayName = match[1];
        operation.name = match[2];
      }
      continue;
    }
    
    // セクションの判定
    if (line === '### 基本情報') {
      currentSection = 'basic';
      inTable = false;
      continue;
    } else if (line === '### 実行可能ロール') {
      currentSection = 'roles';
      inTable = false;
      continue;
    } else if (line === '### 処理フロー') {
      currentSection = 'operations';
      inTable = false;
      continue;
    } else if (line === '### ビジネスステート') {
      currentSection = 'states';
      inTable = false;
      continue;
    } else if (line === '### ユースケース') {
      currentSection = 'usecases';
      inTable = false;
      continue;
    } else if (line === '### UI定義') {
      currentSection = 'ui';
      inTable = false;
      continue;
    } else if (line === '### テストケース') {
      currentSection = 'tests';
      inTable = false;
      continue;
    }
    
    // 基本情報テーブルの処理
    if (currentSection === 'basic' && line.startsWith('|') && !line.includes('---')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length >= 2) {
        if (cells[0] === 'パターン') {
          const patternMap: Record<string, string> = {
            'CRUD（作成・参照・更新・削除）': 'CRUD',
            'ワークフロー': 'Workflow',
            '分析': 'Analytics',
            'コミュニケーション': 'Communication'
          };
          operation.pattern = patternMap[cells[1]] || 'CRUD';
        } else if (cells[0] === 'ゴール') {
          operation.goal = cells[1];
        }
      }
    }
    
    // ロールの処理
    if (currentSection === 'roles' && line.startsWith('- ')) {
      const role = line.substring(2);
      if (Array.isArray(operation.roles)) {
        operation.roles.push(role);
      }
    }
    
    // 処理フローの処理
    if (currentSection === 'operations' && line.match(/^\d+\.\s+(.+)$/)) {
      const match = line.match(/^\d+\.\s+(.+)$/);
      if (match && Array.isArray(operation.operations)) {
        operation.operations.push(match[1]);
      }
    }
    
    // ビジネスステートテーブルの処理
    if (currentSection === 'states') {
      if (line.startsWith('| 状態 |')) {
        inTable = true;
        skipNextLine = true;
        continue;
      }
      
      if (inTable && line.startsWith('|') && !line.includes('---')) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 1 && Array.isArray(operation.businessStates)) {
          operation.businessStates.push(cells[0]);
        }
      }
    }
    
    // その他のセクションは簡略化（実装では詳細な解析が必要）
    // ユースケース、UI定義、テストケースの解析は省略
  }
  
  return operation;
}

/**
 * ビジネスオペレーションMarkdownの妥当性をチェック
 */
export function validateOperationMarkdown(markdown: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // オペレーション名のチェック
  if (!markdown.match(/^## .+（.+）$/m)) {
    errors.push('オペレーション名（## 表示名（name））が必要です');
  }
  
  // 基本情報セクションのチェック
  if (!markdown.includes('### 基本情報')) {
    errors.push('「### 基本情報」セクションが必要です');
  }
  
  // パターンのチェック
  if (!markdown.includes('| パターン |')) {
    errors.push('パターン情報が必要です');
  }
  
  // ゴールのチェック
  if (!markdown.includes('| ゴール |')) {
    errors.push('ゴール情報が必要です');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}