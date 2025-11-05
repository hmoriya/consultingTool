# パラソル開発手法

## パラソル設計の基本原則

パラソル開発では、**設計MDを生成し、API経由でパラソルサービスにポストする**ことで、設計内容をデータベースに登録します。

## 設計MDの種類

パラソル設計では、以下の4種類のMarkdownドキュメントを管理します：

1. **ドメイン言語定義** (`domain-language.md`)
   - エンティティ、値オブジェクト、集約の定義
   - ドメインモデルのクラス図を自動生成

2. **API仕様** (`api-specification.md`)
   - RESTful APIエンドポイントの定義
   - リクエスト/レスポンス形式

3. **DB設計** (`database-design.md`)
   - データベーステーブル定義
   - ER図の自動生成（Mermaid形式）

4. **統合仕様** (`integration-specification.md`)
   - 外部サービスとの連携仕様
   - イベント駆動アーキテクチャの定義

## 設計MDの配置

設計MDは以下のディレクトリ構造で配置します：

```
docs/parasol/services/{service-slug}/
├── domain-language.md
├── api-specification.md
├── database-design.md
└── integration-specification.md
```

**例**: セキュアアクセスサービスの場合
```
docs/parasol/services/secure-access-service/
├── domain-language.md
├── api-specification.md
├── database-design.md
└── integration-specification.md
```

## テンプレートの使用

新しいサービスの設計MDを作成する際は、既存のテンプレートを参考にします：

```bash
# テンプレートディレクトリ
consulting-dashboard-new/templates/parasol-*.md
```

利用可能なテンプレート：
- `parasol-domain-language-v2.md` - ドメイン言語定義のテンプレート
- その他のテンプレートは今後追加予定