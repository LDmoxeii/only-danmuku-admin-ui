export interface PageData<T> {
  list: T[]
  pageNum: number
  pageSize: number
  totalCount: number
  pageTotal?: number
}

export class OrderInfo {
  readonly field: string
  readonly desc: boolean = false

  protected constructor(field: string, desc: boolean = false) {
    this.field = field
    this.desc = desc
  }

  /** 升序 */
  static asc(field: string): OrderInfo {
    return new OrderInfo(field, false)
  }

  /** 降序 */
  static desc(field: string): OrderInfo {
    return new OrderInfo(field, true)
  }
}

export abstract class PageParam {
  pageNum = 1
  pageSize = 10
  sort: OrderInfo[] = []

  protected constructor(init?: Partial<PageParam>) {
    Object.assign(this, init)
  }
}



export type Empty = Record<string, never>

