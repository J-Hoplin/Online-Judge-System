import { PickType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { SubmissionDomain } from 'domains';

export class UpdateSubmissionDto extends PickType(SubmissionDomain, [
  'isPublic',
]) {
  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;
}
