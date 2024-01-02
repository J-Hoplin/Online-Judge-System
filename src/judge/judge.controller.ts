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
import { RunProblemDto, SubmitProblemDto } from './dto';
import {
  SubmissionFilter,
  SubmissionFilterObject,
} from './submission-filter.decorator';

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

  @Post('/:pid/run')
  @JudgeDocs.RunProblem()
  runProblem(
    @Param('pid', ParseIntPipe) pid: number,
    @Body() dto: RunProblemDto,
  ) {
    return this.judgeService.runProblem(pid, dto);
  }

  @Post(['/:pid/submit', '/:pid/submission'])
  @JudgeDocs.SubmitProblem()
  submitProblem(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Body() dto: SubmitProblemDto,
  ) {
    return this.judgeService.submitProblem(uid, pid, dto);
  }

  @Get('/:pid/submission')
  listUserSubmissions(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @SubmissionFilter() filter: SubmissionFilterObject,
    @Pagination() pagination: PaginateObject,
  ) {
    return this.judgeService.listUserSubmissions(uid, pid, filter, pagination);
  }
}
