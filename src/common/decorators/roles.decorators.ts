import { SetMetadata } from '@nestjs/common';
import { rolesList } from '../utils/roles';

export const Roles_key = 'roles';
export const Roles = (...roles: rolesList[]) => SetMetadata(Roles_key, roles);
