import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ProblemDomain, ProblemExampleDomain } from 'domains';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

class ProblemExampleDto extends OmitType(ProblemExampleDomain, [
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

export class CreateProblmeDto extends OmitType(ProblemDomain, [
  'id',
  'contributerId',
  'createdAt',
  'updatedAt',
]) {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  problem: string;

  @IsString()
  @IsNotEmpty()
  input: string;

  @IsString()
  @IsNotEmpty()
  output: string;

  @IsNumber()
  @IsNotEmpty()
  timeLimit: number;

  @IsNumber()
  @IsNotEmpty()
  memoryLimit: number;

  @ApiProperty({
    isArray: true,
    type: ProblemExampleDto,
  })
  @IsArray()
  @IsOptional()
  examples: ProblemExampleDto[];
}
