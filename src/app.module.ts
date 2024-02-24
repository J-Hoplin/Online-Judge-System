import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtifactModule } from './artifact/artifact.module';
import { AuthModule } from './auth/auth.module';
import { JudgeModule } from './judge/judge.module';
import { PrismaModule } from './prisma/prisma.module';
import { SystemLoggerModule } from './system-logger/system-logger.module';
import { UserModule } from './user/user.module';
import { WorkerModule } from './worker/worker.module';
import { QueueModule } from 'queue/queue';

@Module({
  imports: [
    SystemLoggerModule, // Should import before Prisma Module
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    JudgeModule,
    WorkerModule,
    ArtifactModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
