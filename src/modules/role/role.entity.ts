import { Table, Model, AutoIncrement, Column, HasMany, BelongsToMany, Unique } from 'sequelize-typescript';
import { RoleType } from '../../config/constant';
import UserRoleEntity from '../user-role/uer-role.entity';
import UserEntity from '../user/user.entity';

@Table({tableName: 'role'})
export default class RoleEntity extends Model<RoleEntity> {
  @Unique
  @AutoIncrement
  @Column({ primaryKey: true, field: 'id'})
  id: number;

  @Column
  name: RoleType

  @HasMany(() => UserRoleEntity)
  userRoles: UserRoleEntity[];

  @BelongsToMany(() => UserEntity, () => UserRoleEntity)
  users: UserEntity[]
}
