import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InitializeAdmin } from 'app/admin-init';
import { AppModule } from 'app/app.module';
import { PrismaService } from 'app/prisma/prisma.service';
import { Judge0Service } from 'judge/judge0';
import * as request from 'supertest';
import { userSignupGen } from 'test/mock-generator';
import { JudgeLibraryMockProvider } from 'test/mock.provider';
import { BearerTokenHeader } from 'test/test-utils';

describe('/judge Judge Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Mock User
  const user1 = userSignupGen();
  let user1Token: string;
  const user2 = userSignupGen();
  let user2Token: string;
  let adminToken: string;
  let problemId: number;
  let exampleId: number;
  let submissionId: number;
  let issueId: number; // owner: user1
  let issue2Id: number; // owner: user2
  let commentId: number; // owner: user1

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Judge0Service)
      .useValue(JudgeLibraryMockProvider.useValue)
      .compile();

    app = testModule.createNestApplication();
    prisma = testModule.get<PrismaService>(PrismaService);

    await InitializeAdmin(app);
    await app.init();
  });

  afterAll(async () => {
    await prisma.deleteAll();
    await app.close();
  });

  // Create user1
  describe('/signup POST', () => {
    it('should create user1', async () => {
      const signup = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user1);
      expect(signup.statusCode).toBe(200);
      expect(signup.body).not.toBeUndefined();
      user1Token = signup.body['accessToken'];
    });

    it('should create user2', async () => {
      const signup = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user2);

      expect(signup.statusCode).toBe(200);
      expect(signup.body).not.toBeUndefined();
      user2Token = signup.body['accessToken'];
    });

    it('should signup admin', async () => {
      const signin = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          password: process.env.ADMIN_PW,
          email: process.env.ADMIN_EMAIL,
        });

      expect(signin.statusCode).toBe(200);
      expect(signin.body).not.toBeUndefined();
      adminToken = signin.body['accessToken'];
    });
    it('should generate problem', async () => {
      const newProblem = await request(app.getHttpServer())
        .post('/judge/contribute/problems')
        .set('Authorization', BearerTokenHeader(adminToken));
      expect(newProblem.statusCode).toBe(201);
      problemId = newProblem.body['id'];
    });

    it('should set problem public', async () => {
      return request(app.getHttpServer())
        .patch(`/judge/contribute/problems/${problemId}`)
        .set('Authorization', BearerTokenHeader(adminToken))
        .send({
          isOpen: true,
        })
        .expect(200);
    });

    it('should generate problme example', async () => {
      const example = await request(app.getHttpServer())
        .post(`/judge/contribute/problems/${problemId}/examples`)
        .set('Authorization', BearerTokenHeader(adminToken));
      expect(example.statusCode).toBe(201);
      exampleId = example.body['id'];
    });

    it('should patch problem example', async () => {
      await request(app.getHttpServer())
        .patch(`/judge/contribute/problems/${problemId}/examples/${exampleId}`)
        .set('Authorization', BearerTokenHeader(adminToken))
        .send({
          input: '',
          output: 'hello world',
          isPublic: true,
        })
        .expect(200);
    });
  });

  // Test
  describe('/languages GET', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer()).get('/judge/languages').expect(401);
    });
    it('should get language list', async () => {
      return request(app.getHttpServer())
        .get('/judge/languages')
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  describe('/ GET', () => {
    it('should allow unauthenticated', async () => {
      return request(app.getHttpServer()).get('/judge').expect(200);
    });
    it('should get problem list', async () => {
      return request(app.getHttpServer())
        .get('/judge')
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  describe('/:pid GET', () => {
    it('should allow unauthenticated', async () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}`)
        .expect(200);
    });
    it('should get problem info', async () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  describe('/:pid/run POST', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer())
        .post(`/judge/${problemId}/run`)
        .expect(401);
    });

    it('should run code', async () => {
      return request(app.getHttpServer())
        .post(`/judge/${problemId}/run`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          code: "print('hello world')",
          languageId: 71, // Python3
        })
        .expect(200);
    });
  });

  describe('/:pid/submissions generate submission POST', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer())
        .post(`/judge/${problemId}/submit`)
        .expect(401);
    });

    it('should generate submission', async () => {
      /**
       * /submit will be deprecated and change to /submissions
       *
       */
      const response = await request(app.getHttpServer())
        .post(`/judge/${problemId}/submissions`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          code: "print('hello world')",
          isPublic: true,
          languageId: 71,
          language: 'Python3',
        });
      expect(response.statusCode).toBe(200);
      submissionId = response.body['id'];
    });
  });

  describe('/:pid/submissions GET', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/submissions`)
        .expect(401);
    });

    it('should get user submission', () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/submissions`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  describe('/:pid/submissions/:sid GET', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/submissions/${submissionId}`)
        .expect(401);
    });

    it('should throw if other try to read submission', async () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/submissions/${submissionId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(404);
    });

    it('should read submission', async () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/submissions/${submissionId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  describe('/:pid/submissions/public', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/submissions/public`)
        .expect(401);
    });
    it('should get public submision of problem', async () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/submissions/public`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  describe('/:pid/submissions/public/:sid GET', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/submissions/public/${submissionId}`)
        .expect(401);
    });

    it('should read user submission', () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/submissions/public/${submissionId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });

    it('should read even if other user try to read', () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/submissions/public/${submissionId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(200);
    });
  });

  describe('/:pid/submissions/:sid PATCH', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/submissions/${submissionId}`)
        .expect(401);
    });

    it('should throw if other tries to modify public', () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/submissions/${submissionId}`)
        .send({
          isPublic: true,
        })
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(403);
    });

    it('should modify public', () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/submissions/${submissionId}`)
        .send({
          isPublic: false, // Change submission's isPublic: false
        })
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  describe('/:pid/submissions/public/:sid GET', () => {
    it('should throw if submission is not public', () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/submissions/public/${submissionId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(404);
    });
  });

  describe('/:pid/issues GET', () => {
    it('should throw if not authenticated', () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/issues`)
        .expect(401);
    });

    it('should list problem issues', () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}/issues`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  describe('/:pid/issues POST', () => {
    it('should throw if not authenticated', () => {
      return request(app.getHttpServer())
        .post(`/judge/${problemId}/issues`)
        .expect(401);
    });
    it('should throw if problem is not found', () => {
      return request(app.getHttpServer())
        .post(`/judge/1000000/issues`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(404);
    });
    it('should create new Issue', async () => {
      const response = await request(app.getHttpServer())
        .post(`/judge/${problemId}/issues`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          title: 'New Issue',
          content: 'New Issue Content',
        });
      expect(response.statusCode).toBe(200);
      const response2 = await request(app.getHttpServer())
        .post(`/judge/${problemId}/issues`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .send({
          title: 'New Issue2',
          content: 'New Issue2 Content',
        });
      expect(response2.statusCode).toBe(200);
      issueId = response.body['id'];
      issue2Id = response2.body['id'];
    });
  });

  describe('/:pid/issues/:iid PATCH', () => {
    it('should throw if not authenticated', () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/issues/${issueId}`)
        .expect(401);
    });
    it('should throw if problem not found', () => {
      return request(app.getHttpServer())
        .patch(`/judge/90909/issues/${issueId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(404);
    });
    it('should throw if issue not found', () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/issues/909`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          title: 'Updated Issue',
          content: 'Updated Issue Content',
        })
        .expect(403);
    });
    it('should throw if other tries to modify issue', () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/issues/${issueId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .send({
          title: 'Updated Issue',
          content: 'Updated Issue Content',
        })
        .expect(403);
    });
    it('should update issue', () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/issues/${issueId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          title: 'Updated Issue',
          content: 'Updated Issue Content',
        })
        .expect(200);
    });
  });

  describe('/:pid/issues/:iid DELETE', () => {
    it('should throw if not authenticated', () => {
      return request(app.getHttpServer())
        .delete(`/judge/${problemId}/issues/${issueId}`)
        .expect(401);
    });

    it('should throw if problem not found', () => {
      return request(app.getHttpServer())
        .delete(`/judge/9090/issues/${issueId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(404);
    });

    it('should throw if issue not found', () => {
      return request(app.getHttpServer())
        .delete(`/judge/${problemId}/issues/9090`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(403);
    });

    it('should throw if other tries to delete issue', () => {
      return request(app.getHttpServer())
        .delete(`/judge/${problemId}/issues/${issueId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(403);
    });

    it('should remove issue', () => {
      return request(app.getHttpServer())
        .delete(`/judge/${problemId}/issues/${issueId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  // Issue1 Removed

  describe('/:pid/issues/:iid/comments POST', () => {
    it('should throw if not authenticated', () => {
      return request(app.getHttpServer())
        .post(`/judge/${problemId}/issues/${issue2Id}/comments`)
        .expect(401);
    });

    it('should throw if problem not exist', () => {
      return request(app.getHttpServer())
        .post(`/judge/909/issues/${issue2Id}/comments`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(404);
    });

    it('should throw if issue not found', () => {
      return request(app.getHttpServer())
        .post(`/judge/${problemId}/issues/909090/comments`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          content: 'Comment content',
        })
        .expect(403);
    });

    it('should create new commnet', async () => {
      const response = await request(app.getHttpServer())
        .post(`/judge/${problemId}/issues/${issue2Id}/comments`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          content: 'Comment content',
        });
      expect(response.statusCode).toBe(200);
      commentId = response.body['id'];
    });
  });

  describe('/:pid/issues/:iid/comments/:cid PATCH', () => {
    it('should throw if not authenticated', () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/issues/${issue2Id}/comments/${commentId}`)
        .expect(401);
    });
    it('should throw if problem not found', () => {
      return request(app.getHttpServer())
        .patch(`/judge/909009/issues/${issue2Id}/comments/${commentId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(404);
    });
    it('should throw if issue not found', () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/issues/909009/comments/${commentId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          content: 'Modified Comment',
        })
        .expect(403);
    });
    it('should throw if comment not found', () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/issues/${issue2Id}/comments/9090`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          content: 'Modified Comment',
        })
        .expect(403);
    });
    it('should throw if other tries to modify comment', () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/issues/${issue2Id}/comments/${commentId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .send({
          content: 'Modified Comment',
        })
        .expect(403);
    });
    it('should update comment', () => {
      return request(app.getHttpServer())
        .patch(`/judge/${problemId}/issues/${issue2Id}/comments/${commentId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          content: 'Modified Comment',
        })
        .expect(200);
    });
  });

  describe('/:pid/issues/:iid/comments/:cid DELETE', () => {
    it('should throw if not authenticated', () => {
      return request(app.getHttpServer())
        .delete(`/judge/${problemId}/issues/${issue2Id}/comments/${commentId}`)
        .expect(401);
    });
    it('should throw if problem not found', () => {
      return request(app.getHttpServer())
        .delete(`/judge/909009/issues/${issue2Id}/comments/${commentId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(404);
    });
    it('should throw if issue not found', () => {
      return request(app.getHttpServer())
        .delete(`/judge/${problemId}/issues/909009/comments/${commentId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          content: 'Modified Comment',
        })
        .expect(403);
    });
    it('should throw if comment not found', () => {
      return request(app.getHttpServer())
        .delete(`/judge/${problemId}/issues/${issue2Id}/comments/9090`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          content: 'Modified Comment',
        })
        .expect(403);
    });
    it('should throw if other tries to modify comment', () => {
      return request(app.getHttpServer())
        .delete(`/judge/${problemId}/issues/${issue2Id}/comments/${commentId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .send({
          content: 'Modified Comment',
        })
        .expect(403);
    });
    it('should update comment', () => {
      return request(app.getHttpServer())
        .delete(`/judge/${problemId}/issues/${issue2Id}/comments/${commentId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          content: 'Modified Comment',
        })
        .expect(200);
    });
  });
});
