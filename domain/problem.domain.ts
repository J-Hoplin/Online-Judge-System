import { ApiProperty } from '@nestjs/swagger';
import { Problem } from '@prisma/client';

export class ProblemDomain implements Problem {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  problem: string;

  @ApiProperty()
  input: string;

  @ApiProperty()
  output: string;

  @ApiProperty()
  timeLimit: number;

  @ApiProperty()
  memoryLimit: number;

  @ApiProperty()
  contributerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
