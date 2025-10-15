/**
 * パラソル設計ファイル操作のユーティリティ関数
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
 * オペレーションディレクトリパスを構築
 */
export function buildOperationDirPath(
  serviceName: string,
  capabilityName: string,
  operationName: string
): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}`;
}

/**
 * ユースケースディレクトリパスを構築
 */
export function buildUsecaseDirPath(
  serviceName: string,
  capabilityName: string,
  operationName: string,
  usecaseName: string
): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}`;
}