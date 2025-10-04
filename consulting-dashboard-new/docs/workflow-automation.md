# Issue駆動開発ワークフロー自動化

## 概要

先程のIssue #121で実行したワークフロー（Issue作成→ブランチ作成→開発→コミット→PR→マージ）を自動化するスクリプトです。

## 利用可能なスクリプト

### 1. `scripts/auto-workflow.sh` - Issue・ブランチ自動作成

Issue作成とブランチ作成を自動化します。

```bash
# 基本的な使用法
./scripts/auto-workflow.sh "機能名" "詳細説明"

# 例
./scripts/auto-workflow.sh "ユーザープロファイル編集機能" "ユーザーが自分のプロファイル情報を編集できる機能を追加"
```

**実行内容:**
1. GitHub Issue を自動作成
2. Issue番号を含むブランチを自動作成・チェックアウト
3. 開発準備完了メッセージを表示

### 2. `scripts/auto-pr.sh` - PR作成・マージ自動化

開発完了後のPR作成とマージを自動化します。

```bash
# 基本的な使用法（Issue番号自動検出）
./scripts/auto-pr.sh

# Issue番号を明示的に指定
./scripts/auto-pr.sh 123
```

**実行内容:**
1. 未コミット変更の確認
2. ブランチを自動プッシュ
3. PR を自動作成（Issue情報を含む）
4. オプション: 自動マージとメインブランチ復帰

### 3. `scripts/quick-feature.sh` - ワンライナー開発開始

新機能開発を最速で開始するためのスクリプトです。

```bash
# 基本的な使用法
./scripts/quick-feature.sh "機能名" "実装内容の説明"

# 例
./scripts/quick-feature.sh "ダッシュボードフィルター機能" "ユーザーがプロジェクト一覧をフィルタリングできる機能"
```

## 完全自動化ワークフロー例

### 新機能開発の場合

```bash
# 1. 機能開発開始
./scripts/quick-feature.sh "新機能名" "機能の説明"

# 2. 開発作業（コード編集）
# ... ファイル編集 ...

# 3. 自動コミット・PR・マージ
git add . && git commit -m "feat: 新機能名を実装 (#自動取得されたIssue番号)" && ./scripts/auto-pr.sh
```

### バグ修正の場合

```bash
# 1. バグ修正Issue・ブランチ作成
./scripts/auto-workflow.sh "ログインエラー修正" "特定条件下でログインに失敗する問題を修正"

# 2. 修正作業
# ... コード修正 ...

# 3. 自動コミット・PR・マージ
git add . && git commit -m "fix: ログインエラーを修正 (#自動取得されたIssue番号)" && ./scripts/auto-pr.sh
```

## 従来の手動ワークフローとの比較

### 従来（手動）
```bash
# 8-10ステップ、約5-10分
gh issue create --title "..." --body "..."
git checkout -b feature/123-feature-name
# 開発作業
git add .
git commit -m "feat: ..."
git push origin feature/123-feature-name
gh pr create --title "..." --body "..."
gh pr merge 123 --squash --delete-branch
git checkout main
git pull origin main
```

### 自動化後
```bash
# 3ステップ、約1-2分
./scripts/quick-feature.sh "機能名" "説明"
# 開発作業
git add . && git commit -m "feat: ..." && ./scripts/auto-pr.sh
```

## 必要な前提条件

1. **GitHub CLI (gh) インストール済み**
   ```bash
   # macOS
   brew install gh

   # 認証
   gh auth login
   ```

2. **適切なリポジトリ権限**
   - Issues作成権限
   - ブランチ作成・プッシュ権限
   - PR作成・マージ権限

## トラブルシューティング

### Issue番号が取得できない場合
```bash
# 手動でIssue番号を指定
./scripts/auto-pr.sh 123
```

### 権限エラーが発生する場合
```bash
# GitHub CLI の認証状態確認
gh auth status

# 再認証
gh auth login
```

### スクリプト実行権限エラー
```bash
# 実行権限を付与
chmod +x scripts/*.sh
```

## カスタマイズ

各スクリプトは編集可能です：

- **auto-workflow.sh**: Issue作成時のテンプレートやラベルをカスタマイズ
- **auto-pr.sh**: PR本文のテンプレートやマージ方法をカスタマイズ
- **quick-feature.sh**: 開発プロセス全体をカスタマイズ

## セキュリティ注意事項

- スクリプトは自動でマージを実行する場合があります
- 本番環境では手動レビューを推奨
- 重要な変更では `auto-pr.sh` でマージを手動選択してください