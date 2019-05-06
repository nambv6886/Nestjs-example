import { Injectable } from '@nestjs/common';
import { UserModel } from './user.model';
import UserEntity from './user.entity';
import RoleEntity from '../role/role.entity';
import { RoleModel } from '../role/role.model';
import UserRoleEntity from '../user-role/uer-role.entity';

@Injectable()
export class UserRepository {
  constructor () {}

  public async create(user: UserModel): Promise<UserModel> {
    const newUser = this.toEntity(user);
    const result = await newUser.save();
    return this.toModel(result);
  }

  public async findAll(): Promise<UserModel[]> {
    const userEntities = await UserEntity.findAll();
    if(userEntities) {
      return this.toModels(userEntities);
    }
    return [];
  }

  public async findById(id: number): Promise<UserModel> {
    const user = await UserEntity.findOne({include: [RoleEntity], where: {id}});
    if(user) {
      const result = this.toModel(user);
      result.roles = [];
      user.roles.forEach(role => {
        result.roles.push(new RoleModel({
          id: role.id,
          name: role.name
        }))
      });
      return result;
    }
    return null;
  }

  public async findByEmail(email: string): Promise<UserModel> {
    const user = await UserEntity.findOne({include: [RoleEntity], where: {email}});
    if(user) {
      const result = this.toModel(user);
      result.roles = [];
      user.roles.forEach(role => {
        result.roles.push(new RoleModel({
          id: role.id,
          name: role.name
        }))
      });
      return result;
    }
    return null;
  }

  public async update(user: UserModel): Promise<UserModel> {
    const userFound = await UserEntity.findOne({where: {id: user.id}})
    if(userFound) {
      const entity = this.toEntity(user, userFound);
      const result = await entity.save();
      return this.toModel(result);
    }
    return null;
  }

  public async delete(id: number) {
    await UserEntity.destroy({ where: {id}});
  }

  private toEntity(user: UserModel, entity?: UserEntity) {
    if(!entity) {
      entity = new UserEntity();
    }
    
    entity.id = user.id;
    entity.email = user.email;
    entity.name = user.name;
    entity.password = user.password;
    entity.salt = user.salt;
    entity.activeCode = user.activeCode;
    entity.is_confirm_email = user.is_confirm_email
    
    return entity;
  }

  private toModels(entitys: UserEntity[]) {
    return entitys.map(entity => this.toModel(entity));
  }

  private toModel(entity: UserEntity) {
    return new UserModel({
      id: entity.id,
      email: entity.email,
      name: entity.name,
      is_confirm_email: entity.is_confirm_email,
      password: entity.password,
      salt: entity.salt,
      activeCode: entity.activeCode
    })
  }
}