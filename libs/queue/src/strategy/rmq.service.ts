import { Injectable } from '@nestjs/common';
import { QueueService } from './queue-strategy.abstract.service';
import { RabbitMQConenction } from '../decorator/rmq.decorator';
import { QueueTask } from './type';

@Injectable()
export class RabbitMQService extends QueueService {
  // Basic name of workerQueueName

  constructor() {
    super();
    // If Rabbit MQ URL not found
    if (!process.env.RMQ_URL) {
      throw new Error('Rabbit MQ URL not found');
    }
  }

  @RabbitMQConenction()
  async sendTask(task: QueueTask) {
    return JSON.stringify(task);
  }
}
