import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface FileMetadata {
  title: string;
  description: string;
  version: string;
  lastModified: Date;
  author: string;
  tags: string[];
  category: string;
}

interface FileData {
  content: string;
  metadata: FileMetadata;
  exists: boolean;
  lastModified: Date;
}

interface UpdateFileRequest {
  content: string;
  metadata?: Partial<FileMetadata>;
}

// ファイル読み取り
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // セキュリティ: パスの検証
    if (!isValidPath(filePath)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), filePath);

    try {
      // ファイルの存在確認と読み込み
      const stats = await fs.stat(fullPath);
      const content = await fs.readFile(fullPath, 'utf-8');

      // メタデータの抽出（ファイル内容から）
      const metadata = extractMetadata(content, filePath);

      const response: FileData = {
        content,
        metadata,
        exists: true,
        lastModified: stats.mtime,
      };

      return NextResponse.json(response);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // ファイルが存在しない場合
        const response: FileData = {
          content: '',
          metadata: getDefaultMetadata(filePath),
          exists: false,
          lastModified: new Date(),
        };

        return NextResponse.json(response);
      }

      throw error;
    }
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    );
  }
}

// ファイル書き込み
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // セキュリティ: パスの検証
    if (!isValidPath(filePath)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    const body: UpdateFileRequest = await request.json();

    if (!body.content === undefined) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), filePath);

    // ディレクトリの作成（必要に応じて）
    const dirPath = path.dirname(fullPath);
    await fs.mkdir(dirPath, { recursive: true });

    // メタデータの更新
    const updatedContent = updateMetadata(body.content, body.metadata);

    // ファイルの書き込み
    await fs.writeFile(fullPath, updatedContent, 'utf-8');

    const stats = await fs.stat(fullPath);

    const response = {
      success: true,
      lastModified: stats.mtime,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error writing file:', error);
    return NextResponse.json(
      { error: 'Failed to write file' },
      { status: 500 }
    );
  }
}

// ファイル削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // セキュリティ: パスの検証
    if (!isValidPath(filePath)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), filePath);

    try {
      await fs.unlink(fullPath);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // ファイルが存在しない場合は成功とみなす
        return NextResponse.json({ success: true });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

// パスの検証（セキュリティ）
function isValidPath(filePath: string): boolean {
  // パラソルドキュメント内のファイルのみ許可
  const allowedPrefixes = [
    'docs/parasol/',
  ];

  const allowedExtensions = ['.md'];

  // プレフィックスチェック
  const hasValidPrefix = allowedPrefixes.some(prefix =>
    filePath.startsWith(prefix)
  );

  if (!hasValidPrefix) {
    return false;
  }

  // 拡張子チェック
  const hasValidExtension = allowedExtensions.some(ext =>
    filePath.endsWith(ext)
  );

  if (!hasValidExtension) {
    return false;
  }

  // パストラバーサル攻撃の防止
  if (filePath.includes('..') || filePath.includes('//')) {
    return false;
  }

  return true;
}

// ファイル内容からメタデータを抽出
function extractMetadata(content: string, filePath: string): FileMetadata {
  const lines = content.split('\n');
  const title = extractTitle(lines);
  const category = getFileCategory(filePath);

  return {
    title: title || getDefaultTitle(filePath),
    description: extractDescription(lines) || '',
    version: extractVersion(lines) || '1.0.0',
    lastModified: new Date(),
    author: 'current-user', // 実際の認証システムから取得
    tags: extractTags(lines),
    category,
  };
}

// デフォルトメタデータの生成
function getDefaultMetadata(filePath: string): FileMetadata {
  const category = getFileCategory(filePath);
  const title = getDefaultTitle(filePath);

  return {
    title,
    description: '',
    version: '1.0.0',
    lastModified: new Date(),
    author: 'current-user',
    tags: [],
    category,
  };
}

// ファイルパスからカテゴリを取得
function getFileCategory(filePath: string): string {
  if (filePath.endsWith('/usecase.md')) return 'usecase';
  if (filePath.endsWith('/page.md')) return 'page';
  if (filePath.endsWith('/api-usage.md')) return 'api-usage';
  return 'unknown';
}

// ファイルパスからデフォルトタイトルを生成
function getDefaultTitle(filePath: string): string {
  const parts = filePath.split('/');
  const usecaseName = parts[parts.length - 2]; // ユースケース名
  const fileName = parts[parts.length - 1]; // ファイル名

  if (fileName === 'usecase.md') {
    return `ユースケース: ${usecaseName}`;
  } else if (fileName === 'page.md') {
    return `ページ定義: ${usecaseName}`;
  } else if (fileName === 'api-usage.md') {
    return `API利用仕様: ${usecaseName}`;
  }

  return usecaseName;
}

// タイトルの抽出
function extractTitle(lines: string[]): string | null {
  for (const line of lines) {
    const match = line.match(/^#\s+(.+)$/);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

// 説明の抽出
function extractDescription(lines: string[]): string | null {
  let foundTitle = false;
  for (const line of lines) {
    if (line.match(/^#\s+/)) {
      foundTitle = true;
      continue;
    }
    if (foundTitle && line.trim() && !line.startsWith('#')) {
      return line.trim();
    }
  }
  return null;
}

// バージョンの抽出
function extractVersion(lines: string[]): string | null {
  for (const line of lines) {
    const match = line.match(/\*\*バージョン\*\*:\s*(.+)$/);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

// タグの抽出
function extractTags(lines: string[]): string[] {
  for (const line of lines) {
    const match = line.match(/\*\*タグ\*\*:\s*(.+)$/);
    if (match) {
      return match[1].split(',').map(tag => tag.trim());
    }
  }
  return [];
}

// メタデータの更新
function updateMetadata(content: string, metadata?: Partial<FileMetadata>): string {
  if (!metadata) return content;

  // 簡単な実装: ここでは内容をそのまま返す
  // 実際には、マークダウンのヘッダーやフロントマターを更新する
  return content;
}