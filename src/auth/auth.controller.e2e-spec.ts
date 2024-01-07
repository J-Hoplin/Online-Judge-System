import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app/app.module';
import * as request from 'supertest';
import { userSignupGen } from 'test/mock-generator';

describe('/auth Auth Controller', () => {
  let app: INestApplication;

  // Mock user
  const user1 = userSignupGen();

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

  // Signup test
  describe('/singup POST', () => {
    it('should sign up', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(user1)
        .expect(200);
    });

    it('should throw if credential already taken', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(user1)
        .expect(400);
    });
  });

  //Signin test
  describe('/signin POST', () => {
    it('should singin', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          password: user1.password,
          email: user1.email,
        })
        .expect(200);
    });

    it('should throw if credential is not correct', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: user1.email,
          password: 'wrong-password',
        })
        .expect(401);
    });
  });
});
