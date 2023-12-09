import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JudgeModule } from './judge/judge.module';
import { SystemLoggerModule } from './system-logger/system-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    JudgeModule,
    SystemLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
