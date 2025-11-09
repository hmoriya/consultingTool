/**
 * Vercel環境設定とコード設計の統合ユーティリティ
 */

// Vercel環境変数
export const VERCEL_CONFIG = {
  // ランタイム設定
  runtime: 'nodejs18.x' as const,
  maxDuration: 30, // 30秒（Pro planでは60秒）
  memory: 1024, // MB
  
  // リージョン設定
  region: 'iad1' as const, // Washington D.C.
  
  // 環境判定
  isProduction: process.env.NODE_ENV === 'production',
  isVercel: !!process.env.VERCEL,
  isPreview: process.env.VERCEL_ENV === 'preview',
  
  // URL設定
  baseUrl: process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000',
}

// APIレスポンス統一フォーマット
export interface VercelApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
  region?: string
}

/**
 * Vercel対応APIレスポンス作成
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string
): VercelApiResponse<T> {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString(),
    region: VERCEL_CONFIG.region
  }
}

/**
 * Vercel Function最適化ヘルパー
 */
export function withVercelOptimization<T extends (...args: any[]) => any>(
  handler: T,
  options?: {
    maxDuration?: number
    cache?: boolean
  }
): T {
  return (async (...args: Parameters<T>) => {
    const startTime = Date.now()
    
    try {
      const result = await handler(...args)
      
      // パフォーマンスログ
      const duration = Date.now() - startTime
      if (duration > (options?.maxDuration || VERCEL_CONFIG.maxDuration) * 1000) {
        console.warn(`Function exceeded expected duration: ${duration}ms`)
      }
      
      return result
    } catch (error) {
      console.error('Vercel function error:', error)
      throw error
    }
  }) as T
}

/**
 * Edge Runtime対応チェック
 */
export function isEdgeRuntimeCompatible(code: string): boolean {
  // Edge Runtimeで使用できないNode.js APIをチェック
  const nodeOnlyAPIs = [
    'fs.',
    'path.',
    'crypto.randomBytes',
    'child_process',
    'net.',
    'tls.',
    'dgram.',
    'dns.'
  ]
  
  return !nodeOnlyAPIs.some(api => code.includes(api))
}

/**
 * 地域最適化設定
 */
export const REGION_CONFIG = {
  database: {
    // データベースに近いリージョン使用
    preferredRegion: 'iad1', // 東海岸
    fallbackRegion: 'sfo1'   // 西海岸
  },
  cdn: {
    // 静的アセット配信最適化
    cacheControl: 'public, max-age=31536000, immutable',
    regions: ['iad1', 'sfo1', 'fra1'] // 主要3地域
  }
}

/**
 * Vercel環境別設定
 */
export function getEnvironmentConfig() {
  if (VERCEL_CONFIG.isProduction) {
    return {
      logLevel: 'error',
      caching: true,
      monitoring: true,
      timeout: 30000
    }
  } else if (VERCEL_CONFIG.isPreview) {
    return {
      logLevel: 'warn',
      caching: false,
      monitoring: true,
      timeout: 25000
    }
  } else {
    return {
      logLevel: 'debug',
      caching: false,
      monitoring: false,
      timeout: 20000
    }
  }
}