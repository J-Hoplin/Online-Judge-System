import { Inject, Injectable, Logger } from '@nestjs/common';
import { SYSTEM_CONTEXT, SYSTEM_LOGGER } from './token';

@Injectable()
export class SystemLoggerService {
  constructor(
    @Inject(SYSTEM_CONTEXT) private context: string,
    @Inject(SYSTEM_LOGGER) private logger: Logger,
  ) {}

  log(msg: string) {
    this.logger.log(msg, this.context);
  }

  warn(msg: string) {
    this.logger.warn(msg, this.context);
  }

  fatal(msg: string) {
    this.logger.fatal(msg, this.context);
  }

  error(msg: string) {
    this.logger.error(msg, this.context);
  }
}
