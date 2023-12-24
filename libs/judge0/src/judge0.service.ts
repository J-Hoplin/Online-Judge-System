import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { JudgeResponse, JudgeResult } from './type';
import { ResponseType } from '@prisma/client';

@Injectable()
export class Judge0Service {
  private instance: AxiosInstance;
  constructor() {
    const judge0Endpoint = process.env.JUDGE_SERVER_ENDPOINT;
    if (!judge0Endpoint) {
      throw new Error('Judge Server Endpoint not found');
    }
    this.instance = axios.create({
      baseURL: judge0Endpoint,
    });
  }

  async getLanguages() {
    const list = await this.instance.get('/languages');
    return list.data;
  }

  async submit(
    language: number,
    code: string,
    expect: string,
    input: string,
    timeLimitSecond: number,
    memoryLimitMB: number,
  ) {
    // Convert Memory Limit to KB
    const memoryLimitKB = memoryLimitMB * 1024;

    const submission = {
      language_id: language,
      source_code: Buffer.from(code).toString('base64'),
      stdin: Buffer.from(input).toString('base64'),
      expected_output: Buffer.from(expect).toString('base64'),
    };

    const request = await this.instance({
      method: 'post',
      url: '/submissions?base64_encoded=true&wait=true',
      data: submission,
    });

    const result: JudgeResult = request.data;
    const response: JudgeResponse = {
      isCorrect: result.status.id === 3 ? true : false,
      description: '' as ResponseType,
      languageId: language,
      memory: result.memory,
      time: parseFloat(result.time),
      statusId: result.status.id,
      output: {
        expect,
        input,
        stdout: this.base642String(result?.stdout),
        // If Internal Error -> message, else stderr
        message:
          result.status.id === 13
            ? this.base642String(result?.message)
            : this.base642String(result?.stderr),
      },
    };

    switch (response.statusId) {
      case 3:
        // Time limit exceed
        if (response.time > timeLimitSecond) {
          response.isCorrect = false;
          response.statusId = 5;
          response.description = ResponseType.TIME_LIMIT_EXCEED;
        } else {
          // Memory limit exceed
          if (response.memory > memoryLimitKB) {
            response.isCorrect = false;
            response.statusId = 12;
            response.description = ResponseType.MEMORY_LIMIT_EXCEED;
          } else {
            response.description = ResponseType.CORRECT;
          }
        }
        break;
      case 4:
        response.description = ResponseType.WRONG_ANSWER;
        break;
      case 5:
        response.description = ResponseType.TIME_LIMIT_EXCEED;
        break;
      case 6:
        response.description = ResponseType.COMPILE_ERROR;
        break;
      case 7:
        response.description = ResponseType.RUNTIME_ERROR_SIGSEGV;
        break;
      case 8:
        response.description = ResponseType.RUNTIME_ERROR_SIGXFSZ;
        break;
      case 9:
        response.description = ResponseType.RUNTIME_ERROR_SIGFPE;
        break;
      case 10:
        response.description = ResponseType.RUNTIME_ERROR_SIGABRT;
        break;
      case 11:
        response.description = ResponseType.RUNTIME_ERROR_NZEC;
        break;
      case 12:
        response.description = ResponseType.RUNTIME_ERROR;
        break;
      case 13:
        response.description = ResponseType.INTERNAL_ERROR;
        break;
      case 14:
        response.description = ResponseType.EXEC_FORMAT_ERROR;
        break;
    }
    return response;
  }

  private base642String(buffer: string) {
    return buffer ? atob(buffer) : null;
  }
}
