import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { Judge0Module } from 'judge/judge0';
import { PrismaModule } from 'app/prisma/prisma.module';
import { WorkerRmqController } from './worker-rmq.controller';

@Module({
  imports:
    process.env.TYPE === 'worker' && process.env.QUEUE_TYPE === 'RMQ'
      ? [Judge0Module, PrismaModule]
      : [Judge0Module],
  providers: [WorkerService],
  controllers:
    process.env.TYPE === 'worker' && process.env.QUEUE_TYPE === 'RMQ'
      ? [WorkerRmqController]
      : [WorkerController],
})
export class WorkerModule {}
