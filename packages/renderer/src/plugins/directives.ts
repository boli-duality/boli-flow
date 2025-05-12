import type { App, Directive } from 'vue'

const visibleSymbol = Symbol('v-visible:original-style')

const directives: Record<string, Directive> = {
  visible(el, { value: isVisible }) {
    if (isVisible) Object.assign(el.style, el[visibleSymbol])
    else {
      el[visibleSymbol] = {
        position: el.style.position,
        top: el.style.top,
        transform: el.style.transform,
      }
      Object.assign(el.style, {
        position: 'fixed',
        top: '-100%',
        transform: 'translateY(-100%)',
      })
    }
  },
}

export default function install(app: App) {
  Object.entries(directives).forEach(([name, directive]) => {
    app.directive(name, directive)
  })
}
