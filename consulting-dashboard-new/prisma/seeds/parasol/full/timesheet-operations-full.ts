import { seedRecordTimeEntries } from './timesheet-operations/01-record-time-entries'
import { seedApproveTimesheets } from './timesheet-operations/02-approve-timesheets'
import { seedAnalyzeUtilization } from './timesheet-operations/03-analyze-utilization'

export async function seedTimesheetOperationsFull(service: any, capability: any) {
  console.log('  Seeding timesheet operations full data...')
  
  // 1. 工数を記録する
  await seedRecordTimeEntries(service, capability)
  
  // 2. 工数を承認する
  await seedApproveTimesheets(service, capability)
  
  // 3. 稼働率を分析する
  await seedAnalyzeUtilization(service, capability)
  
  console.log('  ✓ Timesheet operations full data seeded')
}