<script setup lang="ts"></script>

<template>
  <section class="container h-100vh flex flex-col of-hidden">
    <section class="h-[calc(100%-22px)] flex">
      <aside class="activitybar w-48 shrink-0 b-r" />
      <bf-sidebar />
      <section class="main-panel h-100% flex flex-1 flex-col">
        <main class="min-h-0 flex-1">
          <RouterView />
        </main>
        <bf-footer />
      </section>

      <bf-auxiliarybar />
    </section>
    <bf-statusbar />
  </section>
</template>

<style lang="scss" scoped></style>
