export interface Config {
  port: number
}

export const config = shallowRef({} as Config)
export const baseURL = computed(() => `${import.meta.env.VITE_BASE_URL}:${config.value.port}`)
