import { Injectable } from '@nestjs/common';
import { QueueStrategy } from './queue-strategy.abstract.service';
import { QueueTask } from './type';

@Injectable()
export class RabbitMqQueueService extends QueueStrategy {
  constructor() {
    super();
  }

  async sendTask(task: QueueTask) {
    throw new Error('Method not implemented.');
  }
}
