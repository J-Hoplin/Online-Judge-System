import { ForbiddenException, Injectable } from '@nestjs/common';
import { PaginateObject } from 'app/decorator';
import { UpdateProblmeDto } from 'app/judge/contributer/dto/update-problem.dto';
import { PrismaService } from 'app/prisma/prisma.service';
import { QueueService } from 'queue/queue/strategy';
import { CreateExampleDto, UpdateExampleDto } from './dto';

@Injectable()
export class ContributerService {
  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
  ) {}

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
    return await this.prisma.problem.findUnique({
      where: {
        id: pid,
        contributerId: uid,
      },
      include: {
        examples: true,
      },
    });
  }

  async createProblem(uid: string) {
    // Return new problem
    return this.prisma.problem.create({
      data: {
        title: 'New Problem',
        problem: 'Problem Here',
        input: 'Input Here',
        output: 'Output Here',
        contributerId: uid,
        tags: [],
      },
    });
  }

  async updateProblem(uid: string, pid: number, dto: UpdateProblmeDto) {
    // If time limit is lower than 0
    if (dto?.timeLimit && dto.timeLimit < 0) {
      dto.timeLimit = 5;
    }

    // If memory limit is lower than 0
    if (dto?.memoryLimit && dto.memoryLimit < 0) {
      dto.memoryLimit = 128;
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

  async createExmaple(uid: string, pid: number, dto: CreateExampleDto) {
    return this.prisma.problemExample.create({
      data: {
        ...dto,
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
    const previousExample = await this.prisma.problemExample.findUnique({
      where: {
        id: eid,
        problemId: pid,
        problem: {
          contributerId: uid,
        },
      },
    });

    if (!previousExample) {
      throw new ForbiddenException('FORBIDDEN_REQUEST');
    }

    // Only trigger re-correction if it input or out-put modified
    if (
      dto.input !== previousExample.input ||
      dto.output !== previousExample.output
    ) {
      // Send task to client
      await this.queueService.sendTask({
        id: pid,
        message: 'RE_CORRECTION',
      });
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
