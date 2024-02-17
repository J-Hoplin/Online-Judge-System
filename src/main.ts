import { config } from 'dotenv';
import { AppServerInit } from './app.webserver';
import { RmqWorkerInit } from './app.worker';

config();

async function bootstrap() {
  // If Queue use SQS -> Worker should be also webserver
  if (process.env.QUEUE_TYPE === 'SQS') {
    const app = await AppServerInit();
    await app.listen(process.env.PORT || 3000);
  } else {
    // Use RMQ and type is worker
    if (process.env.TYPE === 'worker') {
      const app = await RmqWorkerInit();
      await app.listen();
    }
    // Use RMQ and type is webserver
    else {
      const app = await AppServerInit();
      await app.listen(process.env.PORT || 3000);
    }
  }
}
bootstrap();
