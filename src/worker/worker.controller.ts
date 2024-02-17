import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { WorkerService } from './worker.service';
import { WorkerDocs } from './worker.docs';
import { WorkerDto } from './dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SQSMessageTypeEnum } from 'queue/queue/strategy/type';

@Controller('worker')
@WorkerDocs.Controller()
export class WorkerController {
  constructor(private workerService: WorkerService) {}

  @HttpCode(200)
  @Post()
  @WorkerDocs.WorkerController()
  workerController(@Body() dto: WorkerDto) {
    return this.workerService.worker(dto);
  }

  @MessagePattern({ message: SQSMessageTypeEnum.RE_CORRECTION })
  async reCorrectSubmissions(
    @Payload() data: WorkerDto,
    @Ctx() ctx: RmqContext,
  ) {
    console.log('hit');
    return this.workerService.reCorrectSubmissions(data.id);
  }
}
