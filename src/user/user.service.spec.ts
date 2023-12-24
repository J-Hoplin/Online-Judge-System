import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaModule } from 'app/prisma/prisma.module';
import { PrismaService } from 'app/prisma/prisma.service';
import { userSignupGen } from 'test/mock-generator';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CredentialType } from './dto';
import * as bcrypt from 'bcryptjs';
import { UserDomain } from 'domains';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  let user1: UserDomain;
  const user1Signup = userSignupGen(true);

  let user2: UserDomain;
  const user2Signup = userSignupGen(true);

  // For update User info
  let user3: UserDomain;
  const user3Singup = userSignupGen();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
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

    const user3Dto = {
      ...user3Singup,
    };
    user3Dto.password = await bcrypt.hash(user3Dto.password, 10);
    user3 = await prisma.user.create({
      data: {
        ...user3Dto,
      },
    });
  });

  afterAll(async () => {
    await prisma.deleteAll();
  });

  describe('getProfile()', () => {
    it("should get user's profile", async () => {
      const result = await service.getProfile(user1.id);
      expect(result.id).not.toBeUndefined();
    });
    it('should throw if user not found', async () => {
      try {
        await service.getProfile('some-id');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('checkCredential()', () => {
    it('should return true if credential is able to use', async () => {
      const resultEmail = await service.checkCredential({
        type: CredentialType.EMAIL,
        value: 'Some-email',
      });
      const resultNickname = await service.checkCredential({
        type: CredentialType.NICKNAME,
        value: 'Some-Nickname',
      });
      expect(resultEmail.result).toBe(true);
      expect(resultNickname.result).toBe(true);
    });

    it('should throw if invalid type', async () => {
      try {
        await service.checkCredential({
          type: 'something' as CredentialType,
          value: 'value',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return false if credential is taken', async () => {
      const result = await service.checkCredential({
        type: CredentialType.EMAIL,
        value: user1Signup.email,
      });
      expect(result.result).toBe(false);
    });
  });

  describe('updateUserInfo()', () => {
    it('should update user profile', async () => {
      const result = await service.updateUserInfo(user3, {
        blog: 'jhoplin7259.tistory.com',
        nickname: 'nickname',
        github: 'J-hoplin1',
        message: 'message',
        password: user3Singup.password,
      });
      expect(result).not.toBeUndefined();
    });

    it('should throw if password unmatched', async () => {
      try {
        await service.updateUserInfo(user3, {
          blog: 'jhoplin7259.tistory.com',
          nickname: 'nickname2',
          github: 'J-hoplin1',
          message: 'message',
          password: 'wrong-password',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('updatePassword()', () => {
    it("should update user's password", async () => {
      const result = await service.updatePassword(user3, {
        password: user3Singup.password,
        newPassword: 'updatedPassword',
      });
      expect(result.result).toBe(true);
      user3 = await prisma.user.findUnique({
        where: {
          id: user3.id,
        },
      });
    });

    it('should throw if password is unmatched', async () => {
      try {
        await service.updatePassword(user3, {
          password: 'wrong-password',
          newPassword: 'new-password',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('setRole()', () => {
    it("should update user's role", async () => {
      const updated = await service.setRole(user2, {
        role: 'Contributer',
        targetId: user3.id,
      });
      expect(updated.id).toBe(user3.id);
      expect(updated.type).toBe('Contributer');
    });

    it('should throw if user not found', async () => {
      try {
        await service.setRole(user2, {
          role: 'Contributer',
          targetId: 'target',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
