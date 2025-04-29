<script setup lang="ts">
const { t } = useI18n()

const [terminalShow] = useToggle(true)
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
  <section class="container h-100vh flex flex-col of-hidden">
    <section class="flex flex-1">
      <aside class="activitybar w-48 shrink-0 b-r" />
      <aside class="sidebar w-260 shrink-0 b-r">
        {{ t('intro.desc') }}
      </aside>
      <section class="main-panel relative flex flex-1 flex-col">
        <main class="flex-1">
          <RouterView />
        </main>
        <footer v-hide="!terminalShow" class="h-306 bg-#000 pl-20">
          <BaseTerminal :show="terminalShow" />
        </footer>
      </section>
      <aside class="auxiliarybar w-300 shrink-0 b-l">auxiliarybar</aside>
    </section>
    <footer class="statusbar h-22 flex shrink-0 items-center justify-between b-t px-5 text-12">
      <div class="left-items flex items-center">
        <div class="item h-22 flex items-center px-5">4个项目</div>
      </div>
      <div class="right-items flex items-center">
        <div class="item h-22 flex cursor-pointer items-center px-5 hover:bg-#ECEBEB">
          <i-material-symbols-terminal class="size-18" />
        </div>
      </div>
    </footer>
  </section>
</template>

<style lang="scss" scoped></style>
