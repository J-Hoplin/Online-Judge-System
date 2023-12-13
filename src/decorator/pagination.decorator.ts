import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

const defaultPage = 1;
const defaultOffset = 10;

export type PaginateObject = {
  skip: number;
  take: number;
};

export const PaginationDocs = [
  ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Default is 1',
  }),
  ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Default is 10',
  }),
];

export const Pagination = createParamDecorator(
  (key: unknown, ctx: ExecutionContext): PaginateObject => {
    const request = ctx.switchToHttp().getRequest<Request>();
    let page = parseInt(request['page']);
    let offset = parseInt(request['offset']);

    // Validate Page
    page = page && page > 0 ? page : defaultPage;
    offset = offset && offset > 0 ? offset : defaultOffset;
    const skip = offset && offset > 0 ? (page - 1) * offset : defaultOffset;
    const take = offset;
    return {
      skip,
      take,
    };
  },
);
