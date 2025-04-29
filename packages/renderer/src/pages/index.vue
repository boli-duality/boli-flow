<script setup lang="ts">
const { init } = useFileExplorerStore()
init()
</script>

<template>
  <FENavBar />
  <FEList />
</template>
