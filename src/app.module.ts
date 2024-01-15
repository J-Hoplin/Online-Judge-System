import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JudgeModule } from './judge/judge.module';
import { SystemLoggerModule } from './system-logger/system-logger.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    SystemLoggerModule, // Should import before Prisma Module
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    JudgeModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
