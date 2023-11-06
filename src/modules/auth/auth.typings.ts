import { User } from '@prisma/client';
import { AuthAction } from './auth.enum';

export type GenerateAndSendUrlArgs = {
  host: string;
  user: User;
  action: AuthAction;
  template: string;
  callbackUrl?: string;
};
