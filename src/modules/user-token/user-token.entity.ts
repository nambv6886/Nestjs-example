import { Table, Column, Unique, AutoIncrement, Model } from "sequelize-typescript";

@Table({ tableName: 'user_token'})
export default class UserTokenEntity extends Model<UserTokenEntity>{

  @Unique
  @AutoIncrement
  @Column({ primaryKey: true })
  id: number;

  @Column({ field: 'key'})
  key: string;

  @Column({ field: 'user_id'})
  userId: number;

  @Column({ field: 'token'})
  token: string;

  @Column({ field: 'create_time'})
  create: Date;

  @Column({ field: 'expires_time'})
  expires: Date;
}
