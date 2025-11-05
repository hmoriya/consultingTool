# 設計MD作成ガイド

## 設計MDの作成手順

### 1. 設計MDファイルの作成

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

### 2. 設計MDテンプレートの使用

新しいサービスの設計MDを作成する際は、既存のテンプレートを参考にします：

```bash
# テンプレートディレクトリ
consulting-dashboard-new/templates/parasol-*.md
```

利用可能なテンプレート：
- `parasol-domain-language-v2.md` - ドメイン言語定義のテンプレート
- その他のテンプレートは今後追加予定

## 設計MDフォーマットの重要なルール

### DB設計における既存Mermaid ER図の扱い

**重要**: DB設計ドキュメントに既にMermaid ER図が存在する場合、**絶対に再変換しない**でください。

理由：
1. リレーションシップラベルが失われる
2. カーディナリティが不正確になる
3. 手動で調整した内容が消失する

**正しいアプローチ**:
```markdown
## 2. ER図

\`\`\`mermaid
erDiagram
    User {
        string id PK
        string email UK
    }

    Organization {
        string id PK
        string name UK
    }

    User }o--|| Organization : "belongs to"
\`\`\`
```

この場合、パーサーは既存のMermaid ER図をそのまま抽出して使用します。

**避けるべきアプローチ**:
- Mermaid ER図を削除してMarkdownテーブルのみにする
- Mermaid ER図を手動で変換する

詳細は `docs/parasol/mermaid-conversion-spec.md` を参照してください。

## パラソル開発のベストプラクティス

1. **設計MD優先**
   - コードを書く前に、必ず設計MDを作成・更新する
   - 設計MDをAPIでポストして、ダイアグラムが正しく表示されることを確認

2. **テンプレートの活用**
   - 新しいサービスを作成する際は、テンプレートから開始する
   - 既存サービスの設計MDも参考にする

3. **頻繁な動作確認**
   - 設計MDを更新するたびに、APIでポストして表示を確認
   - エラーは早期に発見・修正する

4. **Mermaid変換仕様の遵守**
   - 既存Mermaid図がある場合は再変換しない
   - 新規作成の場合は、適切なフォーマットを使用する

5. **バージョン管理**
   - 設計MDはGitで管理する
   - 変更履歴を明確にする