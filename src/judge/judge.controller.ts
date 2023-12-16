import { Controller, Get, UseGuards } from '@nestjs/common';
import { LocalGuard } from 'app/auth/guard';
import { PaginateObject, Pagination } from 'app/decorator';
import { JudgeFilter, JudgeFilterObject } from './judge-filter.decorator';
import { JudgeDocs } from './judge.docs';
import { JudgeService } from './judge.service';

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

  @Get('/')
  @JudgeDocs.ListProblem()
  listProblem(
    @JudgeFilter() filter: JudgeFilterObject,
    @Pagination() paginate: PaginateObject,
  ) {
    return this.judgeService.listProblem(filter, paginate);
  }
}
