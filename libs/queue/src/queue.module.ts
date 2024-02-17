import { Module } from '@nestjs/common';

import { QueueService } from './strategy/queue-strategy.abstract.service';
import { RabbitMQService } from './strategy/rmq.service';
import { AwsSqsQueueService } from './strategy';

@Module({
  providers: [
    AwsSqsQueueService,
    RabbitMQService,
    {
      useClass:
        process.env.QUEUE_TYPE === 'AWS' ? AwsSqsQueueService : RabbitMQService,
      provide: QueueService,
    },
  ],
  exports: [QueueService, AwsSqsQueueService, RabbitMQService],
})
export class QueueModule {}
