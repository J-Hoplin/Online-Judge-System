import { Injectable } from '@nestjs/common';
import { StaticArtifactDir } from 'app/config';
import { AwsS3Service } from 's3/aws-s3';
import { UploadStaticArtifactResponse } from './response';

@Injectable()
export class ArtifactService {
  constructor(private s3: AwsS3Service) {}

  async uploadStaticArtifact(
    file: Express.Multer.File,
  ): Promise<UploadStaticArtifactResponse> {
    try {
      const fileKey = await this.s3.uploadFile(file, StaticArtifactDir, {
        public: 'true',
      });
      const url = this.s3.getStaticURL(fileKey, StaticArtifactDir);
      return {
        success: true,
        url,
      };
    } catch (err) {
      return {
        success: false,
        url: '',
      };
    }
  }
}

/**
 * Bucket Policy
 *
 * Set tag "public=true" to set artifact public access
 *
 * https://repost.aws/knowledge-center/read-access-objects-s3-bucket
 */
