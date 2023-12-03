import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SetContributerDto {
  @ApiProperty({
    enum: UserType,
  })
  @IsEnum(UserType)
  @IsNotEmpty()
  role: UserType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetId: string;
}
