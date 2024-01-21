import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UploadStaticArtifactDto } from './dto';
import { UploadStaticArtifactResponse } from './response';

export class ArtifactDocs {
  public static Controller() {
    return applyDecorators(ApiTags('Artifact'), ApiBearerAuth());
  }
  public static uploadStaticArtifact() {
    return applyDecorators(
      ApiOperation({
        summary: 'Static File Upload. Public Artifact 업로드',
      }),
      ApiConsumes('multipart/form-data'),
      ApiBody({
        type: UploadStaticArtifactDto,
      }),
      ApiCreatedResponse({
        type: UploadStaticArtifactResponse,
      }),
    );
  }
}
