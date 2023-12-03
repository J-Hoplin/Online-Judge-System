import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';

export class UserDomain implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  password: string;

  @ApiProperty({
    example: 'user@test.com',
  })
  email: string;

  @ApiProperty({
    required: false,
  })
  message: string;

  @ApiProperty({
    required: false,
  })
  github: string;

  @ApiProperty({
    required: false,
  })
  blog: string;

  @ApiProperty({
    enum: $Enums.UserType,
  })
  type: $Enums.UserType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
