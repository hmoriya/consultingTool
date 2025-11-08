import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedOptimizeOrganizationStructure(service: unknown, capability: unknown) {
  console.log('    Creating business operation: 組織構造を最適化する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'OptimizeOrganizationStructure',
      displayName: '組織構造を最適化する',
      pattern: 'Administration',
      design: `# ビジネスオペレーション: 組織構造を最適化する [OptimizeOrganizationStructure] [OPTIMIZE_ORGANIZATION_STRUCTURE]

## オペレーション概要

### 目的
組織の部門、チーム、階層構造を最適化し、組織変更に迅速に対応する

### ビジネス価値
- **運用効率**: 組織変更対応時間を60%削減
- **データ整合性**: 組織情報の不整合を90%削減
- **可視性向上**: 組織全体の構造を即座に把握可能

### 実行頻度
- **頻度**: 月次（組織改編時は随時）
- **トリガー**: 組織改編通知、部門新設・統廃合
- **所要時間**: 小規模変更30分、大規模改編2-3日

## ビジネスオペレーション

詳細なプロセスステップとRACIマトリクスは実装に含まれています。

## KPI
1. **組織更新精度**: 実組織と登録情報の一致率
   - 目標値: 100%
2. **更新リードタイム**: 組織変更通知から反映までの時間
   - 目標値: 2営業日以内
3. **階層整合性**: 組織階層の論理的整合性
   - 目標値: エラー0件`,
      goal: '組織の階層構造、部門、チームを最適化し、組織変更に迅速に対応して権限管理の基盤を提供する',
      
      roles: JSON.stringify([
        {
          name: '組織管理者 [Organization Administrator] [ORGANIZATION_ADMINISTRATOR]',
          responsibility: '組織構造の定義と変更の実施'
        },
        {
          name: '人事部門 [Human Resources] [HUMAN_RESOURCES]',
          responsibility: '組織変更情報の提供と検証'
        },
        {
          name: 'システム管理者 [System Administrator] [SYSTEM_ADMINISTRATOR]',
          responsibility: 'システムへの組織構造の反映'
        },
        {
          name: '部門長 [Department Head] [DEPARTMENT_HEAD]',
          responsibility: '部門内の構造変更の承認'
        }
      ]),
      
      operations: JSON.stringify({
        steps: [
          {
            step: 1,
            name: '組織変更を計画する [Plan Organization Change] [PLAN_ORGANIZATION_CHANGE]',
            description: '組織再編、新部門設立などの変更計画を策定',
            actors: ['組織管理者', '人事部門'],
            raciMatrix: {
              responsible: '組織管理者',
              accountable: '人事部門',
              consulted: '部門長',
              informed: 'システム管理者'
            }
          },
          {
            step: 2,
            name: '影響分析を実施する [Conduct Impact Analysis] [CONDUCT_IMPACT_ANALYSIS]',
            description: '組織変更による権限、アクセス制御への影響を分析',
            actors: ['組織管理者', 'システム管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: '組織管理者',
              consulted: '部門長',
              informed: '人事部門'
            }
          },
          {
            step: 3,
            name: '組織構造を更新する [Update Organization Structure] [UPDATE_ORGANIZATION_STRUCTURE]',
            description: 'システム上の組織階層、部門、チーム情報を更新',
            actors: ['システム管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: '組織管理者',
              consulted: '',
              informed: '人事部門、部門長'
            }
          },
          {
            step: 4,
            name: 'ユーザー所属を変更する [Update User Affiliations] [UPDATE_USER_AFFILIATIONS]',
            description: '組織変更に伴うユーザーの所属部門・チームを更新',
            actors: ['システム管理者', '組織管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: '組織管理者',
              consulted: '部門長',
              informed: 'ユーザー'
            }
          },
          {
            step: 5,
            name: '権限を再割当する [Reassign Permissions] [REASSIGN_PERMISSIONS]',
            description: '新しい組織構造に基づいて権限を再設定',
            actors: ['システム管理者', 'セキュリティ管理者'],
            raciMatrix: {
              responsible: 'システム管理者',
              accountable: 'セキュリティ管理者',
              consulted: '部門長',
              informed: 'ユーザー'
            }
          },
          {
            step: 6,
            name: '変更を検証する [Verify Changes] [VERIFY_CHANGES]',
            description: '組織変更が正しく反映され、アクセス権が適切か確認',
            actors: ['組織管理者', '部門長'],
            raciMatrix: {
              responsible: '組織管理者',
              accountable: '人事部門',
              consulted: 'システム管理者',
              informed: '全関係者'
            }
          }
        ]
      }),
      
      businessStates: JSON.stringify({
        states: [
          {
            name: '計画中 [Planning] [PLANNING]',
            description: '組織変更の計画と影響分析を実施中'
          },
          {
            name: '承認待ち [Pending Approval] [PENDING_APPROVAL]',
            description: '組織変更計画が承認プロセスにある状態'
          },
          {
            name: '実施中 [In Progress] [IN_PROGRESS]',
            description: '組織構造の変更をシステムに反映中'
          },
          {
            name: '検証中 [Verification] [VERIFICATION]',
            description: '変更内容の正確性と影響を確認中'
          },
          {
            name: '完了 [Completed] [COMPLETED]',
            description: '組織変更が完全に反映された状態'
          },
          {
            name: 'ロールバック [Rolled Back] [ROLLED_BACK]',
            description: '問題により変更を取り消した状態'
          }
        ],
        transitions: [
          '計画中 → 承認待ち',
          '承認待ち → 実施中',
          '承認待ち → 却下',
          '実施中 → 検証中',
          '検証中 → 完了',
          '検証中 → ロールバック',
          'ロールバック → 計画中'
        ]
      }),
      
      useCases: JSON.stringify([
        {
          name: '新部門を作成する',
          actors: '組織管理者',
          description: '事業拡大に伴う新部門の追加'
        },
        {
          name: '部門を統合する',
          actors: '組織管理者、人事部門',
          description: '組織再編による部門の統合'
        },
        {
          name: 'チーム構造を変更する',
          actors: '部門長、システム管理者',
          description: 'プロジェクトチームの新設や再編'
        },
        {
          name: '組織階層を見直す',
          actors: '組織管理者',
          description: 'レポートラインの変更'
        }
      ]),
      
      uiDefinitions: JSON.stringify([
        {
          pageName: '組織構造ツリー',
          purpose: '組織階層の視覚的表示と編集',
          elements: ['階層ツリー', 'ドラッグ&ドロップ', '部門詳細']
        },
        {
          pageName: '組織変更申請フォーム',
          purpose: '組織変更の申請と承認',
          elements: ['変更内容', '影響範囲', '実施予定日']
        },
        {
          pageName: '組織マッピング画面',
          purpose: 'ユーザーと組織の関連付け管理',
          elements: ['ユーザーリスト', '所属設定', '一括更新']
        }
      ]),
      
      testCases: JSON.stringify([
        {
          name: '正常系：部門新設',
          steps: ['新部門作成', 'ユーザー配属', '権限設定', '動作確認'],
          expectedResult: '新部門が作成され、所属ユーザーが適切にアクセス可能'
        },
        {
          name: '異常系：循環参照',
          steps: ['親部門を子部門の下に移動試行'],
          expectedResult: 'エラー表示、変更拒否'
        },
        {
          name: '統合テスト：組織再編',
          steps: ['複数部門統合', 'ユーザー移動', '権限再設定'],
          expectedResult: '全ユーザーが新組織で正しくアクセス可能'
        }
      ])
    }
  })
  
  return operation
}