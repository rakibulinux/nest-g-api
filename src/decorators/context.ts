import { User } from '@prisma/client';
import { Request } from 'express';

export type ExecutionRequest = Request & {
  auth: Partial<User>;
  callbackUrl?: string;
};
