import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'app/prisma/prisma.service';
import { Request } from 'express';

/**
 * Problem Id Checker
 * Only use for problem id required routers
 */

@Injectable()
export class ProblemGuard implements CanActivate {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const problemId = request.params['pid'];

    // If path parameter problem id is missing
    if (!problemId) {
      throw new BadRequestException('PROBLEM_ID_MISSING');
    }

    // Check if problem in DB
    try {
      const problem = await this.prisma.problem.findUnique({
        where: {
          id: parseInt(problemId),
        },
      });
      return true;
    } catch (err) {
      throw new BadRequestException('PROBLEM_NOT_FOUND');
    }
  }
}
