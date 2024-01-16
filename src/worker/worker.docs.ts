import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export class WorkerDocs {
  public static WorkerController() {
    return applyDecorators(
      ApiOperation({
        summary: 'AWS SQS worker Controller',
      }),
      ApiOkResponse({
        description: 'If worker task success return 200',
      }),
    );
  }
}
