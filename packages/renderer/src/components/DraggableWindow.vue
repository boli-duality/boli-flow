<script setup lang="ts">
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

defineProps<{
  title?: string
}>()

const emits = defineEmits<{
  close: []
}>()

const state = reactive({
  x: window.innerWidth / 2 - (window.innerWidth * 0.6) / 2,
  y: window.innerHeight / 2 - (window.innerHeight * 0.7) / 2,
  w: 0,
  h: 0,
  draggable: false,
  initW: window.innerWidth * 0.6,
  initH: window.innerHeight * 0.7,
})
</script>

<template>
  <Vue3DraggableResizable
    v-model:x="state.x"
    v-model:y="state.y"
    v-model:w="state.w"
    v-model:h="state.h"
    :init-w="state.initW"
    :init-h="state.initH"
    :min-h="35"
    active
    :draggable="state.draggable"
  >
    <div
      class="header h-35 flex items-center justify-between b-b b-#2B2B2B bg-#181818 px-10 c-#fff"
      @mousedown="state.draggable = true"
      @mouseup="state.draggable = false"
    >
      <div class="placeholder size-19" />
      <div class="title">{{ title }}</div>
      <i-material-symbols-close-rounded class="size-18 cursor-pointer" @click="emits('close')" />
    </div>
    <div class="content h-[calc(100%-35px)]">
      <slot />
    </div>
  </Vue3DraggableResizable>
</template>

<style lang="scss" scoped>
.vdr-container {
  position: fixed;
  z-index: 10;
}
</style>
