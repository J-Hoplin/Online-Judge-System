import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from 'app/auth/guard';
import { GetUser, PaginateObject, Pagination } from 'app/decorator';
import {
  JudgeFilter,
  JudgeFilterObject,
} from './decorator/judge-filter.decorator';
import { JudgeDocs } from './judge.docs';
import { JudgeService } from './judge.service';
import { RunProblemDto, SubmitProblemDto, UpdateSubmissionDto } from './dto';
import {
  SubmissionFilter,
  SubmissionFilterObject,
} from './decorator/submission-filter.decorator';
import { ProblemGuard } from './decorator/problem.guard';

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
  @UseGuards(ProblemGuard)
  @JudgeDocs.RunProblem()
  runProblem(
    @Param('pid', ParseIntPipe) pid: number,
    @Body() dto: RunProblemDto,
  ) {
    return this.judgeService.runProblem(pid, dto);
  }

  @Post(['/:pid/submit', '/:pid/submissions'])
  @UseGuards(ProblemGuard)
  @JudgeDocs.SubmitProblem()
  submitProblem(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Body() dto: SubmitProblemDto,
  ) {
    return this.judgeService.submitProblem(uid, pid, dto);
  }

  @Get('/:pid/submissions')
  @UseGuards(ProblemGuard)
  @JudgeDocs.ListUserSubmission()
  listUserSubmissions(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @SubmissionFilter() filter: SubmissionFilterObject,
    @Pagination() pagination: PaginateObject,
  ) {
    return this.judgeService.listUserSubmissions(uid, pid, filter, pagination);
  }

  @Get('/:pid/submissions/public')
  @UseGuards(ProblemGuard)
  listPublicSubmission(
    @Param('pid', ParseIntPipe) pid: number,
    @SubmissionFilter() filter: SubmissionFilterObject,
    @Pagination() pagination: PaginateObject,
  ) {
    return this.judgeService.listPublicSubmission(pid, filter, pagination);
  }

  @Get('/:pid/submissions/:sid')
  @UseGuards(ProblemGuard)
  @JudgeDocs.ReadUserSubmission()
  readUserSubmission(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Param('sid', ParseIntPipe) sid: number,
  ) {
    return this.judgeService.readUserSubmission(uid, pid, sid);
  }

  @Patch('/:pid/submissions/:sid')
  @UseGuards(ProblemGuard)
  @JudgeDocs.UpdateUserSubmission()
  updateUserSubmission(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Param('sid', ParseIntPipe) sid: number,
    @Body() dto: UpdateSubmissionDto,
  ) {
    return this.judgeService.updateUserSubmission(uid, pid, sid, dto);
  }
}
