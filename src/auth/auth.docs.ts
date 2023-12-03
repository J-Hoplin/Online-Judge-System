import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SignupResponse } from './response';

export class AuthDocs {
  public static Controller() {
    return applyDecorators(ApiTags('Authentication'));
  }
  public static Singup() {
    return applyDecorators(
      ApiOperation({ description: 'User signup' }),
      ApiOkResponse({
        type: SignupResponse,
      }),
      ApiBadRequestResponse({
        description: ['CREDENTIAL_TAKEN', 'FAIL_TO_SIGNUP'].join(', '),
      }),
    );
  }
  public static Signin() {
    return applyDecorators(
      ApiOperation({ description: 'User signin' }),
      ApiOkResponse({ type: SignupResponse }),
    );
  }
}
