import { defineConfig, presetMini, presetIcons } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [
    presetMini(),
    presetRemToPx({ baseFontSize: 4 }),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  shortcuts: [['flex-center', 'flex justify-center items-center']],
})
