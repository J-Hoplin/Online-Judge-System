import { Injectable } from '@nestjs/common';
import { PrismaService } from 'app/prisma/prisma.service';

@Injectable()
export class ContributerService {
  constructor(private prisma: PrismaService) {}
}
