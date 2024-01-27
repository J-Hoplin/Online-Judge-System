import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AllowPublicToken } from 'app/decorator';

// JWT Guard returns 401 default
@Injectable()
export class LocalGuard extends AuthGuard('local') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const allowPublic = this.reflector.get<boolean>(
      AllowPublicToken,
      context.getHandler(),
    );

    if (allowPublic) {
      try {
        return (await super.canActivate(context)) as boolean;
      } catch (err) {
        return true;
      }
    }
    return (await super.canActivate(context)) as boolean;
  }
}
