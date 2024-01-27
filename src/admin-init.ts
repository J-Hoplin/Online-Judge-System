import { INestApplication, LoggerService } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SystemLoggerService } from './system-logger/system-logger.service';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

export async function InitializeAdmin(app: INestApplication) {
  // Generate default admin account
  const prisma = app.get<PrismaService>(PrismaService);
  const logger = app.get<LoggerService>(SystemLoggerService);

  if (!(process.env.ADMIN_EMAIL && process.env.ADMIN_PW)) {
    logger.error(
      'Admin Email and Admin Pw not found. Please configure `.env` file and reboot',
    );
    throw new Error('Fail to initialize server');
  } else {
    // Initialize root admin
    await prisma.$transaction(async (tx: PrismaClient) => {
      await tx.user.upsert({
        where: {
          email: process.env.ADMIN_EMAIL,
        },
        create: {
          nickname: 'admin',
          password: bcrypt.hashSync(process.env.ADMIN_PW, 10),
          email: process.env.ADMIN_EMAIL,
          type: 'Admin',
        },
        update: {},
      });
      logger.log('Admin Initialized');
    });
  }
}
