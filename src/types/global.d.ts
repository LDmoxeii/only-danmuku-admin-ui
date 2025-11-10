import 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    VueCookies: any
    Request: any
    Message: any
    Utils: any
    Verify: any
    Confirm: any
    Api: any
    bodyMaxWidth?: number
    bodyMinWidth?: number
    rowCategoryCount?: number
    chunkSize?: number
    maxUploading?: number
    videoAccept?: string
    imageAccept?: string
    imageThumbnailSuffix?: string
    webDomain?: string
  }
}

export {}

