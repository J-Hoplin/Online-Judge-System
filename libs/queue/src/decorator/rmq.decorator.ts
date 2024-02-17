import * as amqp from 'amqplib';

/**
 *
 * Method decorator of Rabbit MQ Strategy
 *
 */
export function RabbitMQConenction(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // Preserve original function
    const fn: (...args: any[]) => any = descriptor.value;
    descriptor.value = async function (...args) {
      // Connect to RMQ
      const connection = await amqp.connect(process.env.RMQ_URL);
      // Assert Channel
      const channel = await connection.createChannel();
      // Assert Queue
      await channel.assertQueue(process.env.RMQ_WORKER_QUEUE_NAME, {
        durable: true,
      });
      const task: string = await fn.apply(this, args);
      channel.sendToQueue(process.env.RMQ_WORKER_QUEUE_NAME, Buffer.from(task));
      setTimeout(() => {
        connection.close();
      }, 500);
    };
  };
}
