import type { BaseTable } from '@/components/BaseTable.vue'
import type { ExtraTable } from './useTable.type'

export function useTable<T>(options: ExtraTable<T>) {
  return reactive(options) as BaseTable<T>
}
