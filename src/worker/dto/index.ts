import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { QueueTask, SQSMessageType } from 'queue/queue/strategy/type';

export class WorkerDto implements QueueTask {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: SQSMessageType;

  @ApiProperty()
  @IsNotEmpty()
  id: string | number;
}
