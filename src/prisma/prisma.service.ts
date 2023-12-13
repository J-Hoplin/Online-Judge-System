import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit
{
  private logger = new Logger();
  private contextName = 'Prisma-Debug';

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    Object.assign(
      this,
      this.$extends({
        query: {
          problem: {
            findFirst: ({ model, operation, args, query }) => {
              args.where = {
                ...args.where,
                isArchived: false,
              };
              return query(args);
            },
            findMany: ({ model, operation, args, query }) => {
              args.where = {
                ...args.where,
                isArchived: false,
              };
              return query(args);
            },
            findUnique: ({ model, operation, args, query }) => {
              args.where = {
                ...args.where,
                isArchived: false,
              };
              return query(args);
            },
            findFirstOrThrow: ({ model, operation, args, query }) => {
              args.where = {
                ...args.where,
                isArchived: false,
              };
              return query(args);
            },
            findUniqueOrThrow: ({ model, operation, args, query }) => {
              args.where = {
                ...args.where,
                isArchived: false,
              };
              return query(args);
            },
          },
        },
      }),
    );

    Object.assign(
      this,
      this.$on('query', (event) => {
        this.logger.debug(
          `Query - ${event.query}, Duration - ${event.duration}ms`,
          this.contextName,
        );
      }),
    );
  }

  async deleteAll() {
    // Consider order of delete by relation
    await this.$transaction([
      this.problemExample.deleteMany(),
      this.problem.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
