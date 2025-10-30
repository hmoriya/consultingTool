import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// 生産性可視化サービスのケーパビリティとビジネスオペレーション定義
export const productivityVisualizationData = {
  capabilities: [
    {
      name: 'time-tracking',
      displayName: '工数を正確に記録する能力',
      description: 'プロジェクト別・タスク別の作業時間を正確に記録し、生産性分析の基礎データを提供する能力',
      category: 'Core',
      definition: `# ビジネスケーパビリティ: 工数を正確に記録する能力

## ケーパビリティ概要
日々の作業時間を詳細かつ正確に記録し、プロジェクト収益性と個人生産性の分析基盤を提供する能力

## ビジネス価値
- **収益性向上**: 正確な原価計算による利益率改善
- **効率化**: ボトルネックの可視化と改善
- **透明性**: クライアントへの請求根拠の明確化

## 実現する成果
- 工数入力率: 100%（毎日）
- 入力精度: 95%以上
- 承認遅延: 1営業日以内
- 請求漏れ: ゼロ

## 必要な要素
### 人材・スキル
- タイムキーパー
- 工数分析専門家
- プロジェクトコントローラー

### プロセス・方法論
- 日次工数入力ルール
- プロジェクトコード体系
- 承認ワークフロー

### ツール・システム
- 工数入力システム
- モバイル入力アプリ
- 自動集計ダッシュボード`,
      businessOperations: [
        {
          name: 'daily-time-entry',
          displayName: '日次工数を入力する',
          pattern: 'CRUD',
          goal: 'その日の作業内容の正確な記録',
          design: `# ビジネスオペレーション: 日次工数を入力する

## 目的
毎日の作業時間と内容を正確に記録し、プロジェクト原価計算と生産性分析の基礎データを作成する

## 関係者とロール
- **コンサルタント**: 工数入力
- **プロジェクトマネージャー**: 入力確認、指導
- **経理部門**: 請求データ作成
- **システム管理者**: 入力支援

## ビジネスオペレーション
1. **作業記録**: リアルタイムメモ
2. **プロジェクト選択**: 正しいコード選択
3. **時間入力**: 開始・終了時刻or時間数
4. **作業内容記載**: 具体的な活動内容
5. **カテゴリ分類**: 請求可能/不可の判定
6. **保存・確認**: 入力内容の最終確認

## 状態遷移
未入力 → 下書き → 確定 → 承認待ち → 承認済み

## KPI
- 当日入力率: 90%以上
- 入力所要時間: 5分以内
- 修正率: 5%以下`,
          roles: ['コンサルタント', 'プロジェクトマネージャー', '経理部門', 'システム管理者'],
          operations: {
            steps: [
              '作業記録',
              'プロジェクト選択',
              '時間入力',
              '作業内容記載',
              'カテゴリ分類',
              '保存・確認'
            ]
          },
          businessStates: {
            initial: '未入力',
            states: ['未入力', '下書き', '確定', '承認待ち', '承認済み'],
            final: '承認済み'
          }
        },
        {
          name: 'timesheet-submission',
          displayName: 'タイムシートを提出する',
          pattern: 'Workflow',
          goal: '週次・月次での工数確定',
          design: `# ビジネスオペレーション: タイムシートを提出する

## 目的
一定期間の工数をまとめて確認し、承認プロセスに提出する

## 関係者とロール
- **提出者**: タイムシート作成、提出
- **承認者（上司）**: 内容確認、承認
- **プロジェクトマネージャー**: プロジェクト視点確認
- **経理部門**: 請求処理

## ビジネスオペレーション
1. **期間集計**: 週次・月次の集計
2. **整合性確認**: 合計時間、プロジェクト配分
3. **コメント追加**: 特記事項の記載
4. **提出**: 承認者への提出
5. **通知**: 承認者へのアラート
6. **追跡**: 承認状況の確認

## KPI
- 期限内提出率: 100%
- 一発承認率: 85%以上
- 提出所要時間: 10分以内`,
          roles: ['提出者', '承認者（上司）', 'プロジェクトマネージャー', '経理部門'],
          operations: {
            steps: [
              '期間集計',
              '整合性確認',
              'コメント追加',
              '提出',
              '通知',
              '追跡'
            ]
          },
          businessStates: {
            initial: '作成中',
            states: ['作成中', '提出済み', '承認中', '差戻し', '承認済み'],
            final: '承認済み'
          }
        },
        {
          name: 'time-analysis',
          displayName: '工数を分析する',
          pattern: 'Analytics',
          goal: '生産性向上のインサイト抽出',
          design: `# ビジネスオペレーション: 工数を分析する

## 目的
蓄積された工数データから生産性や収益性のインサイトを抽出し、改善施策を立案する

## 関係者とロール
- **分析担当者**: データ分析実施
- **プロジェクトマネージャー**: 改善施策検討
- **経営層**: 戦略的意思決定
- **PMO**: 全社施策展開

## ビジネスオペレーション
1. **データ抽出**: 分析対象データの取得
2. **基礎分析**: 稼働率、配分率等
3. **深堀り分析**: 異常値、トレンド
4. **インサイト抽出**: 課題と機会の発見
5. **施策立案**: 改善アクション
6. **効果測定**: 施策の成果確認

## KPI
- 分析頻度: 月次
- インサイト発見数: 月5件以上
- 施策実行率: 80%以上`,
          roles: ['分析担当者', 'プロジェクトマネージャー', '経営層', 'PMO'],
          operations: {
            steps: [
              'データ抽出',
              '基礎分析',
              '深堀り分析',
              'インサイト抽出',
              '施策立案',
              '効果測定'
            ]
          },
          businessStates: {
            initial: '分析中',
            states: ['分析中', 'レビュー中', '施策検討中', '実行中'],
            final: '実行中'
          }
        }
      ]
    },
    {
      name: 'approval-workflow',
      displayName: '承認を効率化する能力',
      description: '工数承認プロセスを効率化し、迅速かつ正確な承認を実現する能力',
      category: 'Core',
      definition: `# ビジネスケーパビリティ: 承認を効率化する能力

## ケーパビリティ概要
多段階の承認プロセスを効率的に管理し、適時適切な工数承認を実現する能力

## ビジネス価値
- **迅速化**: 承認待ち時間の削減
- **正確性**: 承認ミスの防止
- **可視化**: 承認状況の透明性

## 実現する成果
- 承認所要時間: 24時間以内
- 承認漏れ: ゼロ
- 自動承認率: 60%（ルールベース）
- 差戻し率: 10%以下

## 必要な要素
### 人材・スキル
- ワークフロー設計者
- 承認者トレーニング
- システム管理者

### プロセス・方法論
- 承認ルール設計
- エスカレーション手順
- 例外処理プロセス

### ツール・システム
- ワークフローシステム
- 承認通知システム
- ダッシュボード`,
      businessOperations: [
        {
          name: 'approval-processing',
          displayName: '承認を処理する',
          pattern: 'Workflow',
          goal: '迅速かつ適切な承認判断',
          design: `# ビジネスオペレーション: 承認を処理する

## 目的
提出された工数を適切に確認し、迅速に承認判断を行う

## 関係者とロール
- **承認者**: 承認判断、フィードバック
- **提出者**: 工数説明、修正対応
- **代理承認者**: 不在時の対応
- **システム管理者**: 承認フロー管理

## ビジネスオペレーション
1. **通知受信**: 承認依頼の受領
2. **内容確認**: 工数の妥当性チェック
3. **質問・確認**: 不明点の確認
4. **判断**: 承認/差戻し/保留
5. **フィードバック**: コメント付与
6. **完了通知**: 提出者への通知

## KPI
- 承認時間: 24時間以内
- 初回承認率: 85%以上
- フィードバック付与率: 100%`,
          roles: ['承認者', '提出者', '代理承認者', 'システム管理者'],
          operations: {
            steps: [
              '通知受信',
              '内容確認',
              '質問・確認',
              '判断',
              'フィードバック',
              '完了通知'
            ]
          },
          businessStates: {
            initial: '承認待ち',
            states: ['承認待ち', '確認中', '承認済み', '差戻し', '保留'],
            final: '承認済み'
          }
        },
        {
          name: 'approval-delegation',
          displayName: '承認を委譲する',
          pattern: 'Administration',
          goal: '承認の継続性確保',
          design: `# ビジネスオペレーション: 承認を委譲する

## 目的
承認者不在時でも滞りなく承認プロセスを継続する

## 関係者とロール
- **委譲元承認者**: 権限委譲
- **委譲先承認者**: 代理承認
- **システム管理者**: 委譲設定
- **提出者**: 承認者変更の認識

## ビジネスオペレーション
1. **委譲計画**: 不在期間の確認
2. **委譲先選定**: 適切な代理者選択
3. **権限設定**: システム上の設定
4. **引継ぎ**: 注意点の共有
5. **通知**: 関係者への周知
6. **委譲解除**: 復帰時の設定戻し

## KPI
- 委譲設定率: 100%（長期不在時）
- 委譲ミス: ゼロ
- 引継ぎ完了率: 100%`,
          roles: ['委譲元承認者', '委譲先承認者', 'システム管理者', '提出者'],
          operations: {
            steps: [
              '委譲計画',
              '委譲先選定',
              '権限設定',
              '引継ぎ',
              '通知',
              '委譲解除'
            ]
          },
          businessStates: {
            initial: '通常',
            states: ['通常', '委譲準備中', '委譲中', '解除中'],
            final: '通常'
          }
        }
      ]
    },
    {
      name: 'productivity-insights',
      displayName: '生産性を可視化する能力',
      description: '個人・チーム・組織の生産性を多角的に分析し、改善機会を発見する能力',
      category: 'Supporting',
      definition: `# ビジネスケーパビリティ: 生産性を可視化する能力

## ケーパビリティ概要
工数データから生産性指標を算出し、改善ポイントを可視化する能力

## ビジネス価値
- **効率向上**: ボトルネックの発見と解消
- **収益改善**: 非効率な活動の削減
- **意思決定**: データに基づく施策立案

## 実現する成果
- 生産性向上: 年10%以上
- 非請求時間削減: 20%減
- レポート作成時間: 30分以内
- 改善施策成功率: 70%以上

## 必要な要素
### 人材・スキル
- データアナリスト
- ビジネスインテリジェンス専門家
- 業務改善コンサルタント

### プロセス・方法論
- KPI設計手法
- 統計分析手法
- 可視化ベストプラクティス

### ツール・システム
- BIツール
- データウェアハウス
- 分析ダッシュボード`,
      businessOperations: [
        {
          name: 'kpi-monitoring',
          displayName: 'KPIをモニタリングする',
          pattern: 'Analytics',
          goal: 'リアルタイムな生産性把握',
          design: `# ビジネスオペレーション: KPIをモニタリングする

## 目的
重要な生産性指標をリアルタイムに監視し、異常の早期発見と対応を可能にする

## 関係者とロール
- **KPI管理者**: 指標定義、監視
- **部門長**: 部門KPI確認、対策
- **経営層**: 全社KPI確認
- **データエンジニア**: システム運用

## ビジネスオペレーション
1. **KPI定義**: 重要指標の選定
2. **データ収集**: 自動データ取得
3. **計算・集計**: KPI値の算出
4. **可視化**: ダッシュボード表示
5. **アラート**: 閾値超過の通知
6. **対応追跡**: 改善アクション管理

## KPI
- データ鮮度: リアルタイム
- ダッシュボード稼働率: 99.9%
- アラート精度: 95%以上`,
          roles: ['KPI管理者', '部門長', '経営層', 'データエンジニア'],
          operations: {
            steps: [
              'KPI定義',
              'データ収集',
              '計算・集計',
              '可視化',
              'アラート',
              '対応追跡'
            ]
          },
          businessStates: {
            initial: '設定中',
            states: ['設定中', '監視中', 'アラート発生', '対応中'],
            final: '監視中'
          }
        },
        {
          name: 'productivity-reporting',
          displayName: '生産性レポートを作成する',
          pattern: 'Analytics',
          goal: '経営判断に資するレポート提供',
          design: `# ビジネスオペレーション: 生産性レポートを作成する

## 目的
生産性に関する包括的な分析レポートを作成し、経営判断を支援する

## 関係者とロール
- **レポート作成者**: 分析、作成
- **レビュアー**: 内容確認、品質保証
- **経営層**: レポート活用
- **部門長**: 詳細分析要求

## ビジネスオペレーション
1. **要件確認**: レポート目的、対象
2. **データ準備**: 必要データの収集
3. **分析実施**: 多角的な分析
4. **インサイト抽出**: 重要な発見
5. **レポート作成**: 視覚的な表現
6. **配信**: 対象者への展開

## KPI
- 作成時間: 4時間以内
- 正確性: 99%以上
- 活用率: 80%以上`,
          roles: ['レポート作成者', 'レビュアー', '経営層', '部門長'],
          operations: {
            steps: [
              '要件確認',
              'データ準備',
              '分析実施',
              'インサイト抽出',
              'レポート作成',
              '配信'
            ]
          },
          businessStates: {
            initial: '要件確認中',
            states: ['要件確認中', '作成中', 'レビュー中', '配信済み'],
            final: '配信済み'
          }
        },
        {
          name: 'improvement-tracking',
          displayName: '改善効果を測定する',
          pattern: 'Analytics',
          goal: '施策の効果検証と定着',
          design: `# ビジネスオペレーション: 改善効果を測定する

## 目的
生産性改善施策の効果を定量的に測定し、成功要因を特定して横展開する

## 関係者とロール
- **改善推進者**: 施策実行、測定
- **データアナリスト**: 効果分析
- **部門長**: 施策承認、展開
- **PMO**: ベストプラクティス管理

## ビジネスオペレーション
1. **ベースライン測定**: 改善前の状態
2. **施策実施**: 改善活動の実行
3. **データ収集**: 改善後のデータ
4. **効果測定**: 定量的な比較
5. **要因分析**: 成功/失敗要因
6. **横展開計画**: 他部門への展開

## KPI
- 測定実施率: 100%
- 目標達成率: 70%以上
- 横展開数: 成功施策の80%`,
          roles: ['改善推進者', 'データアナリスト', '部門長', 'PMO'],
          operations: {
            steps: [
              'ベースライン測定',
              '施策実施',
              'データ収集',
              '効果測定',
              '要因分析',
              '横展開計画'
            ]
          },
          businessStates: {
            initial: '計測準備',
            states: ['計測準備', '実施中', '効果測定中', '展開中'],
            final: '展開中'
          }
        }
      ]
    }
  ]
}

