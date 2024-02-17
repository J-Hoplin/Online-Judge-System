import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

export async function RmqWorkerInit(): Promise<INestMicroservice> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
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
