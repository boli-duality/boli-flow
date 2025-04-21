/**
 * A helper to try an async function without forking
 * the control flow. Returns an error first callback _like_
 * array response as [Error, result]
 */
export async function doAwait<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt)
        return [parsedError, undefined]
      }

      return [err, undefined]
    })
}

/** 判断类型 */
export function typeOf(data: any) {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase() as
    | 'number'
    | 'string'
    | 'undefined'
    | 'boolean'
    | 'function'
    | 'null'
    | 'array'
    | 'object'
}

/** interval管理器 */
export function createInterval(handler: () => void) {
  const manager = {
    /** 定时器id */
    id: 0,
    /** 是否正在运行 */
    active: false,
    /** 开始定时器 */
    start(interval?: number | undefined, { immediate = true } = {}) {
      manager.stop()
      if (immediate) handler()
      manager.id = setInterval(handler, interval)
      manager.active = Boolean(manager.id)
    },
    /** 清除定时器 */
    stop() {
      if (!manager.active) return
      clearInterval(manager.id)
      manager.id = 0
      manager.active = false
    },
  }

  return manager
}

/** timeout管理器 */
export function createTimeout(handler: () => void) {
  const manager = {
    id: 0,
    /** 是否正在运行 */
    active: false,
    start(timeout?: number | undefined, { immediate = false } = {}) {
      manager.stop()
      if (immediate) handler()
      manager.id = setTimeout(handler, timeout)
      manager.active = Boolean(manager.id)
    },
    stop() {
      if (!manager.active) return
      clearTimeout(manager.id)
      manager.id = 0
      manager.active = false
    },
  }

  return manager
}

/** 倒计时管理器(秒) */
export function createCountDown(handler?: (countdown: number) => void) {
  const manager = {
    id: 0,
    /** 是否正在运行 */
    active: false,
    countdown: 0,
    start(countdown: number, { immediate = true } = {}) {
      manager.stop()
      manager.countdown = countdown
      if (immediate) handler?.(manager.countdown)
      manager.id = setInterval(() => {
        manager.countdown--
        if (manager.countdown > 0) handler?.(manager.countdown)
        else manager.stop()
      }, 1000)
      manager.active = Boolean(manager.id)
    },
    stop() {
      if (!manager.active) return
      clearInterval(manager.id)
      manager.id = 0
      manager.active = false
      manager.countdown = 0
    },
  }

  return manager
}

export class IndexManager<T> {
  array: T[]
  index = 0
  get length() {
    return this.array.length
  }
  get current() {
    return this.array[this.index]
  }
  get isFirst() {
    return this.index === 0
  }
  get isLast() {
    return this.index === this.array.length - 1
  }
  onPrev?(index: number): void
  onNext?(index: number): void
  onReachLeft?(): void
  onReachRight?(): void
  constructor(
    array: T[],
    config?: {
      onPrev?(index: number): void
      onNext?(index: number): void
      onReachLeft?(): void
      onReachRight?(): void
    }
  ) {
    this.array = array
    if (!config) return
    this.onPrev = config.onPrev
    this.onNext = config.onNext
    this.onReachLeft = config.onReachLeft
    this.onReachRight = config.onReachRight
  }
  prev() {
    if (this.index <= 0) return this.onReachLeft?.()
    this.onPrev?.(--this.index)
    if (this.index <= 0) this.onReachLeft?.()
  }
  next() {
    if (this.index >= this.array.length - 1) return this.onReachRight?.()
    this.onNext?.(++this.index)
    if (this.index >= this.array.length - 1) this.onReachRight?.()
  }
}

type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'
export function convertFileSize(
  size: number,
  {
    fromUnit = 'B',
    toUnit,
    decimals = 0,
  }: { fromUnit?: FileSizeUnit; toUnit?: FileSizeUnit; decimals?: number } = {}
): string {
  if (size < 0) throw new Error('Size must be non-negative')
  if (!size) return ''
  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const
  const fromIndex = units.indexOf(fromUnit)
  const toIndex = toUnit
    ? units.indexOf(toUnit)
    : Math.min(4, Math.floor(Math.log(size) / Math.log(1024)) + fromIndex)

  if (!~fromIndex || !~toIndex) throw new Error('Invalid unit')

  const result = size / Math.pow(1024, toIndex - fromIndex)
  return `${result.toFixed(decimals)} ${units[toIndex]}`
}
