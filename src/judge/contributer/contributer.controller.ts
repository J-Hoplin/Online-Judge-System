import { Controller, UseGuards } from '@nestjs/common';
import { LocalGuard } from 'app/auth/guard';
import { Role } from 'app/decorator/role.decorator';
import { RoleGuard } from 'app/guard';
import { ContributerService } from './contributer.service';

@Controller()
@Role(['Admin', 'Contributer'])
@UseGuards(RoleGuard)
@UseGuards(LocalGuard)
export class ContributerController {
  constructor(private contributerService: ContributerService) {}
}
