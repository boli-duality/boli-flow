import { Controller, Get, Param } from '@nestjs/common'
import { ExplorerService } from './explorer.service'

@Controller('explorer')
export class ExplorerController {
  constructor(private readonly explorerService: ExplorerService) {}

  @Get('dir')
  disk() {
    return this.explorerService.disk()
  }

  @Get('dir/:path')
  dir(@Param('path') path: string) {
    return this.explorerService.dir(path)
  }

  @Get('file/:path')
  file(@Param('path') path: string) {
    return this.explorerService.file(path)
  }

  @Get('stream/:path')
  stream(@Param('path') path: string) {
    return this.explorerService.stream(path)
  }
}
