<script setup lang="ts">
import { addCssUnit } from '@/functions/core'
import { storeToRefs } from 'pinia'

const panelStore = usePanelStore()
const { auxiliarybar } = storeToRefs(panelStore)
</script>

<template>
  <aside
    v-show="auxiliarybar.show"
    class="auxiliarybar shrink-0 b-l"
    :style="{ width: addCssUnit(auxiliarybar.width) }"
  >
    auxiliarybar
  </aside>
</template>

<style lang="scss" scoped></style>
