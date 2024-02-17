import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { WorkerModule } from './worker/worker.module';

export async function RmqWorkerInit(): Promise<INestMicroservice> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      options: {
        urls: [process.env.RMQ_URL],
        queue: process.env.RMQ_WORKER_QUEUE_NAME,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  return app;
}
