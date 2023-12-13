import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, LoggerService, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { SystemLoggerService } from './system-logger/system-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    // Docs: https://docs.nestjs.com/techniques/validation
    new ValidationPipe({
      skipNullProperties: true,
      whitelist: true,
    }),
  );
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Online-Judge-Server')
    .setDescription('Online Judge Server')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Generate default admin account
  const prisma = app.get<PrismaService>(PrismaService);
  const logger = app.get<LoggerService>(SystemLoggerService);

  if (!(process.env.ADMIN_EMAIL && process.env.ADMIN_PW)) {
    logger.error(
      'Admin Email and Admin Pw not found. Please configure `.env` file and reboot',
    );
    throw new Error('Fail to initialize server');
  } else {
    const findAdmin = await prisma.user.findUnique({
      where: {
        email: process.env.ADMIN_EMAIL,
      },
    });
    if (!findAdmin) {
      // Initialize root admin
      await prisma.user.create({
        data: {
          nickname: 'admin',
          password: bcrypt.hashSync(process.env.ADMIN_PW, 10),
          email: process.env.ADMIN_EMAIL,
          type: 'Admin',
        },
      });
      logger.log('Admin initialized');
    } else {
      logger.log('Admin already initialized');
    }
  }

  // Initialize Swagger Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
  });

  await app.listen(3000);
}
bootstrap();
