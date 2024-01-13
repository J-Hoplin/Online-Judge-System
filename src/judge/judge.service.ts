import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginateObject } from 'app/decorator';
import { PrismaService } from 'app/prisma/prisma.service';
import { Judge0Service } from 'judge/judge0';
import { JudgeFilterObject } from './decorator/judge-filter.decorator';
import { SubmissionFilterObject } from './decorator/submission-filter.decorator';
import {
  RunProblemDto,
  SubmitProblemDto,
  UpdateProblemIssueDto,
  UpdateSubmissionDto,
} from './dto';
import { GetLanguagesResponse } from './response/get-languages.response';

@Injectable()
export class JudgeService {
  constructor(private prisma: PrismaService, private judge0: Judge0Service) {}

  async getLanguages() {
    const list: GetLanguagesResponse[] = await this.judge0.getLanguages();
    // Sort by id
    list.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
    return list;
  }

  async listProblem(filter: JudgeFilterObject, paginate: PaginateObject) {
    const problems = await this.prisma.problem.findMany({
      ...paginate,
      where: {
        ...filter.Where,
      },
      orderBy: {
        ...filter.Orderby,
      },
      select: {
        id: true,
        title: true,
        contributer: {
          select: {
            nickname: true,
          },
        },
      },
    });

    const filteredList = [];
    for (const problem of problems) {
      const submissionAggregate = await this.prisma.submission.groupBy({
        by: ['isCorrect'],
        where: {
          problemId: problem.id,
        },
        _count: {
          _all: true,
        },
      });
      let correct = 0;
      let total = 0;

      submissionAggregate.forEach((aggregate) => {
        total += aggregate._count._all;
        switch (aggregate.isCorrect) {
          case true:
            correct += aggregate._count._all;
            break;
          case false:
            break;
        }
      });

      const correctionRate = (correct / total).toFixed(3);
      filteredList.push({
        ...problem,
        correct,
        total,
        correctionRate,
      });
    }

    return filteredList;
  }

  async readProblem(pid: number) {
    return await this.prisma.problem.findUniqueOrThrow({
      where: {
        id: pid,
      },
      include: {
        examples: {
          where: {
            isPublic: true,
          },
        },
      },
    });
  }

  async runProblem(pid: number, dto: RunProblemDto) {
    const problem = await this.prisma.problem.findUniqueOrThrow({
      where: {
        id: pid,
      },
    });

    // Get public examples from problem
    const examples = await this.prisma.problemExample.findMany({
      where: {
        problemId: pid,
        isPublic: true,
      },
    });

    if (!examples.length) {
      // If example not exist -> prevent submit
      throw new BadRequestException('EXAMPLE_NOT_EXIST');
    }
    const results = await Promise.all(
      examples.map((example) => {
        return this.judge0.submit(
          dto.languageId,
          dto.code,
          example.output,
          example.input,
          problem.timeLimit,
          problem.memoryLimit,
        );
      }),
    );

    return results.map((result) => {
      return {
        isCorrect: result.isCorrect,
        description: result.description,
        stdout: result.output.stdout,
        errorMessage: result.output.message,
        expect: result.output.expect,
      };
    });
  }

  async submitProblem(uid: string, pid: number, dto: SubmitProblemDto) {
    const problem = await this.prisma.problem.findUniqueOrThrow({
      where: {
        id: pid,
      },
    });

    // Get examples from problem
    const examples = await this.prisma.problemExample.findMany({
      where: {
        problemId: pid,
      },
    });
    if (!examples.length) {
      // If example not exist -> prevent submit
      throw new BadRequestException('EXAMPLE_NOT_EXIST');
    }

    // Get all of the results
    const results = await Promise.all(
      examples.map((example) => {
        return this.judge0.submit(
          dto.languageId,
          dto.code,
          example.output,
          example.input,
          problem.timeLimit,
          problem.memoryLimit,
        );
      }),
    );

    results.sort((x, y) => {
      // Firstly sort by time
      if (x.time > y.time) {
        return 1;
      }
      if (x.time < y.time) {
        return -1;
      }

      // If time is same, sort as memory
      if (x.memory > y.memory) {
        return 1;
      }
      if (x.memory < y.memory) {
        return -1;
      }
    });

    // Filter wrong answer
    const checkWrongAnswer = results.filter((result) => !result.isCorrect);
    checkWrongAnswer.sort((x, y) => {
      // Firstly sort by time
      if (x.time > y.time) {
        return 1;
      }
      if (x.time < y.time) {
        return -1;
      }

      // If time is same, sort as memory
      if (x.memory > y.memory) {
        return 1;
      }
      if (x.memory < y.memory) {
        return -1;
      }
    });

    const data = checkWrongAnswer.length ? checkWrongAnswer[0] : results[0];
    return await this.prisma.submission.create({
      data: {
        code: dto.code,
        codeLength: dto.code.length,
        memory: data.memory,
        time: data.time,
        languageId: dto.languageId,
        language: dto.language,
        isPublic: dto.isPublic,
        isCorrect: data.isCorrect,
        response: data.description,
        userId: uid,
        problemId: pid,
      },
    });
  }

