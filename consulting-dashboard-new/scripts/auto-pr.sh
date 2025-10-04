#!/bin/bash

# PR作成・マージ自動化スクリプト
# 使用法: ./scripts/auto-pr.sh [ISSUE_NUMBER]

set -e

ISSUE_NUMBER="$1"
CURRENT_BRANCH=$(git branch --show-current)

if [ -z "$ISSUE_NUMBER" ]; then
    # ブランチ名からIssue番号を抽出
    ISSUE_NUMBER=$(echo "$CURRENT_BRANCH" | grep -o '[0-9]*' | head -1)
fi

if [ -z "$ISSUE_NUMBER" ]; then
    echo "エラー: Issue番号が特定できません"
    echo "使用法: $0 [ISSUE_NUMBER]"
    exit 1
fi

echo "🚀 PR作成・マージワークフロー開始"
echo "   Issue: #$ISSUE_NUMBER"
echo "   ブランチ: $CURRENT_BRANCH"

# 1. git statusチェック
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  未コミットの変更があります。先にコミットしてください。"
    git status
    exit 1
fi

# 2. Issue情報取得
echo "📝 Issue情報取得中..."
ISSUE_TITLE=$(gh issue view $ISSUE_NUMBER --json title -q '.title')
ISSUE_BODY=$(gh issue view $ISSUE_NUMBER --json body -q '.body')

echo "   タイトル: $ISSUE_TITLE"

# 3. ブランチをpush
echo "📤 ブランチをプッシュ中..."
git push origin "$CURRENT_BRANCH"

# 4. PR作成
echo "🔄 プルリクエスト作成中..."
PR_NUMBER=$(gh pr create \
    --title "$(git log -1 --pretty=format:"%s")" \
    --body "$(cat <<EOF
## 概要
Issue #$ISSUE_NUMBER の対応です。

## 変更内容
$(git log --oneline origin/main..$CURRENT_BRANCH | sed 's/^/- /')

## 関連Issue
Closes #$ISSUE_NUMBER

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" | grep -o '#[0-9]*' | tr -d '#')

echo "✅ プルリクエスト #$PR_NUMBER を作成しました"

# 5. 自動マージ（オプション）
read -p "🤔 プルリクエストを自動マージしますか？ (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔀 プルリクエストをマージ中..."
    gh pr merge $PR_NUMBER --squash --delete-branch

    echo "🔄 メインブランチに戻り中..."
    git checkout main
    git pull origin main

    echo "🎉 ワークフロー完了！"
    echo "   ✅ Issue #$ISSUE_NUMBER: クローズ済み"
    echo "   ✅ PR #$PR_NUMBER: マージ済み"
    echo "   ✅ ブランチ: 削除済み"
    echo "   ✅ メインブランチに戻りました"
else
    echo "📋 手動でのマージが必要です"
    echo "   PR URL: https://github.com/$(gh repo view --json owner,name -q '.owner.login + \"/\" + .name')/pull/$PR_NUMBER"
fi