import { ApiProperty } from '@nestjs/swagger';
import { Problem } from '@prisma/client';

export class ProblemDomain implements Problem {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  problem: string;

  @ApiProperty({
    required: false,
  })
  input: string;

  @ApiProperty({
    required: false,
  })
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
