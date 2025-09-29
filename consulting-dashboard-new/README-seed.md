# シードデータの実行方法

このプロジェクトでは、開発・テスト環境用のシードデータを効率的に管理するため、複数の実行オプションを提供しています。

## 基本的な実行方法

### 1. 通常のシード実行（既存データをスキップ）
```bash
npm run db:seed
```
既存のデータがある場合は追加されません。初回実行時や、データが空の時に使用します。

### 2. クリア付きシード実行（推奨）
```bash
npm run db:seed:clear
```
または
```bash
npm run db:seed -- --clear
```
既存のデータをすべてクリアしてから新しいシードデータを投入します。
**開発中はこの方法を推奨します。**

### 3. 完全リセット（DBファイル削除 → 再作成）
```bash
npm run db:reset
```
データベースファイル自体を削除してから再作成し、シードデータを投入します。
スキーマ変更後や、完全にクリーンな状態が必要な場合に使用します。

## 個別サービスの操作

### データクリアのみ
```bash
# すべてのデータをクリア
npm run db:clear

# 特定サービスのみクリア
npx tsx prisma/seeds/utils/clear-data.ts auth
npx tsx prisma/seeds/utils/clear-data.ts project
```

### 個別サービスのシード
```bash
# 認証サービスのみ
npm run db:seed:auth

# その他のサービス
npx tsx prisma/seeds/project-seed.ts
npx tsx prisma/seeds/resource-seed.ts
```

## 環境変数での制御

`.env`ファイルまたは環境変数で以下を設定すると、常にクリア付きでシード実行されます：
```bash
SEED_CLEAR_DATA=true
```

## シード実行時の動作

1. **クリアオプション有効時**
   - 全サービスのデータを削除
   - 新しいシードデータを投入
   - 一貫性のあるテストデータ環境を保証

2. **クリアオプション無効時**
   - 既存データはそのまま保持
   - 新規データのみ追加（重複チェックあり）
   - 本番環境での誤操作を防止

## トラブルシューティング

### PMユーザーでプロジェクトが表示されない場合
```bash
npm run db:seed:clear
```
古いProjectMemberデータが原因の可能性があります。クリア付きシードで解決します。

### スキーマ変更後のエラー
```bash
npm run db:reset
```
DBファイルを完全に再作成します。

### 特定サービスのみリセットしたい場合
```bash
# プロジェクトサービスのみクリア＆再シード
npx tsx prisma/seeds/utils/clear-data.ts project
npx tsx prisma/seeds/project-seed.ts
```

## シードデータの内容

- **テストユーザー**: 4名（Executive、PM、Consultant、Client）
- **プロジェクト**: 8件（アクティブ、計画中、完了）
- **パラソル設計**: 7サービス × 72ビジネスオペレーション
- その他、リソース、タイムシート、通知、ナレッジデータ

詳細は`CLAUDE.md`の「シードデータ管理」セクションを参照してください。