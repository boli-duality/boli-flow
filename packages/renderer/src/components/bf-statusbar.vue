<script setup lang="ts">
import { storeToRefs } from 'pinia'

const panelStore = usePanelStore()
const { composite } = storeToRefs(panelStore)
</script>

<template>
  <footer class="statusbar h-22 flex shrink-0 items-center justify-between b-t px-5 text-12">
    <div class="left-items flex items-center">
      <div class="item h-22 flex items-center px-5">4个项目</div>
    </div>
    <div class="right-items flex items-center">
      <div
        class="item h-22 flex cursor-pointer items-center px-5 hover:bg-#ECEBEB"
        @click="composite.show = !composite.show"
      >
        <i-material-symbols-terminal class="size-18" />
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped></style>
