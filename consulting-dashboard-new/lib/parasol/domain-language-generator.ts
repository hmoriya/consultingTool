/**
 * パラソルドメイン言語の段階的生成ユーティリティ
 * 
 * 生成フロー:
 * 1. ケーパビリティ定義から初期ドメイン言語を生成
 * 2. ビジネスオペレーションから詳細化
 * 3. ユースケースから最終確定
 */

import { BusinessCapability, BusinessOperation, DomainEntity, ValueObject, DomainService, State, DomainEvent } from '@/app/types/parasol';

/**
 * ケーパビリティ定義から初期ドメイン言語を生成
 */
export function generateInitialDomainLanguageFromCapabilities(
  capabilities: BusinessCapability[]
): string {
  const sections = [];
  
  // ヘッダー
  sections.push(`# パラソルドメイン言語定義
  
## 概要
このドメイン言語は、ビジネスケーパビリティ定義から自動生成された初期バージョンです。
ビジネスオペレーションとユースケースの詳細化により、段階的に充実させていきます。

## 生成元ケーパビリティ
${capabilities.map(cap => `- ${cap.displayName} [${cap.name}]`).join('\n')}

---
`);

  // エンティティセクション
  sections.push(`## エンティティ（Entities）

### 中核エンティティ`);

  // ケーパビリティ定義からキーワードを抽出してエンティティを推定
  capabilities.forEach(cap => {
    const entities = extractEntitiesFromText(cap.definition || '');
    if (entities.length > 0) {
      sections.push(`
#### ${cap.displayName}関連
${entities.map(entity => `- ${entity.displayName} [${entity.name}] [${entity.systemName}]
  - 説明: ${entity.description}
  - 主要属性:
    - ID [id] [${entity.systemName}_ID]: UUID
    - 作成日時 [createdAt] [CREATED_AT]: TIMESTAMP
    - 更新日時 [updatedAt] [UPDATED_AT]: TIMESTAMP`).join('\n')}`);
    }
  });

  // 値オブジェクトセクション
  sections.push(`
## 値オブジェクト（Value Objects）

### 共通値オブジェクト
- ステータス [Status] [STATUS]
  - 値: ENUM
  - 説明: 各エンティティの状態を表現
  
- 日付範囲 [DateRange] [DATE_RANGE]
  - 開始日 [startDate] [START_DATE]: DATE
  - 終了日 [endDate] [END_DATE]: DATE
  - 説明: 期間を表現する値オブジェクト`);

  // ドメインサービスセクション
  sections.push(`
## ドメインサービス（Domain Services）

### 主要サービス`);

  capabilities.forEach(cap => {
    const serviceName = deriveServiceNameFromCapability(cap);
    sections.push(`
- ${serviceName.displayName} [${serviceName.name}] [${serviceName.systemName}]
  - 責務: ${cap.description || cap.displayName + 'に関する処理'}
  - 主要オペレーション:
    - （ビジネスオペレーション定義後に詳細化）`);
  });

  // フッター
  sections.push(`
---

## 次のステップ

1. **ビジネスオペレーション定義による詳細化**
   - 各オペレーションで扱うエンティティと状態遷移を明確化
   - オペレーション固有の値オブジェクトを追加
   - ドメインサービスの具体的なメソッドを定義

2. **ユースケース定義による確定**
   - エンティティの完全な属性リストを確定
   - ビジネスルールと不変条件を明文化
   - 集約の境界を明確化

## 更新履歴
- ${new Date().toISOString()}: ケーパビリティ定義から初期生成`);

  return sections.join('\n');
}

/**
 * ビジネスオペレーションからドメイン言語を詳細化
 */
