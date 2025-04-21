<script setup lang="ts">
const { init } = useFileExplorerStore()
init()

const { t } = useI18n()
</script>

<template>
  <div class="h-100vh">
    <FENavBar />
    <section class="flex h-[calc(100vh-48px)]">
      <aside class="w-210">
        {{ t('intro.desc') }}
      </aside>
      <main class="flex-1">
        <FEList style="height: calc(100vh - 48px)" />
      </main>
    </section>
  </div>
</template>

<route lang="yaml">
meta:
  layout: frame
</route>
