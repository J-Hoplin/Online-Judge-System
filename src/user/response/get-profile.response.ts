import { OmitType } from '@nestjs/swagger';
import { UserDomain } from 'domains';

export class GetProfileResponse extends OmitType(UserDomain, ['password']) {}
