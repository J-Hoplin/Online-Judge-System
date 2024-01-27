import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

export class WorkerDocs {
  public static Controller() {
    return applyDecorators(ApiTags('Async Task'));
  }
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
