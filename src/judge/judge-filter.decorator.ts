import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

export type JudgeFilterObject = {
  Where: Prisma.ProblemWhereInput;
  Orderby: Prisma.ProblemOrderByWithRelationAndSearchRelevanceInput;
};

export const JudgeFilterDocs = [
  ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Find by problem name',
  }),
  ApiQuery({
    name: 'order',
    required: false,
    enum: Prisma.SortOrder,
    description: 'Order option. Default is desc',
  }),
];

export const JudgeFilter = createParamDecorator(
  (key: any, ctx: ExecutionContext): JudgeFilterObject => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const query = request.query;

    const search = (query['search'] as string) || '';
    let order = query['order'] as string;
    if (!Object.keys(Prisma.SortOrder).includes(order)) {
      order = Prisma.SortOrder.desc;
    }

    return {
      Where: {
        title: {
          contains: search,
        },
      },
      Orderby: {
        createdAt: order as Prisma.SortOrder,
      },
    };
  },
);
