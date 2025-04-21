import { join } from 'node:path'
import { doAwait } from '../functions/core'
import slash from 'slash'
import { readdir, readFile, stat } from 'node:fs/promises'

export default class FileUitls {
  static getPath(path: string) {
    if (path.startsWith('/')) path = path.slice(1)
    if (path.endsWith(':')) path += '/'
    return path
  }

  static async readdir(path: string): Promise<string[]>
  static async readdir(
    path: string,
    options: { withFileInfo: true },
  ): Promise<
    {
      name: string
      path: string
      type: string
      size: number
      readable: boolean
      writable: boolean
      created: number
      modified: number
      accessed: number
    }[]
  >
  static async readdir(
    path: string,
    { withFileInfo }: { withFileInfo?: boolean } = {},
  ): Promise<
    | string[]
    | (
        | {
            name: string
            path: string
            type: string
            size: number
            readable: boolean
            writable: boolean
            created: number
            modified: number
            accessed: number
          }
        | { name: string; path: string }
      )[]
  > {
    const files = await readdir(this.getPath(path))
    if (!withFileInfo) return files

    const filesInfo = await Promise.all(
      files.map(async (file) => {
        const filePath = slash(join(path, file))
        const [err, stats] = await doAwait(stat(filePath))
        if (err) {
          return {
            name: file,
            path: filePath,
          }
        }

        return {
          name: file,
          path: filePath,
          type: stats.isFile()
            ? 'file'
            : stats.isDirectory()
              ? 'directory'
              : stats.isSymbolicLink()
                ? 'symlink'
                : 'other',
          size: stats.size,
          readable: !!(stats.mode & 0o444),
          writable: !!(stats.mode & 0o222),
          created: Math.floor(stats.birthtimeMs),
          modified: Math.floor(stats.mtimeMs),
          accessed: Math.floor(stats.atimeMs),
        }
      }),
    )

    return filesInfo
  }

  static readFile(path: string) {
    return readFile(this.getPath(path), 'utf8')
  }
}
