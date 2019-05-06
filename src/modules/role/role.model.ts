export class RoleModel {
  id: number;
  name: string;

  constructor(fields?: Partial<RoleModel>) {
    if(fields) {
      Object.assign(this, fields);
    }
  }
}