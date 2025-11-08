/**
 * Mermaid形式のプロセスフローをテキスト形式に変換するスクリプト
 *
 * 実行方法:
 * tsx scripts/convert-mermaid-to-text.ts
 */

import { PrismaClient } from '@prisma/parasol-service';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PARASOL_DATABASE_URL || 'file:./prisma/parasol-service/data/parasol.db'
    }
  }
});

/**
 * Mermaidフローチャートからステップを抽出してテキスト形式に変換
 */
function convertMermaidToTextFlow(mermaidCode: string): string[] {
  const steps: string[] = [];

  // Mermaidコードからノード定義を抽出
  // 形式例: A[パスワード変更要求] --> B[現在のパスワード確認]
  const nodePattern = /([A-Z]\d*)\[([^\]]+)\]/g;
  const nodes = new Map<string, string>();

  let match;
  while ((match = nodePattern.exec(mermaidCode)) !== null) {
    const [, nodeId, nodeLabel] = match;
    nodes.set(nodeId, nodeLabel);
  }

  // 接続パターンを抽出してシーケンスを構築
  const connectionPattern = /([A-Z]\d*)\s*--[>|-]/g;
  const connections = [];
  while ((match = connectionPattern.exec(mermaidCode)) !== null) {
    connections.push(match[1]);
  }

  // ノードを順番に並べてステップとして出力
  const visited = new Set<string>();
  connections.forEach((nodeId) => {
    if (!visited.has(nodeId) && nodes.has(nodeId)) {
      const label = nodes.get(nodeId)!;
      // 条件分岐などの特殊なラベルは除外
      if (!label.includes('?') && label.length > 0) {
        steps.push(label);
        visited.add(nodeId);
      }
    }
  });

  return steps;
}

/**
 * プロセスフローセクションをMermaid形式からテキスト形式に置き換え
 */
function replaceProcessFlow(design: string): string {
  // プロセスフローセクションを検索
  const processFlowPattern = /## プロセスフロー\s*\n\s*```mermaid\s*\n([\s\S]*?)\n\s*```/;
  const match = design.match(processFlowPattern);

  if (!match) {
    console.log('  Mermaidブロックが見つかりません');
    return design;
  }

  const mermaidCode = match[1];
  const steps = convertMermaidToTextFlow(mermaidCode);

  if (steps.length === 0) {
    console.log('  ステップを抽出できませんでした');
    return design;
  }

  // テキスト形式のプロセスフローを生成
  const textFlow = steps.map((step, index) => `${index + 1}. ${step}`).join('\n');

  // プロセスフローセクションを置き換え
  const newProcessFlow = `## プロセスフロー\n\n${textFlow}`;

  return design.replace(processFlowPattern, newProcessFlow);
}

/**
 * 例外処理セクションがMarkdownリスト形式か確認・変換
 */
function ensureExceptionListFormat(design: string): string {
  // 例外処理セクションを検索
  const exceptionPattern = /## 例外処理\s*\n\s*([\s\S]*?)(?=\n##|$)/;
  const match = design.match(exceptionPattern);

  if (!match) {
    return design;
  }

  const exceptionContent = match[1];

  // すでにサブセクション形式（### 例外1:）になっている場合はそのまま
  if (exceptionContent.includes('### 例外')) {
    return design;
  }

  // 単純な箇条書き形式の場合は、サブセクション形式に変換
  // 形式: - **エラー名**: 説明
  const listItems = exceptionContent.match(/- \*\*([^*]+)\*\*:\s*(.+)/g);

  if (listItems && listItems.length > 0) {
    let newExceptionContent = '\n';
    listItems.forEach((item, index) => {
      const itemMatch = item.match(/- \*\*([^*]+)\*\*:\s*(.+)/);
      if (itemMatch) {
        const [, errorName, description] = itemMatch;
        newExceptionContent += `### 例外${index + 1}: ${errorName}\n- ${description}\n\n`;
      }
    });

    return design.replace(exceptionPattern, `## 例外処理${newExceptionContent}`);
  }

  return design;
}

async function main() {
  console.log('ビジネスオペレーションのプロセスフローを変換中...\n');

  // すべてのビジネスオペレーションを取得
  const operations = await prisma.business_operations.findMany({
    select: {
      id: true,
      name: true,
      displayName: true,
      design: true
    }
  });

  console.log(`合計 ${operations.length} 件のオペレーションを処理します\n`);

  let convertedCount = 0;
  let skippedCount = 0;

  // バックアップディレクトリを作成
  const backupDir = path.join(process.cwd(), 'backups', 'operations');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  for (const operation of operations) {
    console.log(`処理中: ${operation.displayName} (${operation.name})`);

    // Mermaid形式が含まれているか確認
    if (!operation.design.includes('```mermaid')) {
      console.log('  スキップ: すでにテキスト形式です\n');
      skippedCount++;
      continue;
    }

    // バックアップを保存
    const backupPath = path.join(backupDir, `${operation.name}-original.md`);
    fs.writeFileSync(backupPath, operation.design, 'utf-8');
    console.log(`  バックアップ保存: ${backupPath}`);

    // プロセスフローを変換
    let newDesign = replaceProcessFlow(operation.design);

    // 例外処理も適切な形式に変換
    newDesign = ensureExceptionListFormat(newDesign);

    // データベースを更新
    await prisma.business_operations.update({
      where: { id: operation.id },
      data: {
        design: newDesign,
        updatedAt: new Date()
      }
    });

    console.log('  ✓ 変換完了\n');
    convertedCount++;
  }

  console.log('=== 変換完了 ===');
  console.log(`変換: ${convertedCount} 件`);
  console.log(`スキップ: ${skippedCount} 件`);
  console.log(`合計: ${operations.length} 件`);

  await prisma.$disconnect();
}

main()
  .catch((error) => {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  });
