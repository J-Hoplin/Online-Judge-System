import { OmitType } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ProblemExampleDomain } from 'domains';

export class CreateExampleDto extends OmitType(ProblemExampleDomain, [
  'id',
  'problemId',
]) {
  @IsString()
  @IsOptional()
  input: string;

  @IsString()
  @IsOptional()
  output: string;

  @IsBoolean()
  @IsOptional()
  isPublic: boolean;
}
