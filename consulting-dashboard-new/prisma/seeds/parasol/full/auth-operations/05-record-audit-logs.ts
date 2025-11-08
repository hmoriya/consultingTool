import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedRecordAuditLogs(service: unknown, capability: unknown) {
  console.log('    Creating business operation: 監査ログを記録する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'RecordAuditLogs',
      displayName: '監査ログを記録する',
      pattern: 'Administration',
      design: `# ビジネスオペレーション: 監査ログを記録する [RecordAuditLogs] [RECORD_AUDIT_LOGS]

## オペレーション概要

### 目的
すべてのセキュリティ関連イベントと重要な操作を完全に記録し、コンプライアンス要件を満たし、セキュリティインシデントの調査を可能にする

### ビジネス価値
- **コンプライアンス**: 監査要件に100%準拠
- **セキュリティ**: インシデント検知時間を90%短縮
- **説明責任**: 全操作の完全な追跡可能性確保

### 実行頻度
- **頻度**: リアルタイム（イベント発生時）
- **トリガー**: セキュリティイベント、管理操作
- **所要時間**: ログ記録100ミリ秒以内

## ビジネスオペレーション

詳細なプロセスステップとRACIマトリクスは実装に含まれています。

## KPI
1. **ログ完全性**: イベント記録の欠損率
   - 目標値: 0.01%以下
2. **ログ可用性**: 監査ログの検索可能率
   - 目標値: 99.99%以上
3. **保管期間準拠率**: 規定期間のログ保管率
   - 目標値: 100%`,
      goal: 'すべてのセキュリティ関連イベントと重要な操作を完全に記録し、コンプライアンス要件を満たし、セキュリティインシデントの調査を可能にする',
      
      roles: JSON.stringify([
        {
          name: '監査システム [Audit System] [AUDIT_SYSTEM]',
          responsibility: 'イベントの自動記録と保管'
        },
        {
          name: '監査人 [Auditor] [AUDITOR]',
          responsibility: '監査ログの分析と報告'
        },
        {
          name: 'セキュリティ管理者 [Security Administrator] [SECURITY_ADMINISTRATOR]',
          responsibility: '監査ポリシーの策定と異常対応'
        },
        {
          name: 'コンプライアンス担当者 [Compliance Officer] [COMPLIANCE_OFFICER]',
          responsibility: '規制要件への準拠確認'
        },
        {
          name: 'システム管理者 [System Administrator] [SYSTEM_ADMINISTRATOR]',
          responsibility: '監査システムの運用管理'
        }
      ]),
      
      operations: JSON.stringify({
        steps: [
          {
            step: 1,
            name: 'イベントを捕捉する [Capture Events] [CAPTURE_EVENTS]',
            description: 'システム全体のセキュリティイベントをリアルタイムで捕捉',
            actors: ['監査システム'],
            raciMatrix: {
              responsible: '監査システム',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: 'システム管理者'
            }
          },
          {
            step: 2,
            name: 'ログを構造化する [Structure Logs] [STRUCTURE_LOGS]',
            description: 'イベント情報を標準形式に構造化して記録',
            actors: ['監査システム'],
            raciMatrix: {
              responsible: '監査システム',
              accountable: 'システム管理者',
              consulted: '',
              informed: ''
            }
          },
          {
            step: 3,
            name: '改ざん防止処理をする [Tamper-Proof Processing] [TAMPER_PROOF_PROCESSING]',
            description: 'ログの完全性を保証するためのハッシュ化と署名',
            actors: ['監査システム'],
            raciMatrix: {
              responsible: '監査システム',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: ''
            }
          },
          {
            step: 4,
            name: 'ログを保管する [Store Logs] [STORE_LOGS]',
            description: 'セキュアなストレージへの長期保管',
            actors: ['監査システム', 'システム管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: 'コンプライアンス担当者'
            }
          },
          {
            step: 5,
            name: '異常を検知する [Detect Anomalies] [DETECT_ANOMALIES]',
            description: '不審なパターンやセキュリティ違反の自動検知',
            actors: ['監査システム', 'セキュリティ管理者'],
            raciMatrix: {
              responsible: '監査システム',
              accountable: 'セキュリティ管理者',
              consulted: '',
              informed: '監査人、システム管理者'
            }
          },
          {
            step: 6,
            name: 'レポートを生成する [Generate Reports] [GENERATE_REPORTS]',
            description: 'コンプライアンスと分析のためのレポート作成',
            actors: ['監査人', '監査システム'],
            raciMatrix: {
              responsible: '監査人',
              accountable: 'コンプライアンス担当者',
              consulted: 'セキュリティ管理者',
              informed: '経営層'
            }
          },
          {
            step: 7,
            name: 'ログを監査する [Audit Logs] [AUDIT_LOGS]',
            description: '定期的な監査ログのレビューと分析',
            actors: ['監査人', 'コンプライアンス担当者'],
            raciMatrix: {
              responsible: '監査人',
              accountable: 'コンプライアンス担当者',
              consulted: 'セキュリティ管理者',
              informed: '全関係者'
            }
          }
        ]
      }),
      
      businessStates: JSON.stringify({
        states: [
          {
            name: '記録待機 [Awaiting Recording] [AWAITING_RECORDING]',
            description: 'システムがイベント発生を監視している状態'
          },
          {
            name: '記録中 [Recording] [RECORDING]',
            description: 'イベントを捕捉し、ログとして記録している状態'
          },
          {
            name: '処理中 [Processing] [PROCESSING]',
            description: 'ログの構造化と改ざん防止処理を実行中'
          },
          {
            name: '保管済み [Stored] [STORED]',
            description: 'ログが安全に保管された状態'
          },
          {
            name: '分析中 [Analyzing] [ANALYZING]',
            description: '異常検知や傾向分析を実行中'
          },
          {
            name: 'アラート発行 [Alert Issued] [ALERT_ISSUED]',
            description: '異常を検知しアラートを発行した状態'
          },
          {
            name: '監査完了 [Audited] [AUDITED]',
            description: '監査レビューが完了した状態'
          },
          {
            name: 'アーカイブ済み [Archived] [ARCHIVED]',
            description: '長期保管用にアーカイブされた状態'
          }
        ],
        transitions: [
          '記録待機 → 記録中',
          '記録中 → 処理中',
          '処理中 → 保管済み',
          '保管済み → 分析中',
          '分析中 → アラート発行',
          '分析中 → 監査完了',
          '監査完了 → アーカイブ済み',
          'アラート発行 → 分析中'
        ]
      }),
      
      useCases: JSON.stringify([
        {
          name: '認証ログを記録する',
          actors: '監査システム',
          description: 'ログイン成功/失敗の記録'
        },
        {
          name: '権限変更を追跡する',
          actors: '監査システム',
          description: 'ロール・権限の変更履歴を記録'
        },
        {
          name: 'データアクセスを監視する',
          actors: '監査システム',
          description: '機密データへのアクセス記録'
        },
        {
          name: 'コンプライアンスレポートを作成する',
          actors: '監査人',
          description: '規制要件のための定期レポート'
        },
        {
          name: 'インシデントを調査する',
          actors: 'セキュリティ管理者',
          description: 'セキュリティ事象の詳細調査'
        }
      ]),
      
      uiDefinitions: JSON.stringify([
        {
          pageName: '監査ログビューア',
          purpose: 'ログの検索と閲覧',
          elements: ['検索フィルタ', 'ログリスト', '詳細表示', 'エクスポート']
        },
        {
          pageName: '異常検知ダッシュボード',
          purpose: 'セキュリティ異常の可視化',
          elements: ['アラート一覧', '傾向グラフ', 'リスクスコア']
        },
        {
          pageName: 'コンプライアンスレポート',
          purpose: '監査レポートの生成と管理',
          elements: ['レポートテンプレート', '期間選択', 'PDF生成']
        }
      ]),
      
      testCases: JSON.stringify([
        {
          name: '正常系：ログ記録',
          steps: ['イベント発生', 'ログ記録', '保管確認'],
          expectedResult: '改ざん不可能な形式でログが保存'
        },
        {
          name: '性能：大量ログ',
          steps: ['10000イベント/秒の記録'],
          expectedResult: 'データ損失なく全て記録'
        },
        {
          name: 'セキュリティ：改ざん検知',
          steps: ['保管済みログの改変試行'],
          expectedResult: '改ざんを検知し、アラート発行'
        }
      ])
    }
  })
  
  return operation
}