import { Test, TestingModule } from '@nestjs/testing';
import { ExplorerController } from './explorer.controller';
import { ExplorerService } from './explorer.service';

describe('ExplorerController', () => {
  let controller: ExplorerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExplorerController],
      providers: [ExplorerService],
    }).compile();

    controller = module.get<ExplorerController>(ExplorerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
