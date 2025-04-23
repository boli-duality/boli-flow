import { Module } from '@nestjs/common'
import { TtyGateway } from './modules/tty/tty.gateway'
import { ExplorerModule } from './modules/explorer/explorer.module'

@Module({
  imports: [ExplorerModule],
  providers: [TtyGateway],
})
export class AppModule {}
