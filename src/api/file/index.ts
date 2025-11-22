import request from '@/utils/request'

const base = '/file'

export async function uploadImage(file: File, createThumbnail: boolean): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  form.append('createThumbnail', String(createThumbnail))
  return await request<string>({ url: `${base}/uploadImage`, data: form, method: 'post'})
}

export const sourcePath = '/api/file/getResource?sourceName='
export const getVideoResource = (fileId: string | number) => `/api/file/videoResource/${fileId}/`

