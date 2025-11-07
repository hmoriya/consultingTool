#!/usr/bin/env node

/**
 * Issue #118: 全ビジネスオペレーションをMermaid形式からテキスト形式に変換
 *
 * このスクリプトは55個のビジネスオペレーションMDファイルのうち、
 * Mermaidフローチャートを使用しているファイルをテキスト形式に変換します。
 */

import fs from 'fs/promises';
import { glob } from 'glob';

// 変換対象から除外するファイル（既にテキスト形式）
const EXCLUDED_FILES = [
  'manage-passwords/operation.md',
  'register-and-authenticate-users/operation.md'
];

// Mermaidフローチャートをテキスト形式に変換
function convertMermaidToText(content) {
  // プロセスフローセクションを検索
  const processFlowRegex = /(## プロセスフロー[\s\S]*?)(\n\n## |$)/;
  const match = content.match(processFlowRegex);

  if (!match) {
    console.log('プロセスフローセクションが見つかりません');
    return content;
  }

  const processFlowSection = match[1];

  // Mermaidブロックを検索
  const mermaidRegex = /```mermaid\s*flowchart[\s\S]*?```/;
  const mermaidMatch = processFlowSection.match(mermaidRegex);

  if (!mermaidMatch) {
    console.log('Mermaidフローチャートが見つかりません');
    return content;
  }

  // Mermaidフローチャートからステップを抽出
  const mermaidContent = mermaidMatch[0];
  const steps = extractStepsFromMermaid(mermaidContent);

  // テキスト形式のプロセスフローを生成
  const textProcessFlow = generateTextProcessFlow(steps);

  // 元のプロセスフローセクションを置換
  const newProcessFlowSection = textProcessFlow;
  const newContent = content.replace(processFlowSection, newProcessFlowSection);

  return newContent;
}

// Mermaidからステップを抽出（簡単な実装）
function extractStepsFromMermaid(mermaidContent) {
  // 基本的なパターンマッチングでノードを抽出
  const nodeRegex = /([A-Z])\[([^\]]+)\]/g;
  const steps = [];
  let match;

  while ((match = nodeRegex.exec(mermaidContent)) !== null) {
    const [, nodeId, nodeText] = match;
    steps.push({
      id: nodeId,
      text: nodeText.trim()
    });
  }

  return steps;
}

// テキスト形式のプロセスフローを生成
function generateTextProcessFlow(steps) {
  const header = `## プロセスフロー

> **重要**: プロセスフローは必ず番号付きリスト形式で記述してください。
> Mermaid形式は使用せず、テキスト形式で記述することで、代替フローと例外フローが視覚的に分離されたフローチャートが自動生成されます。

`;

  // ステップをテキストに変換
  const textSteps = steps.map((step, index) => {
    let text = step.text;

    // 動詞を追加してより自然な文章に
    if (text.includes('申請') || text.includes('登録')) {
      text = `ユーザーが${text}を行う`;
    } else if (text.includes('確認') || text.includes('検証')) {
      text = `システムが${text}を実行する`;
    } else if (text.includes('作成') || text.includes('発行') || text.includes('通知')) {
      text = `システムが${text}を行う`;
    } else if (text.includes('処理') || text.includes('実行')) {
      text = `システムが${text}を実行する`;
    } else if (text.includes('許可') || text.includes('承認')) {
      text = `システムが${text}を行う`;
    } else if (text.includes('試行')) {
      text = `ユーザーが${text}を行う`;
    } else if (!text.includes('システム') && !text.includes('ユーザー')) {
      text = `システムが${text}を処理する`;
    }

    return `${index + 1}. ${text}`;
  }).join('\n');

  const alternativeFlow = `

## 代替フロー

### 代替フロー1: 情報不備
- 2-1. システムが情報の不備を検知する
- 2-2. システムが修正要求を送信する
- 2-3. ユーザーが情報を修正し再実行する
- 2-4. 基本フロー2に戻る

## 例外処理

### 例外1: システムエラー
- システムエラーが発生した場合
- エラーメッセージを表示する
- 管理者に通知し、ログに記録する

### 例外2: 承認却下
- 承認が却下された場合
- 却下理由をユーザーに通知する
- 修正後の再実行を促す`;

  return header + textSteps + alternativeFlow;
}

// ファイルが除外対象かチェック
function isExcludedFile(filePath) {
  return EXCLUDED_FILES.some(excluded => filePath.includes(excluded));
}

// メイン処理
async function main() {
  try {
    console.log('🚀 ビジネスオペレーション一括変換開始');

    // 対象ファイルを検索
    const pattern = 'docs/parasol/services/**/operations/*/operation.md';
    const files = glob.sync(pattern);

    console.log(`📁 見つかったファイル: ${files.length}個`);

    let converted = 0;
    let skipped = 0;

    for (const file of files) {
      if (isExcludedFile(file)) {
        console.log(`⏭️  スキップ: ${file} (既にテキスト形式)`);
        skipped++;
        continue;
      }

      try {
        console.log(`🔄 変換中: ${file}`);

        // ファイル読み込み
        const content = await fs.readFile(file, 'utf-8');

        // Mermaidフローチャートが含まれるかチェック
        if (!content.includes('```mermaid\nflowchart') && !content.includes('```mermaid\\nflowchart')) {
          console.log(`⏭️  スキップ: ${file} (Mermaidフローチャートなし)`);
          skipped++;
          continue;
        }

        // 変換実行
        const convertedContent = convertMermaidToText(content);

        // ファイル書き込み
        await fs.writeFile(file, convertedContent, 'utf-8');

        console.log(`✅ 変換完了: ${file}`);
        converted++;

      } catch (error) {
        console.error(`❌ エラー: ${file}`, error.message);
      }
    }

    console.log('\n📊 変換結果:');
    console.log(`   ✅ 変換完了: ${converted}個`);
    console.log(`   ⏭️  スキップ: ${skipped}個`);
    console.log(`   📁 総ファイル: ${files.length}個`);

    if (converted > 0) {
      console.log('\n🎉 変換が完了しました！');
      console.log('次のステップ: API経由でデータベースを更新してください');
      console.log('curl -X POST http://localhost:3000/api/parasol/import -H "Content-Type: application/json" -d \'{}\'');
    }

  } catch (error) {
    console.error('💥 スクリプトエラー:', error);
    process.exit(1);
  }
}

// Node.jsスクリプトとして実行された場合のみ実行
if (require.main === module) {
  main();
}

module.exports = { convertMermaidToText, extractStepsFromMermaid, generateTextProcessFlow };