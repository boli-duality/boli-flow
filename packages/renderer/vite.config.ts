import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { unheadVueComposablesImports } from '@unhead/vue'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import Layouts from 'vite-plugin-vue-layouts'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import LogLabel from '@bolinjs/vite-plugin-log-label'
// import legacy from '@vitejs/plugin-legacy'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      /* options */
      dts: 'vite-env/typed-router.d.ts',
      routesFolder: [
        {
          src: 'src/pages',
          exclude: '**/components/**',
        },
      ],
    }),
    Layouts(),
    vue(),
    vueJsx(),
    // legacy({ modernPolyfills: true }), // 兼容低版本方案
    vueDevTools(),
    UnoCSS(),
    Icons(),
    AutoImport({
      imports: [
        'vue',
        'vue-i18n',
        '@vueuse/core',
        VueRouterAutoImports,
        unheadVueComposablesImports,
      ],
      dirs: ['src/apis', 'src/composables', 'src/stores'],
      dts: 'vite-env/auto-imports.d.ts',
      resolvers: [ElementPlusResolver(), IconsResolver()],
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.vue\.[tj]sx?\?vue/],
      dts: 'vite-env/components.d.ts',
      resolvers: [ElementPlusResolver(), IconsResolver()],
    }),
    VueI18nPlugin({
      include: resolve(__dirname, 'locales/**'),
    }),
    LogLabel({ dts: 'vite-env/log-label.d.ts' }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: './',
})
