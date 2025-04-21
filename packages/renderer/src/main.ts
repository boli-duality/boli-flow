import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import '@xterm/xterm/css/xterm.css'
import './main.css'

import { createApp, type Plugin } from 'vue'

import App from './App.vue'

import loadPolyfills from './polyfills' // 动态安装polyfills

loadPolyfills().then(() => {
  const app = createApp(App)

  // 安装插件
  Object.values(import.meta.glob<{ default: Plugin }>('./plugins/*.ts', { eager: true })).forEach(
    plugin => app.use(plugin.default)
  )

  app.mount('#app')
})
