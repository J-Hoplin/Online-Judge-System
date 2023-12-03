import { ApiProperty } from '@nestjs/swagger';

export class CheckCredentialResponse {
  @ApiProperty()
  result: boolean;
}
