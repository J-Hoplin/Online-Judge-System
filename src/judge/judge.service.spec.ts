import { PrismaService } from 'app/prisma/prisma.service';
import { JudgeService } from './judge.service';
import { userSignupGen } from 'test/mock-generator';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'app/prisma/prisma.module';
import { Judge0Module, Judge0Service } from 'judge/judge0';
import { JudgeLibraryMockProvider } from 'test/mock.provider';
import {
  ProblemDomain,
  ProblemIssueCommentDomain,
  ProblemIssueDomain,
  SubmissionDomain,
  UserDomain,
} from 'domains';
import { JudgeFilterObject } from './decorator/judge-filter.decorator';
import { PaginateObject } from 'app/decorator';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProblemIssueCommentDto,
  CreateProblemIssueDto,
  SubmitProblemDto,
} from './dto';
import { SubmissionFilterObject } from './decorator/submission-filter.decorator';
import { ProblemStatus } from 'app/type';

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

  let problem3: ProblemDomain;

  let openSubmission: SubmissionDomain;
  let closedSubmission: SubmissionDomain;

  let issue: ProblemIssueDomain;
  let comment: ProblemIssueCommentDomain;

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
        problem: '',
        input: '',
        output: '',
        contributerId: user1.id,
        tags: [],
        isOpen: true,
      },
    });

    await prisma.problemExample.create({
      data: {
        problemId: problem1.id,
        input: 'input',
        output: 'output',
      },
    });

    problem2 = await prisma.problem.create({
      data: {
        title: 'No Example',
        problem: '',
        input: '',
        output: '',
        contributerId: user1.id,
        tags: [],
        isOpen: true,
      },
    });

    problem3 = await prisma.problem.create({
      data: {
        title: 'Closed Problem',
        problem: '',
        input: '',
        output: '',
        contributerId: user1.id,
        tags: [],
        isOpen: false,
      },
    });
  });

  afterAll(async () => {
    await prisma.deleteAll();
  });

  // Class
  describe('JudgeService', () => {
    // Method
    describe('getLanguages()', () => {
      it('should return supported language', async () => {
        //given
        //when
        const language = await service.getLanguages();
        //then
        expect(language).toBeArray();
      });
    });

    describe('listProblem()', () => {
      it('should read problem if not authenticated', async () => {
        //given
        const filter: JudgeFilterObject = {
          Orderby: {},
          Where: {
            title: {
              contains: 'Have',
            },
          },
        };
        const paginate: PaginateObject = {
          skip: 0,
          take: 10,
        };
        //when
        const problems = await service.listProblem(filter, paginate, {});
        // Then
        expect(problems[0]).not.toHaveProperty('isSuccess');
        expect(problems).toEqual(
          expect.arrayContaining([
            expect.not.objectContaining({
              id: problem3.id,
            }),
          ]),
        );
        expect(problems).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: problem1.id,
            }),
          ]),
        );
      });

      it('should read problem if authenticated', async () => {
        //given
        const filter: JudgeFilterObject = {
          Orderby: {},
          Where: {
            title: {
              contains: 'Have',
            },
          },
        };
        const paginate: PaginateObject = {
          skip: 0,
          take: 10,
        };
        //when
        const problems = await service.listProblem(filter, paginate, {
          user: user1,
        });
        // Then
        expect(problems[0]).toHaveProperty('isSuccess');
        expect(problems).toEqual(
          expect.arrayContaining([
            expect.not.objectContaining({
              id: problem3.id,
            }),
          ]),
        );
        expect(problems).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: problem1.id,
            }),
          ]),
        );
      });
    });

    describe('readProblem()', () => {
      it('should allow not authenticated', async () => {
        // given
        const id = problem1['id'];
        // when
        const problem = await service.readProblem(id, undefined);
        // then
        expect(problem.id).toBe(id);
        expect(problem).not.toHaveProperty('isSuccess');
      });

      it('should read problem if authenticated', async () => {
        // given
        const id = problem1['id'];
        // when
        const problem = await service.readProblem(id, {
          user: user1,
        });
        // then
        expect(problem.id).toBe(id);
        expect(problem).toHaveProperty('isSuccess');
      });
    });

    describe('runProblem()', () => {
      it('should run existing problem', async () => {
        //given
        const id = problem1['id'];
        //when
        const result = await service.runProblem(id, {
          code: 'code',
          languageId: 71,
        });
        //then
        expect(result).not.toBeUndefined();
      });

      it('should throw if example not exist', async () => {
        //given
        const id = problem2['id'];
        //when
        try {
          await service.runProblem(id, {
            code: 'code',
            languageId: 71,
          });
        } catch (err) {
          //then
          expect(err).toBeInstanceOf(BadRequestException);
        }
      });
    });

    describe('submitProblem()', () => {
      it('should submit problem. Opened Submission', async () => {
        // given
        const userId = user1['id'];
        const problemId = problem1['id'];
        const dto: SubmitProblemDto = {
          code: '',
          isPublic: true,
          languageId: 0,
          language: '',
        };
        // when
        const result = await service.submitProblem(userId, problemId, dto);
        // then
        expect(result).not.toBeUndefined();
        openSubmission = result;
      });

      it('should submit problem. Closed Submission', async () => {
        const userId = user1['id'];
        const problemId = problem1['id'];
        const dto: SubmitProblemDto = {
          code: '',
          isPublic: false,
          languageId: 0,
          language: '',
        };
        // when
        const result = await service.submitProblem(userId, problemId, dto);
        // then
        expect(result).not.toBeUndefined();
        closedSubmission = result;
      });

      it('should throw if example not exist', async () => {
        //given
        const userId = user2['id'];
        const problemId = problem2['id'];
        const dto: SubmitProblemDto = {
          code: '',
          isPublic: false,
          languageId: 0,
          language: '',
        };
        //when
        try {
          await service.submitProblem(userId, problemId, dto);
        } catch (err) {
          // then
          expect(err).toBeInstanceOf(BadRequestException);
        }
      });
    });

    describe('listUserSubmissions()', () => {
      it('should list user submissions', async () => {
        //given
        const userId = user1['id'];
        const problemId = problem1['id'];

        //when
        const submissions = await service.listUserSubmissions(
          userId,
          problemId,
          {} as SubmissionFilterObject,
          {} as PaginateObject,
        );

        //then
        expect(submissions.data).toBeArray();
      });
    });

    describe('listPublicSubmission()', () => {
      it('should return public submission', async () => {
        //given
        const problemId = problem1['id'];
        //when
        const submissions = await service.listPublicSubmission(
          problemId,
          {} as SubmissionFilterObject,
          {} as PaginateObject,
        );

        //then
        expect(submissions).toHaveProperty('aggregate');
        expect(submissions).toHaveProperty('data');
        expect(submissions.data).toEqual(
          expect.arrayContaining([
            expect.not.objectContaining({
              id: closedSubmission.id,
            }),
          ]),
        );
      });
    });

    describe('readPublicSubmission()', () => {
      it('should return public submission', async () => {
        //given
        const problemId = problem1['id'];
        const openedSubmissionId = openSubmission['id'];
        //when
        const submission = await service.readPublicSubmission(
          problemId,
          openedSubmissionId,
        );
        //then
        expect(submission).not.toBeUndefined();
      });

      it('should throw if submission is not public', async () => {
        //given
        const problemId = problem1['id'];
        const closedSubmissionId = closedSubmission['id'];
        //when
        try {
          await service.readPublicSubmission(problemId, closedSubmissionId);
        } catch (err) {
          //then
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });

    describe('readUserSubmission()', () => {
      it('should read user submission', async () => {
        //given
        const userId = user1['id'];
        const problemId = problem1['id'];
        const submissionId = openSubmission['id'];
        //when
        const submission = await service.readUserSubmission(
          userId,
          problemId,
          submissionId,
        );
        //then
        expect(submission).not.toBeUndefined();
      });

      it("should throw if submission is not user's", async () => {
        //given
        const userId = user2['id'];
        const problemId = problem1['id'];
        const submissionId = openSubmission['id'];
        //when
        try {
          await service.readUserSubmission(userId, problemId, submissionId);
        } catch (err) {
          //then
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });

    describe('updateUserSubmission()', () => {
      it('should update submission', async () => {
        const userId = user1['id'];
        const problemId = problem1['id'];
        const submissionId = openSubmission['id'];

        const submission = await service.updateUserSubmission(
          userId,
          problemId,
          submissionId,
          {
            isPublic: true,
          },
        );

        expect(submission).not.toBeUndefined();
      });

      it('should throw if submission not exist', async () => {
        const userId = user2['id'];
        const problemId = problem1['id'];
        const submissionId = 999999;

        try {
          await service.updateUserSubmission(userId, problemId, submissionId, {
            isPublic: true,
          });
        } catch (err) {
          expect(err).toBeInstanceOf(ForbiddenException);
        }
      });

      it('should throw if other tries to modify submission', async () => {
        const userId = user2['id'];
        const problemId = problem1['id'];
        const submissionId = openSubmission['id'];

        try {
          await service.updateUserSubmission(userId, problemId, submissionId, {
            isPublic: true,
          });
        } catch (err) {
          expect(err).toBeInstanceOf(ForbiddenException);
        }
      });
    });

    describe('createProblemIssue()', () => {
      it('should create problem issue', async () => {
        const userId = user1['id'];
        const problemId = problem1['id'];

        issue = await service.createProblemIssue(
          {
            title: 'Issue',
            content: 'Issue Content',
          },
          userId,
          problemId,
        );

        expect(issue).not.toBeUndefined();
      });
    });

    describe('listProblemIssue()', () => {
      it('should list issue', async () => {
        const problemId = problem1['id'];

        const issueList = await service.listProblemIssue(
          problemId,
          {} as PaginateObject,
        );

        expect(issueList).toBeArray();
      });
    });

    describe('readProblemIssue()', () => {
      it('should read problem issue', async () => {
        const problemId = problem1['id'];
        const issueId = issue['id'];

        const readIssue = await service.readProblemIssue(problemId, issueId);

        expect(readIssue).not.toBeUndefined();
      });

      it('should throw if issue not exist', async () => {
        const problemId = problem1['id'];

        try {
          await service.readProblemIssue(problemId, 99999999);
        } catch (err) {
          expect(err).toBeInstanceOf(ForbiddenException);
        }
      });
    });

    describe('updateProblemIssue()', () => {
      it('should update problem issue', async () => {
        const problemId = problem1['id'];
        const issueId = issue['id'];
        const userId = user1['id'];
        const dto: CreateProblemIssueDto = {
          title: 'Updated Title',
          content: 'Updated Content',
        };

        const updatedIssue = await service.updateProblemIssue(
          userId,
          problemId,
          issueId,
          dto,
        );

        expect(updatedIssue).not.toBeUndefined();
      });

      it('should throw if other tries to modify issue', async () => {
        const problemId = problem1['id'];
        const issueId = issue['id'];
        const userId = user2['id'];
        const dto: CreateProblemIssueDto = {
          title: 'Updated Title',
          content: 'Updated Content',
        };

        try {
          await service.updateProblemIssue(userId, problemId, issueId, dto);
        } catch (err) {
          expect(err).toBeInstanceOf(ForbiddenException);
        }
      });
    });

    describe('createProblemIssueComment()', () => {
      it('should create issue comment', async () => {
        const problemId = problem1['id'];
        const issueId = issue['id'];
        const user1Id = user1['id'];
        const dto: CreateProblemIssueCommentDto = {
          content: 'content',
        };

        comment = await service.createProblemIssueComment(
          user1Id,
          problemId,
          issueId,
          dto,
        );

        expect(comment).not.toBeUndefined();
      });

      it('should throw if issue not found', async () => {
        const problemId = problem1['id'];
        const issueId = issue['id'];
        const user1Id = user1['id'];
        const dto: CreateProblemIssueCommentDto = {
          content: 'content',
        };

        try {
          await service.createProblemIssueComment(
            user1Id,
            problemId,
            issueId,
            dto,
          );
        } catch (err) {
          expect(err).toBeInstanceOf(ForbiddenException);
        }
      });
    });

    describe('updateProblemIssueComment()', () => {
      it('should update comment', async () => {
        const problemId = problem1['id'];
        const issueId = issue['id'];
        const user1Id = user1['id'];
        const dto: CreateProblemIssueCommentDto = {
          content: 'content',
        };

        comment = await service.updateProblemIssueComment(
          user1Id,
          problemId,
          issueId,
          comment['id'],
          dto,
        );

        expect(comment).not.toBeUndefined();
      });

      it("should throw if comment's information is invalid", async () => {
        /**
         * Invalid information includes
         *
         * - comment id
         * - user id
         * - issue id
         * - problem id
         */

        const problemId = problem1['id'];
        const issueId = 99999;
        const user1Id = '99999';
        const dto: CreateProblemIssueCommentDto = {
          content: 'content',
        };

        try {
          await service.updateProblemIssueComment(
            user1Id,
            problemId,
            issueId,
            comment['id'],
            dto,
          );
        } catch (err) {
          expect(err).toBeInstanceOf(ForbiddenException);
        }
      });
    });

    describe('deleteProblemIssueComment()', () => {
      it("should throw if comment is not user's", async () => {
        const problemId = problem1['id'];
        const issueId = issue['id'];
        const userId = user2['id'];
        const commentId = comment['id'];

        try {
          await service.deleteProblemIssueComment(
            userId,
            problemId,
            issueId,
            commentId,
          );
        } catch (err) {
          expect(err).toBeInstanceOf(ForbiddenException);
        }
      });

      it('should delete comment', async () => {
        const problemId = problem1['id'];
        const issueId = issue['id'];
        const userId = user1['id'];
        const commentId = comment['id'];

        await service.deleteProblemIssueComment(
          userId,
          problemId,
          issueId,
          commentId,
        );
      });
    });

    describe('deleteProblemIssue()', () => {
      it('should throw if other tries to delete', async () => {
        const problemId = problem1['id'];
        const issueId = issue['id'];
        const userId = user2['id'];

        try {
          await service.deleteProblemIssue(userId, problemId, issueId);
        } catch (err) {
          expect(err).toBeInstanceOf(ForbiddenException);
        }
      });

      it('should delete issue', async () => {
        const problemId = problem1['id'];
        const issueId = issue['id'];
        const userId = user1['id'];

        const result = await service.deleteProblemIssue(
          userId,
          problemId,
          issueId,
        );

        expect(result).not.toBeUndefined();
      });
    });
  });
});
