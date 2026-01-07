import type {PageData, PageParam} from '@/api/_types'

export type UserItem = {
  userId: string | number
  avatar: string | null
  nickName: string | null
  email: string | null
  birthday: string | null
  joinTime: string
  lastLoginTime: string | null
  sex: number | null
  lastLoginIp: string | null
  personIntroduction: string | null
  currentCoinCount: number | null
  totalCoinCount: number | null
  status: number | null
}

export interface GetUserPageRequest extends PageParam{
  nickNameFuzzy?: string | null
  status?: number | null
}

export type GetUserPageResponse = PageData<UserItem>

export type ChangeStatusRequest = {
  userId: string | number
  status: number
}
