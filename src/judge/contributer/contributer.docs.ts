import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDocs } from 'app/decorator';
import { ListProblemResponse } from './response/list-problem.response';
import { CreateProblemResponse } from 'app/judge/contributer/response/create-problem.response';
import { ReadProblemResponse } from 'app/judge/contributer/response';

export class ContributerDocs {
  public static Controller() {
    return applyDecorators(ApiTags('Judge API - Contriubter'), ApiBearerAuth());
  }
  public static listProblem() {
    return applyDecorators(
      ApiOperation({
        summary: 'Contributer가 출제한 문제 목록을 가져옵니다.',
      }),
      ApiQuery({
        name: 'search',
        required: false,
        description: '문제에 포함된 문자열 기준 검색',
      }),
      ...PaginationDocs,
      ApiOkResponse({ type: ListProblemResponse, isArray: true }),
    );
  }

  public static readProblem() {
    return applyDecorators(
      ApiOperation({
        summary: '단일 문제 조회',
      }),
      ApiOkResponse({
        type: ReadProblemResponse,
      }),
      ApiForbiddenResponse({
        description: ['FORBIDDEN_REQUEST'].join(', '),
      }),
    );
  }

  public static createProblem() {
    return applyDecorators(
      ApiOperation({
        summary: '문제 생성하기',
      }),
      ApiOkResponse({
        type: CreateProblemResponse,
      }),
    );
  }
}
