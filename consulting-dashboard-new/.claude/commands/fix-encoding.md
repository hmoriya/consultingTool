# 文字化け修正コマンド

文字化け問題（ANSIエスケープシーケンス汚染）を完全に修正し、恒久的な予防設定を行います。

## 実行内容

1. **環境変数の恒久設定**
   - LANG=ja_JP.UTF-8
   - LC_ALL=ja_JP.UTF-8
   - NO_COLOR=1（ANSIカラー無効化）
   - TERM=xterm-256color

2. **GitHub CLI最適化**
   - gh config set pager cat
   - gh config set prompt disabled
   - カラー出力完全無効化

3. **Git設定最適化**
   - git config --global color.ui false
   - git config --global core.pager cat

4. **汚染チェックと修復**
   - .zshrcファイルのANSI汚染検出
   - 汚染されている場合は自動修復

## 実行手順

### ステップ1: 現在の状況確認
```bash
echo "=== 現在の設定 ==="
echo "LANG: $LANG"
echo "LC_ALL: $LC_ALL"
echo "NO_COLOR: $NO_COLOR"
echo "TERM: $TERM"

# GitHub CLI動作テスト
echo "=== GitHub CLI テスト（修正前） ==="
gh issue list --limit 2
```

### ステップ2: 汚染ファイルのクリーンアップ
```bash
# .zshrcの末尾をチェック（ANSIコードが含まれているか）
echo "=== .zshrc末尾チェック ==="
tail -5 ~/.zshrc

# ANSIコードが検出された場合のクリーンアップ
if tail -5 ~/.zshrc | grep -q '\[38;2'; then
    echo "⚠️  ANSIコード汚染を検出。クリーンアップを実行..."
    total_lines=$(wc -l < ~/.zshrc)
    clean_lines=$((total_lines - 10))
    head -n $clean_lines ~/.zshrc > ~/.zshrc.clean && mv ~/.zshrc.clean ~/.zshrc
    echo "✅ .zshrcクリーンアップ完了"
fi
```

### ステップ3: 恒久的設定の追加
```bash
# 重複追加を防止して設定を追記
if ! grep -q "文字化け防止設定" ~/.zshrc; then
    echo "
# === 文字化け防止設定（Claude Code推奨） ===
export LANG=ja_JP.UTF-8
export LC_ALL=ja_JP.UTF-8
export NO_COLOR=1
export TERM=xterm-256color

# GitHub CLI カラー無効化
export GH_PAGER=cat
export GH_NO_UPDATE_NOTIFIER=1" >> ~/.zshrc
    echo "✅ 恒久設定を.zshrcに追加"
else
    echo "✅ 設定は既に追加済み"
fi
```

### ステップ4: ツール設定の最適化
```bash
# GitHub CLI設定
gh config set pager cat
gh config set prompt disabled
gh config set git_protocol https

# Git設定
git config --global color.ui false
git config --global core.pager cat

echo "✅ GitHub CLI・Git設定完了"
```

### ステップ5: 現在セッションへの即座適用
```bash
export LANG=ja_JP.UTF-8
export LC_ALL=ja_JP.UTF-8
export NO_COLOR=1
export TERM=xterm-256color
export GH_PAGER=cat
export GH_NO_UPDATE_NOTIFIER=1

echo "✅ 現在のセッションに設定適用完了"
```

### ステップ6: 動作確認
```bash
echo "=== 修正後の環境設定 ==="
echo "LANG: $LANG"
echo "LC_ALL: $LC_ALL"
echo "NO_COLOR: $NO_COLOR"
echo "TERM: $TERM"
echo "GH_PAGER: $GH_PAGER"

echo "=== GitHub CLI テスト（修正後） ==="
gh issue list --limit 3

echo "=== .zshrc末尾確認（クリーン状態） ==="
tail -3 ~/.zshrc
```

## 期待される結果

**修正前（問題のある出力）**:
```
[38;2;141;161;185m───────┬────[0m #135 [38;2;227;234;242mパラソル設計...[0m
```

**修正後（正常な出力）**:
```
135	OPEN	パラソル設計の3層分離アーキテクチャ実装
133	OPEN	パラソル設計のMD形式完全統一とJSON形式廃止
132	OPEN	全ビジネスオペレーションのユースケースとページ定義を完成させる
```

## 注意事項

- 新しいターミナルセッションから設定が完全に有効になります
- 既存の設定がある場合は重複を防いで追加されます
- このコマンドは何度実行しても安全です

## トラブルシューティング

問題が継続する場合は：
```bash
# 緊急対応（現在のセッションのみ）
export NO_COLOR=1
export LC_ALL=ja_JP.UTF-8
gh config set pager cat
```