export interface TotalCountInfo {
  userCount?: number
  playCount?: number
  commentCount?: number
  danmuCount?: number
  likeCount?: number
  collectCount?: number
  coinCount?: number
  [key: string]: number | undefined
}

export interface ActualTimeStatisticsInfo {
  totalCountInfo: TotalCountInfo
  preDayData: Record<number, number>
}

export interface WeekStatisticsItem {
  statisticsDate: string
  statisticsCount: number
}

