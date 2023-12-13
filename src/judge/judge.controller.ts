import { Controller, Get, UseGuards } from '@nestjs/common';
import { LocalGuard } from 'app/auth/guard';
import { JudgeService } from './judge.service';
import { JudgeDocs } from './judge.docs';

@Controller()
@UseGuards(LocalGuard)
@JudgeDocs.Controller()
export class JudgeController {
  constructor(private judgeService: JudgeService) {}

  @Get('languages')
  @JudgeDocs.GetLanguages()
  getLanguages() {
    return this.judgeService.getLanguages();
  }
}
