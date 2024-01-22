import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { PaginationDocs } from 'app/decorator';
import { ProblemIssueDomain, SubmissionDomain } from 'domains';
import { SubmissionFilterDocs } from './decorator/submission-filter.decorator';
import {
  CreateProblemIssueCommentResponse,
  DeleteProblemIssueCommentResponse,
  DeleteProblemIssueResponse,
  GetLanguagesResponse,
  ListProblemIssueResponse,
  ListProblemResponse,
  ListUserSubmissionRepsonse,
  ReadProblemResponse,
  ReadPublicSubmissionResponse,
  RunProblemResponse,
  SubmitProblemResponse,
} from './response';
import { ReadProblemIssueResponse } from './response/read-problem-issue.response';

export class JudgeDocs {
  public static Controller() {
    return applyDecorators(ApiTags('Judge0'), ApiBearerAuth());
  }
  public static GetLanguages() {
    return applyDecorators(
      ApiOperation({ summary: '지원하는 언어 목록 출력' }),
      ApiOkResponse({ type: GetLanguagesResponse, isArray: true }),
    );
  }

  public static ListProblem() {
    return applyDecorators(
      ApiOperation({ summary: '문제 리스트 출력' }),
      ApiOkResponse({ type: ListProblemResponse, isArray: true }),
      ...PaginationDocs,
    );
  }

  public static ReadProblem() {
    return applyDecorators(
      ApiOperation({
        summary:
          '문제 반환. 비로그인 사용 가능 API. 비로그인 사용하는 경우에는 `isSuccess` 필드가 없습니다. Enum은 Response Schema 참고바랍니다.',
      }),
      ApiOkResponse({
        type: ReadProblemResponse,
      }),
      ApiNotFoundResponse({ description: ['PROBLEM_NOT_FOUND'].join(', ') }),
    );
  }

  public static RunProblem() {
    return applyDecorators(
      ApiOperation({ summary: 'Public Example 실행' }),
      ApiOkResponse({
        type: RunProblemResponse,
        isArray: true,
      }),
      ApiBadRequestResponse({
        description: ['EXAMPLE_NOT_EXIST'].join(', '),
      }),
      ApiNotFoundResponse({ description: ['PROBLEM_NOT_FOUND'].join(', ') }),
    );
  }

  public static SubmitProblem() {
    return applyDecorators(
      ApiOperation({ summary: '최종 제출' }),
      ApiOkResponse({
        type: SubmitProblemResponse,
      }),
      ApiBadRequestResponse({
        description: ['EXAMPLE_NOT_EXIST'].join(', '),
      }),
      ApiNotFoundResponse({ description: ['PROBLEM_NOT_FOUND'].join(', ') }),
    );
  }

  public static ListUserSubmission() {
    return applyDecorators(
      ApiOperation({ summary: '사용자 Submission 리스트' }),
      ApiOkResponse({ type: ListUserSubmissionRepsonse }),
      ApiNotFoundResponse({
        description: ['PROBLEM_NOT_FOUND', 'SUBMISSION_NOT_FOUND'].join(', '),
      }),
      ...SubmissionFilterDocs,
      ...PaginationDocs,
    );
  }

  public static ListPublicSubmission() {
    return applyDecorators(
      ApiOperation({ summary: '공개된 Submission 리스트' }),
      ApiOkResponse({ type: ListUserSubmissionRepsonse }),
      ApiNotFoundResponse({
        description: ['PROBLEM_NOT_FOUND', 'SUBMISSION_NOT_FOUND'].join(', '),
      }),
      ...SubmissionFilterDocs,
      ...PaginationDocs,
    );
  }

  public static ReadPublicSubmission() {
    return applyDecorators(
      ApiOperation({ summary: '공개된 Submission 상세보기' }),
      ApiOkResponse({ type: ReadPublicSubmissionResponse }),
      ApiNotFoundResponse({
        description: ['PROBLEM_NOT_FOUND', 'SUBMISSION_NOT_FOUND'].join(', '),
      }),
    );
  }

