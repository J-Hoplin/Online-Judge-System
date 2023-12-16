import { Module } from '@nestjs/common';
import { ContributerModule } from './contributer/contributer.module';

import { RouterModule } from '@nestjs/core';
import { Judge0Module } from 'judge/judge0';
import { JudgeController } from './judge.controller';
import { JudgeService } from './judge.service';

@Module({
  imports: [
    ContributerModule,
    Judge0Module,
    RouterModule.register([
      {
        path: 'judge',
        module: JudgeModule,
        children: [
          {
            path: 'contribute',
            module: ContributerModule,
          },
        ],
      },
    ]),
  ],
  controllers: [JudgeController],
  providers: [JudgeService],
})
export class JudgeModule {}
