import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import unocss from '@unocss/eslint-config/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
import { configureVueProject } from '@vue/eslint-config-typescript'
configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  skipFormatting,

  unocss,

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-template': 'error',
      'no-unreachable': 'warn',
    },
  },
  // vue
  {
    rules: {
      'vue/prefer-template': 'error',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
          },
        },
      ],
      'vue/multiline-html-element-content-newline': 'error',
    },
  },

  {
    files: ['src/pages/**', 'src/layouts/**'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  {
    files: ['src/pages/**/components/**'],
    rules: { 'vue/multi-word-component-names': 'error' },
  }
)
