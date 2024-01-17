import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CheckCredentialResponse } from './response/check-credential.response';
import { UserDomain } from 'domains';

export class UserDocs {
  public static Controller() {
    return applyDecorators(ApiTags('User'));
  }

  public static GetMyProfile() {
    return applyDecorators(
      ApiOperation({
        summary: '프로필 조회',
      }),
      ApiOkResponse({
        type: UserDomain,
      }),
      ApiBearerAuth(),
    );
  }

  public static GetProfile() {
    return applyDecorators(
      ApiOperation({
        summary: '다른 사용자 프로필 조회',
      }),
      ApiOkResponse({
        type: UserDomain,
      }),
      ApiBadRequestResponse({
        description: ['USER_NOT_FOUND'].join(', '),
      }),
      ApiBearerAuth(),
    );
  }

  public static CheckCredential() {
    return applyDecorators(
      ApiOperation({
        summary: '사용 가능한 Credential인지 확인',
        description:
          '사용 가능하면 True, 불가능하면 false반환. `type` 필드는 Enum입니다.(EMAIL,NICKNAME)',
      }),
      ApiOkResponse({
        type: CheckCredentialResponse,
      }),
    );
  }

  public static updateUserInfo() {
    return applyDecorators(
      ApiOperation({
        summary: '사용자 정보 업데이트',
        description: 'Password가 요구됩니다.',
      }),
      ApiConsumes('multipart/form-data'),
      ApiOkResponse({
        type: UserDomain,
      }),
      ApiBearerAuth(),
    );
  }

  public static updatePassword() {
    return applyDecorators(
      ApiOperation({
        summary: '사용자 비밀번호 변경',
        description: '서비스 내에서 비밀번호 변경시 사용하는 API',
      }),
      ApiBearerAuth(),
    );
  }

  public static setRole() {
    return applyDecorators(
      ApiOperation({
        summary: '사용자 Contributer로 전환(Admin User 전용 API)',
      }),
      ApiBearerAuth(),
    );
  }
}
