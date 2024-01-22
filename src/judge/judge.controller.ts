import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from 'app/auth/guard';
import {
  AllowPublic,
  GetUser,
  PaginateObject,
  Pagination,
} from 'app/decorator';
import {
  JudgeFilter,
  JudgeFilterObject,
} from './decorator/judge-filter.decorator';
import { ProblemGuard } from './decorator/problem.guard';
import {
  SubmissionFilter,
  SubmissionFilterObject,
} from './decorator/submission-filter.decorator';
import {
  CreateProblemIssueCommentDto,
  CreateProblemIssueDto,
  RunProblemDto,
  SubmitProblemDto,
  UpdateSubmissionDto,
} from './dto';
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
  @AllowPublic()
  @JudgeDocs.ListProblem()
  listProblem(
    @JudgeFilter() filter: JudgeFilterObject,
    @Pagination() paginate: PaginateObject,
  ) {
    return this.judgeService.listProblem(filter, paginate);
  }

  @Get('/:pid')
  @AllowPublic()
  @UseGuards(ProblemGuard)
  @JudgeDocs.ReadProblem()
  readProblem(
    @Param('pid', ParseIntPipe) pid: number,
    @Request() req: Request,
  ) {
    return this.judgeService.readProblem(pid, req);
  }

  @Post('/:pid/run')
  @HttpCode(200)
  @UseGuards(ProblemGuard)
  @JudgeDocs.RunProblem()
  runProblem(
    @Param('pid', ParseIntPipe) pid: number,
    @Body() dto: RunProblemDto,
  ) {
    return this.judgeService.runProblem(pid, dto);
  }

  @Post(['/:pid/submit', '/:pid/submissions'])
  @HttpCode(200)
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
  @JudgeDocs.ListPublicSubmission()
  listPublicSubmission(
    @Param('pid', ParseIntPipe) pid: number,
    @SubmissionFilter() filter: SubmissionFilterObject,
    @Pagination() pagination: PaginateObject,
  ) {
    return this.judgeService.listPublicSubmission(pid, filter, pagination);
  }

  @Get('/:pid/submissions/public/:sid')
  @UseGuards(ProblemGuard)
  @JudgeDocs.ReadPublicSubmission()
  readPublicSubmission(
    @Param('pid', ParseIntPipe) pid: number,
    @Param('sid', ParseIntPipe) sid: number,
  ) {
    return this.judgeService.readPublicSubmission(pid, sid);
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

  @Get('/:pid/issues')
  @UseGuards(ProblemGuard)
  @JudgeDocs.ListProblemIssue()
  listProblemIssue(
    @Param('pid', ParseIntPipe) pid: number,
    @Pagination() paginate: PaginateObject,
  ) {
    return this.judgeService.listProblemIssue(pid, paginate);
  }

  @Get('/:pid/issues/:iid')
  @UseGuards(ProblemGuard)
  @JudgeDocs.ReadProblemIssue()
  readProblemIssue(
    @Param('pid', ParseIntPipe) pid: number,
    @Param('iid', ParseIntPipe) iid: number,
  ) {
    return this.judgeService.readProblemIssue(pid, iid);
  }

  @Post('/:pid/issues')
  @HttpCode(200)
  @UseGuards(ProblemGuard)
  @JudgeDocs.CreateProblemIssue()
  createProblemIssue(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Body() dto: CreateProblemIssueDto,
  ) {
    return this.judgeService.createProblemIssue(dto, uid, pid);
  }

  @Patch('/:pid/issues/:iid')
  @UseGuards(ProblemGuard)
  @JudgeDocs.UpdateProblemIssue()
  updateProblemIssue(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Param('iid', ParseIntPipe) iid: number,
    @Body() dto: CreateProblemIssueDto,
  ) {
    return this.judgeService.updateProblemIssue(uid, pid, iid, dto);
  }

  @Delete('/:pid/issues/:iid')
  @UseGuards(ProblemGuard)
  @JudgeDocs.DeleteProblemIssue()
  deleteProblemIssue(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Param('iid', ParseIntPipe) iid: number,
  ) {
    return this.judgeService.deleteProblemIssue(uid, pid, iid);
  }

  @Post('/:pid/issues/:iid/comments')
  @HttpCode(200)
  @UseGuards(ProblemGuard)
  @JudgeDocs.CreateProblemIssueComment()
  createProblemIssueComment(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Param('iid', ParseIntPipe) iid: number,
    @Body() dto: CreateProblemIssueCommentDto,
  ) {
    return this.judgeService.createProblemIssueComment(uid, pid, iid, dto);
  }

  @Patch('/:pid/issues/:iid/comments/:cid')
  @UseGuards(ProblemGuard)
  @JudgeDocs.UpdateProblemIssueComment()
  updateProblmeIssueComment(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Param('iid', ParseIntPipe) iid: number,
    @Param('cid', ParseIntPipe) cid: number,
    @Body() dto: CreateProblemIssueCommentDto,
  ) {
    return this.judgeService.updateProblemIssueComment(uid, pid, iid, cid, dto);
  }

  @Delete('/:pid/issues/:iid/comments/:cid')
  @UseGuards(ProblemGuard)
  @JudgeDocs.DeleteProblemIssueComment()
  deleteProblemIssueComment(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Param('iid', ParseIntPipe) iid: number,
    @Param('cid', ParseIntPipe) cid: number,
  ) {
    return this.judgeService.deleteProblemIssueComment(uid, pid, iid, cid);
  }
}
