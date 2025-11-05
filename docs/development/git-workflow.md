# Git開発フローとissue管理

## 標準的な開発フロー

開発を行う際は、以下のGitフローに従ってください：

### 1. Issue作成
```
Issue #31: ヘルプドキュメントの記述レベル向上
```

#### Issueテンプレートの活用

プロジェクトには以下のissueテンプレートが用意されています：

- **bug_report.md**: バグ報告用
  - 現象、再現手順、期待動作、環境情報を記載
- **feature_request.md**: 機能追加要望用
  - 背景、提案内容、代替案を記載
- **enhancement.md**: 既存機能の改善提案用
  - 改善対象、理由、影響範囲を記載
- **documentation.md**: ドキュメント関連
  - 対象ドキュメント、問題点、改善案を記載
- **question.md**: 質問用
  - 質問内容と背景情報を記載

GitHubでissueを作成する際は、適切なテンプレートを選択することで、必要な情報を漏れなく記載できます。

### 2. ブランチ作成
issue番号を含めたブランチ名を使用：
```bash
# 推奨フォーマット
git checkout -b feature/31-improve-help-docs
git checkout -b bugfix/42-login-error
git checkout -b hotfix/55-security-patch
git checkout -b docs/67-api-documentation

# 避けるべき例
git checkout -b feature/new-feature  # issue番号なし
git checkout -b 31                   # 説明なし
```

### 3. コミット
各コミットにissue番号を含める：
```bash
# 基本フォーマット
git commit -m "feat: 機能の説明 (#31)"
git commit -m "fix: バグの修正内容 (#42)"
git commit -m "docs: ドキュメント更新 (#67)"

# 詳細な例
git commit -m "feat: ヘルプシステムに詳細ステップビューを追加 (#31)"
git commit -m "test: ヘルプページのE2Eテスト追加 (#31)"
git commit -m "refactor: 詳細情報の型定義を整理 (#31)"
```

### 4. プルリクエスト
PRタイトルと本文にissue番号を含める：
```markdown
# PRタイトル
feat: ヘルプシステムの詳細情報機能を追加 (#31)

# PR本文
## 概要
Issue #31 の対応です。

## 変更内容
- 詳細ステップビューコンポーネントを追加
- 全12ユースケースに詳細情報を追加
- 代替手段の表示機能を実装

## 関連Issue
Closes #31  # これによりマージ時に自動的にissueがクローズされます

## スクリーンショット
[必要に応じて画像を添付]

## レビューポイント
- UIの使いやすさ
- 情報の網羅性
```

## issue番号を入れる場所

| 場所 | 例 | 必須度 | 目的 |
|------|-----|---------|------|
| **ブランチ名** | `feature/31-help-docs` | ◎推奨 | 作業内容の明確化 |
| **コミットメッセージ** | `feat: 機能追加 (#31)` | ◎推奨 | 変更履歴の追跡 |
| **PRタイトル** | `新機能追加 (#31)` | ○任意 | 一覧での識別 |
| **PR本文** | `Closes #31` | ◎必須 | 自動クローズ、関連付け |

## 自動クローズのキーワード

PR本文で以下のキーワードを使うと、マージ時にissueが自動的にクローズされます：
- `Close #31` / `Closes #31`
- `Fix #31` / `Fixes #31` 
- `Resolve #31` / `Resolves #31`

複数issueの場合：
```markdown
Closes #31, #32
```

## なぜissue番号が重要か

1. **トレーサビリティ**: 変更の理由と背景が明確になる
2. **プロジェクト管理**: issueとコードの関連を自動追跡
3. **コラボレーション**: チームメンバーが文脈を理解しやすい
4. **自動化**: issue自動クローズ、プロジェクトボード連携
5. **レビュー効率化**: レビュアーが背景を把握しやすい