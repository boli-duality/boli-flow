<script setup lang="ts">
import { storeToRefs } from 'pinia'

const fileExplorerStore = useFileExplorerStore()
const { dir } = storeToRefs(fileExplorerStore)
const { open } = fileExplorerStore
</script>

<template>
  <FEDiskList v-if="dir.name === '/'" :data="dir.children" @open="open" />
  <FEDetailList v-else-if="dir.name" :data="dir.children" @open="open" />
</template>

<style scoped></style>
