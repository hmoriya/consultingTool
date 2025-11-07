/**
 * エンティティ名推論エンジン
 * ケーパビリティとオペレーションからエンティティ名を推論
 */

import { BusinessCapability, BusinessOperation } from '@/types/parasol';

export interface InferredEntity {
  name: string;
  displayName: string;
  source: 'capability' | 'operation' | 'pattern';
  confidence: number;
  suggestedProperties?: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
  relatedEntities?: string[];
}

/**
 * ケーパビリティとオペレーションからエンティティを推論
 */
export function inferEntities(
  capabilities: BusinessCapability[],
  operations: BusinessOperation[]
): InferredEntity[] {
  const entities: InferredEntity[] = [];
  const entityMap = new Map<string, InferredEntity>();
  
  // 1. ケーパビリティから基本エンティティを推論
  capabilities.forEach(capability => {
    const entity = inferEntityFromCapability(capability, operations);
    if (entity && !entityMap.has(entity.name)) {
      entityMap.set(entity.name, entity);
    }
  });
  
  // 2. オペレーションから追加エンティティを推論
  operations.forEach(operation => {
    const additionalEntities = inferEntitiesFromOperation(operation);
    additionalEntities.forEach(entity => {
      if (!entityMap.has(entity.name)) {
        entityMap.set(entity.name, entity);
      } else {
        // 既存エンティティの情報を強化
        const existing = entityMap.get(entity.name)!;
        existing.confidence = Math.max(existing.confidence, entity.confidence);
        if (entity.suggestedProperties) {
          existing.suggestedProperties = mergeProperties(
            existing.suggestedProperties || [],
            entity.suggestedProperties
          );
        }
      }
    });
  });
  
  // 3. パターン分析による関連エンティティの推論
  const patternEntities = inferEntitiesFromPatterns(operations);
  patternEntities.forEach(entity => {
    if (!entityMap.has(entity.name)) {
      entityMap.set(entity.name, entity);
    }
  });
  
  return Array.from(entityMap.values()).sort((a, b) => b.confidence - a.confidence);
}

/**
 * ケーパビリティから単一エンティティを推論
 */
function inferEntityFromCapability(
  capability: BusinessCapability,
  operations: BusinessOperation[]
): InferredEntity | null {
  const capOperations = operations.filter(op => op.capabilityId === capability.id);
  
  // 基本エンティティの推論
  const entity: InferredEntity = {
    name: capability.name,
    displayName: capability.displayName,
    source: 'capability',
    confidence: 0.8,
    suggestedProperties: [
      { name: 'id', type: 'UUID', required: true },
      { name: 'createdAt', type: 'TIMESTAMP', required: true },
      { name: 'updatedAt', type: 'TIMESTAMP', required: true }
    ]
  };
  
  // オペレーションパターンから追加プロパティを推論
  const patterns = capOperations.map(op => op.pattern);
  
  if (patterns.includes('CRUD')) {
    entity.confidence = 0.9;
    entity.suggestedProperties!.push(
      { name: 'name', type: 'STRING_255', required: true },
      { name: 'description', type: 'TEXT', required: false },
      { name: 'isActive', type: 'BOOLEAN', required: false }
    );
  }
  
  if (patterns.includes('Workflow')) {
    entity.confidence = 0.95;
    entity.suggestedProperties!.push(
      { name: 'status', type: 'ENUM', required: true },
      { name: 'approvedBy', type: 'UUID', required: false },
      { name: 'approvedAt', type: 'TIMESTAMP', required: false },
      { name: 'rejectedBy', type: 'UUID', required: false },
      { name: 'rejectedAt', type: 'TIMESTAMP', required: false },
      { name: 'rejectionReason', type: 'TEXT', required: false }
    );
  }
  
  if (patterns.includes('Analytics')) {
    entity.suggestedProperties!.push(
      { name: 'metrics', type: 'JSON', required: false },
      { name: 'calculatedAt', type: 'TIMESTAMP', required: false }
    );
  }
  
  // 名前から追加の推論
  const nameInference = inferPropertiesFromName(capability.name);
  entity.suggestedProperties!.push(...nameInference);
  
  return entity;
}

/**
 * オペレーションから複数のエンティティを推論
 */
