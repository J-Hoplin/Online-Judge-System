import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDocs } from 'app/decorator';
import { ListProblemResponse } from './response/list-problem.response';

export class ContributerDocs {
  public static Controller() {
    return applyDecorators(ApiTags('Judge API - Contriubter'), ApiBearerAuth());
  }
  public static listProblem() {
    return applyDecorators(
      ApiOperation({
        summary: 'Contributer가 출제한 문제 목록을 가져옵니다.',
      }),
      ...PaginationDocs,
      ApiOkResponse({ type: ListProblemResponse, isArray: true }),
    );
  }
}
