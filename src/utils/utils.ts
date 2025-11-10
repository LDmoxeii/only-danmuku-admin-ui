const isEmpty = (str?: string | null) => {
  if (str === undefined || str === null) return true
  // eslint-disable-next-line no-control-regex
  const replaced = String(str).replace(/[\s\xA0]+/g, '')
  return replaced === '' || replaced === 'null'
}

const formatDate = (timestamp?: number | string | Date, format = 'yyyy-MM-dd HH:mm:ss') => {
  if (timestamp === undefined || timestamp === null || timestamp === '') return ''
  const date = new Date(timestamp as any)
  const pad = (n: number, l = 2) => String(n).padStart(l, '0')
  return format
    .replace('yyyy', pad(date.getFullYear(), 4))
    .replace('MM', pad(date.getMonth() + 1))
    .replace('dd', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
    .replace('ss', pad(date.getSeconds()))
}

const size2Str = (size: number) => {
  if (size < 1024) return `${size}B`
  size = size / 1024
  if (size < 1024) return `${size.toFixed(2)}KB`
  size = size / 1024
  if (size < 1024) return `${size.toFixed(2)}MB`
  size = size / 1024
  if (size < 1024) return `${size.toFixed(2)}GB`
  size = size / 1024
  return `${size.toFixed(2)}TB`
}

const convertSecondsToHMS = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return (hours === 0 ? '' : `${String(hours).padStart(2, '0')}:`) +
    `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

const getFileName = (fileName?: string) => {
  if (!fileName) return fileName
  return fileName.lastIndexOf('.') === -1 ? fileName : fileName.substring(0, fileName.lastIndexOf('.'))
}

const getLocalImage = (image: string) => {
  return new URL(`../assets/${image}`, import.meta.url).href
}

export default {
  isEmpty,
  formatDate,
  size2Str,
  convertSecondsToHMS,
  getFileName,
  getLocalImage
}

