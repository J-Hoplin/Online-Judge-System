import { Module } from '@nestjs/common';
import { QueueModule } from 'queue/queue';
import { ContributerController } from './contributer.controller';
import { ContributerService } from './contributer.service';

@Module({
  imports: [QueueModule],
  providers: [ContributerService],
  controllers: [ContributerController],
})
export class ContributerModule {}
