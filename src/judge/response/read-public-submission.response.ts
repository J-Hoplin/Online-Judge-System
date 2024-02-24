import { ApiProperty, PickType } from '@nestjs/swagger';
import { SubmissionDomain, UserDomain } from 'domains';

class ReadPublicSubmissionResponseUser extends PickType(UserDomain, [
  'id',
  'nickname',
  'email',
]) {}

export class ReadPublicSubmissionResponse extends SubmissionDomain {
  @ApiProperty({
    type: ReadPublicSubmissionResponseUser,
  })
  user: ReadPublicSubmissionResponseUser;
}
