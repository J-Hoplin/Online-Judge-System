import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    Object.assign(
      this,
      this.$extends({
        query: {
          user: {},
        },
      }),
    );
  }

  async deleteAll() {
    await this.$transaction([this.user.deleteMany()]);
  }
}
