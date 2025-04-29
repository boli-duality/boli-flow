<script setup lang="ts">
import { Terminal } from '@xterm/xterm'
import { io, Socket } from 'socket.io-client'
import XtermResizeAddon from './addons/XtermResizeAddon'

const { show = false } = defineProps<{ show?: boolean }>()

const boliTerminal = useTemplateRef('base-terminal')

let client: Socket | undefined

const keyMap = new Map([
  [
    10,
    [
      ['code', 'KeyJ'],
      ['ctrlKey', true],
    ],
  ],
] as const)

onMounted(() => {
  if (!boliTerminal.value) return

  const socket = io('http://localhost:3000', { transports: ['websocket'] })
  client = socket

  const term = new Terminal({
    fontFamily: 'FiraCode Nerd Font, Fira Code, monospace, Consolas',
  })
  term.loadAddon(new XtermResizeAddon())
  term.open(boliTerminal.value)

  term.attachCustomKeyEventHandler(e => {
    for (const values of keyMap.values()) {
      const needCustom = values.every(([k, v]) => e[k] === v)
      if (needCustom) return false
    }
    return true
  })

  term.focus()
  watchEffect(() => {
    if (show) term.focus()
    else term.blur()
  })

  term.onResize(size => {
    socket.emit('resize', size)
  })

  term.onData(v => {
    socket.emit('input', v)
  })

  socket.on('output', v => {
    term.write(v)
  })
})

onUnmounted(() => client?.disconnect())
</script>

<template>
  <div ref="base-terminal" class="base-terminal h-100%" />
</template>
