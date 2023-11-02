import { SetMetadata } from '@nestjs/common';
import { AUTHORIZE } from './auth.constants';

export type AuthRoles = 'Admin' | 'Any';

/**
 * Defines who can access the resolver if not present resolver can be accessed by any authenticated user.
 */
export const Authorize = (authorize: AuthRoles[]) =>
  SetMetadata(AUTHORIZE, authorize);
