import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ProblemIssueDomain } from 'domains';

export class UpdateProblemIssueDto extends PickType(ProblemIssueDomain, [
  'title',
  'content',
]) {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
