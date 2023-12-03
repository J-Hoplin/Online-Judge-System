import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'app/prisma/prisma.service';
import { SingupDto } from './dto';
import { JwtPayload } from 'app/type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcryptjs';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signup(dto: SingupDto) {
    try {
      dto.password = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...dto,
        },
      });
      return await this.issueToken(user.id, user.email);
    } catch (err) {
      // Unique constraint
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new BadRequestException('CREDENTIAL_TAKEN');
        }
      }
      throw new BadRequestException('FAIL_TO_SINGUP');
    }
  }

  async singin(dto: SigninDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    // If user not found
    if (!user) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }

    // Validate Password
    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      throw new UnauthorizedException('INVALID_CREDENTIAL');
    }
    return await this.issueToken(user.id, user.email);
  }

  async issueToken(id: string, email: string) {
    const payload: JwtPayload = {
      id,
      email,
    };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
    return {
      accessToken,
    };
  }
}
