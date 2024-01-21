import { PrismaService } from 'app/prisma/prisma.service';
import { JudgeService } from './judge.service';
import { userSignupGen } from 'test/mock-generator';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'app/prisma/prisma.module';
import { Judge0Module, Judge0Service } from 'judge/judge0';
import { JudgeLibraryMockProvider } from 'test/mock.provider';
import { ProblemDomain, UserDomain } from 'domains';

describe('JudgeService', () => {
  let service: JudgeService;
  let prisma: PrismaService;

  let user1: UserDomain;
  const user1Signup = userSignupGen(true);

  let user2: UserDomain;
  const user2Signup = userSignupGen(true);

  // Opened Problem
  let problem1: ProblemDomain;

  // Closed Problem
  let problem2: ProblemDomain;

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

    await module.init();

    user1 = await prisma.user.create({
      data: {
        ...user1Signup,
      },
    });

    user2 = await prisma.user.create({
      data: {
        ...user2Signup,
      },
    });

    problem1 = await prisma.problem.create({
      data: {
        title: 'Have Example',
        contributerId: user1.id,
        tags: [],
        isOpen: true,
      },
    });

    problem2 = await prisma.problem.create({
      data: {
        title: 'No Problem',
        contributerId: user1.id,
        tags: [],
        isOpen: true,
      },
    });
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
