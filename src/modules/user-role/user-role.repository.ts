import { Injectable } from '@nestjs/common';
import { UserRoleModel } from './user-role.model';
import UserRoleEntity from './uer-role.entity';

@Injectable()
export class UserRoleRepository {
  constructor() {}

  public async createUserRole(userRole: UserRoleModel): Promise<UserRoleEntity> {
    return await UserRoleEntity.create(userRole);
  }

  public async deleteUserRole(id: number){
    return await UserRoleEntity.destroy({ where: { id }});
  }
}
