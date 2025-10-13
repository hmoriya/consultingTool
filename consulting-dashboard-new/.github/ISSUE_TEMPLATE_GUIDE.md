# GitHub Issue作成ガイド - 文字化け防止対策

## 🎯 目的

GitHub Issueで日本語コンテンツが正しく表示されるよう、文字化けを防止するためのガイドラインです。

## ⚠️ 文字化けの主な原因

### 1. ANSIエスケープシーケンス
ターミナルの色付きテキストが原因で文字化けが発生します。

**❌ 問題のある例**:
```
[38;2;227;234;242m# パラソル設計v2.0[0m
```

**✅ 正しい例**:
```
# パラソル設計v2.0
```

### 2. ターミナル出力の直接コピー
`gh issue view`、`cat`、`less`などのコマンド出力を直接コピーすると、制御文字が混入します。

### 3. テキストエディタの制御文字
一部のエディタで自動挿入される制御文字や非表示文字。

## 🛠️ 文字化け防止のベストプラクティス

### 1. Issue作成時

#### ✅ 推奨手順
1. **GitHubのIssueテンプレートを使用**
   ```bash
   # GitHubのWebUIから「New Issue」→ テンプレート選択
   ```

2. **プレーンテキストで作成**
   - Markdown形式で記述
   - 装飾はMarkdown記法のみ使用
   - 外部ツールからのコピー&ペーストは慎重に

3. **コードブロックの適切な使用**
   ```text
   # ターミナル出力やログはtextブロックで囲む
   ログ内容をここに記載
   ```

#### ❌ 避けるべき操作
- ターミナル出力の直接コピー&ペースト
- 色付きテキストのコピー
- バイナリファイルの内容を貼り付け

### 2. コンテンツ準備

#### ターミナル出力を含める場合
```bash
# ❌ 避ける: 色付き出力の直接利用
gh issue view 146

# ✅ 推奨: プレーンテキスト化
gh issue view 146 --json title,body | jq -r '.body'
```

#### ログファイルを含める場合
```bash
# ❌ 避ける: cat コマンドの直接出力
cat app.log

# ✅ 推奨: 制御文字を除去
sed 's/\x1b\[[0-9;]*m//g' app.log
```

### 3. 事前チェック

#### 文字化けチェックスクリプト
```bash
#!/bin/bash
# check-ansi.sh - ANSIエスケープシーケンスの検出

file="$1"
if [ -z "$file" ]; then
    echo "使用方法: $0 <ファイル名>"
    exit 1
fi

# ANSIエスケープシーケンスを検出
if grep -P '\x1b\[[0-9;]*m' "$file" > /dev/null; then
    echo "❌ ANSIエスケープシーケンスが検出されました"
    echo "対象ファイル: $file"
    echo ""
    echo "検出された箇所:"
    grep -n --color=never '\x1b\[[0-9;]*m' "$file"
    exit 1
else
    echo "✅ ANSIエスケープシーケンスは検出されませんでした"
    exit 0
fi
```

#### 使用例
```bash
# Issue内容をファイルに保存してチェック
echo "Issue内容" > issue-draft.md
bash check-ansi.sh issue-draft.md
```

## 📋 Issueテンプレート別ガイド

### パラソル設計関連Issue

**テンプレート**: `.github/ISSUE_TEMPLATE/parasol-design-issue.md`

**特別な注意点**:
- パラソルドメイン言語の記述は純粋なMarkdownで
- API仕様やDB設計はコードブロック内に記載
- Mermaid図表は使用可能（GitHubが対応）

**例**:
```markdown
### パラソルドメイン連携
```text
操作エンティティ: MessageEntity（状態更新: draft → sent → read）
パラソル集約: MessageAggregate - メッセージライフサイクル管理
```
```

### バグ報告

**テンプレート**: `.github/ISSUE_TEMPLATE/bug-report.md`

**特別な注意点**:
- エラーログは必ず `text` ブロックで囲む
- スクリーンショットは画像ファイルとして添付
- ターミナル出力は色情報を除去

**例**:
```markdown
### エラーログ
```text
Error: Database connection failed
  at connection.js:123:45
  Stack trace...
```
```

### 機能要求

**テンプレート**: `.github/ISSUE_TEMPLATE/feature-request.md`

**特別な注意点**:
- UI要件はMarkdownで記述またはモックアップ画像
- 技術要件は構造化して記載
- ユーザーストーリーは定型フォーマット使用

## 🔧 トラブルシューティング

### Issue作成後に文字化けを発見した場合

1. **Issue編集で修正**
   ```bash
   gh issue edit <issue-number> --body-file clean-content.md
   ```

2. **ANSIエスケープシーケンス除去**
   ```bash
   # ファイルから除去
   sed 's/\x1b\[[0-9;]*m//g' original.md > clean.md
   ```

3. **GitHubのWeb UIで編集**
   - 「Edit」ボタンから直接編集
   - プレビューで確認してから保存

### 頻繁な文字化けが発生する場合

1. **環境設定確認**
   ```bash
   echo $LANG
   echo $LC_ALL
   # UTF-8が設定されていることを確認
   ```

2. **ghコマンド設定確認**
   ```bash
   gh config list
   # pagerやエディタ設定を確認
   ```

3. **Gitエディタ設定**
   ```bash
   git config --global core.editor "code --wait"
   # 適切なエディタを設定
   ```

## 📚 関連資料

### テンプレートファイル
- **パラソル設計**: `.github/ISSUE_TEMPLATE/parasol-design-issue.md`
- **バグ報告**: `.github/ISSUE_TEMPLATE/bug-report.md`
- **機能要求**: `.github/ISSUE_TEMPLATE/feature-request.md`

### 参考コマンド
```bash
# Issue一覧表示
gh issue list

# Issue詳細表示（プレーンテキスト）
gh issue view <number> --json title,body | jq -r '.body'

# Issue編集
gh issue edit <number> --body-file content.md

# ANSIエスケープシーケンス除去
sed 's/\x1b\[[0-9;]*m//g' input.txt > output.txt
```

### チェックポイント
- [ ] テンプレートを使用している
- [ ] ターミナル出力は`text`ブロックで囲んでいる
- [ ] ANSIエスケープシーケンスが含まれていない
- [ ] プレビューで正常に表示されることを確認済み
- [ ] 適切なラベルが設定されている

---

**このガイドラインに従うことで、読みやすく保守しやすいIssueを作成できます。**