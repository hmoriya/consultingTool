/**
 * パラソル設計ファイルパスユーティリティ
 */

/**
 * ユースケースのAPI利用仕様ファイルパスを構築
 */
export function buildApiUsageFilePath(serviceName: string, capabilityName: string, operationName: string, usecaseName: string): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/api-usage.md`;
}

/**
 * ユースケースファイルパスを構築
 */
export function buildUsecaseFilePath(serviceName: string, capabilityName: string, operationName: string, usecaseName: string): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/usecase.md`;
}

/**
 * ページファイルパスを構築
 */
export function buildPageFilePath(serviceName: string, capabilityName: string, operationName: string, usecaseName: string): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/page.md`;
}