import { ElMessageBox } from 'element-plus'

interface ConfirmOptions {
  message: string
  okfun?: () => void
  showCancelBtn?: boolean
  okText?: string
}

const confirm = ({ message, okfun, showCancelBtn = true, okText = '确定' }: ConfirmOptions) => {
  ElMessageBox.confirm(message, '提示', {
    'close-on-click-modal': false as any,
    confirmButtonText: okText,
    cancelButtonText: '取消',
    showCancelButton: showCancelBtn,
    type: 'info'
  })
    .then(() => {
      if (okfun) okfun()
    })
    .catch(() => {})
}

export default confirm

