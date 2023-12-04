import { Module } from '@nestjs/common';
import { ContributerService } from './contributer.service';
import { ContributerController } from './contributer.controller';

@Module({
  providers: [ContributerService],
  controllers: [ContributerController],
})
export class ContributerModule {}
