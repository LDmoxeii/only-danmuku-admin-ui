import { ElMessage } from 'element-plus'

const showMessage = (msg: string, callback?: () => void, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
  ElMessage({
    type,
    message: msg,
    duration: 2000,
    offset: 200,
    onClose: () => {
      if (callback) callback()
    }
  })
}

const message = {
  success: (msg: string, callback?: () => void) => showMessage(msg, callback, 'success'),
  warn: (msg: string, callback?: () => void) => showMessage(msg, callback, 'warning'),
  error: (msg: string, callback?: () => void) => showMessage(msg, callback, 'error'),
  info: (msg: string, callback?: () => void) => showMessage(msg, callback, 'info')
}

export default message

