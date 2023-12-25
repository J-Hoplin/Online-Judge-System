import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
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
