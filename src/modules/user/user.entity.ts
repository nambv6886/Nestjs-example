import { Table, Model, Column, AutoIncrement, HasMany, BelongsTo, BelongsToMany, Unique } from 'sequelize-typescript';
import UserRoleEntity from '../user-role/uer-role.entity';
import RoleEntity from '../role/role.entity';

@Table({ tableName: 'user'})
export default class UserEntity extends Model<UserEntity> {
  
  @Unique
  @AutoIncrement
  @Column({ primaryKey: true })
  id: number;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  name: string;

  @Column
  is_confirm_email: number;

  @Column
  salt: string

  @Column
  activeCode: string;

  @BelongsToMany(() => RoleEntity, () => UserRoleEntity)
  roles: RoleEntity[]

  @HasMany(() => UserRoleEntity)
  userRoles: UserRoleEntity[]

}
