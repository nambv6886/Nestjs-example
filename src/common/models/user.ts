import { ResponseCode } from "./response-code";

import { ApiModelProperty, ApiResponse } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterRequest {

  @ApiModelProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiModelProperty()
  @MinLength(6)
  password: string;

  @ApiModelProperty()
  name: string;
  constructor(fields?: Partial<RegisterRequest>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class Response {
  @ApiModelProperty()
  public status: ResponseCode;

  @ApiModelProperty()
  public message: string;

  public constructor(fields?: Partial<Response>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class RegisterResponse extends Response {
  @ApiModelProperty()
  messages: string[];

}

export class RequestLogin {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;

  constructor(fields?: Partial<RequestLogin>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class ResponseLogin extends Response {

  @ApiModelProperty()
  accessToken: string;

  constructor(fields?: Partial<ResponseLogin>) {
    super(fields);
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class JwtPayload {
  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  role: string
}