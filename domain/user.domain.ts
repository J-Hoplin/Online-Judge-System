import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserDomain implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
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
}
