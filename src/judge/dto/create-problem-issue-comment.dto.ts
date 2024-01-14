import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ProblemIssueCommentDomain } from 'domains/problem-issue-comment.domain';

export class CreateProblemIssueCommentDto extends PickType(
  ProblemIssueCommentDomain,
  ['content'],
) {
  @IsString()
  @IsNotEmpty()
  content: string;
}