  async listUserSubmissions(
    uid: string,
    pid: number,
    filter: SubmissionFilterObject,
    pagination: PaginateObject,
  ) {
    const aggregate = await this.prisma.submission.groupBy({
      by: ['response'],
      _count: true,
      where: {
        userId: uid,
        problemId: pid,
      },
    });
    const aggregationMap = {
      all: 0,
    };
    aggregate.map((group) => {
      aggregationMap.all += group._count;
      aggregationMap[group.response] = group._count;
    });

    // Take submission List
    const submissionList = await this.prisma.submission.findMany({
      skip: pagination.skip,
      take: pagination.take,
      orderBy: {
        ...filter.Orderby,
      },
      where: {
        ...filter.Where,
        userId: uid,
        problemId: pid,
      },
    });
    return {
      aggregate: aggregationMap,
      data: submissionList,
    };
  }

  async listPublicSubmission(
    pid: number,
    filter: SubmissionFilterObject,
    pagination: PaginateObject,
  ) {
    const aggregate = await this.prisma.submission.groupBy({
      by: ['response'],
      _count: true,
      where: {
        isPublic: true,
        problemId: pid,
      },
    });
    const aggregationMap = {
      all: 0,
    };
    aggregate.map((group) => {
      aggregationMap.all += group._count;
      aggregationMap[group.response] = group._count;
    });

    const submissions = await this.prisma.submission.findMany({
      skip: pagination.skip,
      take: pagination.take,
      orderBy: {
        ...filter.Orderby,
      },
      where: {
        ...filter.Where,
        isPublic: true,
        problemId: pid,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            email: true,
          },
        },
      },
    });
    return {
      aggreate: aggregationMap,
      data: submissions,
    };
  }

  async readPublicSubmission(pid: number, sid: number) {
    try {
      const submission = await this.prisma.submission.findUniqueOrThrow({
        where: {
          id: sid,
          problemId: pid,
          isPublic: true,
        },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              email: true,
            },
          },
        },
      });
      return submission;
    } catch (err) {
      // P2025 -> If find unique but not found
      //https://www.prisma.io/docs/orm/prisma-migrate/getting-started#baseline-your-production-environment
      if (err.code === 'P2025') {
        throw new NotFoundException('SUBMISSION_NOT_FOUND');
      }
      throw err;
    }
  }

  async readUserSubmission(uid: string, pid: number, sid: number) {
    try {
      return await this.prisma.submission.findUniqueOrThrow({
        where: {
          id: sid,
          problemId: pid,
          userId: uid,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('SUBMISSION_NOT_FOUND');
      }
      throw err;
    }
  }

  async updateUserSubmission(
    uid: string,
    pid: number,
    sid: number,
    dto: UpdateSubmissionDto,
  ) {
    try {
      return await this.prisma.submission.update({
        where: {
          id: sid,
          problemId: pid,
          userId: uid,
        },
        data: {
          ...dto,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('SUBMISSION_NOT_FOUND');
      }
      throw err;
    }
  }

  async listProblemIssue(pid: number, paginate: PaginateObject) {
    return this.prisma.problemIssue.findMany({
      ...paginate,
      where: {
        targetId: pid,
      },
      include: {
        issuer: {
          select: {
            id: true,
            nickname: true,
          },
        },
        target: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async readProblemIssue(pid: number, iid: number) {
    try {
      return this.prisma.problemIssue.findUniqueOrThrow({
        where: {
          id: iid,
          targetId: pid,
        },
        include: {
          issuer: {
            select: {
              id: true,
              nickname: true,
            },
          },
          target: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('ISSUE_NOT_FOUND');
      }
      throw err;
    }
  }

  async createProblemIssue(uid: string, pid: number) {
    return this.prisma.problemIssue.create({
      data: {
        targetId: pid,
        issuerId: uid,
      },
    });
  }

  async updateProblemIssue(
    uid: string,
    pid: number,
    iid: number,
    dto: UpdateProblemIssueDto,
  ) {
    try {
      return this.prisma.problemIssue.update({
        where: {
          id: iid,
          targetId: pid,
          issuerId: uid,
        },
        data: {
          ...dto,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('ISSUE_NOT_FOUND');
      }
      throw err;
    }
  }

  async deleteProblemIssue(uid: string, pid: number, iid: number) {
    try {
      return this.prisma.problemIssue.delete({
        where: {
          id: iid,
          targetId: pid,
          issuerId: uid,
        },
        select: {
          id: true,
          title: true,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('ISSUE_NOT_FOUND');
      }
      throw err;
    }
  }
}
