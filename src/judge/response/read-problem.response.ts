import { ApiProperty } from '@nestjs/swagger';
import { ProblemDomain, ProblemExampleDomain } from 'domains';

class ReadProblemResponseExamples extends ProblemExampleDomain {}

export class ReadProblemResponse extends ProblemDomain {
  @ApiProperty({
    type: ReadProblemResponseExamples,
    isArray: true,
  })
  examples: ReadProblemResponse[];
}
