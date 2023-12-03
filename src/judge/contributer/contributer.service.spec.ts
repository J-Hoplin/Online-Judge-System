import { Test, TestingModule } from '@nestjs/testing';
import { ContributerService } from './contributer.service';

describe('ContributerService', () => {
  let service: ContributerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContributerService],
    }).compile();

    service = module.get<ContributerService>(ContributerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
