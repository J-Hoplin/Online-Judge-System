import { AuthGuard } from '@nestjs/passport';

// JWT Guard returns 401 default
export class LocalGuard extends AuthGuard('local') {}
