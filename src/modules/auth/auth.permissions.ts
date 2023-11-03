import { InferSubjects } from '@casl/ability';

import { Actions, Permissions } from '@modules/casl';

import { TokensEntity } from '@modules/auth/entities/tokens.entity';
import { UserRole } from '@prisma/client';

export type Subjects = InferSubjects<typeof TokensEntity>;

export const permissions: Permissions<UserRole, Subjects, Actions> = {
  customer({ can }) {
    can(Actions.delete, TokensEntity);
  },
};
