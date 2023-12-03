import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaModule } from 'app/prisma/prisma.module';
import { PrismaService } from 'app/prisma/prisma.service';
import { userSignupGen } from 'test/mock-generator';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const user1 = userSignupGen();
  const user2 = userSignupGen();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule.register({})],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.deleteAll();
  });

  describe('/singup (POST)', () => {
    it('should singup', async () => {
      const result = await service.signup({
        ...user1,
      });
      expect(result.accessToken).not.toBeUndefined();
    });
    it('should throw if credential taken', async () => {
      try {
        await service.signup({
          ...user1,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('/signin (POST)', () => {
    it('should signin', async () => {
      const result = await service.singin({
        ...user1,
      });
      expect(result.accessToken).not.toBeUndefined();
    });
    it('should throw if wrong credential', async () => {
      try {
        const fakeUser1 = {
          ...user1,
          password: 'fake password',
        };
        await service.singin(fakeUser1);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });
    it('should throw if not existing uesr', async () => {
      try {
        await service.singin(user2);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
