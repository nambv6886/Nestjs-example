export class UserToken {
  id: number;
  key: string;
  userId: number;
  token: string;
  create: Date;
  expires: Date;

  constructor(fields?: Partial<UserToken>) {
    if(fields) {
      Object.assign(this, fields);
    }
  }
}