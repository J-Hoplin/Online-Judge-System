export type JwtPayload = {
  id: string;
  email: string;
};

export enum ProblemStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

// Common Prisma Enum type

// Convert enum to interface(type)
export type EnumFields<T extends string, K = any> = {
  [key in T]: K;
};
