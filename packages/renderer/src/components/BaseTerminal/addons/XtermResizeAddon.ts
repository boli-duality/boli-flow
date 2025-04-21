// 为xterm.js v5.5.0 开发的宽高自适应插件
const MINIMUM_COLS = 2
const MINIMUM_ROWS = 1

function resize(terminal: any, core: any, width: number, height: number) {
  const cell = core._renderService.dimensions.css.cell
  const scrollBarWidth = core.viewport.scrollBarWidth
  const cols = Math.max(MINIMUM_COLS, Math.floor((width - scrollBarWidth) / cell.width))
  const rows = Math.max(MINIMUM_ROWS, Math.floor(height / cell.height))
  if (cols === terminal.cols && rows === terminal.rows) return
  core._renderService.clear()
  terminal.resize(cols, rows)
}

export default class XtermResizeAddon {
  observer: ResizeObserver | undefined

  activate(terminal: any): void {
    const core = terminal._core
    core.onWillOpen((element: HTMLElement) => {
      Object.assign(element.style, {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        height: '100%',
      })

      this.observer = new ResizeObserver(([el]) => {
        const { width, height } = el.contentRect
        resize(terminal, core, width, height)
      })
      this.observer.observe(element)
    })
  }

  dispose() {
    this.observer?.disconnect()
    this.observer = undefined
  }
}
