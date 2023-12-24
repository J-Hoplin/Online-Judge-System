import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from 'app/auth/guard';
import { GetUser, PaginateObject, Pagination } from 'app/decorator';
import { JudgeFilter, JudgeFilterObject } from './judge-filter.decorator';
import { JudgeDocs } from './judge.docs';
import { JudgeService } from './judge.service';
import { SubmitProblemDto } from './dto';

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

  @Get('/:pid')
  @JudgeDocs.ReadProblem()
  readProblem(@Param('pid', ParseIntPipe) pid: number) {
    return this.judgeService.readProblem(pid);
  }

  @Post('/:pid/submit')
  @JudgeDocs.SubmitProblem()
  submitProblem(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Body() dto: SubmitProblemDto,
  ) {
    return this.judgeService.submitProblem(uid, pid, dto);
  }
}
