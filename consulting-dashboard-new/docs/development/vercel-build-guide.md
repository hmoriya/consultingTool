# Vercel Build Error Prevention Guide

## 概要

このガイドは、ローカルでは動作するがVercelでビルドエラーになる問題を防ぐための開発者向けガイドです。

## なぜVercelビルドだけでエラーが発生するのか？

### 1. TypeScript の厳格性の違い

**ローカル開発環境**:
- `next dev` は型チェックを部分的にスキップ
- 変更されたファイルのみをチェック
- 開発速度を優先

**Vercel ビルド環境**:
- `next build` は全ファイルを厳格にチェック
- すべての型エラーをエラーとして扱う
- 本番環境の安全性を優先

### 2. Next.js 15 の変更点

```typescript
// ❌ Next.js 14 以前
export default function Page({ params }) {
  return <div>{params.id}</div>
}

// ✅ Next.js 15
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>{id}</div>
}
```

### 3. 環境変数の扱い

- ローカル: `.env.local` を自動読み込み
- Vercel: 環境変数を明示的に設定する必要がある

### 4. ビルド時の最適化

- 未使用のインポートがエラーになる
- `any` 型の使用が警告/エラーになる
- Strict Mode での追加チェック

## ローカルでのエラー検出方法

### 1. 基本的な型チェック

```bash
# TypeScriptの型チェックを実行
npm run type-check

# ESLintチェックを実行
npm run lint
```

### 2. 本番ビルドのシミュレーション

```bash
# Vercelと同じ条件でビルド
npm run build:vercel

# または
NODE_ENV=production npm run build
```

### 3. Vercel固有の問題チェック

```bash
# カスタムチェッカーを実行
npm run check:vercel
```

### 4. Git フックの活用

すでに設定済みのGitフックが以下のタイミングでチェックを実行します：

- **pre-commit**: 型チェックとESLint
- **pre-push**: フルビルドチェック

## よくあるエラーと対処法

### 1. Prisma の型不一致

```typescript
// ❌ 問題: PrismaのstringとTypeScriptのリテラル型の不一致
status: project.status as 'active' | 'completed'

// ✅ 解決: 定数を使用
import { PROJECT_STATUS } from '@/constants/status'
status: project.status as keyof typeof PROJECT_STATUS
```

### 2. Missing imports（Lucide React）

```typescript
// ❌ 問題: インポート漏れ
<Users className="h-4 w-4" />

// ✅ 解決: 必要なアイコンをインポート
import { Users } from 'lucide-react'
```

### 3. 動的ルートのPromise型

```typescript
// ❌ 問題: params を直接使用
export default function Page({ params }) {
  const { id } = params

// ✅ 解決: Promiseとして扱う
export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
```

### 4. _count プロパティの欠落

```typescript
// ❌ 問題: スプレッド演算子で_countが消える
return { ...project }

// ✅ 解決: 明示的にプロパティを列挙
return {
  id: project.id,
  name: project.name,
  _count: project._count,
  // 他のプロパティ
}
```

### 5. React コンポーネントのtitle属性

```typescript
// ❌ 問題: Lucideアイコンに直接title属性
<PaperclipIcon title="添付あり" />

// ✅ 解決: spanでラップ
<span title="添付あり">
  <PaperclipIcon className="h-4 w-4" />
</span>
```

## 推奨される開発フロー

### 1. 開発前の準備

```bash
# 最新の依存関係を取得
npm install

# データベースの型を生成
npm run db:generate
```

### 2. 開発中

```bash
# 開発サーバーを起動
npm run dev

# 別ターミナルで型チェックを常時実行
npm run type-check -- --watch
```

### 3. コミット前

```bash
# Vercel互換性チェック
npm run check:vercel

# ローカルビルドテスト
npm run build:check
```

### 4. プッシュ前

```bash
# フルビルドチェック（自動的に実行される）
npm run build:strict
```

## VS Code 設定

`.vscode/settings.json` に以下の設定が含まれています：

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.validate.enable": true,
  "typescript.tsserver.experimental.enableProjectDiagnostics": true
}
```

これにより、エディタ上でリアルタイムにエラーが表示されます。

## トラブルシューティング

### Q: ローカルでは動くのにVercelでエラーになる

A: 以下のコマンドを順番に実行してください：

```bash
npm run type-check
npm run lint
npm run build:vercel
npm run check:vercel
```

### Q: 型エラーが大量に出る

A: Prismaの型を再生成してください：

```bash
npm run db:generate
```

### Q: Git hookが動作しない

A: Huskyを再インストールしてください：

```bash
npm run prepare
```

## 参考リンク

- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [Vercel Build Output API](https://vercel.com/docs/build-output-api)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)