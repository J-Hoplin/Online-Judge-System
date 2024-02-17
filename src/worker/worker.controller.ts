import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';

import { WorkerDto } from './dto';
import { WorkerDocs } from './worker.docs';
import { WorkerService } from './worker.service';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { SQSMessageTypeEnum } from 'queue/queue/strategy/type';

// Worker Controller for AWS SQS
@Controller('worker')
@WorkerDocs.Controller()
export class WorkerController {
  private logger = new Logger('SQSWorkerController');
  constructor(private workerService: WorkerService) {}

  @HttpCode(200)
  @Post()
  @WorkerDocs.WorkerController()
  workerController(@Body() dto: WorkerDto) {
    return this.workerService.worker(dto).catch((err) => {
      this.logger.fatal(`Fail to process(${dto.message}): ${dto.id}`);
    });
  }

  @MessagePattern(SQSMessageTypeEnum.RE_CORRECTION)
  async reCorrectSubmissions(
    @Payload() data: WorkerDto,
    @Ctx() ctx: RmqContext,
  ) {
    return this.workerService.reCorrectSubmissions(data.id).catch((err) => {
      this.logger.fatal(
        `Fail to process(${SQSMessageTypeEnum.RE_CORRECTION}): ${data.id}`,
      );
    });
  }
}
