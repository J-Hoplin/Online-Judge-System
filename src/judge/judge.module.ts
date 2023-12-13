import { Module } from '@nestjs/common';
import { ContributerModule } from './contributer/contributer.module';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';
import { Judge0Module } from 'judge/judge0';
import { JudgeController } from './judge.controller';
import { JudgeService } from './judge.service';

@Module({
  imports: [
    ContributerModule,
    UserModule,
    Judge0Module,
    RouterModule.register([
      {
        path: 'judge',
        children: [
          {
            path: 'contribute',
            module: ContributerModule,
          },
          {
            path: 'solve',
            module: UserModule,
          },
        ],
      },
    ]),
  ],
  controllers: [JudgeController],
  providers: [JudgeService],
})
export class JudgeModule {}
