import { Test, TestingModule } from '@nestjs/testing';
import { ContributerService } from './contributer.service';
import { PrismaModule } from 'app/prisma/prisma.module';
import { PrismaService } from 'app/prisma/prisma.service';
import { ProblemDomain, ProblemExampleDomain, UserDomain } from 'domains';
import { userSignupGen } from 'test/mock-generator';
import { ForbiddenException } from '@nestjs/common';

describe('ContributerService', () => {
  let service: ContributerService;
  let prisma: PrismaService;

  // Mock users
  let user1: UserDomain;
  const user1Signup = userSignupGen(true);

  let user2: UserDomain;
  const user2Signup = userSignupGen(true);

  // Mock problem
  let problem1: ProblemDomain;
  let example1: ProblemExampleDomain;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ContributerService],
    }).compile();

    // Initialize module for prisma service
    module.init();

    service = module.get<ContributerService>(ContributerService);
    prisma = module.get<PrismaService>(PrismaService);

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
  });

  afterAll(async () => {
    await prisma.deleteAll();
  });

  describe('createProblem() & createExample()', () => {
    it('should create new problem', async () => {
      // Create problem
      problem1 = await service.createProblem(user1.id);
      expect(problem1).toBeTruthy();
    });
    it('should create new example of problem1', async () => {
      // Create example of problem1
      example1 = await service.createExmaple(user1.id, problem1.id);
      expect(example1).toBeTruthy();
    });
  });

  describe('updateProblem() & updateExample()', () => {
    it('should update problem', async () => {
      problem1 = await service.updateProblem(user1.id, problem1.id, {
        title: 'Title',
        problem: 'Problem',
        input: 'Input',
        output: 'Output',
        timeLimit: 10,
        memoryLimit: 10,
        tags: ['string'],
      });
      expect(problem1.title).toBe('Title');
    });

    it('should update example', async () => {
      example1 = await service.updateExample(
        user1.id,
        problem1.id,
        example1.id,
        {
          input: '2 3 4',
          output: '5 6 7',
          isPublic: true,
        },
      );
    });
  });

  describe('listProblem() & readProblem()', () => {
    it('should return 1 problem', async () => {
      const list = await service.listProblem(user1.id, undefined, {
        skip: 0,
        take: 10,
      });
      expect(list.length).toBe(1);
    });

    it('should return 0 problem', async () => {
      const list = await service.listProblem(user2.id, undefined, {
        skip: 0,
        take: 10,
      });
      expect(list.length).toBe(0);
    });

    it('should return problem detail', async () => {
      const problem = await service.readProblem(user1.id, problem1.id);
      expect(problem).toBeTruthy();
    });

    it('should throw if problem not found', async () => {
      try {
        await service.readProblem(user2.id, problem1.id);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('deleteProblem() & deleteExample()', () => {
    it('should throw if other contributer tries to remove example', async () => {
      try {
        await service.deleteExample(user2.id, problem1.id, example1.id);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should remove example', async () => {
      const result = await service.deleteExample(
        user1.id,
        problem1.id,
        example1.id,
      );
      expect(result).toBeTruthy();
    });

    it('should return 0 example', async () => {
      const problem = await service.readProblem(user1.id, problem1.id);
      expect(problem.examples.length).toBe(0);
    });

    it('should throw if other contributer tries to remove problem', async () => {
      try {
        await service.deleteProblem(user2.id, problem1.id);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should remove problem', async () => {
      const result = await service.deleteProblem(user1.id, problem1.id);

      expect(result).toBeTruthy();
    });

    it('should return 0 length', async () => {
      const list = await service.listProblem(user1.id, undefined, {
        skip: 0,
        take: 10,
      });
      expect(list.length).toBe(0);
    });
  });
});
