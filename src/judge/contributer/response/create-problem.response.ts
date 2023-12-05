import { ProblemDomain, ProblemExampleDomain } from 'domains';
import { ApiProperty } from '@nestjs/swagger';

// Example
export class CreateProblemExampleResponse extends ProblemExampleDomain {}

// Response
export class CreateProblemResponse extends ProblemDomain {
  @ApiProperty({
    isArray: true,
    type: CreateProblemExampleResponse,
  })
  examples: CreateProblemExampleResponse[];
}
