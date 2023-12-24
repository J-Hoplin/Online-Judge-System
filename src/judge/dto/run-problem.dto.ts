import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SubmissionDomain } from 'domains';

export class RunProblemDto extends PickType(SubmissionDomain, [
  'code',
  'languageId',
]) {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  languageId: number;
}
