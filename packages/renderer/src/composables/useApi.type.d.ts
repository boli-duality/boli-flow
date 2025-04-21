import type { ApiResponse } from '@/request/index.type'
import type { AxiosRequestConfig } from 'axios'
import type { DebouncedFunc } from 'lodash-es'
import type { ToRefs } from 'vue'

export type Options<
  Params = any,
  Response = any,
  Data = undefined,
  Refs extends boolean = false,
> = {
  refs?: Refs
  params?: Params
  config?: AxiosRequestConfig
  data?: Data
  onRequest?({
    params,
    cancel,
  }: {
    params: Ref<Params>
    cancel(message?: MessageOptions['message'], type?: MessageOptions['type']): void
  }): void
  onSuccess?(res: Response): void
  onBlob?(blob: Blob): any
  onReadStream?(read: Read): any
  onError?(err: any): void
  onBusiness?({ code, msg, data }: ApiResponse<Response>): void
  onFinally?(): void
  immediate?: boolean
  gap?: [type: 'debounce' | 'throttle', wait: number]
  blocking?: boolean
  enabledAbort?: boolean
  enabledPolling?: boolean
  pollingDuration?: number
}

export interface Model<Params = any, Response = any, Data = undefined> {
  params: Params | undefined
  data: Response | Data
  pending: boolean
  inited: boolean
  execute: Execute<Response>
  load: Execute<Response> | DebouncedFunc<Execute<Response>>
  refresh: Execute<Response> | DebouncedFunc<Execute<Response>>
  request<T = Response>(params: Params): ReturnType<Execute<T>>
  abort(): void
  poll(): void
  stopPoll(): void
}

type Methods = 'execute' | 'load' | 'reload' | 'request' | 'abort' | 'poll' | 'stopPoll'

export type ModelRefs<P, R, D> = ToRefs<Omit<Model<P, R, D>, Methods>> &
  Pick<Model<P, R, D>, Methods>

export type Return<P, R, D, T> = T extends true ? ModelRefs<P, R, D> : Model<P, R, D>

export type Gap = [type: 'debounce' | 'throttle', wait: number]

export type Execute<Response> = () => Promise<[null, Response] | [Error, undefined]>

export type Read = {
  (): Promise<any[]>
  (handler: (value: any) => void): Promise<undefined>
  (handler?: (value: any) => void): Promise<any[] | undefined>
}
