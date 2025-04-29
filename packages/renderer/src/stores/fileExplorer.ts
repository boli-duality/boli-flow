import { IndexManager } from '@/functions/core'
import { defineStore } from 'pinia'
import { resolve } from 'pathe'

class HistoryManager extends IndexManager<string> {
  add(path: string) {
    this.array.splice(this.index + 1, Infinity)
    this.index = this.array.push(path) - 1
  }
}

export const useFileExplorerStore = defineStore('fileExplorer', () => {
  const { data: dir, request } = useApi(apiExplorerDir, {
    refs: true,
    immediate: false,
    data: {} as ExplorerDir,
    onRequest({ params }) {
      if (params.value.startsWith('/')) params.value = params.value.slice(1)
    },
  })

  const history = reactive(
    new HistoryManager([], {
      onPrev() {
        request(history.current)
      },
      onNext() {
        request(history.current)
      },
    })
  )

  const navbar = computed(() => {
    const current = history.current
    if (!history.length || current === '/') return []
    return current.split('/')
  })

  const listType = computed(() => {
    return navbar.value.length ? 'flat' : 'detail'
  })

  function up() {
    open('..')
  }

  async function open(path: string) {
    path = resolve(history.current, path)
    if (path === history.current) return
    const [err, res] = await request(path)
    if (err) return
    history.add(res.name)
  }

  function refresh() {
    request(history.current)
  }

  async function init(path = '/') {
    const [err, res] = await request(path)
    if (err) return
    history.add(res.name)
  }

  return {
    navbar,
    dir,
    listType,
    history,
    open,
    up,
    refresh,
    init,
  }
})
