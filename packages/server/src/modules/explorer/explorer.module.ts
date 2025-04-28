import { Module } from '@nestjs/common'
import { ExplorerService } from './explorer.service.js'
import { ExplorerController } from './explorer.controller.js'

@Module({
  controllers: [ExplorerController],
  providers: [ExplorerService],
})
export class ExplorerModule {}
