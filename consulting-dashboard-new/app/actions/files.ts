'use server';

import fs from 'fs/promises';
import path from 'path';

/**
 * パラソル設計ファイルの内容を読み込む
 */
export async function readParasolFile(filePath: string) {
  try {
    // セキュリティチェック: パラソル設計ディレクトリ内のファイルのみ許可
    const rootDir = process.cwd();
    const parasolDir = path.join(rootDir, 'docs', 'parasol');
    const fullPath = path.resolve(rootDir, filePath);

    if (!fullPath.startsWith(parasolDir)) {
      return { success: false, error: 'アクセス権限がありません' };
    }

    const content = await fs.readFile(fullPath, 'utf-8');
    return { success: true, data: content };
  } catch (error) {
    console.error('Failed to read file:', error);
    if (error instanceof Error && error.message.includes('ENOENT')) {
      return { success: false, error: 'ファイルが見つかりません' };
    }
    return { success: false, error: 'ファイルの読み込みに失敗しました' };
  }
}

/**
 * パラソル設計ファイルの内容を書き込む
 */
export async function writeParasolFile(filePath: string, content: string) {
  try {
    // セキュリティチェック: パラソル設計ディレクトリ内のファイルのみ許可
    const rootDir = process.cwd();
    const parasolDir = path.join(rootDir, 'docs', 'parasol');
    const fullPath = path.resolve(rootDir, filePath);

    if (!fullPath.startsWith(parasolDir)) {
      return { success: false, error: 'アクセス権限がありません' };
    }

    // ディレクトリが存在しない場合は作成
    const dirPath = path.dirname(fullPath);
    await fs.mkdir(dirPath, { recursive: true });

    await fs.writeFile(fullPath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Failed to write file:', error);
    return { success: false, error: 'ファイルの書き込みに失敗しました' };
  }
}

