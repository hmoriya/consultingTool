# スキル管理・リソース最適化機能ドキュメント

## 概要

スキル管理・リソース最適化機能は、コンサルタントのスキルを体系的に管理し、プロジェクトへの最適なリソース配分を実現するための機能です。スキルマトリックス、稼働率管理、アサイン最適化により、組織全体の生産性を向上させます。

## 主な機能

### 1. スキル管理

#### スキルカタログ
- 技術スキル（プログラミング言語、フレームワーク等）
- ビジネススキル（業界知識、コンサルティング手法等）
- ソフトスキル（リーダーシップ、コミュニケーション等）
- 言語スキル（英語、中国語等）
- 資格・認定（PMP、AWS認定等）

#### スキル評価
- 5段階評価（初級〜エキスパート）
- 自己評価とマネージャー評価
- 経験年数の記録
- プロジェクト実績との紐付け
- スキルの最終利用日

### 2. リソース最適化

#### 稼働率管理
- リアルタイム稼働率表示
- 将来の稼働予測
- 稼働率アラート機能
- チーム別・個人別分析

#### アサイン最適化
- スキルマッチング
- 稼働率を考慮した推奨
- 負荷分散機能
- コンフリクト検出

### 3. スキル開発

#### スキルギャップ分析
- 現状と目標のギャップ表示
- プロジェクト要件との比較
- 育成計画の提案

#### 学習管理
- 研修履歴
- 資格取得支援
- メンタリング記録

## データ構造

### Skill テーブル
```typescript
interface Skill {
  id: string
  name: string
  categoryId: string
  description: string
  demandLevel: 'low' | 'medium' | 'high'
  isActive: boolean
  requiredCertifications?: string[]
  relatedSkills?: string[]
  createdAt: Date
  updatedAt: Date
}
```

