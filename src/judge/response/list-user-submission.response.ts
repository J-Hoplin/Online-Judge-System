import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { EnumFields } from 'app/type';
import { SubmissionDomain } from 'domains';

export class ListUserSubmissionAggregate
  implements EnumFields<$Enums.ResponseType, number>
{
  @ApiProperty()
  all: number;

  @ApiProperty()
  CORRECT: number;

  @ApiProperty()
  WRONG_ANSWER: number;

  @ApiProperty()
  TIME_LIMIT_EXCEED: number;

  @ApiProperty()
  COMPILE_ERROR: number;

  @ApiProperty()
  RUNTIME_ERROR_SIGSEGV: number;

  @ApiProperty()
  RUNTIME_ERROR_SIGXFSZ: number;

  @ApiProperty()
  RUNTIME_ERROR_SIGFPE: number;

  @ApiProperty()
  RUNTIME_ERROR_SIGABRT: number;

  @ApiProperty()
  RUNTIME_ERROR_NZEC: number;

  @ApiProperty()
  RUNTIME_ERROR: number;

  @ApiProperty()
  INTERNAL_ERROR: number;

  @ApiProperty()
  EXEC_FORMAT_ERROR: number;

  @ApiProperty()
  MEMORY_LIMIT_EXCEED: number;
}

export class ListUserSubmissionData extends SubmissionDomain {}

export class ListUserSubmissionRepsonse {
  @ApiProperty({
    type: ListUserSubmissionAggregate,
  })
  aggregate: ListUserSubmissionAggregate;

  @ApiProperty({
    type: ListUserSubmissionData,
    isArray: true,
  })
  data: ListUserSubmissionData[];
}
