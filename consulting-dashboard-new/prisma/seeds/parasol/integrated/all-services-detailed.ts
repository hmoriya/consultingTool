import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import { readFileSync } from 'fs'
import { join } from 'path'

const parasolDb = new ParasolPrismaClient()

interface ServiceConfig {
  name: string
  displayName: string
  description: string
  domainLanguageFile: string
  capabilities: Array<{
    name: string
    displayName: string
    description: string
    category: 'Core' | 'Support' | 'Management'
    definition: string
    operations: Array<{
      name: string
      displayName: string
      pattern: 'Workflow' | 'CRUD' | 'Analytics' | 'Communication' | 'Administration'
      goal: string
      roles: string[]
      businessStates: string[]
      operations: any[]
      useCases: any[]
      uiDefinitions: any[]
      testCases: any[]
      robustnessModel: any
      design: {
        overview?: string
        processFlow?: string
        kpis?: Record<string, string>
        businessRules?: string[]
        inputOutputSpec?: {
          inputs: string[]
          outputs: string[]
        }
      }
    }>
  }>
}

const services: ServiceConfig[] = [
  {
    name: 'secure-access',
    displayName: 'セキュアアクセスサービス',
    description: '認証・認可・監査を通じて、システムへの安全なアクセスを保証',
    domainLanguageFile: 'secure-access-v2.md',
    capabilities: [
      {
        name: 'access-control',
        displayName: 'アクセスを安全に管理する能力',
        description: 'ユーザー認証、権限管理、監査ログを通じて安全性を確保',
        category: 'Core',
        definition: `# アクセスを安全に管理する能力

## 定義
組織のセキュリティポリシーに基づき、システムへのアクセスを制御し、不正アクセスを防止する組織的能力

## 責務
- ユーザーの身元確認と認証
- 権限に基づくアクセス制御
- セキュリティイベントの記録と監査
- コンプライアンス要件の遵守
- セキュリティインシデントの早期発見と対応

## 提供価値
- セキュリティリスクの最小化: 不正アクセス試行を99%以上検知・ブロック
- コンプライアンス要件の充足: 監査で100%適合を維持
- 監査証跡の提供: 全アクセスログの完全な記録と検索可能性
- 不正アクセスの防止: 多要素認証により侵害リスクを95%削減
- 組織信頼性の向上: セキュリティ認証取得による顧客信頼度向上

## 実現手段
- ユーザーを認証する
- 権限を管理する
- アクセスを監査する

## 成熟度レベル
- **現在**: レベル3（定義され管理されている）
- **目標**: レベル4（定量的に管理されている）
- **改善計画**: セキュリティメトリクスの自動監視導入とリアルタイム脅威検知システムの構築

## 依存関係
- **前提ケーパビリティ**: なし（基盤的能力）
- **関連ケーパビリティ**: コンプライアンス管理能力、リスク管理能力`,
        operations: [
          {
            name: 'authenticate-user',
            displayName: 'ユーザーを認証する',
            pattern: 'Workflow',
            goal: 'ユーザーの身元を確認し、システムへのアクセスを許可',
            roles: ['User', 'System', 'SecurityAdmin'],
            businessStates: ['login-initiated', 'credentials-verified', 'mfa-required', 'mfa-completed', 'authenticated', 'rejected'],
            operations: [],
            useCases: [
              {
                name: 'ログインする',
                actors: ['User'],
                preconditions: ['ユーザーアカウントが存在する'],
                postconditions: ['認証トークンが発行される'],
                mainFlow: ['メールアドレス入力', 'パスワード入力', '認証', 'MFA確認', 'ダッシュボード表示']
              }
            ],
            uiDefinitions: [
              {
                pageName: 'ログイン画面',
                components: ['メールアドレス入力フィールド', 'パスワード入力フィールド', 'ログインボタン', 'パスワードリセットリンク']
              }
            ],
            testCases: [
              {
                name: '正常ログイン',
                steps: ['有効な認証情報を入力', 'ログインボタンをクリック'],
                expected: 'ダッシュボードが表示される'
              }
            ],
            robustnessModel: {
              boundaries: ['LoginUI'],
              controls: ['AuthenticationService'],
              entities: ['User', 'Session']
            },
            design: `# ビジネスオペレーション: ユーザーを認証する

## 概要
**目的**: ユーザーの身元を確実に確認し、システムへの安全なアクセスを提供する
**パターン**: Workflow
**ゴール**: 不正アクセスを防止しながら、正当なユーザーに迅速で確実な認証を提供

## 関係者とロール
- **エンドユーザー**: 自身の認証情報を正確に入力し、セキュリティ要件に協力
- **セキュリティシステム**: 認証情報の検証、リスク評価、アクセス制御の実行
- **セキュリティ管理者**: 認証ポリシーの設定、異常検知、インシデント対応

## プロセスフロー
\`\`\`mermaid
flowchart LR
    A[ログイン開始] --> B[認証情報入力]
    B --> C[一次認証検証]
    C --> D{認証成功?}
    D -->|失敗| E[エラー表示]
    D -->|成功| F[MFA要求]
    F --> G[MFA検証]
    G --> H{MFA成功?}
    H -->|失敗| E
    H -->|成功| I[セッション作成]
    I --> J[ダッシュボード表示]
    E --> K[ログイン再試行]
\`\`\`

### ステップ詳細
1. **認証情報入力**: ユーザーがメールアドレスとパスワードを入力
2. **一次認証検証**: システムがハッシュ化されたパスワードと照合
3. **MFA検証**: SMS、認証アプリ、またはハードウェアトークンによる追加認証
4. **セッション作成**: 認証成功時にJWTトークンとセッション情報を生成
5. **アクセス記録**: 認証試行をすべて監査ログに記録

## ビジネス状態
\`\`\`mermaid
stateDiagram-v2
    [*] --> 未認証
    未認証 --> 認証中: ログイン開始
    認証中 --> MFA待機: 一次認証成功
    認証中 --> 認証失敗: 一次認証失敗
    MFA待機 --> 認証完了: MFA成功
    MFA待機 --> 認証失敗: MFA失敗
    認証失敗 --> 未認証: 再試行
    認証完了 --> [*]: セッション開始
\`\`\`

## KPI
- **認証成功率**: 99.9%以上 - 正当なユーザーの円滑なアクセス確保
- **MFA採用率**: 100% - 全ユーザーの2要素認証実施
- **平均認証時間**: 10秒以内 - ユーザビリティの維持
- **不正アクセス検知率**: 95%以上 - セキュリティ侵害の防止

## ビジネスルール
- パスワードは8文字以上、大小英数記号を含む
- 連続3回失敗でアカウントロック（15分間）
- MFAは全ユーザー必須
- セッション有効期限は8時間、無操作30分で自動ログアウト
- 異なるデバイスからのログインは追加認証が必要

## 入出力仕様
### 入力
- **メールアドレス**: 登録済みユーザーのメールアドレス
- **パスワード**: ハッシュ化前の平文パスワード
- **MFAコード**: 6桁の数値認証コード

### 出力
- **認証トークン**: JWT形式のアクセストークン（有効期限付き）
- **ユーザーセッション**: セッションID、最終アクセス時刻
- **ロール情報**: ユーザーの権限とアクセス可能なリソース

## 例外処理
- **アカウントロック**: ロック解除手順の案内とセキュリティ管理者への通知
- **MFA失敗**: バックアップコード利用の案内
- **システム障害**: 代替認証手段の提供と障害復旧の迅速化`
          },
          {
            name: 'manage-permissions',
            displayName: '権限を管理する',
            pattern: 'CRUD',
            goal: 'ロールベースのアクセス制御を実施',
            roles: ['SecurityAdmin', 'SystemAdmin'],
            businessStates: ['permission-created', 'permission-updated', 'permission-revoked'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'RBACに基づく権限管理システム',
              kpis: {
                '権限設定精度': '100%',
                '権限変更反映時間': '即時'
              },
              businessRules: [
                '最小権限の原則に従う',
                '職責分離を実施',
                '定期的な権限レビュー'
              ]
            }
          },
          {
            name: 'audit-access',
            displayName: 'アクセスを監査する',
            pattern: 'Analytics',
            goal: 'セキュリティイベントを記録し、コンプライアンスを確保',
            roles: ['Auditor', 'SecurityAdmin', 'ComplianceOfficer'],
            businessStates: ['event-recorded', 'anomaly-detected', 'alert-raised', 'investigation-completed'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: '包括的な監査ログと異常検知システム',
              processFlow: 'イベント記録 → 異常検知 → アラート生成 → 調査 → レポート',
              kpis: {
                'ログ記録率': '100%',
                '異常検知精度': '95%以上',
                'インシデント対応時間': '1時間以内'
              }
            }
          }
        ]
      }
    ]
  },
  {
    name: 'project-success-support',
    displayName: 'プロジェクト成功支援サービス',
    description: 'プロジェクトを成功に導くための計画策定、実行支援、リスク管理を統合的にサポート',
    domainLanguageFile: 'project-success-v2.md',
    capabilities: [
      {
        name: 'project-success',
        displayName: 'プロジェクトを成功に導く能力',
        description: 'プロジェクトを期限内・予算内で成功に導き、期待を超える成果を提供',
        category: 'Core',
        definition: `# プロジェクトを成功に導く能力

## 定義
プロジェクトの計画から完了まで、全体を統括し成功に導く組織的能力

## 責務
- プロジェクト計画の策定と管理
- リスクの特定と対応
- 進捗の追跡と報告
- 品質の保証
- ステークホルダーとのコミュニケーション

## 提供価値
- プロジェクト成功率の向上
- 計画精度の向上
- リスクの最小化
- ステークホルダー満足度の向上
- ナレッジの蓄積と活用`,
        operations: [
          {
            name: 'plan-project',
            displayName: 'プロジェクトを計画する',
            pattern: 'Workflow',
            goal: '目標・スコープ・スケジュール・リソース計画を策定し、成功への道筋を明確にする',
            roles: ['PM', 'BusinessAnalyst', 'Client', 'TeamLead'],
            businessStates: ['draft', 'requirements-gathered', 'scope-defined', 'schedule-created', 'resource-allocated', 'plan-approved'],
            operations: [],
            useCases: [
              {
                name: 'プロジェクトチャーターを作成する',
                actors: ['PM', 'Client'],
                preconditions: ['プロジェクトの基本情報が揃っている'],
                postconditions: ['プロジェクトチャーターが承認される']
              },
              {
                name: 'WBSを作成する',
                actors: ['PM', 'TeamLead'],
                preconditions: ['スコープが定義されている'],
                postconditions: ['作業分解構造が完成する']
              }
            ],
            uiDefinitions: [
              {
                pageName: 'プロジェクト計画画面',
                components: ['プロジェクト基本情報フォーム', 'WBSエディタ', 'ガントチャート', 'リソース割当表']
              }
            ],
            testCases: [
              {
                name: 'プロジェクト計画作成',
                steps: ['基本情報入力', 'スコープ定義', 'タスク分解', 'スケジュール作成', 'リソース割当'],
                expected: '計画が承認される'
              }
            ],
            robustnessModel: {
              boundaries: ['ProjectPlanUI'],
              controls: ['PlanningService', 'SchedulingEngine'],
              entities: ['Project', 'Task', 'Resource', 'Schedule']
            },
            design: {
              overview: 'プロジェクトの目標から詳細計画まで体系的に策定',
              processFlow: 'チャーター作成 → 要件収集 → スコープ定義 → WBS作成 → スケジューリング → リソース計画 → 承認',
              kpis: {
                '計画精度': '初期見積もりとの乖離±10%以内',
                '計画策定期間': '2週間以内',
                'ステークホルダー合意率': '100%'
              },
              businessRules: [
                'すべてのタスクに担当者を割り当てる',
                'クリティカルパスを特定する',
                'バッファを20%確保する',
                '週次でのマイルストーン設定'
              ],
              inputOutputSpec: {
                inputs: ['プロジェクト要件', 'リソース情報', '制約条件'],
                outputs: ['プロジェクト計画書', 'WBS', 'ガントチャート', 'リソース計画']
              }
            }
          },
          {
            name: 'manage-risks',
            displayName: 'リスクを管理する',
            pattern: 'Analytics',
            goal: 'リスクを早期識別し対策を講じる',
            roles: ['PM', 'RiskManager', 'TeamLead'],
            businessStates: ['risk-identified', 'risk-assessed', 'mitigation-planned', 'risk-monitoring', 'risk-closed'],
            operations: [],
            useCases: [
              {
                name: 'リスクを識別する',
                actors: ['PM', 'Team'],
                preconditions: ['プロジェクト計画が存在する'],
                postconditions: ['リスク登録簿が更新される']
              }
            ],
            uiDefinitions: [
              {
                pageName: 'リスク管理ダッシュボード',
                components: ['リスクマトリックス', 'リスク一覧', 'リスク詳細フォーム', '対策計画エディタ']
              }
            ],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'プロアクティブなリスク管理プロセス',
              processFlow: 'リスク識別 → 定性・定量分析 → 対策立案 → 実行 → モニタリング',
              kpis: {
                'リスク事前識別率': '90%以上',
                'リスク顕在化率': '10%以下',
                '対策実施率': '100%'
              },
              businessRules: [
                'リスクは発生確率と影響度で評価',
                '高リスクは24時間以内に対策立案',
                '週次でリスクレビュー実施'
              ]
            }
          },
          {
            name: 'track-progress',
            displayName: '進捗を追跡する',
            pattern: 'Analytics',
            goal: '進捗を可視化し遅延に対応',
            roles: ['PM', 'TeamLead', 'TeamMember'],
            businessStates: ['on-track', 'delayed', 'at-risk', 'completed'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'リアルタイム進捗追跡システム',
              processFlow: 'タスク更新 → 進捗集計 → 分析 → アラート → 対応',
              kpis: {
                'スケジュール遵守率': '95%以上',
                '遅延検知時間': '24時間以内',
                '進捗報告精度': '98%以上'
              }
            }
          },
          {
            name: 'ensure-quality',
            displayName: '品質を保証する',
            pattern: 'Workflow',
            goal: '成果物の品質基準を満たす',
            roles: ['QA', 'PM', 'Reviewer'],
            businessStates: ['draft', 'under-review', 'approved', 'rejected', 'rework'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: '体系的な品質保証プロセス',
              processFlow: '品質基準定義 → レビュー → テスト → 是正 → 承認',
              kpis: {
                '品質基準達成率': '100%',
                '初回合格率': '90%以上',
                'バグ密度': '1件/KLOC以下'
              }
            }
          },
          {
            name: 'deliver-results',
            displayName: '成果物を納品する',
            pattern: 'Workflow',
            goal: '計画通りに価値を提供',
            roles: ['PM', 'DeliveryManager', 'Client'],
            businessStates: ['preparation', 'review', 'acceptance', 'delivered'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: '確実な成果物デリバリープロセス',
              processFlow: '成果物準備 → 品質確認 → クライアントレビュー → 受入 → 納品',
              kpis: {
                '納期遵守率': '100%',
                '受入率': '95%以上（初回）',
                'クライアント満足度': '4.5/5.0以上'
              }
            }
          }
        ]
      }
    ]
  },
  {
    name: 'talent-optimization',
    displayName: 'タレント最適化サービス',
    description: '人材の能力を最大化し、適材適所の配置と成長機会を提供',
    domainLanguageFile: 'talent-optimization-v2.md',
    capabilities: [
      {
        name: 'talent-management',
        displayName: 'チームの生産性を最大化する能力',
        description: 'スキル管理、配置最適化、パフォーマンス向上を実現',
        category: 'Core',
        definition: `# チームの生産性を最大化する能力

## 定義
個々の人材の能力を把握し、最適な配置と育成により、チーム全体の生産性を最大化する組織的能力

## 責務
- スキルの可視化と管理
- リソースの最適配分
- タレントの育成と成長支援
- パフォーマンスの測定と改善

## 提供価値
- チーム生産性の向上
- 従業員満足度の向上
- スキルギャップの解消
- 人材の定着率向上`,
        operations: [
          {
            name: 'manage-skills',
            displayName: 'スキルを管理する',
            pattern: 'CRUD',
            goal: 'メンバーのスキルを可視化し育成',
            roles: ['HR', 'Manager', 'Employee'],
            businessStates: ['skill-registered', 'skill-assessed', 'skill-updated'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'スキルの体系的管理と可視化',
              kpis: {
                'スキル登録率': '100%',
                'スキル更新頻度': '四半期ごと',
                'スキルマッチング精度': '90%以上'
              },
              businessRules: [
                'スキルレベルは5段階評価',
                '年2回のスキルアセスメント実施',
                'スキルギャップ分析の自動化'
              ]
            }
          },
          {
            name: 'optimize-allocation',
            displayName: 'リソースを最適配置する',
            pattern: 'Analytics',
            goal: '適材適所の人材配置を実現',
            roles: ['ResourceManager', 'PM', 'TeamLead'],
            businessStates: ['request-received', 'matching-completed', 'allocated', 'released'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'AIを活用したリソース最適化',
              processFlow: '要求分析 → スキルマッチング → 稼働率確認 → 配置決定 → 通知',
              kpis: {
                'リソース稼働率': '85%以上',
                'プロジェクト満足度': '90%以上',
                '配置最適化時間': '24時間以内'
              }
            }
          },
          {
            name: 'develop-talent',
            displayName: 'タレントを育成する',
            pattern: 'Workflow',
            goal: 'キャリア開発と成長支援',
            roles: ['HR', 'Manager', 'Mentor', 'Employee'],
            businessStates: ['plan-created', 'training-ongoing', 'assessment-done', 'promotion-ready'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: '個別最適化された育成プログラム',
              kpis: {
                '育成計画達成率': '80%以上',
                'スキル向上率': '年20%以上',
                '昇進準備完了率': '30%/年'
              }
            }
          }
        ]
      }
    ]
  },
  {
    name: 'productivity-visualization',
    displayName: '生産性可視化サービス',
    description: '工数データを分析し、生産性向上のインサイトを提供',
    domainLanguageFile: 'productivity-visualization-v2.md',
    capabilities: [
      {
        name: 'productivity-analysis',
        displayName: '工数を正確に把握する能力',
        description: '工数記録、分析、最適化提案を通じて生産性を向上',
        category: 'Core',
        definition: `# 工数を正確に把握する能力

## 定義
プロジェクトやタスクに費やされた時間を正確に記録・分析し、生産性向上のインサイトを提供する能力

## 責務
- 工数の正確な記録
- 生産性指標の算出
- ボトルネックの特定
- 改善提案の生成

## 提供価値
- 正確な原価計算
- 生産性の可視化
- 改善機会の発見
- 請求根拠の明確化`,
        operations: [
          {
            name: 'record-timesheet',
            displayName: '工数を記録する',
            pattern: 'CRUD',
            goal: '正確な作業時間を記録',
            roles: ['Employee', 'Contractor'],
            businessStates: ['draft', 'submitted', 'approved', 'rejected'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'シンプルで正確な工数入力システム',
              kpis: {
                '入力率': '100%',
                '入力精度': '95%以上',
                '承認サイクル': '48時間以内'
              },
              businessRules: [
                '日次での工数入力必須',
                '週40時間を超える場合は理由記載',
                '月次締め後の変更は承認必要'
              ]
            }
          },
          {
            name: 'analyze-productivity',
            displayName: '生産性を分析する',
            pattern: 'Analytics',
            goal: '工数データから改善点を発見',
            roles: ['Analyst', 'Manager', 'PM'],
            businessStates: ['data-collected', 'analyzed', 'insights-generated', 'reported'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'AIを活用した生産性分析',
              processFlow: 'データ収集 → 正規化 → 分析 → インサイト生成 → レポート',
              kpis: {
                '分析精度': '90%以上',
                '改善提案実施率': '70%以上',
                '生産性向上率': '年10%以上'
              }
            }
          },
          {
            name: 'optimize-workload',
            displayName: '作業負荷を最適化する',
            pattern: 'Analytics',
            goal: 'チームの負荷を平準化',
            roles: ['ResourceManager', 'TeamLead'],
            businessStates: ['imbalance-detected', 'optimization-suggested', 'adjustment-made'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: '負荷分散の自動最適化',
              kpis: {
                '負荷平準化率': '±20%以内',
                '過負荷防止率': '100%',
                'バーンアウト予防率': '100%'
              }
            }
          }
        ]
      }
    ]
  },
  {
    name: 'collaboration-facilitation',
    displayName: 'コラボレーション促進サービス',
    description: 'チーム間の円滑なコミュニケーションと情報共有を実現',
    domainLanguageFile: 'collaboration-facilitation-v2.md',
    capabilities: [
      {
        name: 'communication',
        displayName: '情報を即座に届ける能力',
        description: '通知、メッセージング、情報共有を通じてコラボレーションを促進',
        category: 'Core',
        definition: `# 情報を即座に届ける能力

## 定義
適切な情報を適切なタイミングで適切な相手に届け、チームの協働を促進する能力

## 責務
- タイムリーな通知配信
- 効果的なコミュニケーション支援
- 知識の共有と蓄積
- コラボレーション環境の提供

## 提供価値
- 情報伝達の迅速化
- コミュニケーションコストの削減
- チーム連携の強化
- 意思決定の迅速化`,
        operations: [
          {
            name: 'send-notifications',
            displayName: '通知を配信する',
            pattern: 'Communication',
            goal: '重要情報をタイムリーに伝達',
            roles: ['System', 'Admin', 'User'],
            businessStates: ['notification-created', 'queued', 'sent', 'delivered', 'read'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'マルチチャネル通知システム',
              kpis: {
                '配信成功率': '99.9%以上',
                '配信遅延': '1秒以内',
                '既読率': '90%以上'
              },
              businessRules: [
                '重要度に応じた配信チャネル選択',
                'Do Not Disturb時間の考慮',
                '配信失敗時の再送制御'
              ]
            }
          },
          {
            name: 'facilitate-discussion',
            displayName: '議論を促進する',
            pattern: 'Communication',
            goal: 'チーム内の対話を活性化',
            roles: ['Facilitator', 'TeamMember'],
            businessStates: ['discussion-started', 'ongoing', 'concluded', 'action-items-created'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: '構造化された議論支援システム',
              kpis: {
                '議論参加率': '80%以上',
                '結論到達率': '90%以上',
                'アクション実行率': '85%以上'
              }
            }
          },
          {
            name: 'share-knowledge',
            displayName: '知識を共有する',
            pattern: 'Communication',
            goal: 'ナレッジの蓄積と活用',
            roles: ['KnowledgeWorker', 'Team'],
            businessStates: ['knowledge-created', 'reviewed', 'published', 'utilized'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: '知識共有プラットフォーム',
              kpis: {
                '知識登録率': '週5件以上/チーム',
                '再利用率': '60%以上',
                '検索ヒット率': '90%以上'
              }
            }
          }
        ]
      }
    ]
  },
  {
    name: 'knowledge-cocreation',
    displayName: 'ナレッジ共創サービス',
    description: '組織の知見を集約し、新たな価値を創造する知識基盤を構築',
    domainLanguageFile: 'knowledge-cocreation-v2.md',
    capabilities: [
      {
        name: 'knowledge-management',
        displayName: '知識を組織資産化する能力',
        description: 'ナレッジの蓄積、共有、活用を通じて組織知を強化',
        category: 'Core',
        definition: `# 知識を組織資産化する能力

## 定義
個人の暗黙知を形式知化し、組織全体で活用可能な知識資産として管理・活用する能力

## 責務
- 知識の収集と整理
- 知識の品質管理
- 知識の検索と提供
- 知識の更新と改善

## 提供価値
- 組織知の蓄積
- 業務効率の向上
- イノベーションの促進
- 競争優位性の確立`,
        operations: [
          {
            name: 'capture-knowledge',
            displayName: '知識を蓄積する',
            pattern: 'CRUD',
            goal: 'プロジェクトの学びを記録',
            roles: ['KnowledgeWorker', 'PM', 'Consultant'],
            businessStates: ['draft', 'review', 'approved', 'published'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: '体系的な知識収集プロセス',
              kpis: {
                '知識登録数': '月10件以上/プロジェクト',
                '品質スコア': '4.0/5.0以上',
                'レビュー完了率': '100%'
              },
              businessRules: [
                'プロジェクト完了時の振り返り必須',
                '知識は構造化フォーマットで記録',
                'ピアレビュー後に公開'
              ]
            }
          },
          {
            name: 'organize-knowledge',
            displayName: '知識を体系化する',
            pattern: 'Analytics',
            goal: 'ナレッジを検索可能に整理',
            roles: ['KnowledgeManager', 'Librarian'],
            businessStates: ['categorized', 'tagged', 'indexed', 'searchable'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'AIを活用した自動分類と体系化',
              kpis: {
                '分類精度': '95%以上',
                '検索精度': '90%以上',
                'タグ付け率': '100%'
              }
            }
          },
          {
            name: 'apply-knowledge',
            displayName: '知識を活用する',
            pattern: 'Analytics',
            goal: 'ベストプラクティスの展開',
            roles: ['Consultant', 'PM', 'TeamMember'],
            businessStates: ['searched', 'found', 'applied', 'feedback-provided'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'コンテキストに応じた知識推薦',
              kpis: {
                '活用率': '月5回以上/人',
                '有用性評価': '4.2/5.0以上',
                '改善提案率': '30%以上'
              }
            }
          }
        ]
      }
    ]
  },
  {
    name: 'revenue-optimization',
    displayName: '収益最適化サービス',
    description: 'プロジェクト収益を最大化し、コスト効率を改善',
    domainLanguageFile: 'revenue-optimization-v2.md',
    capabilities: [
      {
        name: 'financial-management',
        displayName: '収益性を最適化する能力',
        description: '収益追跡、コスト管理、利益率改善を実現',
        category: 'Core',
        definition: `# 収益性を最適化する能力

## 定義
プロジェクトの収益とコストを精緻に管理し、利益率を最大化する能力

## 責務
- 収益の正確な追跡
- コストの詳細管理
- 収益性分析
- 改善施策の立案と実行

## 提供価値
- 利益率の向上
- キャッシュフローの改善
- 財務リスクの低減
- 投資対効果の最大化`,
        operations: [
          {
            name: 'track-revenue',
            displayName: '収益を追跡する',
            pattern: 'Analytics',
            goal: 'プロジェクト収益を正確に把握',
            roles: ['FinanceManager', 'PM', 'AccountManager'],
            businessStates: ['revenue-recorded', 'invoice-sent', 'payment-received', 'reconciled'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'リアルタイム収益追跡システム',
              kpis: {
                '請求精度': '100%',
                '回収率': '98%以上',
                '回収サイクル': '30日以内'
              },
              businessRules: [
                '月次での収益認識',
                '進行基準による収益計上',
                '与信限度額の管理'
              ]
            }
          },
          {
            name: 'manage-costs',
            displayName: 'コストを管理する',
            pattern: 'CRUD',
            goal: '予算内でのプロジェクト遂行',
            roles: ['PM', 'FinanceManager', 'PurchaseManager'],
            businessStates: ['budget-set', 'cost-incurred', 'approved', 'paid'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: '予実管理と承認ワークフロー',
              kpis: {
                '予算遵守率': '95%以上',
                'コスト削減率': '年5%以上',
                '承認時間': '24時間以内'
              }
            }
          },
          {
            name: 'optimize-profitability',
            displayName: '収益性を最適化する',
            pattern: 'Analytics',
            goal: '利益率の向上施策を実施',
            roles: ['Executive', 'FinanceManager', 'PM'],
            businessStates: ['analysis-completed', 'opportunity-identified', 'action-taken', 'result-measured'],
            operations: [],
            useCases: [],
            uiDefinitions: [],
            testCases: [],
            robustnessModel: {},
            design: {
              overview: 'データドリブンな収益性改善',
              kpis: {
                '粗利率': '40%以上',
                '営業利益率': '20%以上',
                'ROI': '150%以上'
              }
            }
          }
        ]
      }
    ]
  }
]

