import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

/**
 * All of the AWS SDK version is Version 3
 *
 * Do not use Version2 AWS SDK. It will be deprecated in near future
 *
 *
 * AWS S3 v3 Guidance : https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
 *
 * < Used SDK Reference >
 *
 * GetObjectCommand: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
 * getSignedURL: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_request_presigner.html
 * PutObjectCommand: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
 *
 */

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;
  private s3Bucket: string;
  private defaultExpireDay = 1;

  constructor() {
    /** Initiate S3Client */
    this.s3Client = new S3Client({
      region: process.env.AWS_S3_Region,
      credentials: {
        accessKeyId: process.env.AWS_S3_AccessKeyId,
        secretAccessKey: process.env.AWS_S3_AccessKey,
      },
    });
    this.s3Bucket = process.env.AWS_S3_BUCKET;
  }

  /** Upload file */
  public async uploadFile(file: Express.Multer.File, directory: string) {
    /** Generate file salt */
    const fileSalt = v4();
    /** File name with salt */
    const fileKey = `${fileSalt}_${file.originalname}`;
    /** S3 upload location */
    const s3SavedIn = this.directoryBuilder(fileKey, directory);
    /** S3 Object put command */
    const command = new PutObjectCommand({
      Bucket: this.s3Bucket,
      Key: s3SavedIn,
      ContentType: file.mimetype,
      Body: file.buffer,
      ACL: 'public-read',
    });

    await this.s3Client.send(command);
    return fileKey;
  }

  /** Make sure AWS S3 Bucket is set as ACL Activated */
  /** This method is for common file url generator */
  public getStaticURL(fileKey: string, directory: string) {
    if (!fileKey) {
      return null;
    }
    return `https://${process.env.AWS_S3_BUCKET}.s3.${
      process.env.AWS_S3_Region
    }.amazonaws.com/${this.directoryBuilder(fileKey, directory)}`;
  }

  /** Issue presigned URL */
  /** This method is for file url generator which requires expire date*/
  public async getSignedURL(
    fileKey: string,
    directory: string,
    expireDay?: number,
  ) {
    /** If file not exist, return null */
    if (!fileKey) {
      return null;
    }
    const expireSecond = expireDay
      ? this.dayToSecond(expireDay < 1 ? 1 : expireDay)
      : this.dayToSecond(this.defaultExpireDay);
    const expectedLocation = this.directoryBuilder(fileKey, directory);
    try {
      /** Generate Get Object Command */
      const command = new GetObjectCommand({
        Bucket: this.s3Bucket,
        Key: expectedLocation,
      });

      /** Issue new Presigned URL */
      const signedURL = await getSignedUrl(this.s3Client, command, {
        expiresIn: expireSecond,
      });

      return signedURL;
    } catch (err) {
      /** Return null if S3 fail to issue presigned URL */
      return null;
    }
  }

  /** Remove Object */
  public async removeObject(
    fileKey: string,
    directory: string,
  ): Promise<boolean> {
    /** If key not handled, return */
    if (!fileKey) {
      return true;
    }
    const expectedLocation = this.directoryBuilder(fileKey, directory);
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.s3Bucket,
        Key: expectedLocation,
      });
      await this.s3Client.send(command);
      return true;
    } catch (err) {
      /** Fail to delet object */
      return false;
    }
  }

  private directoryBuilder(fileName: string, directory: string) {
    return `${directory}/${fileName}`;
  }

  private dayToSecond(day: number) {
    return day * 24 * 60 * 60;
  }
}
