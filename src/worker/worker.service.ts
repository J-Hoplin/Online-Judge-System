import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'app/prisma/prisma.service';
import { WorkerDto } from 'aws-sqs/aws-sqs/dto';
import { ProblemDomain, SubmissionDomain } from 'domains';
import { Judge0Service } from 'judge/judge0';

@Injectable()
export class WorkerService {
  private log: Logger = new Logger();

  constructor(private prisma: PrismaService, private judge0: Judge0Service) {}

  async worker(dto: WorkerDto) {
    switch (dto.message) {
      // Re-Correct if contributer modify example
      case 'RE_CORRECTION':
        return await this.reCorrectSubmissions(dto.id as number);
        break;
      // Code Submit
      case 'CODE_SUBMIT':
        break;
      default:
        // If message with unsupported message type -> Consume and ignore
        this.log.warn(`Unknown queue item detected: ${dto}`);
        return true;
    }
  }

  async reCorrectSubmissions(id: number) {
    try {
      // Get all of the submission with problem id
      const submissions = await this.prisma.submission.findMany({
        where: {
          problemId: id,
        },
      });

      let problem: ProblemDomain;
      try {
        problem = await this.prisma.problem.findUnique({
          where: {
            id: id,
          },
        });
      } catch (err) {
        // If target problem is unappropriate problem for recorrection
        return true;
      }
      for (const submission of submissions) {
        await this.correctionWithExample(id, submission, problem);
      }
      return true;
    } catch (err) {
      // If fail -> Do logging and throw error again
      console.error(`Fail to recorrect submission: ${id}`);
      console.error(`Message: ${err}`);
      throw err;
    }
  }

  async correctionWithExample(
    problemId: number,
    submission: SubmissionDomain,
    problem: ProblemDomain,
  ) {
    const examples = await this.prisma.problemExample.findMany({
      where: {
        problemId: problemId,
      },
    });

    const results = await Promise.all(
      examples.map((example) => {
        return this.judge0.submit(
          submission.languageId,
          submission.code,
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

    await this.prisma.$transaction([
      this.prisma.submission.update({
        where: {
          id: submission.id,
        },
        data: {
          memory: data.memory,
          time: data.time,
          isCorrect: data.isCorrect,
          response: data.description,
        },
      }),
    ]);
    return true;
  }
}
