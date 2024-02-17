import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WorkerModule } from './worker/worker.module';

export async function RmqWorkerInit(): Promise<INestMicroservice> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL],
        queue: process.env.RMQ_WORKER_QUEUE_NAME,
        queueOptions: {
          durable: true,
        },
        prefetchCount: 1,
      },
    },
  );
  return app;
}
