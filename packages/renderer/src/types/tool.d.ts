/** vscode类型提示展开 */
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
