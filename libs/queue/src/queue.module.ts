import { Module, Provider } from '@nestjs/common';
import { QueueService } from './strategy/queue-strategy.abstract.service';
import { RabbitMQService } from './strategy/rmq.service';
import { AwsSqsQueueService } from './strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RMQ_TOKEN } from './type';

@Module({
  imports:
    process.env.QUEUE_TYPE === 'RMQ'
      ? [
          ClientsModule.register([
            {
              name: RMQ_TOKEN,
              transport: Transport.RMQ,
              options: {
                urls: [process.env.RMQ_URL],
                queue: process.env.RMQ_WORKER_QUEUE_NAME,
                queueOptions: {
                  durable: true,
                },
              },
            },
          ]),
        ]
      : [],
  providers: [
    AwsSqsQueueService,
    RabbitMQService,
    {
      useClass:
        process.env.QUEUE_TYPE === 'RMQ' ? RabbitMQService : AwsSqsQueueService,
      provide: QueueService,
    },
  ],
  exports: [QueueService, AwsSqsQueueService, RabbitMQService],
})
export class QueueModule {}
