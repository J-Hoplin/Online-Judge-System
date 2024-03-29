import { ValueProvider } from '@nestjs/common';
import { Judge0Service } from 'judge/judge0';
import { QueueService } from 'queue/queue/strategy';
import { AwsS3Service } from 's3/aws-s3';

/**
 * Mock Object of Judge0 Service
 */
export const JudgeLibraryMockProvider: ValueProvider = {
  provide: Judge0Service,
  useValue: {
    getLanguages: () => [
      {
        id: 0,
        name: 'string',
      },
      {
        id: 0,
        name: 'string',
      },
    ],
    submit: (...args) => {
      return {
        isCorrect: true,
        description: 'CORRECT',
        languageId: 71,
        memory: 3260,
        time: 0.015,
        statusId: 3,
        output: {
          expect: 'hello',
          input: '',
          stdout: 'hello\n',
          message: null,
        },
      };
    },
  },
};

/**
 * Mock Object of AWS S3
 */
export const AwsS3LibraryMockProvider: ValueProvider = {
  provide: AwsS3Service,
  useValue: {
    uploadFile: jest.fn((...args) => 'some-url'),
    getStaticURL: jest.fn((...args) => 'some-url'),
    getSignedURL: jest.fn((...args) => 'some-url'),
    removeObject: jest.fn((...args) => 'some-url'),
  },
};

/**
 * Mock Object of QueueService
 */
export const QueueLibraryMockProvider: ValueProvider = {
  provide: QueueService,
  useValue: {
    sendTask: jest.fn((...args) => true),
  },
};
