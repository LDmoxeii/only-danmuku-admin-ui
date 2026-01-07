export type CheckCodeResponse = {
  checkCode: string
  checkCodeKey: string | null
}

export type LoginRequest = {
  account: string
  password: string
  checkCode: string
  checkCodeKey: string
}

export type LoginResponse = {
  userId: string | number
  account: string | null
  nickName: string
  avatar: string | null
  token: string
}
