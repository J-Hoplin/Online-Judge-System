import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AwsS3Module } from 's3/aws-s3';

@Module({
  imports: [AwsS3Module],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
