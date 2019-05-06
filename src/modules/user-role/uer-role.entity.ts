import { Table, Model, Column, AutoIncrement, ForeignKey, BelongsTo, Unique } from 'sequelize-typescript';
import UserEntity from '../user/user.entity';
import RoleEntity from '../role/role.entity';

@Table({ tableName: 'user_role'})
export default class UserRoleEntity extends Model<UserRoleEntity> {

  @Unique
  @AutoIncrement
  @Column({ primaryKey: true })
  id: number;

  @Column({field: 'user_id'})
  @ForeignKey(() => UserEntity)
  userId: number;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @Column({ field: 'role_id'})
  @ForeignKey(() => RoleEntity)
  roleId: number;

  @BelongsTo(() => RoleEntity)
  role: RoleEntity
}