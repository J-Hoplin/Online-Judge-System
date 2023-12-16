import { Injectable } from '@nestjs/common';
import { PrismaService } from 'app/prisma/prisma.service';
import { Judge0Service } from 'judge/judge0';
import { GetLanguagesResponse } from './response/get-languages.response';
import { PaginateObject } from 'app/decorator';
import { JudgeFilterObject } from './judge-filter.decorator';

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
}
