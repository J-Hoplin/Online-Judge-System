import { ApiProperty } from '@nestjs/swagger';
import { ProblemIssue } from '@prisma/client';

export class ProblemIssueDomain implements ProblemIssue {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  problemId: number;

  @ApiProperty()
  issuerId: string;
}
