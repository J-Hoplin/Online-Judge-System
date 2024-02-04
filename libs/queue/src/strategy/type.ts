export enum SQSMessageTypeEnum {
  RE_CORRECTION,
  CODE_SUBMIT,
}

export type SQSMessageType = keyof typeof SQSMessageTypeEnum;

export type QueueTask = {
  message: SQSMessageType;
  id: string | number;
};
