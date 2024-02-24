import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InitializeAdmin } from 'app/admin-init';
import { AppModule } from 'app/app.module';
import { userSignupGen } from 'test/mock-generator';
import * as request from 'supertest';
import { BearerTokenHeader } from 'test/test-utils';
import { User } from '@prisma/client';
import { PrismaService } from 'app/prisma/prisma.service';

describe('/user User Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // MockUser
  const user1 = userSignupGen();
  let user1Token: string;
  let user1Obj: User;
  let adminToken: string;
  let adminObj: User;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Initialize nest application
    app = testModule.createNestApplication();
    prisma = testModule.get<PrismaService>(PrismaService);

    await InitializeAdmin(app);
    await app.init();
  });

  afterAll(async () => {
    await prisma.deleteAll();
    await app.close();
  });

  // Pre-test
  describe('/auth/signup POST', () => {
    it('should create user1', async () => {
      const signup = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user1);
      expect(signup.statusCode).toBe(200);
      expect(signup.body).not.toBeUndefined();
      user1Token = signup.body['accessToken'];
    });
  });

  describe('/auth/signin POST', () => {
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

  // Test
  describe('/profile GET', () => {
    it('should throw if anonymous user', () => {
      return request(app.getHttpServer()).get('/user/profile').expect(401);
    });
    it('should get user1 profile', async () => {
      const user = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', BearerTokenHeader(user1Token));
      expect(user.statusCode).toBe(200);
      user1Obj = user.body;
    });
    it('should get admin profile', async () => {
      const user = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', BearerTokenHeader(adminToken));
      expect(user.statusCode).toBe(200);
      adminObj = user.body;
    });
  });

  describe('/profile/:uid GET', () => {
    it('shold throw if anonymous user', () => {
      return request(app.getHttpServer()).get(`/user/profile/id`).expect(401);
    });

    it('should throw if user not exist', () => {
      return request(app.getHttpServer())
        .get(`/user/profile/0c20078f-036e-43b1-9366-7f24a58f70bc`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(400);
    });

    it('should get user profile', () => {
      return request(app.getHttpServer())
        .get(`/user/profile/${adminObj.id}`)
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(200);
    });
  });

  describe('/credential POST', () => {
    it('should throw if not supported type of credential', () => {
      return request(app.getHttpServer())
        .post(`/user/credential`)
        .send({
          type: 'Invalid Type',
          value: 'string',
        })
        .expect(400);
    });

    it('should be proper credential', () => {
      return request(app.getHttpServer()).post(`/user/credential`).send({
        type: 'EMAIL',
        value: 'test__100__@example.com',
      });
    });
  });

  describe('/profile PATCH', () => {
    it('should throw if anonymous user', () => {
      return request(app.getHttpServer()).patch(`/user/profile`).expect(401);
    });

    it('should throw if password unmatched', () => {
      return request(app.getHttpServer())
        .patch(`/user/profile`)
        .set(`Authorization`, BearerTokenHeader(user1Token))
        .send({
          password: 'string',
        })
        .expect(401);
    });

    it('should update user', () => {
      return request(app.getHttpServer())
        .patch(`/user/profile`)
        .set(`Authorization`, BearerTokenHeader(user1Token))
        .send({
          password: user1.password,
        })
        .expect(200);
    });
  });

  describe('/password PATCH', () => {
    it('should throw if anonymous user', () => {
      return request(app.getHttpServer()).patch('/user/password').expect(401);
    });
    it('should throw if previous password is incorrect', () => {
      return request(app.getHttpServer())
        .patch('/user/password')
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          password: 'string',
          newPassword: 'string',
        })
        .expect(401);
    });
    it('should change password', () => {
      return request(app.getHttpServer())
        .patch('/user/password')
        .set('Authorization', BearerTokenHeader(user1Token))
        .send({
          password: user1.password,
          newPassword: 'string',
        })
        .expect(200);
    });

    it('should signin', () => {
      return request(app.getHttpServer()).post('/auth/signin').send({
        password: 'string',
        email: user1.email,
      });
    });
  });

  describe('/role PATCH', () => {
    it('should throw if anonymous user', () => {
      return request(app.getHttpServer()).patch('/user/role').expect(401);
    });

    it('should throw if user is not admin authenticated', () => {
      return request(app.getHttpServer())
        .patch('/user/role')
        .set('Authorization', BearerTokenHeader(user1Token))
        .expect(403);
    });

    it('should throw if user does not exist', () => {
      return request(app.getHttpServer())
        .patch('/user/role')
        .set('Authorization', BearerTokenHeader(adminToken))
        .send({
          role: 'Admin',
          targetId: '0c20078f-036e-43b1-9366-7f24a58f70bc',
        })
        .expect(400);
    });

    it('should change user role with admin account', () => {
      return request(app.getHttpServer())
        .patch('/user/role')
        .set('Authorization', BearerTokenHeader(adminToken))
        .send({
          role: 'Admin',
          targetId: user1Obj.id,
        })
        .expect(200);
    });

    it('should check user role changed', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', BearerTokenHeader(user1Token));
      expect(response.statusCode).toBe(200);
      expect(response.body.type).toBe('Admin');
    });
  });
});
