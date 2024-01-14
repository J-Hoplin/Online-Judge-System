import { PickType } from '@nestjs/swagger';
import { ProblemIssueCommentDomain } from 'domains/problem-issue-comment.domain';

export class DeleteProblemIssueCommentResponse extends PickType(
  ProblemIssueCommentDomain,
  ['id', 'content'],
) {}
