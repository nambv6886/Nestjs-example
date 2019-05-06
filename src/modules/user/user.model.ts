import { RoleModel } from "../role/role.model";

export class UserModel {
  id: number;
  email: string;
  password: string;
  name: string;
  is_confirm_email: number;
  salt: string;
  roles: RoleModel[];
  activeCode: string;

  constructor(fields: Partial<UserModel>) {
    if(fields) {
      Object.assign(this, fields);
    }
  }
}
