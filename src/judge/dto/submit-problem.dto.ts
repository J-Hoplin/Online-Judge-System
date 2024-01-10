import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SubmissionDomain } from 'domains';

export class SubmitProblemDto extends PickType(SubmissionDomain, [
  'code',
  'languageId',
  'isPublic',
]) {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @IsNumber()
  @IsNotEmpty()
  languageId: number;

  @ApiProperty({ description: '언어 이름' })
  @IsString()
  @IsNotEmpty()
  language: string;
}
