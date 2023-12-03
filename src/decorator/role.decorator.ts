import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';

export const Role = Reflector.createDecorator<UserType[]>();
