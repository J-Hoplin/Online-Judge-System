import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { SQSTask } from 'aws-sqs/aws-sqs/type';

@Controller('worker')
export class WorkerController {
  constructor(private workerService: WorkerService) {}

  @HttpCode(200)
  @Post()
  workerController(@Body() dto: SQSTask) {
    return this.workerService.worker(dto);
  }
}
