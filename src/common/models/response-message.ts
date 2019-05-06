export class ResponseMessage {
  status: number;
  messageCode: number;
  message: string;
  messages: string[];

  constructor(fields?: Partial<ResponseMessage>) {
    if(fields) {
      Object.assign(this, fields);
    }
  }
}