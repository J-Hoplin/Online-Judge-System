import { ApiProperty } from '@nestjs/swagger';
import { ProblemStatus } from 'app/type';
import { ProblemDomain, ProblemExampleDomain } from 'domains';

class ReadProblemResponseExamples extends ProblemExampleDomain {}

export class ReadProblemUnauthenticatedResponse extends ProblemDomain {
  @ApiProperty({
    type: ReadProblemResponseExamples,
    isArray: true,
  })
  examples: ReadProblemResponseExamples[];
}

export class ReadProblemAuthenticatedResponse extends ReadProblemUnauthenticatedResponse {
  @ApiProperty({
    enum: ProblemStatus,
  })
  isSuccess: ProblemStatus;
}
