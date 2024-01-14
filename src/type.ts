export type JwtPayload = {
  id: string;
  email: string;
};

// Common Prisma Enum type

// Convert enum to interface(type)
export type EnumFields<T extends string, K = any> = {
  [key in T]: K;
};
