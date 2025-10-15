'use server';

import fs from 'fs/promises';
import path from 'path';

/**
 * パラソル設計ファイルの内容を読み込む（無効化済み - Issue #148対応）
 *
 * ⚠️ SECURITY NOTICE: この関数は無効化されています
 * Issue #148: パラソル設計データ参照方式の意図しない変更への対応
 *
 * パラソル設計データは必ずAPI経由でデータベースからアクセスしてください：
 * - ユースケース定義: usecase.definition (DB)
 * - ページ定義: pageDefinition.content (DB)
 * - API利用仕様: usecase.apiUsageDefinition (DB)
 */
export async function readParasolFile(filePath: string) {
  console.warn('⚠️ readParasolFile は無効化されています - Issue #148対応');
  console.warn('パラソル設計データはAPI経由でDBからアクセスしてください');
  console.warn('ファイルパス:', filePath);

  // 直接ファイル参照の代わりに、データベース参照を促すエラーを返す
  return {
    success: false,
    error: 'ファイル直接参照は無効化されています。API経由でDBからデータを取得してください。',
    warningType: 'FILE_ACCESS_DISABLED',
    solution: 'パラソル設計データはAPI経由でデータベースからアクセスしてください'
  };
}

/**
 * パラソル設計ファイルの内容を書き込む（無効化済み - Issue #148対応）
 *
 * ⚠️ SECURITY NOTICE: この関数は無効化されています
 * Issue #148: パラソル設計データ参照方式の意図しない変更への対応
 *
 * パラソル設計データは必ずAPI経由でデータベースに保存してください：
 * - ユースケース定義: usecase.definition (DB更新)
 * - ページ定義: pageDefinition.content (DB更新)
 * - API利用仕様: usecase.apiUsageDefinition (DB更新)
 */
export async function writeParasolFile(filePath: string, content: string) {
  console.warn('⚠️ writeParasolFile は無効化されています - Issue #148対応');
  console.warn('パラソル設計データはAPI経由でDBに保存してください');
  console.warn('ファイルパス:', filePath);
  console.warn('コンテンツ長:', content.length, '文字');

  // 直接ファイル書き込みの代わりに、データベース更新を促すエラーを返す
  return {
    success: false,
    error: 'ファイル直接書き込みは無効化されています。API経由でDBにデータを保存してください。',
    warningType: 'FILE_WRITE_DISABLED',
    solution: 'パラソル設計データはAPI経由でデータベースに保存してください'
  };
}

