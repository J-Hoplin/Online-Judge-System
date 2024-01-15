import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { Judge0Module } from 'judge/judge0';

@Module({
  imports: [Judge0Module],
  providers: [WorkerService],
  controllers: [WorkerController],
})
export class WorkerModule {}
