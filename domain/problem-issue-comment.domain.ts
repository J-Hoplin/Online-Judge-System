import { ApiProperty } from '@nestjs/swagger';
import { ProblemIssueComment } from '@prisma/client';

export class ProblemIssueCommentDomain implements ProblemIssueComment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  issueId: number;

  @ApiProperty()
  problemId: number;

  @ApiProperty()
  userId: string;
}
