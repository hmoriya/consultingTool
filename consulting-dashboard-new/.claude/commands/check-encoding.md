# 文字化け診断コマンド

現在の環境設定を詳細診断し、文字化けの原因を特定します。

## 実行手順

### 環境設定の診断
```bash
echo "===================="
echo "🔍 文字化け診断開始"
echo "===================="

echo "=== 基本環境変数 ==="
echo "LANG: ${LANG:-'未設定'}"
echo "LC_ALL: ${LC_ALL:-'未設定'}"
echo "NO_COLOR: ${NO_COLOR:-'未設定'}"
echo "TERM: ${TERM:-'未設定'}"

echo "=== GitHub CLI関連 ==="
echo "GH_PAGER: ${GH_PAGER:-'未設定'}"
echo "GH_NO_UPDATE_NOTIFIER: ${GH_NO_UPDATE_NOTIFIER:-'未設定'}"

# GitHub CLI設定確認
echo "=== GitHub CLI 設定状況 ==="
gh config list 2>/dev/null || echo "GitHub CLI設定なし"

echo "=== Git カラー設定 ==="
git config --global color.ui || echo "Git カラー設定なし"
```

### ファイル汚染チェック
```bash
echo "=== .zshrc汚染チェック ==="
if tail -10 ~/.zshrc | grep -q '\[38;2'; then
    echo "🚨 CRITICAL: .zshrcファイルがANSIエスケープシーケンスで汚染されています"
    echo "汚染された行数:" $(tail -10 ~/.zshrc | grep -c '\[38;2')
    echo "サンプル（最後の3行）:"
    tail -3 ~/.zshrc
else
    echo "✅ .zshrcファイルはクリーンです"
fi

echo "=== その他設定ファイル汚染チェック ==="
for file in ~/.bashrc ~/.profile ~/.bash_profile; do
    if [[ -f $file ]] && grep -q '\[38;2' "$file" 2>/dev/null; then
        echo "⚠️  $file が汚染されています"
    fi
done
```

### GitHub CLI 動作テスト
```bash
echo "=== GitHub CLI 出力テスト ==="
echo "文字化けがある場合、ANSIエスケープシーケンスが表示されます："

gh issue list --limit 2 2>/dev/null | head -2
```

### 問題の特定と推奨対応
```bash
echo "===================="
echo "📊 診断結果サマリー"
echo "===================="

# 問題レベルの判定
ISSUES=0

if [[ -z "$LC_ALL" ]]; then
    echo "🟡 LC_ALL未設定 - ロケール問題の可能性"
    ISSUES=$((ISSUES + 1))
fi

if [[ -z "$NO_COLOR" ]]; then
    echo "🟡 NO_COLOR未設定 - ANSIカラー出力が生成される"
    ISSUES=$((ISSUES + 1))
fi

if tail -10 ~/.zshrc | grep -q '\[38;2'; then
    echo "🚨 .zshrc汚染 - 緊急修復が必要"
    ISSUES=$((ISSUES + 3))
fi

if [[ -z "$GH_PAGER" ]]; then
    echo "🟡 GitHub CLIページャー未設定"
    ISSUES=$((ISSUES + 1))
fi

# 推奨アクション
echo "===================="
if [[ $ISSUES -eq 0 ]]; then
    echo "✅ 環境設定は正常です"
else
    echo "⚠️  問題が $ISSUES 件検出されました"
    echo "🔧 推奨対応: /fix-encoding コマンドを実行してください"
fi
echo "===================="
```

## 診断項目

- ✅ **基本環境変数**: LANG, LC_ALL, NO_COLOR, TERM
- ✅ **GitHub CLI設定**: ページャー、カラー出力
- ✅ **Git設定**: カラー出力設定
- ✅ **ファイル汚染**: .zshrc, .bashrc等のANSI混入
- ✅ **実際の出力**: GitHub CLI動作確認

## 問題レベル

- 🚨 **CRITICAL**: ファイル汚染（即座修復必要）
- 🟡 **WARNING**: 設定不備（予防策として修正推奨）
- ✅ **OK**: 正常状態