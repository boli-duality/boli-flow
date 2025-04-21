import type { AxiosInstance } from 'axios'

export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

export interface ApiInstance extends AxiosInstance {
  <T = any, R = ApiResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>
  <T = any, R = ApiResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
}
