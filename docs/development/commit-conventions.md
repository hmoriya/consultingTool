# コミットメッセージテンプレート

現在、Gitのコミットメッセージテンプレート（`.gitmessage`）は設定されていませんが、以下のフォーマットを推奨します：

## 推奨フォーマット
```
<type>: <summary> (#<issue-number>)

<body>

<footer>
```

## タイプの種類
- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（フォーマット等）
- `refactor`: バグ修正でも機能追加でもないコード変更
- `perf`: パフォーマンス改善
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

## コミットメッセージの例
```bash
# 機能追加
git commit -m "feat: ヘルプシステムに詳細ステップビューを追加 (#31)"

# バグ修正
git commit -m "fix: ログイン時のロール判定エラーを修正 (#42)"

# リファクタリング
git commit -m "refactor: 認証ロジックを共通関数に統合 (#55)"

# ドキュメント
git commit -m "docs: Git開発フローを追加 (#67)"
```

## コミットメッセージテンプレートの設定方法

プロジェクトでコミットメッセージのテンプレートを使用したい場合：

### 1. `.gitmessage`ファイルを作成：
```bash
# プロジェクトルートに.gitmessageファイルを作成
cat > .gitmessage << 'EOF'
# <type>: <summary> (#<issue-number>)
# 
# <body>
# 
# <footer>
# 
# Type can be:
#   feat    : new feature
#   fix     : bug fix
#   docs    : documentation only
#   style   : formatting, no code change
#   refactor: refactoring code
#   perf    : performance improvement
#   test    : adding tests
#   chore   : updating build tasks etc
EOF
```

### 2. Gitに設定：
```bash
# プロジェクト専用の設定
git config commit.template .gitmessage

# またはグローバル設定
git config --global commit.template ~/.gitmessage
```