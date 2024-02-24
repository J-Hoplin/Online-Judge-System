import { OmitType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
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
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  problem: string;

  @IsBoolean()
  @IsOptional()
  isOpen: boolean;

  @IsString()
  @IsOptional()
  input: string;

  @IsString()
  @IsOptional()
  output: string;

  @IsNumber()
  @IsOptional()
  timeLimit: number;

  @IsNumber()
  @IsOptional()
  memoryLimit: number;

  @IsArray()
  @IsOptional()
  tags: string[];
}
