# Issue #104: DB設計ダイアグラムパーサーの修正

**作成日**: 2025-10-01
**ステータス**: 完了
**優先度**: 高
**担当者**: Claude

## 問題の概要

パラソル設計のDB設計タブでMermaid ER図を表示しようとすると、パースエラーが発生してダイアグラムが表示されない問題が発生していた。

### エラーメッセージ

```
Mermaid描画エラー: Parse error on line 2: ...agram 作成SQL { '-' id TEXT PRIMARY
```

## 根本原因

`lib/parasol/diagram-converter.ts`の`parseDBSchema`メソッドに以下の3つの問題があった:

### 1. SQLコードブロックの誤解析

**問題**: Markdown内のSQLコードブロック（```sql）の内容をテーブル定義として解析していた

**影響**: 日本語コメント「-- 作成SQL」などがMermaidのエンティティ名として扱われ、構文エラーが発生

### 2. 番号プレフィックスの処理不足

**問題**: テーブル見出し「### 1. workspaces テーブル」の番号プレフィックスがそのままMermaid図に含まれていた

**影響**: `erDiagram 1. workspaces { ...` のような不正な構文が生成される

### 3. セクション範囲の制御不足

**問題**: 「## 物理設計」セクション以外のMarkdownテーブル（運用設計、データ保持ポリシーなど）もDB定義として解析していた

**影響**: 「メッセージ（アクティブチャネル） 1年」のような運用情報がテーブル名として解析され、パースエラーが発生

## 解決策

### 修正1: コードブロック検出とスキップ

```typescript
let inCodeBlock = false;

lines.forEach(line => {
  const trimmed = line.trim();

  // コードブロック（```）の開始/終了を検出
  if (trimmed.startsWith('```')) {
    inCodeBlock = !inCodeBlock;
    return;
  }

  // コードブロック内の行はスキップ
  if (inCodeBlock) {
    return;
  }
  // ... 以降の処理
});
```

**効果**: SQLコードブロックの内容が解析対象から除外される

### 修正2: 番号プレフィックスの削除

```typescript
// テーブル名の検出（### または #### で始まる見出し）
if ((trimmed.startsWith('### ') || trimmed.startsWith('#### ')) &&
    (trimmed.includes('テーブル') || trimmed.toLowerCase().includes('table'))) {
  let name = trimmed.replace(/^#{3,4}\s+/, '').replace(/テーブル.*$/, '').trim();
  // 番号プレフィックス（"1. ", "2. " など）を削除
  name = name.replace(/^\d+\.\s*/, '');
  // ...
}
```

**効果**: 「1. workspaces」→「workspaces」と正規化される

### 修正3: 物理設計セクション限定の解析

```typescript
let inPhysicalDesignSection = false;

lines.forEach(line => {
  const trimmed = line.trim();

  // 物理設計セクションの開始を検出
  if (trimmed.startsWith('## ') && (trimmed.includes('物理設計') || trimmed.toLowerCase().includes('physical design'))) {
    inPhysicalDesignSection = true;
    return;
  }

  // 物理設計セクション終了を検出（次の## セクション）
  if (inPhysicalDesignSection && trimmed.startsWith('## ') &&
      !trimmed.includes('物理設計') && !trimmed.toLowerCase().includes('physical design')) {
    inPhysicalDesignSection = false;
    currentTable = null;
    return;
  }

  // 物理設計セクション内でのみテーブルを解析
  if (!inPhysicalDesignSection) {
    return;
  }
  // ... テーブル解析処理
});
```

**効果**: 運用設計やデータ保持ポリシーのテーブルが解析対象から除外される

## 修正ファイル

- **ファイル**: `consulting-dashboard-new/lib/parasol/diagram-converter.ts`
- **メソッド**: `parseDBSchema` (lines 1169-1256)
- **修正行数**: 約90行

## テスト結果

### 修正前

```
コンソールエラー:
Mermaid描画エラー: Parse error on line 2: ...agram 作成SQL { '-' id TEXT PRIMARY
Mermaid描画エラー: Parse error on line 1: erDiagram 1. workspaces { UUID id...
Mermaid描画エラー: Parse error on line 125: ...ッセージ（アクティブチャネル） 1年
```

### 修正後

```
コンソールログ:
Generated diagram code: erDiagram
  workspaces {
    UUID id
    VARCHAR(100) name
    UUID organizationId
    ...
  }
```

ただし、別のChunkLoadErrorが発生（Mermaidライブラリのロード問題、本Issueとは別の問題）

## 影響範囲

### 改善される機能

- パラソル設計のDB設計タブでER図が正常に表示される（Markdown形式から自動生成）
- すべてのサービスのDB設計ドキュメント（collaboration-facilitation-service, secure-access-service等）で一貫したダイアグラム表示が可能

### 影響を受けるサービス

- コラボレーション促進サービス（検証済み）
- セキュアアクセスサービス
- タレント最適化サービス
- ナレッジ共創サービス
- プロジェクト成功支援サービス
- 収益最適化サービス
- 生産性可視化サービス

## 残存課題

### 課題1: DBのリレーション情報の不足

**問題**: 現在のパーサーではテーブル定義（エンティティとカラム）のみを解析しており、テーブル間のリレーション（外部キー関係）が抽出されていない

**影響**:
- Mermaid ER図にリレーションシップ（線）が表示されない
- テーブル間の関係性が視覚的に把握できない
- FK制約の情報が図に反映されない

**原因**:
`lib/parasol/diagram-converter.ts`の`parseDBSchema`メソッドがMarkdownテーブル形式のFK情報を解析しているが、Mermaidコード生成時に関係性を出力していない

**例**: `database-design.md`の以下のような情報が未活用
```markdown
| organizationId | UUID | ○ | FK(organizations.id) | 所属組織ID |
```

**解決策（検討中）**:
1. `parseDBSchema`メソッドでFK情報を抽出し、関係性リストを生成
2. `convertToMermaid`メソッドで関係性を出力
   ```
   workspaces ||--o{ channels : "has many"
   ```
3. カーディナリティ（1:1, 1:N, N:M）の判定ロジック追加

**対応**: 別Issueで対応予定（#106）

### 課題2: ChunkLoadError

```
ChunkLoadError: Loading chunk _app-pages-browser_node_modules_mermaid_dist_chunks_mermaid_core_erDiagram-Q2GNP2WA_mjs failed
```

**原因**: Next.jsのコード分割（Code Splitting）によるMermaidライブラリの動的インポートに失敗

**影響**: ダイアグラムタブでエラーメッセージが表示される

**対応**: 別Issueで対応予定（#105）

## 備考

### 設計哲学への準拠

この修正は、パラソル開発手法の「実装非依存の設計」原則に準拠している:

- Markdownで記述されたDB設計定義（実装非依存）
- 自動的にMermaid ER図に変換（可視化）
- Prismaスキーマへの変換も可能（実装生成）

このアプローチにより、DB設計がドキュメントとして管理され、かつビジュアル化・実装生成の両方が可能になる。

## 関連Issue

- #101: ドメインダイアグラムフィルタ機能追加（同様のパーサー修正を実施）
- #105: Mermaid ChunkLoadError対応（予定）

## コミット情報

- **ブランチ**: feature/104-db-diagram-parser-fix
- **コミットメッセージ**:
  ```
  fix: DB設計ダイアグラムパーサーの修正 (#104)

  - SQLコードブロックのスキップ処理を追加
  - テーブル名の番号プレフィックス削除
  - 物理設計セクションのみ解析するよう制限
  ```
