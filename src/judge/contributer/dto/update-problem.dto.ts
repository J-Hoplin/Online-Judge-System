import { OmitType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProblemDomain } from 'domains';

export class UpdateProblmeDto extends OmitType(ProblemDomain, [
  'id',
  'contributerId',
  'createdAt',
  'updatedAt',
  'isArchived',
  'deletedAt',
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

  @IsArray()
  @IsOptional()
  tags: string[];
}
