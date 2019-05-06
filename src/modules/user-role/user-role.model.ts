export class UserRoleModel {
  id: number;
  userId: number;
  roleId: number;

  constructor(fields?: Partial<UserRoleModel>) {
    if(fields) {
      Object.assign(this, fields);
    }
  }
}