import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserDomain } from 'domain/user.domain';

export class UpdateUserInfoDto extends PickType(UserDomain, [
  'blog',
  'nickname',
  'github',
  'password',
]) {
  @IsString()
  @IsOptional()
  blog: string;

  @IsString()
  @IsOptional()
  nickname: string;

  @IsString()
  @IsOptional()
  github: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
