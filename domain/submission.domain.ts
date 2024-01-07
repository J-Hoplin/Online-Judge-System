import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Submission } from '@prisma/client';

export class SubmissionDomain implements Submission {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  codeLength: number;

  @ApiProperty()
  memory: number;

  @ApiProperty()
  time: number;

  @ApiProperty()
  languageId: number;

  @ApiProperty()
  language: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  isCorrect: boolean;

  @ApiProperty({
    enum: $Enums.ResponseType,
  })
  response: $Enums.ResponseType;

  @ApiProperty()
  problemId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
