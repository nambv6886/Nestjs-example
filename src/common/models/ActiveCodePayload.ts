export class ActiveCodePayload {
  userId: number;
  activeCode: string;
  created: number;

  constructor(fields?: Partial<ActiveCodePayload>) {
    if(fields) {
      Object.assign(this, fields);
    }
  }
}