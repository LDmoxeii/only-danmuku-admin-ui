export interface PageData<T> {
  list: T[]
  pageNum: number
  pageSize: number
  totalCount: number
  pageTotal?: number
}

export type Empty = Record<string, never>

