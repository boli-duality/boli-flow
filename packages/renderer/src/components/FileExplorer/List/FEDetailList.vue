<script setup lang="tsx">
import { useTable } from '@/composables/useTable'
import { convertFileSize } from '@/functions/core'
import dayjs from 'dayjs'
import { extname } from 'pathe'

const attrs = useAttrs()
const emits = defineEmits<{
  open: [path: string]
}>()
const { data = [] } = defineProps<{
  data?: ExplorerDir<ExplorerFile>['children']
}>()

const { t } = useI18n()

const model = useTable({
  data: computed(() => data),
  table: {
    rowKey: 'name',
    style: { height: 'calc(100% - 48px)' },
    border: true,
    size: 'small',
    async onRowDblclick(row) {
      if (row.type == 'directory') return emits('open', row.name)
      if (row.type == 'file') openFile(row.name, row.path)
    },
  },
  columns: [
    {
      type: 'selection',
      width: 40,
    },
    {
      label: '名称',
      width: 270,
      showOverflowTooltip: true,
      slot: ({ row }) => (
        <div class='flex items-center'>
          <div class='mr-3 text-14'>{fileIcon[row.type]}</div>
          {row.name}
        </div>
      ),
    },
    {
      label: '修改日期',
      width: 145,
      slot: ({ row }) => dayjs(row.modified).format('YYYY/M/D H:mm'),
    },
    {
      label: '类型',
      width: 120,
      slot: ({ row }) =>
        row.type && t(`file-type.${row.type}`, { name: extname(row.name).slice(1).toUpperCase() }),
    },
    {
      label: '大小',
      align: 'right',
      width: 80,
      slot: ({ row }) => convertFileSize(row.size),
    },
  ],
})

const fileApi = useApi(apiExplorerFile, { immediate: false })

const fileIcon = {
  directory: '📁',
  file: '📄',
  symlink: '🔗',
  other: '❓',
}

const textFile = [
  'txt',
  'json',
  'xml',
  'html',
  'css',
  'js',
  'ts',
  'md',
  'vue',
  'jsonc',
  'yml',
  'yaml',
  'mdx',
  'sql',
  'log',
]
const imgFile = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg']

async function openFile(file: string, path: string) {
  const ext = extname(file).slice(1)
  if (imgFile.includes(ext)) imgPreviewState.open(urlExplorerStream(path))
  else if (textFile.includes(ext)) {
    const [err, res] = await fileApi.request(path)
    if (err) return
    codeEditorState.show = true
    codeEditorState.value = res
    codeEditorState.title = file
  }
}

const codeEditorState = reactive({
  show: false,
  value: '',
  title: '',
})
const imgPreviewState = reactive({
  show: false,
  srcList: [] as string[],
  open(url: string) {
    imgPreviewState.srcList[0] = url
    imgPreviewState.show = true
  },
})
</script>

<template>
  <BaseTable v-bind="attrs" :model />
  <el-image-viewer
    v-if="imgPreviewState.show"
    :url-list="imgPreviewState.srcList"
    @close="imgPreviewState.show = false"
  />
  <CodeEditor
    v-if="codeEditorState.show"
    :value="codeEditorState.value"
    :title="codeEditorState.title"
    @close="codeEditorState.show = false"
  />
</template>

<style lang="scss" scoped>
.el-table {
  --el-table-row-hover-bg-color: #e5f3ff;
  :deep() {
    td.el-table__cell,
    .el-table-column--selection.el-table__cell {
      border-right: none;
    }
    .el-table__cell {
      border-bottom: none !important;
    }
    .el-table__inner-wrapper::before {
      display: none;
    }
    .el-table__body td.el-table__cell {
      transition: none;
    }
  }
}
</style>
