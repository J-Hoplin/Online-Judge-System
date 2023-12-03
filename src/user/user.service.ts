import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'app/prisma/prisma.service';
import { CheckCredentialDto, CredentialType, UpdatePasswordDto } from './dto';
import { Prisma } from '@prisma/client';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { UserDomain } from 'domain/user.domain';
import * as bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SetContributerDto } from './dto/set-contributor';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(uid: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: uid,
      },
    });
    if (!user) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    return user;
  }

  async checkCredential(dto: CheckCredentialDto) {
    let where: Prisma.UserWhereUniqueInput;
    switch (dto.type) {
      case CredentialType.EMAIL:
        where = {
          email: dto.value,
        };
        break;
      case CredentialType.NICKNAME:
        where = {
          nickname: dto.value,
        };
        break;
      default:
        throw new BadRequestException('INVALID_CREDENTIAL_TYPE');
    }
    const find = await this.prisma.user.findUnique({
      where,
    });
    return {
      result: !find,
    };
  }

  async updateUserInfo(user: UserDomain, dto: UpdateUserInfoDto) {
    const validatePassword = await bcrypt.compare(dto.password, user.password);

    // If fail to validate
    if (!validatePassword) {
      throw new UnauthorizedException('WRONG_CREDENTIAL');
    }
    delete dto.password;

    try {
      // If not update
      const updatedUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...dto,
        },
      });
      return updatedUser;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new BadRequestException('CREDENTIAL_TAKEN');
        }
      }
      throw new BadRequestException(err.message);
    }
  }

  async updatePassword(user: UserDomain, dto: UpdatePasswordDto) {
    const validatePassword = await bcrypt.compare(dto.password, user.password);

    // If fail to validate
    if (!validatePassword) {
      throw new UnauthorizedException('WRONG_CREDENTIAL');
    }

    // Hash user's new password
    const newPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
      },
    });
    return {
      result: true,
    };
  }

  async setRole(user: UserDomain, dto: SetContributerDto) {
    // TODO: Send email to user about promoted to contributer with Sendgrid
    const findUser = await this.prisma.user.findUnique({
      where: {
        id: dto.targetId,
      },
    });
    if (!findUser) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    const updated = await this.prisma.user.update({
      where: {
        id: dto.targetId,
      },
      data: {
        type: dto.role,
      },
    });
    return updated;
  }
}
