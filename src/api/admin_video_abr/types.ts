export type GetVariantsRequest = {
  fileId: string | number
}

export type GetVariantsResponse = {
  qualities: string[]
  variantJson: string
}
