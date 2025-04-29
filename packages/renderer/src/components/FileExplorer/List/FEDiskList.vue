<script setup lang="ts">
import type { ExplorerDir, ExplorerDisk } from '@/apis/explorer.type'

const emits = defineEmits<{
  open: [path: string]
}>()
const { data = [] } = defineProps<{
  data?: ExplorerDir<ExplorerDisk>['children']
}>()
</script>

<template>
  <ul class="flex flex-1 flex-wrap items-start gap-5 p-20">
    <li
      v-for="(item, index) in data"
      :key="index"
      class="h-57 w-250 flex-center hover:bg-#E5F3FF"
      @dblclick="emits('open', item.Name)"
    >
      <img class="h-50 w-50 pr-10" src="@/assets/windows.png" alt="" />
      <div>
        <div>{{ item.Name }}</div>
        <div class="h-17 w-191 b b-#BCBCBC">
          <div
            class="h-100% bg-#26A0DA"
            :style="{
              width: `${Math.ceil(((+item.Size - +item.FreeSpace) / +item.Size) * 100)}%`,
            }"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
