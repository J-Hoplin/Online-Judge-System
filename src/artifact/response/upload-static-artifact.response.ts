import { ApiProperty } from '@nestjs/swagger';

export class UploadStaticArtifactResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  url: string;
}
