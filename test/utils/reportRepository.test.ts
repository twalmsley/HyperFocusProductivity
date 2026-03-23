import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createReport, getReportById, listReports } from '~/server/utils/reportRepository'

describe('reportRepository', () => {
  const create = vi.fn()
  const findMany = vi.fn()
  const findFirst = vi.fn()

  const client = {
    report: {
      create,
      findMany,
      findFirst,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stores generated reports', async () => {
    create.mockResolvedValue({
      id: 'report-1',
      title: 'Activity Summary Report',
    })

    const result = await createReport(client, {
      userId: 'user-1',
      reportType: 'ACTIVITY_SUMMARY',
      title: 'Activity Summary Report',
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T23:59:59.999Z'),
      markdownContent: '# report',
    })

    expect(create).toHaveBeenCalledOnce()
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          reportType: 'ACTIVITY_SUMMARY',
        }),
      }),
    )
    expect(result.id).toBe('report-1')
  })

  it('lists reports newest first for a user', async () => {
    findMany.mockResolvedValue([{ id: 'newest' }, { id: 'older' }])

    const results = await listReports(client, 'user-2')
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-2' },
        orderBy: { createdAt: 'desc' },
      }),
    )
    expect(results).toHaveLength(2)
  })

  it('retrieves a specific report by id for the user', async () => {
    findFirst.mockResolvedValue({
      id: 'report-42',
      markdownContent: '# Existing report',
    })

    const result = await getReportById(client, 'user-3', 'report-42')
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'report-42', userId: 'user-3' },
      }),
    )
    expect(result?.id).toBe('report-42')
  })
})
