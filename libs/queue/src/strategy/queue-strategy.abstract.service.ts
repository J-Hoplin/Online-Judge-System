import { QueueTask } from './type';

export abstract class QueueStrategy {
  abstract sendTask(task: QueueTask): Promise<void>;
}
