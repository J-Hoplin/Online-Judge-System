import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
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
import { LocalGuard } from 'app/auth/guard';

@Controller('artifact')
@UseGuards(LocalGuard)
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
