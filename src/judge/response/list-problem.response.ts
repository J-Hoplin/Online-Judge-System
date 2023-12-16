import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProblemDomain, UserDomain } from 'domains';

export class ListProblemContributerResponse extends PickType(UserDomain, [
  'nickname',
]) {}

export class ListProblemResponse extends PickType(ProblemDomain, [
  'id',
  'title',
]) {
  @ApiProperty({
    type: ListProblemContributerResponse,
  })
  contributer: ListProblemContributerResponse;
}
