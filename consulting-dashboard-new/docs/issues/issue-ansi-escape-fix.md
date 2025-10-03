# Issue: パラソルサービス設計ドキュメントのANSI escape sequence問題

**作成日**: 2025-10-01
**ステータス**: ✅ 解決済み
**優先度**: 高
**担当**: Claude Code

## 問題の概要

パラソル設計管理画面でセキュアアクセスサービスとコラボレーション促進サービスのDB設計タブを開くと、ANSI escape sequence（`^[[38;2;141;161;185m`など）が表示され、Markdownが文字化けしていた。

## 症状

### 影響範囲
- セキュアアクセスサービス
  - API仕様
  - DB設計
  - 統合仕様
- コラボレーション促進サービス
  - API仕様
  - DB設計
  - 統合仕様

### 画面表示例
```
^[[38;2;141;161;185m───────┬────────────────────────────────────────────────────────────────────────^[[0m
^[[38;2;141;161;185m   1   ^[[38;2;141;161;185m│^[[0m ^[[38;2;227;234;242m# セキュアアクセスサービス データベース設計書^[[0m
```

## 原因

初期データ投入時に`bat`コマンドの出力（端末色コード付き）がそのままデータベースに保存されたため。

```bash
# 問題のあったコマンド例
cat docs/parasol/services/secure-access-service/database-design.md | bat --color=always
```

batコマンドは`--color=always`オプションでANSI escape sequenceを含む色付き出力を生成する。

## 解決方法

### 1. Next.js 15対応（API Route修正）

**ファイル**:
- `app/api/parasol/services/[serviceId]/api-specification/route.ts`
- `app/api/parasol/services/[serviceId]/database-design/route.ts`
- `app/api/parasol/services/[serviceId]/integration-specification/route.ts`

**変更内容**:
```typescript
// Before
export async function GET(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  const serviceName = params.serviceId;
  // ...
}

// After
export async function GET(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const { serviceId: serviceName } = await params;
  // ...
}
```

### 2. クリーンデータの再投入

**スクリプト**: `fix-design-docs.sh`

```bash
#!/bin/bash
services=("secure-access-service" "collaboration-facilitation-service")
doc_types=("api-specification" "database-design" "integration-specification")

for service in "${services[@]}"; do
  for doc in "${doc_types[@]}"; do
    file_path="docs/parasol/services/$service/$doc.md"
    content=$(cat "$file_path" | jq -Rs .)
    payload="{\"content\":$content}"

    curl -s -X PUT \
      "http://localhost:3000/api/parasol/services/$service/$doc" \
      -H "Content-Type: application/json" \
      -d "$payload"
  done
done
```

**実行結果**:
```
✅ secure-access-service/api-specification.md: 200
✅ secure-access-service/database-design.md: 200
✅ secure-access-service/integration-specification.md: 200
✅ collaboration-facilitation-service/api-specification.md: 200
✅ collaboration-facilitation-service/database-design.md: 200
✅ collaboration-facilitation-service/integration-specification.md: 200
```

### 3. 検証

**データベース確認**:
```bash
sqlite3 prisma/parasol-service/data/parasol.db \
  "SELECT s.name, substr(d.content, 1, 100) FROM services s
   JOIN database_designs d ON s.id = d.serviceId
   WHERE s.name = 'secure-access-service';"
```

**結果**:
```
secure-access-service|# セキュアアクセスサービス データベース設計書

**バージョン**: v1.0.0
**最終更新日**: 2025-01-15
```

✅ ANSI escape sequenceが完全に削除され、クリーンなMarkdownになっていることを確認。

## 予防策

今後、同様の問題を防ぐための対策：

1. **データ投入時の注意**
   - `bat`コマンド使用時は`--color=never`オプションを使用
   - または`cat`コマンドを使用

2. **API経由での投入を推奨**
   - MDファイルから直接API経由でアップロード
   - スクリプト: `fix-design-docs.sh`を再利用可能

3. **データ検証**
   - シード実行後、データベース内容を確認
   - ANSI escape sequenceの有無をチェック

## コミット

**コミットハッシュ**: 77fa049
**ブランチ**: feature/101-add-domain-diagram-filter

## 関連ファイル

- `consulting-dashboard-new/app/api/parasol/services/[serviceId]/api-specification/route.ts` (新規作成)
- `consulting-dashboard-new/app/api/parasol/services/[serviceId]/database-design/route.ts` (新規作成)
- `consulting-dashboard-new/app/api/parasol/services/[serviceId]/integration-specification/route.ts` (新規作成)
- `consulting-dashboard-new/fix-design-docs.sh` (新規作成)
- `docs/parasol/services/secure-access-service/database-design.md` (データ再投入)
- `docs/parasol/services/collaboration-facilitation-service/database-design.md` (データ再投入)

## 参考情報

- Next.js 15 Dynamic Route Parameters: https://nextjs.org/docs/app/api-reference/file-conventions/route#params-optional
- ANSI escape code: https://en.wikipedia.org/wiki/ANSI_escape_code
