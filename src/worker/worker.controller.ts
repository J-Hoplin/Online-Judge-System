import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { WorkerService } from './worker.service';
import { WorkerDocs } from './worker.docs';
import { WorkerDto } from './dto';

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
