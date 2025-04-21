import { request } from '@/request'
import type { Api } from './api'
import type { ExplorerDir } from './explorer.type'
import { join } from 'pathe'

export const apiExplorerDir: Api<string, ExplorerDir> = (params, config) =>
  request({
    url: join('/explorer/dir', encodeURIComponent(params)),
    method: 'GET',
    ...config,
  })

export const apiExplorerFile: Api<string, string> = (params, config) =>
  request({
    url: `/explorer/file/${encodeURIComponent(params)}`,
    method: 'GET',
    ...config,
  })

export const apiExplorerStream: Api<string, Blob> = (params: string, config) =>
  request({
    url: `/explorer/stream/${encodeURIComponent(params)}`,
    method: 'GET',
    responseType: 'blob',
    ...config,
  })
