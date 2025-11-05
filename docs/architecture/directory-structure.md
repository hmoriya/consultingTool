# プロジェクトディレクトリ構造

## ⚠️ 重要: 二重ディレクトリの絶対禁止

**プロジェクトルートは1つのみです:**
```
/Users/hmoriya/Develop/github/github.com/hmoriya/consultingTool/consulting-dashboard-new/
```

**絶対に作成してはいけない二重ディレクトリ:**
```
❌ consulting-dashboard-new/consulting-dashboard-new/
❌ consulting-dashboard-new/consulting-dashboard-new/lib/
❌ consulting-dashboard-new/consulting-dashboard-new/docs/
```

## 正しいディレクトリ構造

```
consulting-dashboard-new/
├── app/                      # Next.js App Router
│   ├── api/                 # APIルート
│   │   └── parasol/        # パラソル関連API
│   ├── components/         # コンポーネント
│   └── ...
├── lib/                     # ライブラリ・ユーティリティ
│   └── parasol/
│       └── parsers/        # パラソルパーサー（4つ）
│           ├── domain-language-parser.ts
│           ├── api-specification-parser.ts
│           ├── database-design-parser.ts
│           └── integration-specification-parser.ts
├── docs/                    # ドキュメント
│   └── parasol/
│       ├── templates/      # ドキュメントテンプレート
│       └── services/       # サービス別ドキュメント
│           └── secure-access-service/
│               ├── service.md
│               ├── domain-language.md
│               ├── api-specification.md
│               ├── database-design.md
│               ├── integration-specification.md
│               └── capabilities/
├── prisma/                  # Prismaスキーマとデータベース
│   ├── auth-service/
│   ├── project-service/
│   ├── parasol-service/
│   └── ...
└── ...
```

## ファイル作成時の注意事項

**新しいファイルを作成する際は、必ず以下を確認してください:**

1. **現在のディレクトリを確認**: `pwd`で現在地を確認
2. **正しい場所を指定**: プロジェクトルートからの相対パスを使用
3. **二重作成の防止**: `consulting-dashboard-new/consulting-dashboard-new/`とならないよう注意

**例（正しい作成方法）:**
```bash
# 現在地確認
pwd
# => /Users/.../consulting-dashboard-new

# ファイル作成（プロジェクトルートから）
touch lib/parasol/parsers/new-parser.ts
touch docs/parasol/services/new-service/api-specification.md
```

**例（間違った作成方法）:**
```bash
# ❌ 二重ディレクトリを作ってしまう例
touch consulting-dashboard-new/lib/parasol/parsers/new-parser.ts
# これは /consulting-dashboard-new/consulting-dashboard-new/lib/... になる
```