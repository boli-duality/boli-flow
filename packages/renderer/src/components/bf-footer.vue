<script setup lang="ts">
import { storeToRefs } from 'pinia'

const panelStore = usePanelStore()
const { composite, compositeHeight } = storeToRefs(panelStore)
// const { ctrl_j, shift, alt } = useMagicKeys({
//   passive: false,
//   onEventFired(e) {
//     if (ctrl_j.value && !shift.value && !alt.value) e.preventDefault()
//   },
// })

// whenever(
//   () => ctrl_j.value && !shift.value && !alt.value,
//   () => terminalToggle()
// )
</script>

<template>
  <footer
    v-show="true"
    v-visible="composite.show"
    class="z-10 b-t-1 bg-#000 pl-20 c-#fff"
    :style="{ height: compositeHeight }"
  >
    <div class="composite h-35 flex items-center justify-between pr-13 text-12">
      <div class="composite-bar">终端</div>
      <div class="action-bar">
        <ul class="actions">
          <li />
        </ul>
        <ul class="global-actions flex items-center gap-5">
          <li
            class="size-22 flex-center cursor-pointer rd-5 hover:bg-[rgba(255,255,255,.2)]"
            @click="composite.isfullScreen = !composite.isfullScreen"
          >
            <div
              v-if="composite.isfullScreen"
              class="i-material-symbols-keyboard-arrow-down-rounded size-22"
            />
            <div v-else class="i-material-symbols-keyboard-arrow-up-rounded size-22" />
          </li>
          <li
            class="size-22 flex-center cursor-pointer rd-5 hover:bg-[rgba(255,255,255,.2)]"
            @click="composite.show = false"
          >
            <div class="i-material-symbols-close-rounded size-17" />
          </li>
        </ul>
      </div>
    </div>
    <div :style="{ height: `calc(${compositeHeight} - 35px)` }">
      <BaseTerminal />
    </div>
  </footer>
</template>

<style lang="scss" scoped></style>
