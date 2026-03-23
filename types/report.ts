export type ReportType = 'ACTIVITY_SUMMARY' | 'DETAILED_PROJECT'

export interface ReportSummary {
  id: string
  reportType: ReportType
  title: string
  startDate: string
  endDate: string
  createdAt: string
}

export interface ReportDetail extends ReportSummary {
  markdownContent: string
}
