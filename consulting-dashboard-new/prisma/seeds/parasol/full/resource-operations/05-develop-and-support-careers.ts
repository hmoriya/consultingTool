import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedDevelopAndSupportCareers(service: unknown, capability: unknown) {
  console.log('    Creating business operation: キャリアを開発・支援する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'DevelopAndSupportCareers',
      displayName: 'キャリアを開発・支援する',
      design: `# ビジネスオペレーション: キャリアを開発・支援する [DevelopAndSupportCareers] [DEVELOP_AND_SUPPORT_CAREERS]

## オペレーション概要

### 目的
コンサルタント個々のキャリア志向と組織ニーズを調和させ、中長期的なキャリアパスの設計と実現を支援することで、個人の自己実現と組織の持続的成長を両立する

### ビジネス価値
- **人材定着**: 優秀人材の定着率85%達成、離職率40%削減、エンゲージメント30%向上
- **組織強化**: 次世代リーダー充足率100%、専門性深化度50%向上、多様性指標20%改善
- **競争力向上**: 高付加価値人材比率60%達成、平均単価15%向上、顧客満足度向上

### 実行頻度
- **頻度**: 年次キャリア面談（必須）、四半期フォロー、随時相談
- **トリガー**: 年次評価後、プロジェクト完了時、ライフイベント発生時
- **所要時間**: 年次面談（2時間）、キャリアプラン策定（1週間）

## ロールと責任

### 関与者
- キャリアマネージャー [CareerManager] [CAREER_MANAGER]
  - 責任: キャリア開発戦略、プログラム設計、機会創出
  - 権限: キャリアパス承認、異動提案、投資決定

- コンサルタント [Consultant] [CONSULTANT]
  - 責任: キャリアビジョン明確化、主体的な成長、機会活用
  - 権限: キャリア選択、学習機会選定、異動希望

- 上司 [Supervisor] [SUPERVISOR]
  - 責任: 部下のキャリア支援、成長機会提供、推薦
  - 権限: アサイン調整、昇進推薦、育成投資

- メンター [Mentor] [MENTOR]
  - 責任: キャリア相談、経験共有、ネットワーク紹介
  - 権限: アドバイス提供、機会推薦

### RACI マトリクス
| ステップ | CM | コンサルタント | 上司 | メンター |
|---------|-----|--------------|------|----------|
| 志向性把握 | C | R | C | I |
| パス設計 | A | R | C | C |
| 計画策定 | C | R | A | C |
| 機会提供 | R | C | R | I |
| 進捗確認 | C | R | R | I |
| 調整・支援 | R | C | C | C |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：キャリア管理サイクル]
  ↓
[ステップ1：キャリア志向性把握]
  ↓
[ステップ2：キャリアパス設計]
  ↓
[ステップ3：能力開発計画策定]
  ↓
[ステップ4：成長機会の提供]
  ↓
[ステップ5：進捗モニタリング]
  ↓
[ステップ6：キャリア移行支援]
  ↓
[判断：目標達成？]
  ↓ Yes                    ↓ No
[次フェーズへ]            [計画見直し]
\`\`\`

### 各ステップの詳細

#### ステップ1: キャリア志向性把握 [UnderstandCareerAspirations] [UNDERSTAND_CAREER_ASPIRATIONS]
- **目的**: 個人の価値観・志向・目標を深く理解
- **入力**: 自己分析結果、過去の経歴、評価結果
- **活動**:
  1. キャリアアンカー診断の実施
  2. ライフキャリアビジョンの明確化
  3. 強み・情熱・価値観の探索
  4. 5年後・10年後の理想像設定
  5. ワークライフバランス優先度確認
  6. 学習意欲・成長領域の特定
- **出力**: キャリア志向性レポート、ビジョンステートメント
- **所要時間**: 2-3時間

#### ステップ2: キャリアパス設計 [DesignCareerPath] [DESIGN_CAREER_PATH]
- **目的**: 個人の志向と組織機会を統合した道筋を設計
- **入力**: キャリア志向性、組織のキャリアモデル、市場動向
- **活動**:
  1. 複数のキャリアオプション検討
  2. 各パスの要件とステップ定義
  3. 必要スキル・経験の明確化
  4. タイムラインの設定
  5. リスクと機会の評価
  6. 優先順位付けと選択
- **出力**: キャリアパスマップ、マイルストーン定義
- **所要時間**: 1日

#### ステップ3: 能力開発計画策定 [CreateDevelopmentPlan] [CREATE_DEVELOPMENT_PLAN]
- **目的**: キャリア目標達成に必要な能力開発を計画
- **入力**: キャリアパス、現在の能力、ギャップ分析
- **活動**:
  1. 必要コンピテンシーの特定
  2. 現状とのギャップ分析
  3. 学習方法の選定（70-20-10モデル）
  4. ストレッチアサインメントの計画
  5. 外部学習機会の特定
  6. メンタリング・コーチング計画
- **出力**: 個別能力開発計画、学習ロードマップ
- **所要時間**: 2日

#### ステップ4: 成長機会の提供 [ProvideGrowthOpportunities] [PROVIDE_GROWTH_OPPORTUNITIES]
- **目的**: 計画に基づいた実践的な成長機会を創出・提供
- **入力**: 能力開発計画、プロジェクト機会、予算
- **活動**:
  1. 適切なプロジェクトへのアサイン
  2. リーダーシップ機会の提供
  3. クロスファンクショナル経験
  4. 社外活動機会（講演、執筆）
  5. 海外・異文化経験機会
  6. イノベーション・起業機会
- **出力**: アサイン実績、成長機会記録
- **所要時間**: 継続的

#### ステップ5: 進捗モニタリング [MonitorProgress] [MONITOR_PROGRESS]
- **目的**: キャリア開発の進捗を定期的に確認し支援
- **入力**: キャリアプラン、実績、フィードバック
- **活動**:
  1. 定期的な1on1の実施
  2. マイルストーン達成度確認
  3. 新たな課題・機会の発見
  4. 計画の柔軟な見直し
  5. 支援ニーズの把握
  6. 成功体験の強化
- **出力**: 進捗レポート、調整後計画
- **所要時間**: 月次1時間

#### ステップ6: キャリア移行支援 [SupportCareerTransition] [SUPPORT_CAREER_TRANSITION]
- **目的**: 次のキャリアステージへの円滑な移行を支援
- **入力**: 移行計画、必要条件、タイミング
- **活動**:
  1. 移行準備の支援
  2. 必要スキルの最終確認
  3. 内部公募・推薦プロセス
  4. 引き継ぎ計画の策定
  5. 新役割へのオンボーディング
  6. 移行後のフォローアップ
- **出力**: 移行完了、新役割での活躍
- **所要時間**: 1-3ヶ月

## 状態遷移

### 状態定義
- 探索中 [Exploring] [EXPLORING]: キャリアの方向性を模索中
- 計画中 [Planning] [PLANNING]: キャリアプランを策定中
- 開発中 [Developing] [DEVELOPING]: 能力開発を実施中
- 準備完了 [Ready] [READY]: 次ステージへの準備完了
- 移行中 [Transitioning] [TRANSITIONING]: キャリア移行実施中
- 定着中 [Stabilizing] [STABILIZING]: 新役割に適応中
- 見直し中 [Reviewing] [REVIEWING]: キャリアプラン再検討中

### 遷移条件
\`\`\`
探索中 --[志向性明確化]--> 計画中
計画中 --[プラン確定]--> 開発中
開発中 --[能力習得]--> 準備完了
準備完了 --[機会発生]--> 移行中
移行中 --[移行完了]--> 定着中
定着中 --[安定化]--> 探索中
任意の状態 --[環境変化]--> 見直し中
見直し中 --[方針決定]--> 計画中
\`\`\`

## ビジネスルール

### 事前条件
1. 組織のキャリアフレームワークが存在する
2. キャリア面談の時間が確保されている
3. 成長機会へのアクセスが公平である
4. 本人の主体性が確認されている

### 実行中の制約
1. キャリア情報は機密情報として管理
2. 本人の意向を最優先に尊重
3. 組織都合での強制的な方向付けは禁止
4. 多様なキャリアパスを認める
5. ワークライフバランスを考慮

### 事後条件
1. キャリアプランが文書化されている
2. 能力開発の機会が提供されている
3. 定期的なフォローアップが設定されている
4. 成長の記録が蓄積されている
5. 次の目標が明確になっている

## パラソルドメインモデル

### エンティティ定義
- キャリアプラン [CareerPlan] [CAREER_PLAN]
  - プランID、コンサルタントID、ビジョン、目標、期限、状態
- キャリアパス [CareerPath] [CAREER_PATH]
  - パスID、名称、要件、ステップ、典型期間
- 成長機会 [GrowthOpportunity] [GROWTH_OPPORTUNITY]
  - 機会ID、種別、内容、提供日、成果、評価
- キャリア面談 [CareerConsultation] [CAREER_CONSULTATION]
  - 面談ID、実施日、参加者、議題、合意事項、次回アクション

### 値オブジェクト
- キャリアアンカー [CareerAnchor] [CAREER_ANCHOR]
  - 専門性、管理、自律性、安定性、起業家精神、奉仕、挑戦、ライフスタイル
- キャリアステージ [CareerStage] [CAREER_STAGE]
  - 見習い、一人前、指導者、専門家、経営幹部

## KPI

1. **キャリア目標達成率**: 設定したキャリア目標の達成度
   - 目標値: 80%以上
   - 測定方法: (達成マイルストーン数 / 計画マイルストーン数) × 100
   - 測定頻度: 年次

2. **内部登用率**: 重要ポジションへの内部人材登用割合
   - 目標値: 70%以上
   - 測定方法: (内部登用数 / 重要ポジション充足数) × 100
   - 測定頻度: 年次

3. **キャリア満足度**: キャリア開発支援への満足度
   - 目標値: 4.0/5.0以上
   - 測定方法: 年次サーベイでの満足度スコア
   - 測定頻度: 年次

4. **能力向上度**: キャリアプランに基づく能力成長
   - 目標値: 年間2段階以上のレベルアップ
   - 測定方法: スキル評価の変化測定
   - 測定頻度: 半期

5. **定着率**: キャリア支援対象者の組織定着率
   - 目標値: 90%以上
   - 測定方法: (継続勤務者数 / 支援対象者数) × 100
   - 測定頻度: 年次`,
      pattern: 'CareerDevelopment',
      goal: '個々のキャリア志向と組織ニーズを調和させ、長期的な成長と自己実現を支援する',
      roles: JSON.stringify([
        { name: 'CareerManager', displayName: 'キャリアマネージャー', systemName: 'CAREER_MANAGER' },
        { name: 'Consultant', displayName: 'コンサルタント', systemName: 'CONSULTANT' },
        { name: 'Supervisor', displayName: '上司', systemName: 'SUPERVISOR' },
        { name: 'Mentor', displayName: 'メンター', systemName: 'MENTOR' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'UnderstandCareerAspirations', displayName: 'キャリア志向性把握', systemName: 'UNDERSTAND_CAREER_ASPIRATIONS' },
          { name: 'DesignCareerPath', displayName: 'キャリアパス設計', systemName: 'DESIGN_CAREER_PATH' },
          { name: 'CreateDevelopmentPlan', displayName: '能力開発計画策定', systemName: 'CREATE_DEVELOPMENT_PLAN' },
          { name: 'ProvideGrowthOpportunities', displayName: '成長機会の提供', systemName: 'PROVIDE_GROWTH_OPPORTUNITIES' },
          { name: 'MonitorProgress', displayName: '進捗モニタリング', systemName: 'MONITOR_PROGRESS' },
          { name: 'SupportCareerTransition', displayName: 'キャリア移行支援', systemName: 'SUPPORT_CAREER_TRANSITION' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'Exploring', displayName: '探索中', systemName: 'EXPLORING' },
        { name: 'Planning', displayName: '計画中', systemName: 'PLANNING' },
        { name: 'Developing', displayName: '開発中', systemName: 'DEVELOPING' },
        { name: 'Ready', displayName: '準備完了', systemName: 'READY' },
        { name: 'Transitioning', displayName: '移行中', systemName: 'TRANSITIONING' },
        { name: 'Stabilizing', displayName: '定着中', systemName: 'STABILIZING' },
        { name: 'Reviewing', displayName: '見直し中', systemName: 'REVIEWING' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}