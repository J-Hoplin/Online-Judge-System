import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'app/prisma/prisma.service';
import { Request } from 'express';

/**
 * Problem Issue Id Checker
 * Only use for problem issue id required routers ('iid')
 *
 * Return 404 NotFound Error if problem issue does not found
 */

@Injectable()
export class ProblemIssueGuard implements CanActivate {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const issueId = request.params['iid'];

    try {
      await this.prisma.problemIssue.findUniqueOrThrow({
        where: {
          id: parseInt(issueId),
        },
      });
      return true;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('ISSUE_NOT_FOUND');
      }
      throw err;
    }
    return true;
  }
}
