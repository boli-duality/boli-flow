import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import '@xterm/xterm/css/xterm.css'
import './main.css'

import { createApp, type Plugin } from 'vue'
import App from './App.vue'

import { config } from './states/config'

// import loadPolyfills from './polyfills' // 动态安装polyfills
// await loadPolyfills()

config.value = await BF.getConfig()

const app = createApp(App)

// 安装插件
Object.values(import.meta.glob<{ default: Plugin }>('./plugins/*.ts', { eager: true })).forEach(
  plugin => app.use(plugin.default)
)

app.mount('#app')
