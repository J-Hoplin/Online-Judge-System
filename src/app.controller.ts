import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { QueueService } from 'queue/queue/strategy';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly queueService: QueueService,
  ) {}

  @Get()
  async getHello() {
    await this.queueService.sendTask({
      id: 10,
      message: 'RE_CORRECTION',
    });
    return this.appService.getHello();
  }
}
