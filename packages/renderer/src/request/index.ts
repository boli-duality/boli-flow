import axios from 'axios'
import type { ApiInstance, ApiResponse } from './index.type'
import { baseURL } from '@/states/config'

export class BizError<T = any> extends Error {
  data
  constructor(data: ApiResponse<T>) {
    super()
    this.name = 'BizError'
    this.data = data
  }
}

// 创建 Axios 实例
const instance: ApiInstance = axios.create({
  baseURL: baseURL.value, // 设置基础 URL
  adapter: 'fetch',
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，比如添加 token
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  error => {
    // 对请求错误做些什么
    throw error
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    if (response.data.code) throw new BizError(response.data)
    return response.data
  },
  error => {
    // 对响应错误做些什么
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 401:
          // 处理未授权
          break
        case 404:
          // 处理未找到
          break
        case 500:
          // 处理服务器错误
          break
        default:
          // 处理其他错误
          break
      }
    }
    throw error
  }
)

export const request = instance
