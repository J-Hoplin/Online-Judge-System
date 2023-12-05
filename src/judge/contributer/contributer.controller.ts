import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from 'app/auth/guard';
import { Role } from 'app/decorator/role.decorator';
import { RoleGuard } from 'app/guard';
import { ContributerService } from './contributer.service';
import { GetUser, PaginateObject, Pagination } from 'app/decorator';
import { ContributerDocs } from './contributer.docs';
import { CreateProblmeDto } from 'app/judge/contributer/dto/create-problme.dto';

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
  createProblem(@GetUser('id') uid: string, @Body() dto: CreateProblmeDto) {
    return this.contributerService.createProblem(uid, dto);
  }
}
