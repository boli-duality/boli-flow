declare const _log: {
  (label?: any, ...data: any[]): void
  default: (label?: any, ...data: any[]) => void
  info: (label?: any, ...data: any[]) => void
  success: (label?: any, ...data: any[]) => void
  warn: (label?: any, ...data: any[]) => void
  error: (label?: any, ...data: any[]) => void
  /** key: `${bg},${color}` */
  [key: string]: (label?: any, ...data: any[]) => void
}
