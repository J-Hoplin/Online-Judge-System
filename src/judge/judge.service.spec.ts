import { PrismaService } from 'app/prisma/prisma.service';
import { JudgeService } from './judge.service';
import { userSignupGen } from 'test/mock-generator';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'app/prisma/prisma.module';
import { Judge0Module, Judge0Service } from 'judge/judge0';
import { JudgeLibraryMockProvider } from 'test/mock.provider';

describe('JudgeService', () => {
  let service: JudgeService;
  let prisma: PrismaService;

  const user1 = userSignupGen();
  const user2 = userSignupGen();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, Judge0Module],
      providers: [JudgeService],
    })
      .overrideProvider(Judge0Service)
      .useValue(JudgeLibraryMockProvider.useValue)
      .compile();

    service = module.get<JudgeService>(JudgeService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  afterAll(async () => {
    await prisma.deleteAll();
  });

  describe('Test', () => {
    it('Test', () => {
      expect(true);
    });
  });
});
