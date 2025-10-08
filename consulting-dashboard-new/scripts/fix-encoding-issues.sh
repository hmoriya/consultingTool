#!/bin/bash

# ============================================
# 文字化け防止スクリプト (Claude Code推奨)
# ============================================

echo "🔧 文字化け防止設定を適用中..."

# 1. 環境変数の恒久設定
cat >> ~/.zshrc << 'EOF'

# === 文字化け防止設定（自動追加）===
export LANG=ja_JP.UTF-8
export LC_ALL=ja_JP.UTF-8
export NO_COLOR=1
export TERM=xterm-256color

# GitHub CLI最適化
export GH_PAGER=cat
export GH_NO_UPDATE_NOTIFIER=1
EOF

# 2. GitHub CLI設定
gh config set pager cat
gh config set prompt disabled
gh config set git_protocol https

# 3. Git設定
git config --global color.ui false
git config --global core.pager cat

# 4. 現在セッションに適用
export LANG=ja_JP.UTF-8
export LC_ALL=ja_JP.UTF-8
export NO_COLOR=1
export TERM=xterm-256color
export GH_PAGER=cat
export GH_NO_UPDATE_NOTIFIER=1

echo "✅ 文字化け防止設定完了！"
echo "📝 新しいターミナルセッションから設定が有効になります"

# 5. 設定確認
echo "=== 現在の設定 ==="
echo "LANG: $LANG"
echo "LC_ALL: $LC_ALL"
echo "NO_COLOR: $NO_COLOR"
echo "GH_PAGER: $GH_PAGER"