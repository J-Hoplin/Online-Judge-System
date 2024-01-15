export type SQSMessageType = 'RE_CORRECTION' | 'CODE_SUBMIT';

export type SQSTask = {
  message: SQSMessageType;
  id: string | number;
};