### UserSkill テーブル
```typescript
interface UserSkill {
  id: string
  userId: string
  skillId: string
  level: 1 | 2 | 3 | 4 | 5  // 1:初級 〜 5:エキスパート
  selfAssessment: number
  managerAssessment?: number
  experienceYears: number
  lastUsedDate?: Date
  projectCount: number
  certificationDate?: Date
  certificationExpiry?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

### ResourceAllocation テーブル
```typescript
interface ResourceAllocation {
  id: string
  userId: string
  projectId: string
  roleInProject: string
  allocationPercentage: number
  startDate: Date
  endDate: Date
  status: 'planned' | 'confirmed' | 'active' | 'completed'
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

## 画面構成

### 1. スキル管理画面（個人）

#### パス
`/team/skills/my-skills`

#### 主な要素
- スキル一覧（カテゴリ別）
- レベル評価入力
- 経験詳細入力
- スキル追加/削除
- スキルレーダーチャート

### 2. スキルマトリックス画面（管理者）

#### パス
`/team/skills/matrix`

#### 主な要素
- チームメンバー × スキルのマトリックス表
- フィルター機能（カテゴリ、レベル、部門）
- ヒートマップ表示
- CSV/PDFエクスポート
- ギャップ分析ビュー

### 3. リソース配分画面

#### パス
`/team/utilization`

#### 主な要素
- ガントチャート形式の配分表示
- 稼働率グラフ
- ドラッグ&ドロップでの配分調整
- コンフリクト警告表示
- What-ifシミュレーション

### 4. アサイン推奨画面

#### パス
`/projects/:id/assign`

#### 主な要素
- 必要スキル入力
- 推奨メンバーリスト
- マッチ度スコア表示
- 稼働状況確認
- アサイン実行ボタン

## ビジネスロジック

### スキルマッチングアルゴリズム

```typescript
function calculateMatchScore(
  requiredSkills: RequiredSkill[],
  userSkills: UserSkill[]
): number {
  let totalScore = 0
  let totalWeight = 0
  
  for (const required of requiredSkills) {
    const userSkill = userSkills.find(s => s.skillId === required.skillId)
    if (userSkill) {
      // レベル差分によるスコア計算
      const levelScore = Math.min(userSkill.level / required.minLevel, 1)
      totalScore += levelScore * required.importance
      totalWeight += required.importance
    } else {
      // 必須スキルがない場合
      if (required.isMandatory) return 0
      totalWeight += required.importance
    }
  }
  
  return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0
}
```

### 稼働率計算

```typescript
function calculateUtilization(
  allocations: ResourceAllocation[],
  targetDate: Date
): number {
  const activeAllocations = allocations.filter(a => 
    a.status === 'active' &&
    a.startDate <= targetDate &&
    a.endDate >= targetDate
  )
  
  return activeAllocations.reduce((sum, a) => 
    sum + a.allocationPercentage, 0
  )
}
```

## API エンドポイント

### スキル管理
- `GET /api/skills` - スキルカタログ取得
- `GET /api/skills/categories` - カテゴリ一覧
- `GET /api/users/:id/skills` - ユーザースキル取得
- `POST /api/users/:id/skills` - スキル追加
- `PUT /api/users/:id/skills/:skillId` - スキル更新
- `DELETE /api/users/:id/skills/:skillId` - スキル削除

### リソース管理
- `GET /api/resources/utilization` - 稼働率一覧
- `GET /api/resources/availability` - 空きリソース検索
- `POST /api/resources/allocate` - リソース配分
- `PUT /api/resources/allocation/:id` - 配分更新
- `DELETE /api/resources/allocation/:id` - 配分削除

### マッチング
- `POST /api/resources/match` - スキルマッチング
- `GET /api/resources/recommendations` - 推奨リソース取得

## レポート機能

### スキルレポート
- スキル保有状況サマリー
- スキルギャップ分析
- スキル需要予測
- 育成進捗レポート

### 稼働レポート
- 稼働率推移
- プロジェクト別稼働状況
- 部門別稼働分析
- 稼働予測レポート

## 権限管理

### 一般ユーザー
- 自身のスキル管理
- 自身の稼働状況確認
- スキルカタログ閲覧

### マネージャー
- チームメンバーのスキル閲覧・評価
- チームの稼働状況管理
- アサイン調整

### 管理者
- 全社スキル管理
- スキルカタログメンテナンス
- リソース配分の承認

## 運用フロー

### スキル棚卸しプロセス（四半期毎）
1. 各自がスキル自己評価を更新
2. マネージャーが評価レビュー
3. 1on1での評価調整
4. スキル開発計画の策定

### アサインプロセス
1. PMがプロジェクト要件を入力
2. システムが推奨メンバーを提示
3. マネージャーと調整
4. アサイン確定・通知

## ベストプラクティス

### スキル管理
- 定期的な更新（プロジェクト終了時）
- 具体的な実績の記載
- 客観的な評価基準の活用
- 継続的なスキル開発

### リソース配分
- 余裕を持った配分（80%目安）
- スキル育成機会の考慮
- 負荷の平準化
- 早期のコンフリクト解消

## 分析・最適化

### KPI
- スキルカバー率
- 稼働率（目標：75-85%）
- スキルマッチ度
- 育成目標達成率

### 最適化施策
- スキル需要に基づく採用
- 戦略的な育成投資
- 外部リソースの活用
- ジョブローテーション

## トラブルシューティング

### よくある問題

#### スキルが検索されない
- スキル名の表記確認
- カテゴリ設定の確認
- 非アクティブ化されていないか確認

#### 稼働率が100%を超える
- 重複アサインの確認
- 期間設定の確認
- データ整合性チェック

#### マッチングで候補が出ない
- スキル要件の緩和
- 期間の調整
- 他チームとの調整

## 今後の拡張予定

### 短期
- AIによるスキル推定
- 外部リソース管理
- モバイルアプリ対応

### 中期
- スキルマーケットプレイス
- 自動アサイン最適化
- 予測分析機能

### 長期
- 他システム連携（LinkedIn等）
- グローバルリソース管理
- AIによるキャリアパス提案