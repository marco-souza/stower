export type LogFunc = (...data: any[]) => void

export type Logging = {
  debug: LogFunc,
  info: LogFunc,
  warn: LogFunc,
  error: LogFunc,
}

export const logging: Logging = {
  ...console,
}
