import { UserRole } from '@prisma/client';

export interface AuthorizableUser<Id = string, Email = string> {
  id: Id;
  email: Email;
  role: UserRole;
}
