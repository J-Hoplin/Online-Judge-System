import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SubmissionDomain } from 'domains';

export class SubmitProblemDto extends PickType(SubmissionDomain, [
  'code',
  'languageId',
]) {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  languageId: number;

  @ApiProperty({ description: '언어 이름' })
  @IsString()
  @IsNotEmpty()
  language: string;
}
