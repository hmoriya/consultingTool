#!/bin/bash
# Git pull後に実行するスクリプト
# サンプルDBを最新の状態にリセットします

echo "🔄 プル完了後の処理を開始します..."

# スクリプトのディレクトリを取得
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"

# 環境変数ファイルの存在確認
if [ ! -f ".env" ]; then
    echo "⚠️  .envファイルが見つかりません。"
    if [ -f ".env.example" ]; then
        echo "📋 .env.exampleから.envをコピーします..."
        cp .env.example .env
    fi
fi

# Node modulesの更新確認
echo "📦 パッケージの更新を確認中..."
npm install

# データベースのリセット（既存データを削除して最新のシードを投入）
echo "🗄️  データベースを最新の状態にリセット中..."
npm run db:reset

echo ""
echo "✨ プル後の処理が完了しました！"
echo ""
echo "🚀 開発サーバーを起動するには："
echo "   npm run dev"
echo ""
echo "📧 テストユーザー:"
echo "   - exec@example.com / password123 (Executive)"
echo "   - pm@example.com / password123 (PM)"
echo "   - consultant@example.com / password123 (Consultant)"
echo "   - client@example.com / password123 (Client)"
echo ""