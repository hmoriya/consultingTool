/**
 * パラソル生成設定
 * ケーパビリティ単位・サービス単位での生成を制御
 */

export type GenerationScope = 'capability' | 'service' | 'all';
export type GenerationTarget = 'domain' | 'api' | 'db' | 'all';

export interface GenerationConfig {
  scope: GenerationScope;
  target: GenerationTarget;
  serviceId?: string;
  capabilityId?: string;
  options: GenerationOptions;
}

export interface GenerationOptions {
  // ドメイン生成オプション
  domain?: {
    includeValueObjects: boolean;
    includeDomainServices: boolean;
    includeRepositories: boolean;
    includeEvents: boolean;
  };
  
  // API生成オプション
  api?: {
    includeSwagger: boolean;
    includeValidation: boolean;
    includePagination: boolean;
    baseUrl?: string;
  };
  
  // DB生成オプション
  db?: {
    includeIndexes: boolean;
    includeConstraints: boolean;
    includeTriggers: boolean;
    databaseType: 'sqlite' | 'postgresql' | 'mysql';
  };
  
  // 共通オプション
  overwriteExisting: boolean;
  generateTests: boolean;
  generateDocs: boolean;
}

/**
 * デフォルトの生成設定
 */
export const defaultGenerationOptions: GenerationOptions = {
  domain: {
    includeValueObjects: true,
    includeDomainServices: true,
    includeRepositories: true,
    includeEvents: true
  },
  api: {
    includeSwagger: true,
    includeValidation: true,
    includePagination: true
  },
  db: {
    includeIndexes: true,
    includeConstraints: true,
    includeTriggers: false,
    databaseType: 'sqlite'
  },
  overwriteExisting: false,
  generateTests: false,
  generateDocs: true
};

/**
 * ケーパビリティごとの生成設定プリセット
 */
export const capabilityPresets: Record<string, Partial<GenerationOptions>> = {
  // コアケーパビリティ：フル機能生成
  core: {
    domain: {
      includeValueObjects: true,
      includeDomainServices: true,
      includeRepositories: true,
      includeEvents: true
    },
    generateTests: true,
    generateDocs: true
  },
  
  // サポーティングケーパビリティ：標準機能のみ
  supporting: {
    domain: {
      includeValueObjects: true,
      includeDomainServices: false,
      includeRepositories: true,
      includeEvents: false
    },
    generateTests: false,
    generateDocs: true
  },
  
  // 汎用ケーパビリティ：最小限の機能
  generic: {
    domain: {
      includeValueObjects: false,
      includeDomainServices: false,
      includeRepositories: true,
      includeEvents: false
    },
    generateTests: false,
    generateDocs: false
  }
};

/**
 * 生成スコープに基づいてケーパビリティをフィルタリング
 */
export function filterCapabilitiesByScope(
  capabilities: any[],
  config: GenerationConfig
): any[] {
  switch (config.scope) {
    case 'capability':
      return capabilities.filter(cap => cap.id === config.capabilityId);
    case 'service':
      return capabilities.filter(cap => cap.serviceId === config.serviceId);
    case 'all':
      return capabilities;
    default:
      return [];
  }
}

/**
 * 生成設定の検証
 */
export function validateGenerationConfig(config: GenerationConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // スコープ別の検証
  if (config.scope === 'capability' && !config.capabilityId) {
    errors.push('ケーパビリティ単位の生成にはcapabilityIdが必要です');
  }
  
  if (config.scope === 'service' && !config.serviceId) {
    errors.push('サービス単位の生成にはserviceIdが必要です');
  }
  
  // DBタイプの検証
  const validDbTypes = ['sqlite', 'postgresql', 'mysql'];
  if (config.options.db && !validDbTypes.includes(config.options.db.databaseType)) {
    errors.push(`無効なデータベースタイプ: ${config.options.db.databaseType}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * ケーパビリティのカテゴリに基づいて生成設定を取得
 */
export function getGenerationOptionsByCategory(category: string): GenerationOptions {
  const preset = capabilityPresets[category.toLowerCase()] || {};
  return {
    ...defaultGenerationOptions,
    ...preset
  };
}