import { timesheetDb } from './app/lib/db/timesheet-db'
import { authDb } from './app/lib/db/auth-db'
import { projectDb } from './app/lib/db/project-db'

async function main() {
  console.log('🕒 タイムシートデータのシード投入を開始...')

  try {
    // ユーザーを取得
    const users = await authDb.user.findMany()
    console.log(`ユーザー数: ${users.length}`)

    // プロジェクトを取得
    const projects = await projectDb.project.findMany({
      include: {
        projectMembers: true
      }
    })
    console.log(`プロジェクト数: ${projects.length}`)

    // 既存のデータをクリア
    await timesheetDb.timeEntry.deleteMany({})
    await timesheetDb.timesheet.deleteMany({})
    await timesheetDb.workingHours.deleteMany({})
    await timesheetDb.holiday.deleteMany({})
    console.log('✅ 既存データをクリア')

    // 祝日データを作成
    const holidays = [
      { name: '元日', date: new Date('2025-01-01'), type: 'PUBLIC' },
      { name: '成人の日', date: new Date('2025-01-13'), type: 'PUBLIC' },
      { name: '建国記念の日', date: new Date('2025-02-11'), type: 'PUBLIC' },
      { name: '天皇誕生日', date: new Date('2025-02-23'), type: 'PUBLIC' },
      { name: '春分の日', date: new Date('2025-03-20'), type: 'PUBLIC' },
      { name: '昭和の日', date: new Date('2025-04-29'), type: 'PUBLIC' },
      { name: '憲法記念日', date: new Date('2025-05-03'), type: 'PUBLIC' },
      { name: 'みどりの日', date: new Date('2025-05-04'), type: 'PUBLIC' },
      { name: 'こどもの日', date: new Date('2025-05-05'), type: 'PUBLIC' },
      { name: '海の日', date: new Date('2025-07-21'), type: 'PUBLIC' },
      { name: '山の日', date: new Date('2025-08-11'), type: 'PUBLIC' },
      { name: '敬老の日', date: new Date('2025-09-15'), type: 'PUBLIC' },
      { name: '秋分の日', date: new Date('2025-09-23'), type: 'PUBLIC' },
      { name: 'スポーツの日', date: new Date('2025-10-13'), type: 'PUBLIC' },
      { name: '文化の日', date: new Date('2025-11-03'), type: 'PUBLIC' },
      { name: '勤労感謝の日', date: new Date('2025-11-23'), type: 'PUBLIC' }
    ]

    for (const holiday of holidays) {
      await timesheetDb.holiday.create({
        data: {
          ...holiday,
          country: 'JP',
          isNationwide: true
        }
      })
    }
    console.log(`✅ ${holidays.length}件の祝日データを作成`)

    // 各ユーザーの勤務時間設定を作成
    for (const user of users) {
      await timesheetDb.workingHours.create({
        data: {
          consultantId: user.id,
          effectiveFrom: new Date('2025-01-01'),
          standardHoursPerDay: 8,
          standardHoursPerWeek: 40,
          workingDays: JSON.stringify(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']),
          flexTimeEnabled: true,
          coreHours: JSON.stringify({ startTime: '10:00', endTime: '16:00' }),
          overtimeThreshold: 40
        }
      })
    }
    console.log(`✅ ${users.length}人分の勤務時間設定を作成`)

    // 過去3週間分のタイムシートを作成
    const now = new Date()
    const weeksToCreate = 3
    let totalEntries = 0

    for (let weekOffset = -weeksToCreate; weekOffset <= 0; weekOffset++) {
      // 週の開始日を計算（日曜日）
      const weekStart = new Date(now)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + weekOffset * 7)
      weekStart.setHours(0, 0, 0, 0)
      
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      console.log(`\n📅 ${weekStart.toLocaleDateString('ja-JP')} 週のタイムシートを作成中...`)

      // 各ユーザーのタイムシートを作成
      for (const user of users) {
        // このユーザーが参加しているプロジェクトを取得
        const userProjects = projects.filter(p => 
          p.projectMembers.some(m => m.userId === user.id)
        )

        if (userProjects.length === 0) continue

        // タイムシートを作成
        const timesheet = await timesheetDb.timesheet.create({
          data: {
            consultantId: user.id,
            weekStartDate: weekStart,
            weekEndDate: weekEnd,
            status: weekOffset < -1 ? 'APPROVED' : weekOffset === -1 ? 'SUBMITTED' : 'OPEN',
            submittedAt: weekOffset < 0 ? new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000) : null
          }
        })

        // 各営業日のエントリを作成
        let weeklyHours = 0
        let weeklyBillableHours = 0

        for (let day = 0; day < 7; day++) {
          const entryDate = new Date(weekStart)
          entryDate.setDate(entryDate.getDate() + day)

          // 週末はスキップ（ただし稀に作業することもある）
          if (day === 0 || day === 6) {
            // 20%の確率で週末も作業
            if (Math.random() > 0.8) {
              const project = userProjects[Math.floor(Math.random() * userProjects.length)]
              const hours = 2 + Math.floor(Math.random() * 3)
              const activityTypes = ['DEVELOPMENT', 'DOCUMENTATION', 'REVIEW', 'OTHER']
              
              await timesheetDb.timeEntry.create({
                data: {
                  consultantId: user.id,
                  projectId: project.id,
                  timesheetId: timesheet.id,
                  date: entryDate,
                  hours,
                  description: `週末の${activityTypes[Math.floor(Math.random() * activityTypes.length)]?.toLowerCase() || 'other'}作業`,
                  billable: true,
                  activityType: activityTypes[Math.floor(Math.random() * activityTypes.length)] || 'OTHER',
                  status: weekOffset < -1 ? 'APPROVED' : weekOffset === -1 ? 'SUBMITTED' : 'DRAFT',
                  weekNumber: Math.floor((entryDate.getTime() - new Date(entryDate.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
                }
              })
              
              weeklyHours += hours
              weeklyBillableHours += hours
              totalEntries++
            }
            continue
          }

          // 平日の作業時間を記録
          const baseHours = 7 + Math.floor(Math.random() * 3) // 7-9時間
          let remainingHours = baseHours

          // 複数のプロジェクトに時間を配分
          const projectCount = Math.min(userProjects.length, 1 + Math.floor(Math.random() * 2))
          const selectedProjects = userProjects
            .sort(() => Math.random() - 0.5)
            .slice(0, projectCount)

          for (let i = 0; i < selectedProjects.length; i++) {
            const project = selectedProjects[i]
            const isLast = i === selectedProjects.length - 1
            const hours = isLast ? remainingHours : Math.floor(remainingHours * (0.3 + Math.random() * 0.4))
            remainingHours -= hours

            // アクティビティタイプを決定
            const activityTypes = ['DEVELOPMENT', 'MEETING', 'DOCUMENTATION', 'REVIEW', 'TRAINING', 'ADMIN']
            const weights = [0.4, 0.2, 0.15, 0.1, 0.1, 0.05]
            const random = Math.random()
            let cumulative = 0
            let activityType = 'DEVELOPMENT'
            
            for (let j = 0; j < activityTypes.length; j++) {
              cumulative += weights[j]
              if (random < cumulative) {
                activityType = activityTypes[j] || 'DEVELOPMENT'
                break
              }
            }

            // 一部を非請求可能時間として記録（管理業務など）
            const isBillable = activityType !== 'ADMIN' && activityType !== 'TRAINING' && Math.random() > 0.1

            await timesheetDb.timeEntry.create({
              data: {
                consultantId: user.id,
                projectId: project.id,
                timesheetId: timesheet.id,
                date: entryDate,
                hours,
                description: getActivityDescription(activityType),
                billable: isBillable,
                activityType,
                status: weekOffset < -1 ? 'APPROVED' : weekOffset === -1 ? 'SUBMITTED' : 'DRAFT',
                weekNumber: Math.floor((entryDate.getTime() - new Date(entryDate.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1,
                approvedAt: weekOffset < -1 ? new Date(weekEnd.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
                approvedById: weekOffset < -1 ? users.find(u => u.email === 'pm@example.com')?.id : null
              }
            })

            weeklyHours += hours
            if (isBillable) weeklyBillableHours += hours
            totalEntries++
          }
        }

        // タイムシートの集計を更新
        await timesheetDb.timesheet.update({
          where: { id: timesheet.id },
          data: {
            totalHours: weeklyHours,
            billableHours: weeklyBillableHours,
            nonBillableHours: weeklyHours - weeklyBillableHours
          }
        })

        console.log(`  ✅ ${user.name}: ${weeklyHours}時間 (請求可能: ${weeklyBillableHours}時間)`);
      }
    }

    // 稼働率メトリクスを計算
    const metricsStartDate = new Date(now)
    metricsStartDate.setMonth(metricsStartDate.getMonth() - 1)
    metricsStartDate.setDate(1)
    metricsStartDate.setHours(0, 0, 0, 0)

    const metricsEndDate = new Date(metricsStartDate)
    metricsEndDate.setMonth(metricsEndDate.getMonth() + 1)
    metricsEndDate.setDate(0)
    metricsEndDate.setHours(23, 59, 59, 999)

    for (const user of users) {
      const entries = await timesheetDb.timeEntry.findMany({
        where: {
          consultantId: user.id,
          date: {
            gte: metricsStartDate,
            lte: metricsEndDate
          }
        }
      })

      const totalWorkedHours = entries.reduce((sum, e) => sum + e.hours, 0)
      const billableHours = entries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0)
      const workingDays = 20 // 月間営業日数の概算
      const totalAvailableHours = workingDays * 8

      await timesheetDb.utilizationMetrics.create({
        data: {
          consultantId: user.id,
          periodStart: metricsStartDate,
          periodEnd: metricsEndDate,
          totalAvailableHours,
          totalWorkedHours,
          billableHours,
          nonBillableHours: totalWorkedHours - billableHours,
          utilizationRate: (totalWorkedHours / totalAvailableHours) * 100,
          billableRate: totalWorkedHours > 0 ? (billableHours / totalWorkedHours) * 100 : 0,
          overtime: Math.max(0, totalWorkedHours - totalAvailableHours),
          undertime: Math.max(0, totalAvailableHours - totalWorkedHours),
          leaveHours: 0,
          holidayHours: 0
        }
      })
    }
    console.log('\n✅ 稼働率メトリクスを計算')

    console.log(`\n✅ タイムシートデータの投入が完了しました！`)
    console.log(`総エントリ数: ${totalEntries}`)

  } catch (_error) {
    console.error('❌ エラー:', error)
  } finally {
    await timesheetDb.$disconnect()
    await authDb.$disconnect()
    await projectDb.$disconnect()
  }
}

function getActivityDescription(activityType: string): string {
  const descriptions: Record<string, string[]> = {
    DEVELOPMENT: [
      'フィーチャー開発',
      'バグ修正',
      'リファクタリング',
      'ユニットテスト実装',
      'API開発',
      'フロントエンド実装',
      'データベース設計'
    ],
    MEETING: [
      'スプリント計画会議',
      'デイリースクラム',
      'クライアントミーティング',
      'レトロスペクティブ',
      '技術検討会議',
      '進捗報告会議'
    ],
    DOCUMENTATION: [
      '設計書作成',
      'API仕様書更新',
      'ユーザーマニュアル作成',
      '技術文書作成',
      'プロセス文書化'
    ],
    REVIEW: [
      'コードレビュー',
      'プルリクエストレビュー',
      'ドキュメントレビュー',
      'デザインレビュー'
    ],
    TRAINING: [
      '技術研修',
      '新技術の調査',
      'オンライン学習',
      '社内勉強会'
    ],
    ADMIN: [
      '管理業務',
      '報告書作成',
      '経費精算',
      'チーム調整'
    ],
    TRAVEL: [
      'クライアント訪問',
      '出張移動',
      '現地調査'
    ],
    SALES: [
      '提案書作成',
      'プレゼンテーション準備',
      '見積もり作成'
    ],
    OTHER: [
      'その他業務',
      '緊急対応',
      'サポート業務'
    ]
  }

  const options = descriptions[activityType] || descriptions.OTHER
  return options[Math.floor(Math.random() * options.length)] || 'その他業務'
}

main()