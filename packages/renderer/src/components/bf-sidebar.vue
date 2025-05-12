<script setup lang="ts">
import { addCssUnit } from '@/functions/core'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const panelStore = usePanelStore()
const { sidebar } = storeToRefs(panelStore)
</script>

<template>
  <aside
    v-show="sidebar.show"
    class="sidebar shrink-0 b-r"
    :style="{ width: addCssUnit(sidebar.width) }"
  >
    {{ t('intro.desc') }}
  </aside>
</template>

<style lang="scss" scoped></style>
