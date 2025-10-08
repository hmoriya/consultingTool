# 文字化け緊急修正コマンド

現在のターミナルセッションで即座に文字化け問題を解決します。
設定ファイルは変更せず、一時的な修正のみ行います。

## 実行手順

### 即座修正（現在セッションのみ）
```bash
echo "🚑 緊急文字化け修正を開始..."

# 基本環境変数の即座設定
export LANG=ja_JP.UTF-8
export LC_ALL=ja_JP.UTF-8
export NO_COLOR=1
export TERM=xterm-256color

# GitHub CLI緊急設定
export GH_PAGER=cat
export GH_NO_UPDATE_NOTIFIER=1

echo "✅ 現在セッションの環境変数設定完了"
```

### GitHub CLI一時設定
```bash
# GitHub CLIの一時設定（設定ファイルは変更しない）
gh config set pager cat
gh config set prompt disabled

echo "✅ GitHub CLI緊急設定完了"
```

### 動作確認
```bash
echo "=== 修正後の設定確認 ==="
echo "LANG: $LANG"
echo "LC_ALL: $LC_ALL"
echo "NO_COLOR: $NO_COLOR"
echo "GH_PAGER: $GH_PAGER"

echo "=== 修正後の動作テスト ==="
gh issue list --limit 3

echo "✅ 緊急修正完了！"
echo "💡 次回ログイン時も有効にするには /fix-encoding を実行してください"
```

## 使用場面

- 🚨 **緊急時**: 今すぐ文字化けを止めたい
- 🔧 **一時対応**: 設定ファイルを変更したくない
- 📝 **テスト**: 修正効果を一時的に確認したい
- ⚡ **高速**: 最小限の変更で最大効果

## 制限事項

- 現在のターミナルセッションでのみ有効
- 新しいターミナルを開くと設定はリセット
- 恒久的な修正には `/fix-encoding` が必要

## 緊急度レベル

このコマンドは以下の状況で使用：

1. **🚨 CRITICAL**: GitHub Issue作成中に文字化け発生
2. **⚡ URGENT**: デモ・プレゼン直前の緊急対応
3. **🔍 TEST**: 修正効果の即座確認
4. **🚑 EMERGENCY**: 他の修正コマンドが使えない場合