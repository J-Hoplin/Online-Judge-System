import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InitializeAdmin } from 'app/admin-init';
import { AppModule } from 'app/app.module';
import { PrismaService } from 'app/prisma/prisma.service';
import { userSignupGen } from 'test/mock-generator';
import * as request from 'supertest';
import { BearerTokenHeader } from 'test/test-utils';
import { QueueService } from 'queue/queue/strategy';
import { QueueLibraryMockProvider } from 'test/mock.provider';

describe('/judge/contributer', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const user1 = userSignupGen();
  let user1Token: string;
  const user2 = userSignupGen();
  let user2Token: string;
  let user2Id: string;
  let adminToken: string;
  let problemId: string;
  let exampleId: number;
  //endpoints

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QueueService)
      .useValue(QueueLibraryMockProvider.useValue)
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

  // Create User
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

    it('should get user2 id', async () => {
      const getProfile = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(200);
      user2Id = getProfile.body['id'];
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

    it('should change user2 as contributer', () => {
      return request(app.getHttpServer())
        .patch('/user/admin/role')
        .set('Authorization', BearerTokenHeader(adminToken))
        .send({
          role: 'Contributer',
          targetId: user2Id,
        })
        .expect(200);
    });
  });

  // Test

  describe('/problems GET', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer())
        .get('/judge/contribute/problems')
        .expect(401);
    });
    it('should throw if unauthorized', async () => {
      return request(app.getHttpServer())
        .get('/judge/contribute/problems')
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(403);
    });
    it('should get contributer problem list', () => {
      return request(app.getHttpServer())
        .get('/judge/contribute/problems')
        .set('Authorization', BearerTokenHeader(adminToken))
        .expect(200);
    });
  });

  describe('/problems POST', () => {
    it('should throw if unauthentciated', async () => {
      return request(app.getHttpServer())
        .post('/judge/contribute/problems')
        .expect(401);
    });
    it('should throw if unauthorized', () => {
      return request(app.getHttpServer())
        .post('/judge/contribute/problems')
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(403);
    });
    it('should create new problem', async () => {
      const response = await request(app.getHttpServer())
        .post('/judge/contribute/problems')
        .set('Authorization', BearerTokenHeader(adminToken))
        .expect(201);
      problemId = response.body['id'];
    });
  });

  describe('/problems/:pid GET', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer())
        .get(`/judge/contribute/problems/${problemId}`)
        .expect(401);
    });
    it('should throw if unauthorized', async () => {
      return request(app.getHttpServer())
        .get(`/judge/contribute/problems/${problemId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(403);
    });
    it('should throw if others contributer tries to access problem', () => {
      return request(app.getHttpServer())
        .get(`/judge/contribute/problems/${problemId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(403);
    });
    it('should read problem', () => {
      return request(app.getHttpServer())
        .get(`/judge/contribute/problems/${problemId}`)
        .set('Authorization', BearerTokenHeader(adminToken))
        .expect(200);
    });
  });

  describe('/problems/:pid PATCH', () => {
    it('should throw if unauthenticated', async () => {
      return request(app.getHttpServer())
        .patch(`/judge/contribute/problems/${problemId}`)
        .expect(401);
    });
    it('should throw if unauthorized', () => {
      return request(app.getHttpServer())
        .patch(`/judge/contribute/problems/${problemId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(403);
    });
    it('should throw if other contributer tries to modify problem', () => {
      return request(app.getHttpServer())
        .patch(`/judge/contribute/problems/${problemId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(403);
    });
    it('should patch problem', () => {
      return request(app.getHttpServer())
        .patch(`/judge/contribute/problems/${problemId}`)
        .set('Authorization', BearerTokenHeader(adminToken))
        .send({
          title: 'string',
          problem: 'string',
          input: 'string',
          output: 'string',
          timeLimit: 0,
          memoryLimit: 0,
          tags: ['sort', 'bfs', 'math'],
          isOpen: true,
        })
        .expect(200);
    });
  });

  describe('/problmes/:pid/examples POST', () => {
    it('should throw if unauthenticated', () => {
      return request(app.getHttpServer())
        .post(`/judge/contribute/problems/${problemId}/examples`)
        .expect(401);
    });

    it('should throw if unauthorized', () => {
      return request(app.getHttpServer())
        .post(`/judge/contribute/problems/${problemId}/examples`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(403);
    });

    it('should throw if other contributer tries to create example', () => {
      return request(app.getHttpServer())
        .post(`/judge/contribute/problems/${problemId}/examples`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(403);
    });

    it('should create example for question', async () => {
      const response = await request(app.getHttpServer())
        .post(`/judge/contribute/problems/${problemId}/examples`)
        .set(`Authorization`, BearerTokenHeader(adminToken))
        .send({
          input: 'string',
          output: 'string',
          isPublic: true,
        })
        .expect(201);
      exampleId = response.body['id'];
    });
  });

  describe('/problems/:pid/examples/:eid PATCH', () => {
    it('should throw if unauthenticated', () => {
      return request(app.getHttpServer())
        .patch(`/judge/contribute/problems/${problemId}/examples/${exampleId}`)
        .expect(401);
    });

    it('should throw if unauthorized', () => {
      return request(app.getHttpServer())
        .patch(`/judge/contribute/problems/${problemId}/examples/${exampleId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(403);
    });

    it('should throw if other contributer tries to modify exmaple', () => {
      return request(app.getHttpServer())
        .patch(`/judge/contribute/problems/${problemId}/examples/${exampleId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(403);
    });

    it('should modify example', () => {
      return request(app.getHttpServer())
        .patch(`/judge/contribute/problems/${problemId}/examples/${exampleId}`)
        .set('Authorization', BearerTokenHeader(adminToken))
        .expect(200);
    });
  });

  describe('/problem/:pid/examples/:eid DELETE', () => {
    it('should throw if unauthenticated', () => {
      return request(app.getHttpServer())
        .delete(`/judge/contribute/problems/${problemId}/examples/${exampleId}`)
        .expect(401);
    });

    it('should throw if unauthorized', () => {
      return request(app.getHttpServer())
        .delete(`/judge/contribute/problems/${problemId}/examples/${exampleId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(403);
    });

    it('should throw if other contributer tries to modify', () => {
      return request(app.getHttpServer())
        .delete(`/judge/contribute/problems/${problemId}/examples/${exampleId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(403);
    });

    it('should throw if other contributer tries to modify', () => {
      return request(app.getHttpServer())
        .delete(`/judge/contribute/problems/${problemId}/examples/${exampleId}`)
        .set('Authorization', BearerTokenHeader(adminToken))
        .expect(200);
    });
  });

  describe('/problem/:pid DELETE', () => {
    it('should throw if unauthenticated', () => {
      return request(app.getHttpServer())
        .delete(`/judge/contribute/problems/${problemId}`)
        .expect(401);
    });

    it('should throw if unauthorized', () => {
      return request(app.getHttpServer())
        .delete(`/judge/contribute/problems/${problemId}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(403);
    });

    it('should throw if other contributer tries to modify', () => {
      return request(app.getHttpServer())
        .delete(`/judge/contribute/problems/${problemId}`)
        .set('Authorization', BearerTokenHeader(user2Token))
        .expect(403);
    });

    it('should throw if other contributer tries to modify', () => {
      return request(app.getHttpServer())
        .delete(`/judge/contribute/problems/${problemId}`)
        .set('Authorization', BearerTokenHeader(adminToken))
        .expect(200);
    });
  });
});
