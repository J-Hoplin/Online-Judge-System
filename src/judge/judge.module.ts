import { Module } from '@nestjs/common';
import { ContributerModule } from './contributer/contributer.module';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ContributerModule,
    UserModule,
    RouterModule.register([
      {
        path: 'judge',
        children: [
          {
            path: 'contribute',
            module: ContributerModule,
          },
          {
            path: '',
            module: UserModule,
          },
        ],
      },
    ]),
  ],
})
export class JudgeModule {}
