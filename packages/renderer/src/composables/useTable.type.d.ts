import type { BaseTable } from '@/components/BaseTable.vue'

export type ExtraTable<T> = Omit<BaseTable<T>, 'data'> & {
  data: T[] | Ref<T[]>
}
