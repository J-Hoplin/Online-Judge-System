import { OmitType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ProblemExampleDomain } from 'domains';

export class UpdateExampleDto extends OmitType(ProblemExampleDomain, [
  'id',
  'problemId',
]) {
  @IsString()
  @IsNotEmpty()
  input: string;

  @IsString()
  @IsNotEmpty()
  output: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;
}
