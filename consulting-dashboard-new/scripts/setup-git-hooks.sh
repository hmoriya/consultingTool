#!/bin/bash
# Git hooksをセットアップするスクリプト

echo "🔧 Git hooksをセットアップ中..."

# プロジェクトのルートディレクトリを取得
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "$PROJECT_ROOT"

# Git hooksディレクトリを設定
git config core.hooksPath .githooks

echo "✅ Git hooksが有効になりました"
echo ""
echo "📌 以下のタイミングで自動的にDBがリセットされます:"
echo "   - git pull実行後"
echo "   - git merge実行後"
echo ""
echo "🔄 手動でDBをリセットする場合:"
echo "   npm run db:reset"
echo ""