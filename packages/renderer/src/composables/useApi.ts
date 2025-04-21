import { createCountDown, doAwait } from '@/functions/core'
import { debounce, throttle } from 'lodash-es'
import type { Execute, Gap, Model, Options, Return } from './useApi.type'
import type { Api } from '@/apis/api'
import { BizError } from '@/request'
import { type MessageOptions } from 'element-plus'
import { AxiosError } from 'axios'

export function useApi<
  Params = any,
  Response = any,
  Data = undefined,
  Refs extends boolean = false,
>(
  api: Api<Params, Response>,
  {
    params,
    config,
    data,
    onRequest,
    onSuccess,
    onBlob,
    onReadStream,
    onError,
    onBusiness,
    onFinally,
    immediate = true,
    gap,
    blocking = true,
    pollingDuration,
    enabledAbort,
    enabledPolling,
    refs,
  }: Options<Params, Response, Data, Refs> = {}
): Return<Params, Response, Data, Refs> {
  const paramsRef = ref(params) as Ref<Params>

  async function execute() {
    try {
      if (blocking && model.pending) throw new UseApiCanceledError('blocking')
      model.pending = true

      onRequest?.({
        params: paramsRef,
        cancel,
      })

      if (enabledAbort) {
        config ??= {}
        const abortController = new AbortController()
        config.signal = abortController.signal
        abortModel!.controllers.add(abortController)
      }
      const [err, res] = await doAwait(api(model.params, config))
      if (err) {
        if (err instanceof BizError) onBusiness?.(err.data)
        throw err
      }

      // #region 处理数据 😃
      if (res instanceof ReadableStream) {
        const reader = res.getReader()
        async function read(handler?: (value: any) => void) {
          let array: any[] | undefined
          if (!handler) {
            array = []
            handler = v => array!.push(v)
          }
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            handler(value)
          }
          return array as any
        }
        if (onReadStream) model.data = await onReadStream(read)
        else model.data = await read()
      } else if (res instanceof Blob) {
        if (onBlob) model.data = await onBlob(res)
        else model.data = res
      } else {
        onSuccess?.(res.data)
        model.data = res.data
      }
      // #endregion 处理数据 👆

      model.inited = true

      return [null, model.data] as [null, Response]
    } catch (error: any) {
      if (error instanceof UseApiCanceledError) {
        _log.warn('useApi canceled', { type: error.message, api: api.name })
      } else if (error instanceof AxiosError && error.name == 'CanceledError') {
        _log.warn('useApi abort', api.name)
      } else console.error(error)
      onError?.(error)
      return [error, undefined] as [Error, undefined]
    } finally {
      model.pending = false
      onFinally?.()
    }
  }

  // #region 安装模块 😃
  // 防抖节流
  const load = setupGap(execute, gap)
  // 轮询
  const polling = setupPolling(!!enabledPolling, execute, pollingDuration)
  // 中止请求
  const abortModel = setupAbort(!!enabledAbort)
  // #endregion 安装模块 👆

  async function request(params: Params) {
    model.params = params
    const res = await load()
    if (!res) return [new UseApiCanceledError('Gap'), undefined] as [Error, undefined]
    return res
  }

  const model = reactive({
    params: paramsRef,
    data,
    pending: false,
    inited: false,
  }) as Model

  const methods = {
    execute,
    load,
    refresh: load,
    request,
    abort: abortModel?.abort,
    ...polling,
  }

  if (immediate) load()

  if (refs) return Object.assign(toRefs(model), methods) as any
  return Object.assign(model, methods) as any
}

class UseApiCanceledError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'UseApiCanceledError'
  }
}
function cancel(message?: MessageOptions['message'], type: MessageOptions['type'] = 'warning') {
  if (message) ElMessage({ message, type })
  throw new UseApiCanceledError('cancel')
}

function setupGap<Response>(execute: Execute<Response>, gap: Gap | undefined) {
  if (!gap) return execute
  const [type, wait] = gap
  if (type === 'debounce') return debounce(execute, wait, { trailing: false })
  if (type === 'throttle') return throttle(execute, wait, { trailing: false })
  return execute
}

function setupPolling<Response>(
  enabled: boolean,
  execute: Execute<Response>,
  pollingDuration: number = 10
) {
  if (!enabled) return
  const timer = createCountDown(execute)
  function poll() {
    timer.start(pollingDuration)
  }

  return {
    poll,
    stopPoll: timer.stop,
  }
}

function setupAbort(enabled: boolean) {
  if (!enabled) return
  const model = {
    controllers: new Set<AbortController>(),
    abort() {
      model.controllers.forEach(controller => controller.abort())
      model.controllers.clear()
    },
  }
  return model
}
