import { PickType } from '@nestjs/swagger';
import { ProblemIssueDomain } from 'domains';

export class DeleteProblemIssueResponse extends PickType(ProblemIssueDomain, [
  'id',
  'title',
]) {}
