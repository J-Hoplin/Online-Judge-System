import { ApiProperty } from '@nestjs/swagger';

export class RunProblemResponse {
  @ApiProperty()
  isCorrect: boolean;

  @ApiProperty()
  description: string;

  @ApiProperty()
  stdout: string;

  @ApiProperty()
  errorMessage: string;

  @ApiProperty()
  expect: string;
}
