import { Module } from '@nestjs/common';
import { AwsSqsService } from 'aws-sqs/aws-sqs';
import { QueueStrategy } from './strategy/queue-strategy.abstract.service';
import { RabbitMqQueueService } from './strategy/rabbitmq-service';

@Module({
  providers: [
    {
      useFactory: () => {
        return process.env.DEPLOY === 'AWS'
          ? AwsSqsService
          : RabbitMqQueueService;
      },
      provide: QueueStrategy,
    },
  ],
  exports: [QueueStrategy],
})
export class QueueModule {}
