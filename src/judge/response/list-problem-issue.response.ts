import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProblemDomain, ProblemIssueDomain, UserDomain } from 'domains';

export class ListProblemIssueResponseIssuer extends PickType(UserDomain, [
  'id',
  'nickname',
]) {}

export class ListProblemIssueResponseTarget extends PickType(ProblemDomain, [
  'id',
  'title',
]) {}

export class ListProblemIssueResponse extends ProblemIssueDomain {
  @ApiProperty({ type: ListProblemIssueResponseIssuer })
  issuer: ListProblemIssueResponseIssuer;

  @ApiProperty({ type: ListProblemIssueResponseTarget })
  target: ListProblemIssueResponseTarget;
}
