export type GetActualTimeStatisticsResponse = {
  totalCountInfo: Record<string, number>
  preDayData: Record<number, number>
}

export type GetWeekStatisticsInfoRequest = {
  dataType: number
}

export type WeekStatisticsItem = {
  statisticsDate: string
  statisticsCount: number
}
