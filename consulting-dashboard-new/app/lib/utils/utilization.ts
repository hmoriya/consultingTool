import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from 'date-fns'

/**
 * 営業日数を計算する（土日を除く）
 */
export function getBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0
  const current = new Date(startDate)
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0=日曜, 6=土曜
      count++
    }
    current.setDate(current.getDate() + 1)
  }
  
  return count
}

/**
 * 期間の標準工数時間を計算する（営業日 × 8時間）
 */
export function getStandardHours(startDate: Date, endDate: Date): number {
  const businessDays = getBusinessDays(startDate, endDate)
  return businessDays * 8
}

/**
 * 稼働率を計算する（実働時間 / 標準時間 × 100）
 */
export function calculateUtilization(actualHours: number, startDate: Date, endDate: Date): number {
  const standardHours = getStandardHours(startDate, endDate)
  if (standardHours === 0) return 0
  
  const utilization = (actualHours / standardHours) * 100
  // 100%を上限とする（残業は稼働率に含めない）
  return Math.min(utilization, 100)
}

/**
 * 期間タイプに応じた開始日と終了日を取得
 */
export function getPeriodDates(date: Date, periodType: 'weekly' | 'monthly' | 'quarterly') {
  switch (periodType) {
    case 'weekly':
      return {
        startDate: startOfWeek(date, { weekStartsOn: 1 }), // 月曜始まり
        endDate: endOfWeek(date, { weekStartsOn: 1 })
      }
    case 'monthly':
      return {
        startDate: startOfMonth(date),
        endDate: endOfMonth(date)
      }
    case 'quarterly':
      return {
        startDate: startOfQuarter(date),
        endDate: endOfQuarter(date)
      }
  }
}

/**
 * 複数メンバーの平均稼働率を計算
 */
export function calculateAverageUtilization(
  memberUtilizations: { userId: string; actualHours: number }[],
  startDate: Date,
  endDate: Date
): number {
  if (memberUtilizations.length === 0) return 0
  
  const totalUtilization = memberUtilizations.reduce((sum, member) => {
    return sum + calculateUtilization(member.actualHours, startDate, endDate)
  }, 0)
  
  return totalUtilization / memberUtilizations.length
}