export async function createProductivityVisualizationData(serviceId: string) {
  console.log('  Creating Productivity Visualization Service capabilities and operations...')
  
  let totalCapabilities = 0
  let totalOperations = 0
  
  for (const capData of productivityVisualizationData.capabilities) {
    // ケーパビリティの作成
    const capability = await parasolDb.businessCapability.create({
      data: {
        serviceId,
        name: capData.name,
        displayName: capData.displayName,
        description: capData.description,
        definition: capData.definition,
        category: capData.category
      }
    })
    totalCapabilities++
    console.log(`    ✓ Created capability: ${capability.displayName}`)
    
    // ビジネスオペレーションの作成
    for (const opData of capData.businessOperations) {
      const operation = await parasolDb.businessOperation.create({
        data: {
          serviceId,
          capabilityId: capability.id,
          name: opData.name,
          displayName: opData.displayName,
          design: opData.design,
          pattern: opData.pattern,
          goal: opData.goal,
          roles: JSON.stringify(opData.roles),
          operations: JSON.stringify(opData.operations),
          businessStates: JSON.stringify(opData.businessStates),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify({ pages: [] }),
          testCases: JSON.stringify({ criteria: opData.goal })
        }
      })
      totalOperations++
      console.log(`      ✓ Created operation: ${operation.displayName}`)
    }
  }
  
  return { capabilities: totalCapabilities, operations: totalOperations }
}