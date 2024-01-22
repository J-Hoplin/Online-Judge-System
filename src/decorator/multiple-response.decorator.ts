import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface ResponseReference {
  classRef: Type;
  example: any;
  isArray?: boolean;
  description?: string;
}

export type MultipleResponseOptions = Record<string, ResponseReference>;

// Use when Swagger requires to view multiple response
export const ApiMultipleResponse = (
  statusCode: HttpStatus | number,
  options: MultipleResponseOptions,
) => {
  const models = Object.values(options).map((option) => {
    return option.classRef;
  });

  const responseExample = {};
  for (const [key, option] of Object.entries(options)) {
    responseExample[key] = {
      value: option.isArray ? [option.example] : option.example,
    };
  }

  return applyDecorators(
    ApiExtraModels(...models),
    ApiResponse({
      status: statusCode,
      content: {
        'application/json': {
          schema: {
            oneOf: models.map((model) => {
              return {
                $ref: getSchemaPath(model),
              };
            }),
          },
          examples: responseExample,
        },
      },
    }),
  );
};
