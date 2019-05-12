import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../../config/constant';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
