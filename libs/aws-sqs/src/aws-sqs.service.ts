import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { SQSTask } from './type';

@Injectable()
export class AwsSqsService {
  private sqsClient: SQSClient;
  private sqsQueue: string;

  constructor() {
    // SQS Client
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_ACCESS_SECRET,
      },
    });

    // SQS URL
    this.sqsQueue = process.env.AWS_SQS_QUEUE;
  }

  async sendTask(task: SQSTask) {
    const command = new SendMessageCommand({
      QueueUrl: this.sqsQueue,
      MessageBody: JSON.stringify(task),
    });
    await this.sqsClient.send(command);
  }
}
