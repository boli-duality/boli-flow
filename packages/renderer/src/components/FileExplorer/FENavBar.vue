<script setup lang="ts">
import { storeToRefs } from 'pinia'

const fileExplorerStore = useFileExplorerStore()
const { navbar, dir, history } = storeToRefs(fileExplorerStore)
const { open, up, refresh } = fileExplorerStore

const tools = reactive([
  {
    icon: 'i-material-symbols-arrow-back-rounded',
    handle: () => history.value.prev(),
    disabled: computed(() => history.value.isFirst),
  },
  {
    icon: 'i-material-symbols-arrow-forward-rounded',
    handle: () => history.value.next(),
    disabled: computed(() => history.value.isLast),
  },
  {
    icon: 'i-material-symbols-arrow-upward-rounded',
    handle: up,
    disabled: computed(() => history.value.current === '/'),
  },
  {
    icon: 'i-material-symbols:refresh-rounded',
    handle: refresh,
  },
])

const scrollLeft = ref(0)
onMounted(() => {
  const scrollbar = document.querySelector<HTMLOListElement>('.scrollbar')
  if (!scrollbar) return
  scrollbar.addEventListener('wheel', e => (scrollbar.scrollLeft += e.deltaY), { passive: true })
  scrollbar.addEventListener('scroll', () => (scrollLeft.value = scrollbar.scrollLeft), {
    passive: true,
  })
  watch(
    () => navbar.value.length,
    () => nextTick(() => (scrollbar.scrollLeft = scrollbar.scrollWidth))
  )
})
</script>

<template>
  <nav class="h-48 flex items-center rd-4 bg-#F3F4F5">
    <div class="tools w-200 flex items-center justify-between px-10">
      <div
        v-for="item in tools"
        :key="item.icon"
        class="h-32 w-32 flex-center cursor-pointer rd-4 hover:bg-#ECEBEB"
        :class="{
          'c-#A3A1A0': item.disabled,
        }"
        s-center
        @click="item.handle"
      >
        <div :class="item.icon" class="size-18" />
      </div>
    </div>

    <div
      ref="scrollbar"
      class="scrollbar relative mx-10 h-32 flex flex-[7] items-center of-x-auto rd-4 bg-#FDFDFD pr-5"
    >
      <div class="sticky left-0 z-1 shrink-0 bg-white pl-5">
        <ol
          class="flex items-center rd-4"
          :class="{
            'shadow-[0_0_5px_5px_rgba(0,0,0,0.1)]': scrollLeft > 0,
          }"
        >
          <li class="flex items-center">
            <div class="h-26 flex-center px-8">
              <i-material-symbols-desktop-windows-outline-rounded class="size-19" />
            </div>
            <div
              class="icon-box h-26 w-24 flex-center cursor-pointer rd-4 hover:b hover:b-#F2F3F3 hover:bg-#F2F3F3"
            >
              <div class="i-material-symbols:arrow-forward-ios-rounded size-10" />
            </div>
          </li>
          <li
            class="flex shrink-0 cursor-pointer of-hidden b b-transparent rd-4 hover:b hover:b-#F2F3F3"
          >
            <div class="h-24 px-8 text-14 lh-24 hover:bg-#F2F3F3" @click="open('/')">此电脑</div>
            <div class="h-24 w-24 flex-center lh-24 hover:bg-#F2F3F3">
              <div class="i-material-symbols:arrow-forward-ios-rounded size-10" />
            </div>
          </li>
        </ol>
      </div>
      <ol class="flex items-center">
        <li
          v-for="(dirName, index) in navbar"
          :key="index"
          class="flex shrink-0 cursor-pointer of-hidden b b-transparent rd-4 hover:b hover:b-#F2F3F3"
        >
          <div
            class="h-24 px-8 text-14 lh-24 hover:bg-#F2F3F3"
            @click="open(`/${navbar.slice(0, index + 1).join('/')}`)"
          >
            {{ dirName }}
          </div>
          <div v-if="dir.children.length" class="h-24 w-24 flex-center lh-24 hover:bg-#F2F3F3">
            <div class="i-material-symbols:arrow-forward-ios-rounded size-8" />
          </div>
        </li>
      </ol>
    </div>

    <el-input class="search mr-10 h-32 w-500 flex-[3] bg-#FDFDFD" placeholder="搜索" />
  </nav>
</template>

<style lang="scss" scoped>
.scrollbar {
  &::-webkit-scrollbar {
    height: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #858585;
  }
}
</style>
