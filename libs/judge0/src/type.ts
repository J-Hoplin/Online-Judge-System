import { ResponseType } from '@prisma/client';

export type JudgeResult = {
  stdout: string;
  time: string;
  memory: number;
  stderr: null;
  token: string;
  compile_output: string;
  message: null;
  status: {
    id: number;
    description: string;
  };
};

export type JudgeResponse = {
  isCorrect: boolean;
  description: ResponseType;
  languageId: number;
  memory: number;
  time: number;
  statusId: number;
  output: {
    expect: string;
    input: string;
    stdout: string;
    message: string;
  };
};
