// Share response with ListProblemIssueResponse

import { ApiProperty } from '@nestjs/swagger';
import { ProblemIssueCommentDomain } from 'domains/problem-issue-comment.domain';
import { ListProblemIssueResponse } from './list-problem-issue.response';

export class ReadProblemIssueResponse extends ListProblemIssueResponse {
  @ApiProperty({
    isArray: true,
    type: ProblemIssueCommentDomain,
  })
  comments: ProblemIssueCommentDomain;
}
