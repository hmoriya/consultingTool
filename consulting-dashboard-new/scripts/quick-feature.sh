#!/bin/bash

# クイック機能開発スクリプト（全自動）
# 使用法: ./scripts/quick-feature.sh "機能名" "実装内容の説明"

set -e

FEATURE_NAME="$1"
DESCRIPTION="$2"

if [ -z "$FEATURE_NAME" ]; then
    echo "エラー: 機能名が必要です"
    echo "使用法: $0 \"機能名\" \"実装内容の説明\""
    echo "例: $0 \"ユーザープロファイル編集機能\" \"ユーザーが自分のプロファイル情報を編集できる機能を追加\""
    exit 1
fi

if [ -z "$DESCRIPTION" ]; then
    DESCRIPTION="$FEATURE_NAME の実装"
fi

echo "⚡ クイック機能開発ワークフロー開始"
echo "   機能: $FEATURE_NAME"

# 1. 自動Issue作成・ブランチ作成
echo "🎯 Step 1: Issue・ブランチ作成"
ISSUE_BODY="## 概要
$DESCRIPTION

## 要件
- [ ] 機能実装
- [ ] テスト作成
- [ ] ドキュメント更新

## 受入条件
- [ ] 実装が完了している
- [ ] 適切なテストが追加されている
- [ ] エラーハンドリングが実装されている

🤖 Generated with [Claude Code](https://claude.com/claude-code)"

./scripts/auto-workflow.sh "$FEATURE_NAME" "$ISSUE_BODY"

# ブランチ名からIssue番号を取得
CURRENT_BRANCH=$(git branch --show-current)
ISSUE_NUMBER=$(echo "$CURRENT_BRANCH" | grep -o '[0-9]*' | head -1)

echo ""
echo "🛠️  Step 2: 開発作業"
echo "   Issue #$ISSUE_NUMBER が作成されました"
echo "   ブランチ '$CURRENT_BRANCH' で開発を開始してください"
echo ""
echo "開発完了後、以下のコマンドで自動化を続行:"
echo "   git add . && git commit -m \"feat: $FEATURE_NAME を実装 (#$ISSUE_NUMBER)\""
echo "   ./scripts/auto-pr.sh $ISSUE_NUMBER"
echo ""
echo "または、ワンライナーで:"
echo "   git add . && git commit -m \"feat: $FEATURE_NAME を実装 (#$ISSUE_NUMBER)\" && ./scripts/auto-pr.sh $ISSUE_NUMBER"