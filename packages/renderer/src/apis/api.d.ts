import type { AxiosRequestConfig } from 'axios'

export type Api<Params = any, Response = any> = (
  params: Params,
  config?: AxiosRequestConfig
) => Promise<ApiResponse<Response>>
