import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';

import { WorkerDto } from './dto';
import { WorkerDocs } from './worker.docs';
import { WorkerService } from './worker.service';

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
}
