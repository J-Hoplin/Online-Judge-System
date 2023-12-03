import { ApiProperty } from '@nestjs/swagger';

export class SignupResponse {
  @ApiProperty()
  accessToken: string;
}
