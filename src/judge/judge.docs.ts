import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { PaginationDocs } from 'app/decorator';
import { ApiMultipleResponse } from 'app/decorator/multiple-response.decorator';
import { ProblemIssueDomain, SubmissionDomain } from 'domains';
import { SubmissionFilterDocs } from './decorator/submission-filter.decorator';
import {
  CreateProblemIssueCommentResponse,
  DeleteProblemIssueCommentResponse,
  DeleteProblemIssueResponse,
  GetLanguagesResponse,
  ListProblemAuthenticatedResponse,
  ListProblemIssueResponse,
  ListProblemUnAuthenticatedResponse,
  ListUserSubmissionRepsonse,
  ReadProblemAuthenticatedResponse,
  ReadProblemUnauthenticatedResponse,
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
      ApiMultipleResponse(HttpStatus.OK, {
        Authenticated: {
          classRef: ListProblemUnAuthenticatedResponse,
          example: {
            id: 11,
            title: 'New Problem',
            contributer: {
              nickname: 'admin',
            },
            correct: 1,
            total: 1,
            correctionRate: '1.000',
            status: 'SUCCESS',
          },
          isArray: true,
          description: 'If authenticated response',
        },
        UnAuthenticated: {
          classRef: ListProblemAuthenticatedResponse,
          example: {
            id: 10,
            title: 'string',
            contributer: {
              nickname: 'admin',
            },
            correct: 0,
            total: 1,
            correctionRate: '0.000',
          },
          isArray: true,
          description: 'If Unauthenticated Response',
        },
      }),
      ...PaginationDocs,
    );
  }

  public static ReadProblem() {
    return applyDecorators(
      ApiOperation({
        summary:
          '문제 반환. 비로그인 사용 가능 API. 비로그인 사용하는 경우에는 `isSuccess` 필드가 없습니다. Enum은 Response Schema 참고바랍니다.',
      }),
      ApiMultipleResponse(HttpStatus.OK, {
        Authenticated: {
          classRef: ReadProblemAuthenticatedResponse,
          example: {
            id: 11,
            title: 'New Problem',
            problem: 'Problem Here',
            input: 'Input Here',
            output: 'Output Here',
            timeLimit: 5,
            memoryLimit: 128,
            contributerId: '97f16592-93a3-4bba-9bc5-08f55c860bd4',
            tags: [],
            isOpen: true,
            isArchived: false,
            deletedAt: null,
            createdAt: '2024-01-16T14:12:07.748Z',
            updatedAt: '2024-01-16T14:12:39.185Z',
            examples: [
              {
                id: 6,
                input: '',
                output: 'hello world',
                isPublic: true,
                problemId: 11,
              },
            ],
            isSuccess: 'SUCCESS',
          },
        },
        UnAuthenticated: {
          classRef: ReadProblemUnauthenticatedResponse,
          example: {
            id: 11,
            title: 'New Problem',
            problem: 'Problem Here',
            input: 'Input Here',
            output: 'Output Here',
            timeLimit: 5,
            memoryLimit: 128,
            contributerId: '97f16592-93a3-4bba-9bc5-08f55c860bd4',
            tags: [],
            isOpen: true,
            isArchived: false,
            deletedAt: null,
            createdAt: '2024-01-16T14:12:07.748Z',
            updatedAt: '2024-01-16T14:12:39.185Z',
            examples: [
              {
                id: 6,
                input: '',
                output: 'hello world',
                isPublic: true,
                problemId: 11,
              },
            ],
          },
        },
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
