import { Injectable } from '@nestjs/common';
import { PrismaService } from 'app/prisma/prisma.service';
import { Judge0Service } from 'judge/judge0';
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
}
