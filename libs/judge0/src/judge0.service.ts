import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class Judge0Service {
  private instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.JUDGE_API,
    });
  }

  async getLanguages() {
    const list = await this.instance.get('/languages');
    return list.data;
  }
}
