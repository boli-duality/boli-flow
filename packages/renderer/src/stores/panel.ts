import { addCssUnit } from '@/functions/core'
import { defineStore } from 'pinia'

export const usePanelStore = defineStore('panel', () => {
  const sidebar = ref({
    show: false,
    width: 260,
  })

  const composite = ref({
    show: false,
    height: 306,
    isfullScreen: false,
  })

  const auxiliarybar = ref({
    show: false,
    width: 300,
  })

  const compositeHeight = computed(() =>
    addCssUnit(composite.value.isfullScreen ? '100%' : composite.value.height)
  )

  return {
    sidebar,
    composite,
    auxiliarybar,
    compositeHeight,
  }
})
