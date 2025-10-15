# GitHub CLI文字化け修正 Issue #143

## 概要
GitHub CLIコマンドでissue表示時にANSIエスケープシーケンス（`[38;2;141;161;185m`等）が文字化けとして表示される問題の修正

## 再現手順
1. `gh issue view 142` を実行
2. `gh issue view 143` を実行
3. 出力にANSI色コード（`[38;2;141;161;185m───────┬────`等）が混入して表示される

## 期待する動作
- 日本語テキストが正しく表示される
- ANSIエスケープシーケンスが適切に処理される
- クリーンなテキスト出力が得られる

## 実際の動作
以下のようなANSIエスケープシーケンスが混入：
```
[38;2;141;161;185m───────┬────────────────────────────────────────────────────────────────────────[0m
[38;2;141;161;185m│ [0m[1mSTDIN[0m
[38;2;141;161;185m───────┼────────────────────────────────────────────────────────────────────────[0m
```

## 環境
- **OS**: macOS Darwin 25.0.0
- **GitHub CLI**: `gh --version`で確認可能
- **ターミナル**: 標準ターミナル
- **文字エンコーディング**: UTF-8

## 根本原因
1. **ターミナル環境変数の未設定**: `LANG`, `LC_ALL`等が適切に設定されていない
2. **GitHub CLI色出力設定**: ANSIカラーコードが出力に混入
3. **ページャー設定**: デフォルトページャーによる表示問題

## 解決策

### 1. 緊急文字化け修正（現在セッション用）
```bash
# 基本環境変数の設定
export LANG=ja_JP.UTF-8
export LC_ALL=ja_JP.UTF-8
export NO_COLOR=1
export TERM=xterm-256color

# GitHub CLI専用設定
export GH_PAGER=cat
export GH_NO_UPDATE_NOTIFIER=1
```

### 2. GitHub CLI設定の修正
```bash
# 永続的なGitHub CLI設定
gh config set pager cat
gh config set prompt disabled
```

### 3. 動作確認
```bash
echo "=== 修正後の設定確認 ==="
echo "LANG: $LANG"
echo "LC_ALL: $LC_ALL"
echo "NO_COLOR: $NO_COLOR"
echo "GH_PAGER: $GH_PAGER"

echo "=== 修正後の動作テスト ==="
gh issue list --limit 3
```

## 緊急修正ファイル参照
詳細な修正手順は以下のファイルに記載：
- `.claude/commands/fix-encoding-now.md` - 緊急文字化け修正コマンド

## 使用場面
- 🚨 **緊急時**: 今すぐ文字化けを止めたい
- 🔧 **一時対応**: 設定ファイルを変更したくない
- 📝 **テスト**: 修正効果を一時的に確認したい
- ⚡ **高速**: 最小限の変更で最大効果

## 制限事項
- 現在のターミナルセッションでのみ有効
- 新しいターミナルを開くと設定はリセット
- 恒久的な修正には追加設定が必要

## 成功定義
- [ ] Issue #142, #143が文字化けなしで表示される
- [ ] ANSIエスケープシーケンスが正しく処理される
- [ ] 日本語テキストが正常に表示される
- [ ] GitHub CLIコマンドの出力がクリーンになる

## 関連Issue
- Issue #142: パラソル設計ファイル編集ページの実装
- Issue #143: 本Issue（文字化け修正）

## 優先度
**High** - 開発作業効率に直接影響するため緊急対応が必要

---

🚑 **緊急修正が必要な場合**: `.claude/commands/fix-encoding-now.md`の手順を実行してください

🤖 **自動生成**: Claude Code による GitHub Issue テンプレート