import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserDomain } from 'domains';

export class UpdateUserInfoDto extends PickType(UserDomain, [
  'blog',
  'nickname',
  'github',
  'password',
  'message',
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
  @IsOptional()
  message: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
