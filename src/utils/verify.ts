type Callback = (err?: Error) => void

const regs = {
  email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
  password: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{8,}$/
}

const verify = (rule: any, value: string, reg: RegExp, callback: Callback) => {
  if (value) {
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error(rule.message))
    }
  } else {
    callback()
  }
}

export default {
  email: (rule: any, value: string, callback: Callback) => verify(rule, value, regs.email, callback),
  password: (rule: any, value: string, callback: Callback) => verify(rule, value, regs.password, callback)
}