function inferEntitiesFromOperation(operation: BusinessOperation): InferredEntity[] {
  const entities: InferredEntity[] = [];
  
  // オペレーション名から関連エンティティを抽出
  const operationWords = extractMeaningfulWords(operation.name);
  
  // アクション動詞を除外して名詞を抽出
  const actionVerbs = ['create', 'update', 'delete', 'approve', 'reject', 'submit', 'calculate', 'generate'];
  const nouns = operationWords.filter(word => !actionVerbs.includes(word.toLowerCase()));
  
  // 複合名詞の検出（例: ProjectMember, TaskAssignment）
  if (nouns.length >= 2) {
    const compoundEntity = nouns.join('');
    if (isValidCompoundEntity(compoundEntity)) {
      entities.push({
        name: compoundEntity,
        displayName: nouns.map(n => capitalize(n)).join(' '),
        source: 'operation',
        confidence: 0.7,
        suggestedProperties: inferPropertiesFromCompound(nouns)
      });
    }
  }
  
  // ビジネスステートからエンティティを推論
  if (operation.businessStates && Array.isArray(operation.businessStates)) {
    operation.businessStates.forEach(state => {
      if (typeof state === 'object' && state.name) {
        const stateEntity = inferEntityFromState(state);
        if (stateEntity) {
          entities.push(stateEntity);
        }
      }
    });
  }
  
  return entities;
}

/**
 * パターン分析によるエンティティ推論
 */
function inferEntitiesFromPatterns(operations: BusinessOperation[]): InferredEntity[] {
  const entities: InferredEntity[] = [];
  const patternMap = new Map<string, string[]>();
  
  // 同じパターンを持つオペレーションをグループ化
  operations.forEach(op => {
    const pattern = op.pattern;
    if (!patternMap.has(pattern)) {
      patternMap.set(pattern, []);
    }
    patternMap.get(pattern)!.push(op.name);
  });
  
  // Workflowパターンから承認関連エンティティを推論
  if (patternMap.has('Workflow')) {
    const workflowOps = patternMap.get('Workflow')!;
    
    // 承認履歴エンティティ
    entities.push({
      name: 'ApprovalHistory',
      displayName: '承認履歴',
      source: 'pattern',
      confidence: 0.75,
      suggestedProperties: [
        { name: 'id', type: 'UUID', required: true },
        { name: 'targetId', type: 'UUID', required: true },
        { name: 'targetType', type: 'STRING_50', required: true },
        { name: 'action', type: 'ENUM', required: true },
        { name: 'actorId', type: 'UUID', required: true },
        { name: 'comment', type: 'TEXT', required: false },
        { name: 'createdAt', type: 'TIMESTAMP', required: true }
      ]
    });
    
    // ワークフローステップエンティティ
    entities.push({
      name: 'WorkflowStep',
      displayName: 'ワークフローステップ',
      source: 'pattern',
      confidence: 0.7,
      suggestedProperties: [
        { name: 'id', type: 'UUID', required: true },
        { name: 'workflowId', type: 'UUID', required: true },
        { name: 'stepNumber', type: 'INTEGER', required: true },
        { name: 'name', type: 'STRING_100', required: true },
        { name: 'status', type: 'ENUM', required: true },
        { name: 'assignedTo', type: 'UUID', required: false },
        { name: 'completedAt', type: 'TIMESTAMP', required: false }
      ]
    });
  }
  
  // Analyticsパターンからメトリクス関連エンティティを推論
  if (patternMap.has('Analytics')) {
    entities.push({
      name: 'MetricSnapshot',
      displayName: 'メトリクススナップショット',
      source: 'pattern',
      confidence: 0.7,
      suggestedProperties: [
        { name: 'id', type: 'UUID', required: true },
        { name: 'metricType', type: 'STRING_50', required: true },
        { name: 'targetId', type: 'UUID', required: true },
        { name: 'value', type: 'DECIMAL', required: true },
        { name: 'metadata', type: 'JSON', required: false },
        { name: 'calculatedAt', type: 'TIMESTAMP', required: true }
      ]
    });
  }
  
  return entities;
}

/**
 * 名前から追加プロパティを推論
 */
function inferPropertiesFromName(name: string): Array<{ name: string; type: string; required: boolean }> {
  const properties: Array<{ name: string; type: string; required: boolean }> = [];
  const lowerName = name.toLowerCase();
  
  // プロジェクト関連
  if (lowerName.includes('project')) {
    properties.push(
      { name: 'startDate', type: 'DATE', required: false },
      { name: 'endDate', type: 'DATE', required: false },
      { name: 'budget', type: 'MONEY', required: false },
      { name: 'progress', type: 'PERCENTAGE', required: false }
    );
  }
  
  // タスク関連
  if (lowerName.includes('task')) {
    properties.push(
      { name: 'priority', type: 'ENUM', required: false },
      { name: 'assignedTo', type: 'UUID', required: false },
      { name: 'dueDate', type: 'DATE', required: false },
      { name: 'completedAt', type: 'TIMESTAMP', required: false }
    );
  }
  
  // ユーザー関連
  if (lowerName.includes('user') || lowerName.includes('member')) {
    properties.push(
      { name: 'email', type: 'EMAIL', required: true },
      { name: 'role', type: 'STRING_50', required: true },
      { name: 'lastLoginAt', type: 'TIMESTAMP', required: false }
    );
  }
  
  // 財務関連
  if (lowerName.includes('invoice') || lowerName.includes('payment')) {
    properties.push(
      { name: 'amount', type: 'MONEY', required: true },
      { name: 'currency', type: 'STRING_3', required: true },
      { name: 'dueDate', type: 'DATE', required: false },
      { name: 'paidAt', type: 'TIMESTAMP', required: false }
    );
  }
  
  return properties;
}

