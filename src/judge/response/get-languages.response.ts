import { ApiProperty } from '@nestjs/swagger';

export class GetLanguagesResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