export function refineDomainLanguageFromOperations(
  currentDomainLanguage: string,
  operations: BusinessOperation[],
  capabilities: BusinessCapability[]
): string {
  const sections = [];
  
  // 既存のドメイン言語を解析（簡易的な実装）
  const existingContent = currentDomainLanguage || generateInitialDomainLanguageFromCapabilities(capabilities);
  
  // ヘッダー部分は維持
  const headerMatch = existingContent.match(/^(#.*?)\n##\s+エンティティ/s);
  if (headerMatch) {
    sections.push(headerMatch[1]);
  }

  // オペレーションから新しいエンティティと詳細を抽出
  const _additionalEntities = extractEntitiesFromOperations(operations);
  const _additionalStates = extractStatesFromOperations(operations);
  const additionalValueObjects = extractValueObjectsFromOperations(operations);
  
  // エンティティセクション（拡張版）
  sections.push(`## エンティティ（Entities）

### 中核エンティティ`);

  // オペレーションごとにグループ化
  const operationGroups = groupOperationsByCapability(operations, capabilities);
  
  operationGroups.forEach(group => {
    sections.push(`
#### ${group.capabilityName}

${group.entities.map(entity => `##### ${entity.displayName} [${entity.name}] [${entity.systemName}]
- 説明: ${entity.description}
- ライフサイクル: ${entity.lifecycle}
- 主要属性:
  - ID [id] [${entity.systemName}_ID]: UUID
  - ${entity.attributes.map(attr => `${attr.displayName} [${attr.name}] [${attr.systemName}]: ${attr.type}`).join('\n  - ')}
- ビジネスルール:
  ${entity.businessRules.map(rule => `- ${rule}`).join('\n  ')}
- 状態:
  ${entity.states.map(state => `- ${state.name}: ${state.description}`).join('\n  ')}`).join('\n\n')}`);
  });

  // 値オブジェクトセクション（拡張版）
  sections.push(`
## 値オブジェクト（Value Objects）

### 共通値オブジェクト
${additionalValueObjects.common.map(vo => `- ${vo.displayName} [${vo.name}] [${vo.systemName}]
  - 値: ${vo.type}
  - 説明: ${vo.description}
  - 制約: ${vo.constraints}`).join('\n')}

### ドメイン固有値オブジェクト
${additionalValueObjects.domainSpecific.map(vo => `- ${vo.displayName} [${vo.name}] [${vo.systemName}]
  - 値: ${vo.type}
  - 説明: ${vo.description}
  - ビジネスルール: ${vo.businessRules}`).join('\n')}`);

  // ドメインサービスセクション（詳細版）
  sections.push(`
## ドメインサービス（Domain Services）

### 主要サービス`);

  operationGroups.forEach(group => {
    const service = group.domainService;
    sections.push(`
#### ${service.displayName} [${service.name}] [${service.systemName}]
- 責務: ${service.responsibility}
- オペレーション:
${service.operations.map(op => `  - ${op.displayName} [${op.name}]
    - 入力: ${op.input}
    - 出力: ${op.output}
    - 前提条件: ${op.precondition}
    - 事後条件: ${op.postcondition}`).join('\n')}`);
  });

  // 集約セクション（新規追加）
  sections.push(`
## 集約（Aggregates）

### 集約ルート
${extractAggregatesFromOperations(operations).map(agg => `- ${agg.displayName} [${agg.name}]
  - ルート: ${agg.root}
  - メンバー: ${agg.members.join(', ')}
  - 不変条件: ${agg.invariants}
  - トランザクション境界: ${agg.transactionBoundary}`).join('\n')}`);

  // ドメインイベントセクション（新規追加）
  sections.push(`
## ドメインイベント（Domain Events）

${extractDomainEventsFromOperations(operations).map(event => `- ${event.displayName} [${event.name}]
  - 発生タイミング: ${event.trigger}
  - ペイロード: ${event.payload}
  - 影響: ${event.impact}`).join('\n')}`);

  // 更新履歴
  sections.push(`
---

## 更新履歴
- ${new Date().toISOString()}: ビジネスオペレーションから詳細化
${existingContent.match(/- \d{4}-\d{2}-\d{2}.*$/gm)?.join('\n') || ''}`);

  return sections.join('\n');
}

// ヘルパー関数群

function extractEntitiesFromText(_text: string): DomainEntity[] {
  // テキストからエンティティ候補を抽出（簡易実装）
  const _entityPatterns = [
    /(\w+)\s*\[([A-Z_]+)\]\s*\[([A-Z_]+)\]/g,
    /「(.+?)」/g,
    /\b([A-Z][a-z]+(?:[A-Z][a-z]+)*)\b/g
  ];
  
  const entities = [];
  // 実際の実装では、より高度な自然言語処理を使用
  
  return entities;
}

function extractEntitiesFromOperations(operations: BusinessOperation[]): DomainEntity[] {
  // オペレーションからエンティティを抽出
  const entities = new Map();
  
  operations.forEach(op => {
    // オペレーションの設計内容から抽出
    const _design = op.design || '';
    // 簡易的な実装 - 実際にはより高度な解析が必要
  });
  
  return Array.from(entities.values());
}

function extractStatesFromOperations(_operations: BusinessOperation[]): State[] {
  // オペレーションから状態を抽出
  return [];
}

function extractValueObjectsFromOperations(_operations: BusinessOperation[]): ValueObject[] {
  // オペレーションから値オブジェクトを抽出
  return {
    common: [],
    domainSpecific: []
  };
}

function extractAggregatesFromOperations(_operations: BusinessOperation[]): string[] {
  // オペレーションから集約を抽出
  return [];
}

function extractDomainEventsFromOperations(_operations: BusinessOperation[]): DomainEvent[] {
  // オペレーションからドメインイベントを抽出
  return [];
}

function groupOperationsByCapability(operations: BusinessOperation[], capabilities: BusinessCapability[]): { capability: BusinessCapability; operations: BusinessOperation[] }[] {
  // オペレーションをケーパビリティごとにグループ化
  const groups = [];
  
  capabilities.forEach(cap => {
    const capOperations = operations.filter(op => op.capabilityId === cap.id);
    if (capOperations.length > 0) {
      groups.push({
        capabilityName: cap.displayName,
        operations: capOperations,
        entities: [],
        domainService: {
          displayName: cap.displayName + 'サービス',
          name: cap.name + 'Service',
          systemName: cap.name.toUpperCase() + '_SERVICE',
          responsibility: cap.description,
          operations: []
        }
      });
    }
  });
  
  return groups;
}

function deriveServiceNameFromCapability(capability: BusinessCapability): DomainService {
  // ケーパビリティからサービス名を導出
  const baseName = capability.name.replace(/Capability$/, '');
  return {
    displayName: capability.displayName + 'サービス',
    name: baseName + 'Service',
    systemName: baseName.toUpperCase() + '_SERVICE'
  };
}