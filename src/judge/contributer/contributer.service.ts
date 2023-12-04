import { Injectable } from '@nestjs/common';
import { PaginateObject } from 'app/decorator';
import { PrismaService } from 'app/prisma/prisma.service';

@Injectable()
export class ContributerService {
  constructor(private prisma: PrismaService) {}

  async listProblem(uid: string, pagination: PaginateObject) {
    console.log(pagination);
    return await this.prisma.problem.findMany({
      skip: pagination.skip,
      take: pagination.take,
      where: {
        contributerId: uid,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
