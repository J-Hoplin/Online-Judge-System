import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FileNameTransformPipe,
  FileOptionFactory,
  StaticArtifactConfig,
} from 'app/config/artifact.config';
import { ArtifactDocs } from './artifact.docs';
import { ArtifactService } from './artifact.service';

@Controller('artifact')
@ArtifactDocs.Controller()
export class ArtifactController {
  constructor(private artifactService: ArtifactService) {}

  @Post('static')
  @UseInterceptors(
    FileInterceptor('artifact', FileOptionFactory(StaticArtifactConfig)),
  )
  @ArtifactDocs.uploadStaticArtifact()
  uploadStaticArtifact(
    @UploadedFile(FileNameTransformPipe) file: Express.Multer.File,
  ) {
    return this.artifactService.uploadStaticArtifact(file);
  }
}
