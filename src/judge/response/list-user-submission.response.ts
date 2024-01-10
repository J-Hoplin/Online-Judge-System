import { ApiProperty } from '@nestjs/swagger';
import { $Enums, ResponseType } from '@prisma/client';
import { EnumFields } from 'app/type';
import { SubmissionDomain } from 'domains';

interface ResponseTypeAggregate extends EnumFields<ResponseType> {
  CORRECT: string;
}

export class ListUserSubmissionAggregate {}

export class ListUserSubmissionData extends SubmissionDomain {}

export class ListUserSubmissionRepsonse {
  aggregate: ListUserSubmissionAggregate;

  @ApiProperty({
    type: ListUserSubmissionData,
    isArray: true,
  })
  data: ListUserSubmissionData[];
}
