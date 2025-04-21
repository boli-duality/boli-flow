import { Module } from '@nestjs/common';
import { ExplorerService } from './explorer.service';
import { ExplorerController } from './explorer.controller';

@Module({
  controllers: [ExplorerController],
  providers: [ExplorerService],
})
export class ExplorerModule {}
