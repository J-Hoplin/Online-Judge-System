import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { SQSMessageTypeEnum } from 'queue/queue/strategy/type';
import { WorkerDto } from './dto';
import { WorkerService } from './worker.service';
import { Controller, Logger } from '@nestjs/common';

// Worker Controller for Rabbit MQ
@Controller()
export class WorkerRmqController {
  private logger = new Logger('RMQWorkerController');
  constructor(private workerService: WorkerService) {}

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
