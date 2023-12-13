import { Global, Logger, Module } from '@nestjs/common';
import { SystemLoggerService } from './system-logger.service';
import { SYSTEM_CONTEXT, SYSTEM_LOGGER } from './token';

@Global()
@Module({
  providers: [
    SystemLoggerService,
    {
      useValue: SYSTEM_CONTEXT,
      provide: SYSTEM_CONTEXT,
    },
    {
      provide: SYSTEM_LOGGER,
      useFactory: () => {
        const logger = new Logger();
        return logger;
      },
    },
  ],
  exports: [SystemLoggerService],
})
export class SystemLoggerModule {}
