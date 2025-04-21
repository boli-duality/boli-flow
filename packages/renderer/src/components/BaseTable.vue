<script setup lang="tsx" generic="T">
import { type TableProps, type TableColumnCtx } from 'element-plus'

export type TableColumnRender<T> = (scope: {
  row: T
  column: TableColumnCtx<T>
  $index: number
}) => any
export interface TableColumn<T> extends Partial<TableColumnCtx<T>> {
  slot?: TableColumnRender<T>
  slotHeader?: TableColumnRender<T>
  slotFilterIcon?: TableColumnRender<T>
}
export interface BaseTable<T> {
  data: T[]
  columns?: TableColumn<T>[]
  table?: Omit<TableProps<T>, 'data'> & {
    onScroll?: (...args: any[]) => any
    onSelect?: (...args: any[]) => any
    onExpandChange?: (...args: any[]) => any
    onCurrentChange?: (...args: any[]) => any
    onSelectAll?: (...args: any[]) => any
    onSelectionChange?: (...args: any[]) => any
    onCellMouseEnter?: (...args: any[]) => any
    onCellMouseLeave?: (...args: any[]) => any
    onCellContextmenu?: (...args: any[]) => any
    onCellClick?: (...args: any[]) => any
    onCellDblclick?: (...args: any[]) => any
    onRowClick?: (...args: any[]) => any
    onRowContextmenu?: (...args: any[]) => any
    onRowDblclick?: (row: T, column: TableColumnCtx<T>, event: Event) => any
    onHeaderClick?: (...args: any[]) => any
    onHeaderContextmenu?: (...args: any[]) => any
    onSortChange?: (...args: any[]) => any
    onFilterChange?: (...args: any[]) => any
    onHeaderDragend?: (...args: any[]) => any
  }
}

const { model } = defineProps<{ model: BaseTable<T> }>()

// unplugin-auto-import无法识别tsx中的组件，需要显示声明
// 不手动导入是因为手动导入不会自动引入样式
const Table = ElTable
const TableColumn = ElTableColumn

const Render = () => (
  <Table data={model.data} {...model.table}>
    {model.columns?.map(({ slot, slotHeader, slotFilterIcon, ...item }) => (
      <TableColumn {...item}>
        {{ default: slot, header: slotHeader, filterIcon: slotFilterIcon }}
      </TableColumn>
    ))}
  </Table>
)
</script>

<template>
  <Render />
</template>
