import { Module } from '@nestjs/common'
import { TtyGateway } from './modules/tty/tty.gateway.js'
import { ExplorerModule } from './modules/explorer/explorer.module.js'

@Module({
  imports: [ExplorerModule],
  providers: [TtyGateway],
})
export class AppModule {}
