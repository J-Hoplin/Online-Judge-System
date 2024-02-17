import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RMQ_TOKEN } from '../type';
import { QueueService } from './queue-strategy.abstract.service';
import { QueueTask } from './type';

@Injectable()
export class RabbitMQService extends QueueService {
  // Basic name of workerQueueName

  constructor(@Inject(RMQ_TOKEN) private client: ClientProxy) {
    super();
    // If Rabbit MQ URL not found
    if (!process.env.RMQ_URL) {
      throw new Error('Rabbit MQ URL not found');
    }
  }

  async sendTask(task: QueueTask) {
    // Send returns cold Observable. Requires to explicit subscribe before sent
    // https://docs.nestjs.com/microservices/basics#sending-messages
    this.client.send(task.message, task).subscribe();
  }
}
