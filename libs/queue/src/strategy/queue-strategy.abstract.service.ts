import { QueueTask } from './type';

export abstract class QueueService {
  abstract sendTask(task: QueueTask): Promise<string>;
}
