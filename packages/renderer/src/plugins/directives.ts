import type { App } from 'vue'

export default function install(app: App) {
  app.directive('hide', {
    mounted(el, binding) {
      updateVisibility(el, binding.value)
    },
    updated(el, binding) {
      updateVisibility(el, binding.value)
    },
  })

  let style: any
  // 更新元素可见性的函数
  function updateVisibility(el: any, isHidden: boolean) {
    if (isHidden) {
      style = el.style
      Object.assign(el.style, {
        position: 'fixed',
        transform: `translateX(calc(-${window.innerWidth}px - 100%))`,
      })
    } else {
      Object.assign(
        el.style,
        {
          position: '',
          transform: '',
        },
        style
      )
    }
  }
}
