import { ForbiddenException, Injectable } from '@nestjs/common';
import { PaginateObject } from 'app/decorator';
import { UpdateProblmeDto } from 'app/judge/contributer/dto/update-problem.dto';
import { PrismaService } from 'app/prisma/prisma.service';
import { UpdateExampleDto } from './dto';

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
      include: {
        examples: true,
      },
    });
    if (!problem) {
      throw new ForbiddenException('FORBIDDEN_REQUEST');
    }
    return problem;
  }

  async createProblem(uid: string) {
    // Return new problem
    return this.prisma.problem.create({
      data: {
        title: 'New Problem',
        contributerId: uid,
        tags: [],
      },
    });
  }

  async updateProblem(uid: string, pid: number, dto: UpdateProblmeDto) {
    const findProblem = await this.prisma.problem.findUnique({
      where: {
        id: pid,
        contributerId: uid,
      },
    });

    if (!findProblem) {
      throw new ForbiddenException('FORBIDDEN_REQUEST');
    }

    const problem = await this.prisma.problem.update({
      where: {
        id: pid,
        contributerId: uid,
      },
      data: {
        ...dto,
      },
      include: {
        examples: true,
      },
    });
    return problem;
  }

  async deleteProblem(uid: string, pid: number) {
    const findProblem = await this.prisma.problem.findUnique({
      where: {
        id: pid,
        contributerId: uid,
      },
    });
    if (!findProblem) {
      throw new ForbiddenException('FORBIDDEN_REQUEST');
    }
    const updatedProblem = await this.prisma.problem.update({
      where: {
        id: pid,
      },
      data: {
        isArchived: true,
        deletedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
      },
    });
    return updatedProblem;
  }

  async createExmaple(uid: string, pid: number) {
    return this.prisma.problemExample.create({
      data: {
        problemId: pid,
      },
    });
  }

  async updateExample(
    uid: string,
    pid: number,
    eid: number,
    dto: UpdateExampleDto,
  ) {
    const findExample = await this.prisma.problemExample.findUnique({
      where: {
        id: eid,
        problemId: pid,
        problem: {
          contributerId: uid,
        },
      },
    });
    if (!findExample) {
      throw new ForbiddenException('FORBIDDEN_REQUEST');
    }
    return this.prisma.problemExample.update({
      where: {
        id: eid,
        problemId: pid,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteExample(uid: string, pid: number, eid: number) {
    const findExample = await this.prisma.problemExample.findUnique({
      where: {
        id: eid,
        problemId: pid,
        problem: {
          contributerId: uid,
        },
      },
    });
    if (!findExample) {
      throw new ForbiddenException('FORBIDDEN_REQUEST');
    }
    const problem = await this.prisma.problemExample.delete({
      where: {
        id: eid,
        problemId: pid,
      },
      select: {
        output: true,
        input: true,
      },
    });
    return problem;
  }
}