  public static ReadUserSubmission() {
    return applyDecorators(
      ApiOperation({ summary: '사용자 Submission 상세보기' }),
      ApiOkResponse({ type: SubmissionDomain }),
      ApiNotFoundResponse({
        description: ['PROBLEM_NOT_FOUND', 'SUBMISSION_NOT_FOUND'].join(', '),
      }),
    );
  }

  public static UpdateUserSubmission() {
    return applyDecorators(
      ApiOperation({ summary: '사용자 Submission isPublic 변경' }),
      ApiOkResponse({ type: SubmissionDomain }),
      ApiForbiddenResponse({
        description: ['SUBMISSION_NOT_FOUND'].join(', '),
      }),
      ApiNotFoundResponse({
        description: ['PROBLEM_NOT_FOUND'].join(', '),
      }),
    );
  }

  public static ListProblemIssue() {
    return applyDecorators(
      ApiOperation({ summary: 'Problem의 Issue 리스트' }),
      ApiOkResponse({ type: ListProblemIssueResponse, isArray: true }),
      ApiNotFoundResponse({
        description: ['PROBLEM_NOT_FOUND', 'ISSUE_NOT_FOUND'].join(', '),
      }),
      ...PaginationDocs,
    );
  }

  public static ReadProblemIssue() {
    return applyDecorators(
      ApiOperation({ summary: 'Problem의 Issue 조회' }),
      ApiOkResponse({ type: ReadProblemIssueResponse }),
      ApiNotFoundResponse({
        description: ['PROBLEM_NOT_FOUND', 'ISSUE_NOT_FOUND'].join(', '),
      }),
    );
  }

  public static CreateProblemIssue() {
    return applyDecorators(
      ApiOperation({ summary: 'Problem의 Issue 생성' }),
      ApiOkResponse({ type: ProblemIssueDomain }),
      ApiNotFoundResponse({
        description: ['PROBLEM_NOT_FOUND'].join(', '),
      }),
    );
  }

  public static UpdateProblemIssue() {
    return applyDecorators(
      ApiOperation({ summary: 'Problem Issue 수정' }),
      ApiOkResponse({ type: ProblemIssueDomain }),
      ApiForbiddenResponse({
        description: ['ISSUE_NOT_FOUND'].join(', '),
      }),
      ApiNotFoundResponse({
        description: ['PROBLEM_NOT_FOUND'].join(', '),
      }),
    );
  }

  public static DeleteProblemIssue() {
    return applyDecorators(
      ApiOperation({ summary: 'Problem Issue 삭제' }),
      ApiOkResponse({ type: DeleteProblemIssueResponse }),
      ApiForbiddenResponse({
        description: ['ISSUE_NOT_FOUND'].join(', '),
      }),
      ApiNotFoundResponse({
        description: ['PROBLEM_NOT_FOUND'].join(', '),
      }),
    );
  }

  public static CreateProblemIssueComment() {
    return applyDecorators(
      ApiOperation({ summary: 'Problem Issue Comment 생성' }),
      ApiOkResponse({ type: CreateProblemIssueCommentResponse }),
      ApiForbiddenResponse({
        description: ['ISSUE_NOT_FOUND'].join(', '),
      }),
      ApiNotFoundResponse({ description: ['PROBLEM_NOT_FOUND'].join(', ') }),
    );
  }

  public static UpdateProblemIssueComment() {
    return applyDecorators(
      ApiOperation({ summary: 'Problem Issue Comment 수정' }),
      ApiOkResponse({ type: CreateProblemIssueCommentResponse }),
      ApiForbiddenResponse({
        description: ['ISSUE_COMMENT_NOT_FOUND'].join(', '),
      }),
      ApiNotFoundResponse({ description: ['PROBLEM_NOT_FOUND'].join(', ') }),
    );
  }

  public static DeleteProblemIssueComment() {
    return applyDecorators(
      ApiOperation({ summary: 'Problem Issue Comment 삭제' }),
      ApiOkResponse({ type: DeleteProblemIssueCommentResponse }),
      ApiForbiddenResponse({
        description: ['ISSUE_COMMENT_NOT_FOUND'].join(', '),
      }),
      ApiNotFoundResponse({ description: ['PROBLEM_NOT_FOUND'].join(', ') }),
    );
  }
}
