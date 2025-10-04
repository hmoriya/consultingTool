#!/bin/bash

# Issue駆動開発ワークフロー自動化スクリプト
# 使用法: ./scripts/auto-workflow.sh "Issue タイトル" "Issue 説明"

set -e

ISSUE_TITLE="$1"
ISSUE_BODY="$2"

if [ -z "$ISSUE_TITLE" ]; then
    echo "エラー: Issue タイトルが必要です"
    echo "使用法: $0 \"Issue タイトル\" \"Issue 説明\""
    exit 1
fi

echo "🚀 Issue駆動開発ワークフロー開始"

# 1. Issue作成
echo "📝 Issue作成中..."
ISSUE_NUMBER=$(gh issue create \
    --title "$ISSUE_TITLE" \
    --body "$ISSUE_BODY" \
    --assignee @me \
    --label "enhancement" | grep -o '#[0-9]*' | tr -d '#')

echo "✅ Issue #$ISSUE_NUMBER を作成しました"

# 2. ブランチ作成
BRANCH_NAME="feature/${ISSUE_NUMBER}-$(echo "$ISSUE_TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')"
echo "🌿 ブランチ作成中: $BRANCH_NAME"

git checkout -b "$BRANCH_NAME"

echo "✅ ブランチ '$BRANCH_NAME' を作成し、チェックアウトしました"

# 3. 開発準備完了メッセージ
echo ""
echo "🎯 開発準備完了！"
echo "   Issue: #$ISSUE_NUMBER - $ISSUE_TITLE"
echo "   ブランチ: $BRANCH_NAME"
echo ""
echo "次のステップ:"
echo "1. コードを編集・開発"
echo "2. git add . && git commit -m \"feat: 機能追加 (#$ISSUE_NUMBER)\""
echo "3. ./scripts/auto-pr.sh $ISSUE_NUMBER でPR作成・マージ"