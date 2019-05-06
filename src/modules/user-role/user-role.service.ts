import { Injectable } from '@nestjs/common';
import { UserRoleRepository } from './user-role.repository';
import { UserRoleModel } from './user-role.model';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly userRoleRepository: UserRoleRepository
  ){}

  public async create(userRole: UserRoleModel): Promise<UserRoleModel> {
    return await this.userRoleRepository.createUserRole(userRole);
  }

  public async delete(id: number) {
    return await this.userRoleRepository.deleteUserRole(id);
  }
}
