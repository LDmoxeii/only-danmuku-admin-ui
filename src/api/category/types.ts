export interface CategoryItem {
  categoryId: number | string
  parentId: number | string
  categoryCode: string
  categoryName: string
  icon?: string
  background?: string
  videoCount?: number
  children?: CategoryItem[]
}

