import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { WorkerDto } from 'aws-sqs/aws-sqs/dto';
import { WorkerService } from './worker.service';
import { WorkerDocs } from './worker.docs';

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
}
