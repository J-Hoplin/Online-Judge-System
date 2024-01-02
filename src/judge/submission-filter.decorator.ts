import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { Request } from 'express';

export type SubmissionFilterObject = {
  Where: Prisma.SubmissionWhereInput;
  Orderby: Prisma.SubmissionOrderByWithRelationAndSearchRelevanceInput;
};

export const SubmissionFilterDocs = [
  ApiQuery({
    name: 'order',
    required: false,
    enum: Prisma.SortOrder,
    description: 'Order option. Default is desc',
  }),
  ApiQuery({
    name: 'result',
    required: false,
    enum: $Enums.ResponseType,
    description: 'Response type',
  }),
];

export const SubmissionFilter = createParamDecorator(
  (key: any, ctx: ExecutionContext): SubmissionFilterObject => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const query = request.query;

    const filterObject: SubmissionFilterObject = {
      Where: {},
      Orderby: {},
    };

    // Filter: Result
    if (
      query['result'] &&
      Object.keys($Enums.ResponseType).includes(query['result'] as string)
    ) {
      filterObject.Where['result'] = query['result'];
    }

    // Filter: Orderby
    if (
      query['order'] &&
      Object.keys(Prisma.SortOrder).includes(query['order'] as string)
    ) {
      filterObject.Orderby['createdAt'] = query['order'] as Prisma.SortOrder;
    } else {
      filterObject.Orderby['createdAt'] = 'desc';
    }

    return filterObject;
  },
);
