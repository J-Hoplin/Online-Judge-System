import { OmitType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ProblemExampleDomain } from 'domains';

export class UpdateExampleDto extends OmitType(ProblemExampleDomain, [
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
