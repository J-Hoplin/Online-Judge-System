import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProblemStatus } from 'app/type';
import { ProblemDomain, UserDomain } from 'domains';

export class ListProblemContributerResponse extends PickType(UserDomain, [
  'nickname',
]) {}

export class ListProblemUnAuthenticatedResponse extends PickType(
  ProblemDomain,
  ['id', 'title'],
) {
  @ApiProperty({
    type: ListProblemContributerResponse,
  })
  contributer: ListProblemContributerResponse;

  @ApiProperty()
  correct: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  correctionRate: number;
}

export class ListProblemAuthenticatedResponse extends ListProblemUnAuthenticatedResponse {
  @ApiProperty({
    enum: ProblemStatus,
  })
  isSuccess: ProblemStatus;
}
