import { Module } from '@nestjs/common';
import { ArtifactController } from './artifact.controller';
import { ArtifactService } from './artifact.service';
import { AwsS3Module } from 's3/aws-s3';

@Module({
  imports: [AwsS3Module],
  controllers: [ArtifactController],
  providers: [ArtifactService],
})
export class ArtifactModule {}
