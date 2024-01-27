import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SQSMessageType, SQSTask } from '../type';

export class WorkerDto implements SQSTask {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: SQSMessageType;

  @ApiProperty()
  @IsNotEmpty()
  id: string | number;
}
