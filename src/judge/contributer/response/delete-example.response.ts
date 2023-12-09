import { PickType } from '@nestjs/swagger';
import { ProblemExampleDomain } from 'domains';

export class DeleteProblemExampleResponse extends PickType(
  ProblemExampleDomain,
  ['input', 'output'],
) {}
