import { Module } from '@nestjs/common';
import { AwsSqsService } from './aws-sqs.service';

@Module({
  providers: [AwsSqsService],
  exports: [AwsSqsService],
})
export class AwsSqsModule {}
