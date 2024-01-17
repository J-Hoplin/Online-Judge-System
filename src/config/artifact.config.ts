import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  ApiPayloadTooLargeResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

// Interface type of artifact limit configuration
interface ArtifactValidationConfig {
  size: number;

  extension: RegExp;
}

// Util: MB unit to Byte
const mbt2bt = (mbt: number) => {
  return mbt * 1024 * 1024;
};

/**
 * Util FileNameTransformerPipe
 *
 * https://github.com/expressjs/multer/issues/1104
 *
 * https://github.com/mscdex/busboy/issues/20
 *
 * Multer use internally use 'BusBoy' package which is streaming parser of Form Data
 *
 * Clients should be sending non-latin1 header parameter values using the format (encoded words) defined by RFC5987. If they don't send that, then the values are assumed to be encoded as latin1
 */
@Injectable()
export class FileNameTransformPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (value) {
      value.originalname = Buffer.from(value.originalname, 'latin1').toString(
        'utf-8',
      );
      return value;
    }
    return value;
  }
}

// File Option Factory
export const FileOptionFactory = (
  config: ArtifactValidationConfig,
): MulterOptions => {
  return {
    limits: {
      fileSize: mbt2bt(config.size),
    },
    fileFilter: (req, file, cb) => {
      if (file.originalname.toLowerCase().match(config.extension)) {
        cb(null, true);
      } else {
        cb(new UnprocessableEntityException('UNSUPPORTED_EXTENSION'), false);
      }
    },
  };
};

// File Option Validation error swagger document
export const FileValidationErrorDocs = () => {
  return [
    ApiPayloadTooLargeResponse({
      description: 'FILE_SIZE_LIMIT_EXCEED',
    }),
    ApiUnprocessableEntityResponse({
      description: 'UNSUPPORTED_EXTENSION',
    }),
  ];
};

//Config

export const UserProfileImageArtifactConfig: ArtifactValidationConfig = {
  size: 10,
  extension: /^.*\.(jpg|jpeg|png)$/,
};

export const StaticArtifactConfig: ArtifactValidationConfig = {
  size: 10,
  extension: /^.*\.[a-zA-Z0-9]+$/,
};
