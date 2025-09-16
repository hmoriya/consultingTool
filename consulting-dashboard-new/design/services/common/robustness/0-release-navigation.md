# ロバストネス図 - 0リリース ナビゲーションシステム

**更新日: 2025-01-09**

## UC002: トップページ表示とナビゲーション

### ロバストネス図

```
[Actor: ログイン済みユーザー]
    |
    | 1. ページアクセス
    v
[Boundary: アプリケーションレイアウト]
    |
    | 2. セッション確認
    v
[Control: 認証チェックコントローラー]
    |
    | 3. セッション検証
    v
[Entity: セッション]
[Entity: ユーザー]
    |
    | 4. ユーザー情報取得
    v
[Control: レイアウト生成コントローラー]
    |
    | 5. ロール確認
    v
[Entity: ロール]
[Entity: 権限]
    |
    | 6. UI構成決定
    v
[Boundary: ヘッダー]
[Boundary: サイドバー]
[Boundary: メインコンテンツ]
```

## UC004: サイドバー操作

### ロバストネス図

```
[Actor: ユーザー]
    |
    | 1. ハンバーガーメニュークリック
    v
[Boundary: ヘッダー（ハンバーガーボタン）]
    |
    | 2. クリックイベント
    v
[Control: サイドバー状態管理コントローラー]
    |
    | 3. 状態切替
    v
[Entity: UIステート（LocalStorage）]
    |
    | 4. 状態更新
    v
[Boundary: サイドバー]
    |
    | 5. 表示更新
```

### オブジェクトタイプ

#### Boundary（境界オブジェクト）
- **アプリケーションレイアウト**: 全体のレイアウト構造
- **ヘッダー**: 固定ヘッダーコンポーネント
  - ロゴ
  - ハンバーガーメニューボタン
  - プロファイルドロップダウン
- **サイドバー**: ナビゲーションメニュー
  - メニューアイテム（ロール別）
  - 折りたたみ/展開状態
- **メインコンテンツ**: ページコンテンツ表示エリア

#### Control（制御オブジェクト）
- **認証チェックコントローラー**: セッション有効性確認
- **レイアウト生成コントローラー**: ロールベースUI構成
- **サイドバー状態管理コントローラー**: 開閉状態制御
- **レスポンシブ制御コントローラー**: 画面サイズ対応

#### Entity（エンティティオブジェクト）
- **セッション**: 現在のセッション情報
- **ユーザー**: ログインユーザー情報
- **ロール**: ユーザーロール
- **権限**: ロール権限
- **UIステート**: UI状態（LocalStorage保存）

### レスポンシブ対応フロー

```
[Control: レスポンシブ制御コントローラー]
    |
    | 1. 画面サイズ検知
    v
[Entity: デバイス情報]
    |
    | 2. モバイル判定
    v
[Control: サイドバー状態管理コントローラー]
    |
    | 3. モバイルモード設定
    v
[Boundary: サイドバー]
    |
    | 4. オーバーレイ表示
```

### プロファイルドロップダウンフロー

```
[Actor: ユーザー]
    |
    | 1. プロファイルアイコンクリック
    v
[Boundary: プロファイルアイコン]
    |
    | 2. クリックイベント
    v
[Control: ドロップダウン制御コントローラー]
    |
    | 3. メニュー表示制御
    v
[Boundary: ドロップダウンメニュー]
    |
    | 4. メニュー項目表示
    |   - プロファイル編集
    |   - 設定
    |   - ログアウト
```

### ロールベースメニュー生成

```typescript
// メニューアイテム定義
const menuItems = [
  { id: 'dashboard', label: 'ダッシュボード', icon: Home, roles: ['all'] },
  { id: 'projects', label: 'プロジェクト一覧', icon: Folder, roles: ['executive', 'pm'] },
  { id: 'reports', label: 'レポート', icon: BarChart, roles: ['executive', 'pm'] },
  { id: 'settings', label: '設定', icon: Settings, roles: ['all'] },
  { id: 'help', label: 'ヘルプ', icon: HelpCircle, roles: ['all'] }
]

// ロールフィルタリング
const filteredItems = menuItems.filter(item => 
  item.roles.includes('all') || item.roles.includes(user.role)
)
```

### 状態管理

#### サイドバー状態
- **展開/折りたたみ**: LocalStorageに保存
- **モバイルオーバーレイ**: 一時的な状態
- **アニメーション**: CSS Transition

#### セッション状態
- **Server Component**: サーバーサイドで検証
- **Client Component**: Context APIで共有