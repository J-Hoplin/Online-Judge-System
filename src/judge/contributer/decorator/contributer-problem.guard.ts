import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'app/prisma/prisma.service';
import { Request } from 'express';

/**
 * Contributer problem Id Checker
 *
 * Assuem that user id already check from controller level Auth Guard
 *
 * Return 403 Forbidden Error if problem with contributer ID not found
 */

@Injectable()
export class ContributerProblemGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Get User info
    const userId = request.user['id'];
    // Get Problem Id
    const problemId = request.params['pid'];

    try {
      await this.prisma.problem.findUniqueOrThrow({
        where: {
          id: parseInt(problemId),
          contributerId: userId,
        },
      });
      return true;
    } catch (err) {
      console.error(err);
      if (err.code === 'P2025') {
        throw new ForbiddenException('FORBIDDEN_REQUEST');
      }
      throw err;
    }
  }
}