/**
 * 複合名詞からプロパティを推論
 */
function inferPropertiesFromCompound(words: string[]): Array<{ name: string; type: string; required: boolean }> {
  const properties: Array<{ name: string; type: string; required: boolean }> = [
    { name: 'id', type: 'UUID', required: true },
    { name: 'createdAt', type: 'TIMESTAMP', required: true },
    { name: 'updatedAt', type: 'TIMESTAMP', required: true }
  ];
  
  // 関連エンティティへの参照を追加
  words.forEach(word => {
    const singular = singularize(word);
    properties.push({
      name: `${singular.charAt(0).toLowerCase() + singular.slice(1)}Id`,
      type: 'UUID',
      required: true
    });
  });
  
  return properties;
}

/**
 * ステートからエンティティを推論
 */
function inferEntityFromState(state: unknown): InferredEntity | null {
  if (!state.name || typeof state.name !== 'string') return null;
  
  // ステート遷移履歴エンティティ
  if (state.transitions && Array.isArray(state.transitions)) {
    return {
      name: `${capitalize(state.name)}History`,
      displayName: `${state.displayName || state.name}履歴`,
      source: 'operation',
      confidence: 0.65,
      suggestedProperties: [
        { name: 'id', type: 'UUID', required: true },
        { name: 'entityId', type: 'UUID', required: true },
        { name: 'fromState', type: 'STRING_50', required: true },
        { name: 'toState', type: 'STRING_50', required: true },
        { name: 'triggeredBy', type: 'UUID', required: true },
        { name: 'reason', type: 'TEXT', required: false },
        { name: 'transitionedAt', type: 'TIMESTAMP', required: true }
      ]
    };
  }
  
  return null;
}

/**
 * 意味のある単語を抽出
 */
function extractMeaningfulWords(text: string): string[] {
  // キャメルケースを分割
  const words = text.split(/(?=[A-Z])/).map(w => w.toLowerCase());
  
  // 一般的な接続詞や前置詞を除外
  const stopWords = ['and', 'or', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by'];
  
  return words.filter(word => 
    word.length > 2 && 
    !stopWords.includes(word) &&
    /^[a-z]+$/i.test(word)
  );
}

/**
 * 有効な複合エンティティかチェック
 */
function isValidCompoundEntity(name: string): boolean {
  // 一般的な複合エンティティのパターン
  const validPatterns = [
    /Project(Member|Task|Resource|Budget)/i,
    /Task(Assignment|Comment|Attachment)/i,
    /User(Role|Permission|Profile)/i,
    /Team(Member|Lead|Assignment)/i,
    /(Invoice|Payment)(Item|History|Status)/i
  ];
  
  return validPatterns.some(pattern => pattern.test(name));
}

/**
 * プロパティのマージ（重複除去）
 */
function mergeProperties(
  existing: Array<{ name: string; type: string; required: boolean }>,
  additional: Array<{ name: string; type: string; required: boolean }>
): Array<{ name: string; type: string; required: boolean }> {
  const propertyMap = new Map<string, { type: string; required: boolean }>();
  
  // 既存プロパティを追加
  existing.forEach(prop => {
    propertyMap.set(prop.name, { type: prop.type, required: prop.required });
  });
  
  // 追加プロパティをマージ
  additional.forEach(prop => {
    if (!propertyMap.has(prop.name)) {
      propertyMap.set(prop.name, { type: prop.type, required: prop.required });
    } else {
      // 既存の場合はより厳しい制約を採用
      const existing = propertyMap.get(prop.name)!;
      if (!existing.required && prop.required) {
        existing.required = true;
      }
    }
  });
  
  return Array.from(propertyMap.entries()).map(([name, { type, required }]) => ({
    name,
    type,
    required
  }));
}

/**
 * 単語を大文字で始める形式に変換
 */
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * 単語を単数形に変換（簡易版）
 */
function singularize(word: string): string {
  if (word.endsWith('ies')) {
    return word.slice(0, -3) + 'y';
  }
  if (word.endsWith('es')) {
    return word.slice(0, -2);
  }
  if (word.endsWith('s')) {
    return word.slice(0, -1);
  }
  return word;
}