import { ApiProperty } from '@nestjs/swagger';
import { ProblemExample } from '@prisma/client';

export class ProblemExampleDomain implements ProblemExample {
  @ApiProperty()
  id: number;

  @ApiProperty()
  input: string;

  @ApiProperty()
  output: string;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  problemId: number;
}
