<script setup lang="ts">
import { editor } from 'monaco-editor'
import { extname } from 'pathe'

const emits = defineEmits<{
  close: []
}>()
const { value, title } = defineProps<{ value: string; title?: string }>()

const codeEditor = useTemplateRef('code-editor')

const languagesMap = {
  html: 'html',
  css: 'css',
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  json: 'json',
  md: 'markdown',
  vue: 'html',
  txt: 'plaintext',
}

onMounted(() => {
  const editorEl = codeEditor.value
  if (!editorEl) return
  const ext = extname(title || '').slice(1) as keyof typeof languagesMap
  const language = languagesMap[ext]
  if (!language) ElMessage.error('不支持的文件格式')
  // Hover on each property to see its docs!
  const editorIns = editor.create(editorEl, {
    value,
    language: languagesMap[ext],
    automaticLayout: true,
    theme: 'vs-dark',
  })

  watch(
    () => value,
    () => editorIns.setValue(value)
  )
})
</script>

<template>
  <DraggableWindow :title @close="emits('close')">
    <div ref="code-editor" style="height: 100%" />
  </DraggableWindow>
</template>

<style lang="scss" scoped></style>
