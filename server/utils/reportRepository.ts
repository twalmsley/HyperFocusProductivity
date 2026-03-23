export interface CreateReportPayload {
  userId: string
  reportType: string
  title: string
  startDate: Date
  endDate: Date
  markdownContent: string
}

interface ReportDelegate {
  create: (args: {
    data: CreateReportPayload
    select: {
      id: boolean
      reportType: boolean
      title: boolean
      startDate: boolean
      endDate: boolean
      markdownContent: boolean
      createdAt: boolean
    }
  }) => Promise<any>
  findMany: (args: {
    where: { userId: string }
    orderBy: { createdAt: 'asc' | 'desc' }
    select: {
      id: boolean
      reportType: boolean
      title: boolean
      startDate: boolean
      endDate: boolean
      createdAt: boolean
    }
  }) => Promise<any[]>
  findFirst: (args: {
    where: { id: string; userId: string }
    select: {
      id: boolean
      reportType: boolean
      title: boolean
      startDate: boolean
      endDate: boolean
      markdownContent: boolean
      createdAt: boolean
    }
  }) => Promise<any | null>
}

interface ReportClient {
  report: ReportDelegate
}

export async function createReport(client: ReportClient, payload: CreateReportPayload) {
  return client.report.create({
    data: payload,
    select: {
      id: true,
      reportType: true,
      title: true,
      startDate: true,
      endDate: true,
      markdownContent: true,
      createdAt: true,
    },
  })
}

export async function listReports(client: ReportClient, userId: string) {
  return client.report.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      reportType: true,
      title: true,
      startDate: true,
      endDate: true,
      createdAt: true,
    },
  })
}

export async function getReportById(client: ReportClient, userId: string, reportId: string) {
  return client.report.findFirst({
    where: { id: reportId, userId },
    select: {
      id: true,
      reportType: true,
      title: true,
      startDate: true,
      endDate: true,
      markdownContent: true,
      createdAt: true,
    },
  })
}
