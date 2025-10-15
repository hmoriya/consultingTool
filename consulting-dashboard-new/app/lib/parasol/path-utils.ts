/**
 * パラソル設計ファイルパス構築のユーティリティ関数群
 */

/**
 * ユースケースのAPI利用仕様ファイルパスを構築
 */
export function buildApiUsageFilePath(
  serviceName: string,
  capabilityName: string,
  operationName: string,
  usecaseName: string
): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/api-usage.md`;
}

/**
 * ユースケースファイルパスを構築
 */
export function buildUsecaseFilePath(
  serviceName: string,
  capabilityName: string,
  operationName: string,
  usecaseName: string
): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/usecase.md`;
}

/**
 * ページファイルパスを構築
 */
export function buildPageFilePath(
  serviceName: string,
  capabilityName: string,
  operationName: string,
  usecaseName: string
): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/page.md`;
}

/**
 * オペレーションファイルパスを構築
 */
export function buildOperationFilePath(
  serviceName: string,
  capabilityName: string,
  operationName: string
): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/operation.md`;
}

/**
 * サービスファイルパスを構築
 */
export function buildServiceFilePath(serviceName: string): string {
  return `docs/parasol/services/${serviceName}/service.md`;
}