async function seedAllServicesDetailed() {
  console.log('🚀 Starting detailed Parasol seed for all services...')

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await parasolDb.testDefinition.deleteMany()
    await parasolDb.pageDefinition.deleteMany()
    await parasolDb.useCase.deleteMany()
    await parasolDb.businessOperation.deleteMany()
    await parasolDb.businessCapability.deleteMany()
    await parasolDb.service.deleteMany()

    let totalServices = 0
    let totalCapabilities = 0
    let totalOperations = 0

    for (const serviceConfig of services) {
      console.log(`\n📦 Creating ${serviceConfig.displayName}...`)

      // Load domain language
      const domainLanguagePath = join(__dirname, '../domain-languages', serviceConfig.domainLanguageFile)
      let domainLanguage = ''
      try {
        domainLanguage = readFileSync(domainLanguagePath, 'utf-8')
      } catch (error) {
        console.warn(`  ⚠️ Domain language file not found: ${serviceConfig.domainLanguageFile}`)
        domainLanguage = `# ${serviceConfig.displayName} ドメイン言語\n\nドメイン言語定義は準備中です。`
      }

      // Create service
      const service = await parasolDb.service.create({
        data: {
          name: serviceConfig.name,
          displayName: serviceConfig.displayName,
          description: serviceConfig.description,
          domainLanguage: JSON.stringify({ content: domainLanguage }),
          apiSpecification: JSON.stringify({
            endpoints: [],
            schemas: {},
            authentication: 'JWT'
          }),
          dbSchema: JSON.stringify({
            tables: [],
            relations: [],
            indexes: []
          })
        }
      })
      totalServices++
      console.log(`  ✅ Service created: ${service.displayName}`)

      // Create capabilities and operations
      for (const capConfig of serviceConfig.capabilities) {
        const capability = await parasolDb.businessCapability.create({
          data: {
            serviceId: service.id,
            name: capConfig.name,
            displayName: capConfig.displayName,
            description: capConfig.description,
            category: capConfig.category,
            definition: capConfig.definition
          }
        })
        totalCapabilities++
        console.log(`    ✅ Capability created: ${capability.displayName}`)

        // Create operations with detailed design
        for (const opConfig of capConfig.operations) {
          await parasolDb.businessOperation.create({
            data: {
              serviceId: service.id,
              capabilityId: capability.id,
              name: opConfig.name,
              displayName: opConfig.displayName,
              pattern: opConfig.pattern,
              goal: opConfig.goal,
              operations: JSON.stringify(opConfig.operations),
              businessStates: JSON.stringify(opConfig.businessStates),
              roles: JSON.stringify(opConfig.roles),
              useCases: JSON.stringify(opConfig.useCases),
              uiDefinitions: JSON.stringify(opConfig.uiDefinitions),
              testCases: JSON.stringify(opConfig.testCases),
              robustnessModel: JSON.stringify(opConfig.robustnessModel),
              design: JSON.stringify(opConfig.design)
            }
          })
          totalOperations++
        }
        console.log(`      Created ${capConfig.operations.length} operations with detailed designs`)
      }
    }

    console.log('\n📊 Summary:')
    console.log(`  ✅ Services: ${totalServices}`)
    console.log(`  ✅ Capabilities: ${totalCapabilities}`)
    console.log(`  ✅ Operations: ${totalOperations}`)
    console.log('\n✨ Detailed Parasol seed finished successfully!')

    return { services: totalServices, capabilities: totalCapabilities, operations: totalOperations }

  } catch (error) {
    console.error('❌ Error in seedAllServicesDetailed:', error)
    throw error
  } finally {
    await parasolDb.$disconnect()
  }
}

// Direct execution
if (require.main === module) {
  seedAllServicesDetailed()
    .then(result => {
      console.log('✅ Seed completed successfully')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Seed failed:', error)
      process.exit(1)
    })
}

export { seedAllServicesDetailed }