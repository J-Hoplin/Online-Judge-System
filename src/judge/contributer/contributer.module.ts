import { Module } from '@nestjs/common';
import { ContributerService } from './contributer.service';
import { ContributerController } from './contributer.controller';
import { AwsSqsModule } from 'aws-sqs/aws-sqs';

@Module({
  imports: [AwsSqsModule],
  providers: [ContributerService],
  controllers: [ContributerController],
})
export class ContributerModule {}
