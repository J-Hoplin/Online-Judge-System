import { Module } from '@nestjs/common';
import { AwsSqsService } from 'aws-sqs/aws-sqs';
import { QueueService } from './strategy/queue-strategy.abstract.service';
import { RabbitMQService } from './strategy/rmq.service';

@Module({
  providers: [
    AwsSqsService,
    RabbitMQService,
    {
      useClass:
        process.env.QUEUE_TYPE === 'AWS' ? AwsSqsService : RabbitMQService,
      provide: QueueService,
    },
  ],
  exports: [QueueService, AwsSqsService, RabbitMQService],
})
export class QueueModule {}
