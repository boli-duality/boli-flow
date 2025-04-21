import { Test, TestingModule } from '@nestjs/testing';
import { TtyGateway } from './tty.gateway';

describe('TtyGateway', () => {
  let gateway: TtyGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtyGateway],
    }).compile();

    gateway = module.get<TtyGateway>(TtyGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
