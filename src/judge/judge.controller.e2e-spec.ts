import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app/app.module';
import * as request from 'supertest';
import { userSignupGen } from 'test/mock-generator';
import { BearerTokenHeader } from 'test/test-utils';

describe('/judge Judge Controller', () => {
  let app: INestApplication;

  // Mock User
  const user1 = userSignupGen();
  let user1Token: string;
  const user2 = userSignupGen();
  let user2Token: string;
  let adminToken: string;
  let problemId: number;
  let exampleId: number;
  let submissionId: number;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
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
      return request(app.getHttpServer()).get('/judge').expect(401);
    });
    it('should get language list', async () => {
      return request(app.getHttpServer())
        .get('/judge/languages')
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  describe('/ GET', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer()).get('/judge').expect(401);
    });
    it('should get problem list', async () => {
      return request(app.getHttpServer())
        .get('/judge')
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  describe('/:pid GET', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer())
        .get(`/judge/${problemId}`)
        .expect(401);
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
        .expect(403);
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
        .expect(403);
    });
  });
});
