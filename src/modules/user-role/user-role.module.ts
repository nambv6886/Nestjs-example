import { Module } from '@nestjs/common';
import { UserRoleRepository } from './user-role.repository';
import { UserRoleService } from './user-role.service';

@Module({
  providers: [UserRoleRepository, UserRoleService],
  exports: [UserRoleService]
})
export class UserRoleModule {
}
