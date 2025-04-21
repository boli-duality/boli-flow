import { Injectable, StreamableFile } from '@nestjs/common'
import { execSync } from 'node:child_process'
import { decode } from 'iconv-lite'
import { ApiResult } from 'src/common/utils/ApiResult'
import FileUitls from 'src/common/utils/FileUtils'
import { createReadStream } from 'node:fs'
import { extname } from 'node:path'
import mime from 'mime'

const winChaset = 'cp936'

@Injectable()
export class ExplorerService {
  disk() {
    const res = execSync('wmic logicaldisk get deviceid').toString()
    const deviceids = res
      .trim()
      .split('\n')
      .slice(1)
      .map((item) => {
        const res = decode(
          execSync(`wmic logicaldisk where "deviceid='${item.trim()}'" get /format:value`),
          winChaset,
        )
        const entries = res
          .trim()
          .split('\n')
          .map((item) => {
            const entrie = item.trim().split('=') as [PropertyKey, string]
            return entrie
          })

        const disk = Object.fromEntries(entries)
        return disk
      })
    const dir = {
      name: '/',
      children: deviceids,
    }

    return ApiResult.ok(dir)
  }
  async dir(path: string) {
    const files = await FileUitls.readdir(path, { withFileInfo: true })

    const dir = {
      name: path,
      children: files.filter((file) => file.type),
    }

    return ApiResult.ok(dir)
  }

  async file(path: string) {
    const file = await FileUitls.readFile(path)
    return ApiResult.ok(file)
  }

  stream(path: string) {
    const stream = createReadStream(path)
    return new StreamableFile(stream, {
      type: mime.getType(extname(path))!,
    })
  }
}
