export enum SQSMessageTypeEnum {
  RE_CORRECTION,
  CODE_SUBMIT,
}

export type SQSMessageType = keyof typeof SQSMessageTypeEnum;

export type SQSTask = {
  message: SQSMessageType;
  id: string | number;
};
