import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { Judge0Module } from 'judge/judge0';
import { PrismaModule } from 'app/prisma/prisma.module';

@Module({
  imports:
    process.env.TYPE === 'worker'
      ? [Judge0Module, PrismaModule]
      : [Judge0Module],
  providers: [WorkerService],
  controllers: [WorkerController],
})
export class WorkerModule {}
