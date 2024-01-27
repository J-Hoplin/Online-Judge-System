import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadStaticArtifactDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  artifact: Express.Multer.File;
}
