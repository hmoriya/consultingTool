# UIの改善提案: ユースケース階層表示の最適化

## 📝 概要
パラソル設計管理のツリービューにおいて、ユースケースをディレクトリ（フォルダ）として表示し、その下にusecase.md/page.mdを実際のファイルアイコンで表示するUI設計への変更を提案します。

## 🎯 現在の問題
現在の階層構造では、ユースケース名が「グループ名」として機能しているものの、実際のファイル構造が直感的に理解しにくい状態です。

### 現在の表示構造
```
capture-knowledge オペレーション (5)
├── classify-and-tag-knowledge (1)
│   └── classify-and-tag-knowledge-page
├── extract-and-structure-knowledge (1)
│   └── extract-and-structure-knowledge-page
├── identify-knowledge-sources (1)
│   └── identify-knowledge-sources-page
├── publish-and-share-knowledge (1)
│   └── publish-and-share-knowledge-page
└── validate-knowledge-quality (1)
    └── validate-knowledge-quality-page
```

## 🚀 提案する改善後の表示構造

### 理想的な表示構造
```
capture-knowledge オペレーション
├── 📁 classify-and-tag-knowledge/          (ディレクトリ表示)
│   ├── 📄 usecase.md                      (ユースケースファイル)
│   ├── 🖼️ page.md                         (ページ定義ファイル)
│   └── 🔧 api-usage.md                    (API利用ファイル、v2.0仕様)
├── 📁 extract-and-structure-knowledge/
│   ├── 📄 usecase.md
│   ├── 🖼️ page.md
│   └── 🔧 api-usage.md
├── 📁 identify-knowledge-sources/
│   ├── 📄 usecase.md
│   ├── 🖼️ page.md
│   └── 🔧 api-usage.md
├── 📁 publish-and-share-knowledge/
│   ├── 📄 usecase.md
│   ├── 🖼️ page.md
│   └── 🔧 api-usage.md
└── 📁 validate-knowledge-quality/
    ├── 📄 usecase.md
    ├── 🖼️ page.md
    └── 🔧 api-usage.md
```

## 💡 期待される効果

### 1. 直感的なファイル構造の理解
- ✅ 実際のディレクトリ構造と画面表示が一致
- ✅ エクスプローラー/Finderライクな操作感
- ✅ ファイルタイプの視覚的識別

### 2. 開発効率の向上
- ✅ ファイルシステムとUIの1対1対応
- ✅ 編集対象ファイルの即座特定
- ✅ ファイル操作の直感性向上

### 3. パラソル設計v2.0との整合性
- ✅ 1対1関係（usecase ↔ page）の視覚化
- ✅ api-usage.mdファイルの明示的表示
- ✅ v2.0仕様の3ファイル構成の明確化

## 🛠️ 実装詳細

### 必要な変更箇所
1. **UnifiedTreeView.tsx**
   - ノードタイプの追加: `'directory'`, `'file'`
   - アイコンマッピングの拡張
   - 階層構造の調整

2. **tree-utils.ts**
   - ツリー構築ロジックの変更
   - ファイルノード生成の実装

3. **types/parasol.ts**
   - TreeNodeタイプの拡張
   - ファイルタイプ定義の追加

### アイコン定義
```typescript
const fileIcons = {
  'usecase.md': FileText,      // 📄 ユースケース定義
  'page.md': Layout,           // 🖼️ ページ定義
  'api-usage.md': Code,        // 🔧 API利用仕様
  'operation.md': Folder,      // 📁 オペレーション
  'directory': FolderOpen      // 📂 ディレクトリ
}
```

## 📋 実装手順
1. [ ] tree-utils.tsでのファイルノード生成機能追加
2. [ ] UnifiedTreeView.tsxでのディレクトリ・ファイル表示対応
3. [ ] アイコンセットの追加・整備
4. [ ] 展開・折りたたみ動作の調整
5. [ ] 選択・ハイライト機能の調整

## 🎨 UI/UX設計詳細

### ビジュアル要素
- **ディレクトリ**: フォルダアイコン + ディレクトリ名 + 展開/折りたたみ矢印
- **ファイル**: ファイルタイプ別アイコン + ファイル名
- **インデント**: 階層に応じた適切なインデント

### インタラクション
- **ディレクトリクリック**: 展開/折りたたみ
- **ファイルクリック**: ファイル内容の表示・編集画面へ遷移
- **ドラッグ&ドロップ**: 将来的なファイル移動機能（オプション）

## 📊 影響範囲
- **ツリービューコンポーネント**: 中程度の変更
- **データ構造**: 軽微な拡張
- **既存機能**: 互換性維持
- **パフォーマンス**: 影響なし

## 🔗 関連Issue・PR
- パラソル設計v2.0仕様実装 (#138, #139)
- UnifiedTreeView言語切り替え機能 (前回の修正)

## 📈 優先度
**中** - UI/UX改善による開発効率向上が期待されるが、現在の機能に致命的な問題はない

## 🎯 完了条件
- [ ] ユースケースディレクトリがフォルダアイコンで表示される
- [ ] usecase.md/page.md/api-usage.mdが適切なアイコンで表示される
- [ ] 展開・折りたたみ動作が正常に機能する
- [ ] ファイル選択・編集画面遷移が正常に動作する
- [ ] 既存機能（検索、言語切り替え等）が継続動作する