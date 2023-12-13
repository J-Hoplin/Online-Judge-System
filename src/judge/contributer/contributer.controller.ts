import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from 'app/auth/guard';
import { GetUser, PaginateObject, Pagination } from 'app/decorator';
import { Role } from 'app/decorator/role.decorator';
import { RoleGuard } from 'app/guard';
import { UpdateProblmeDto } from 'app/judge/contributer/dto/update-problem.dto';
import { ContributerDocs } from './contributer.docs';
import { ContributerService } from './contributer.service';
import { UpdateExampleDto } from './dto';

@Controller()
@Role(['Admin', 'Contributer']) // Set Controller Level RBAC
@UseGuards(RoleGuard)
@UseGuards(LocalGuard)
@ContributerDocs.Controller()
export class ContributerController {
  constructor(private contributerService: ContributerService) {}

  @Get('problems')
  @ContributerDocs.listProblem()
  listProblem(
    @GetUser('id') uid: string,
    @Query('search') search: string,
    @Pagination() pagination: PaginateObject,
  ) {
    return this.contributerService.listProblem(uid, search, pagination);
  }

  @Get('problems/:pid')
  @ContributerDocs.readProblem()
  readProblem(
    @GetUser('id') uid: string,
    @Query('pid', ParseIntPipe) pid: number,
  ) {
    return this.contributerService.readProblem(uid, pid);
  }

  @Post('problems')
  @ContributerDocs.createProblem()
  createProblem(@GetUser('id') uid: string) {
    return this.contributerService.createProblem(uid);
  }

  @Patch('problems/:pid')
  @ContributerDocs.updateProblem()
  updateProblem(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Body() dto: UpdateProblmeDto,
  ) {
    return this.contributerService.updateProblem(uid, pid, dto);
  }

  @Delete('problems/:pid')
  deleteProblem(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
  ) {
    return this.contributerService.deleteProblem(uid, pid);
  }

  @Post('problems/:pid/examples')
  @ContributerDocs.createExample()
  createExample(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
  ) {
    return this.contributerService.createExmaple(uid, pid);
  }

  @Patch('problems/:pid/examples/:eid')
  @ContributerDocs.updateExample()
  updateExample(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Param('eid', ParseIntPipe) eid: number,
    @Body() dto: UpdateExampleDto,
  ) {
    return this.contributerService.updateExample(uid, pid, eid, dto);
  }

  @Delete('problems/:pid/examples/:eid')
  @ContributerDocs.deleteExample()
  deleteExample(
    @GetUser('id') uid: string,
    @Param('pid', ParseIntPipe) pid: number,
    @Param('eid', ParseIntPipe) eid: number,
  ) {
    return this.contributerService.deleteExample(uid, pid, eid);
  }
}
