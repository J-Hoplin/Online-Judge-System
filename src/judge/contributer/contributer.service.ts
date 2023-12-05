import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PaginateObject } from 'app/decorator';
import { PrismaService } from 'app/prisma/prisma.service';
import { CreateProblmeDto } from 'app/judge/contributer/dto/create-problme.dto';
import { ru } from '@faker-js/faker';

@Injectable()
export class ContributerService {
  constructor(private prisma: PrismaService) {}

  async listProblem(uid: string, search: string, pagination: PaginateObject) {
    return this.prisma.problem.findMany({
      skip: pagination.skip,
      take: pagination.take,
      where: {
        contributerId: uid,
        title: {
          contains: search || '',
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async readProblem(uid: string, pid: number) {
    const problem = await this.prisma.problem.findUnique({
      where: {
        id: pid,
        contributerId: uid,
      },
    });
    if (!problem) {
      throw new ForbiddenException('FORBIDDEN_REQUEST');
    }
    return problem;
  }

  async createProblem(uid: string, dto: CreateProblmeDto) {
    const problem = await this.prisma.problem.create({
      data: {
        title: dto.title,
        problem: dto.problem,
        input: dto.input,
        output: dto.output,
        timeLimit: dto.timeLimit,
        memoryLimit: dto.memoryLimit,
        contributerId: uid,
        examples: {
          create: dto.examples.map((example) => {
            return {
              input: example.input,
              output: example.output,
              isPublic: example.isPublic,
            };
          }),
        },
      },
      include: {
        examples: true,
      },
    });
    return problem;
  }
}
