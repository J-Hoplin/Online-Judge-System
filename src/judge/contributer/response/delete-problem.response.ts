import { PickType } from '@nestjs/swagger';
import { ProblemDomain } from 'domains';

export class DeleteProblemResponse extends PickType(ProblemDomain, [
  'id',
  'title',
]) {}
