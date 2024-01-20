import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InitializeAdmin } from 'app/admin-init';
import { AppModule } from 'app/app.module';
import { PrismaService } from 'app/prisma/prisma.service';
import { userSignupGen } from 'test/mock-generator';
import * as request from 'supertest';
import { BearerTokenHeader } from 'test/test-utils';

describe('/judge/contributer', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const user1 = userSignupGen();
  let user1Token: string;
  const user2 = userSignupGen();
  let user2Token: string;
  let adminToken: string;
  let problemId: string;
  //endpoints

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
  });

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
    it('should throw if others tries to access problem', () => {
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
});
