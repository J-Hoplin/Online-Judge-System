import { Controller, Get, UseGuards } from '@nestjs/common';
import { LocalGuard } from 'app/auth/guard';
import { Role } from 'app/decorator/role.decorator';
import { RoleGuard } from 'app/guard';
import { ContributerService } from './contributer.service';
import { GetUser, PaginateObject, Pagination } from 'app/decorator';
import { ContributerDocs } from './contributer.docs';

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
    @Pagination() pagination: PaginateObject,
  ) {
    return this.contributerService.listProblem(uid, pagination);
  }
}
