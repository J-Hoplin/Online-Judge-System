import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { WorkerDto } from 'aws-sqs/aws-sqs/dto';
import { WorkerService } from './worker.service';

@Controller('worker')
export class WorkerController {
  constructor(private workerService: WorkerService) {}

  @HttpCode(200)
  @Post()
  workerController(@Body() dto: WorkerDto) {
    return this.workerService.worker(dto);
  }
}
