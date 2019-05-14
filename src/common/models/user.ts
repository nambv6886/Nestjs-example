import { ResponseCode } from "./response-code";

import { ApiModelProperty, ApiResponse } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { UserModel } from "../../modules/user/user.model";
import { RoleType } from "../../config/constant";

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

  @ApiModelProperty()
  refreshToken: string;

  constructor(fields?: Partial<ResponseLogin>) {
    super(fields);
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class JwtPayload {
  @ApiModelProperty()
  userId: number;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  roles: RoleType[];

  constructor(fields?: Partial<JwtPayload>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class GetUserListResponse {
  @ApiModelProperty()
  user: UserModel[];

  @ApiModelProperty()
  message: string;

  @ApiModelProperty()
  totalCount: number;

  constructor(fields?: Partial<GetUserListResponse>) {
    if(fields) {
      Object.assign(this, fields);
    }
  }
}

export class RefreshLoginRequest {
  @ApiModelProperty()
  refreshToken: string;

  constructor(fields?: Partial<RefreshLoginRequest>) {
    if(fields) {
      Object.assign(this, fields);
    }
  }
}

export class RefreshAccessToken {
  key: string;
  userId: number;
  iat: number;
  exp: number;

  constructor(fields?: Partial<RefreshAccessToken>) {
    if(fields) {
      Object.assign(this, fields);
    }
  }
}

export class LogoutRequest {
  @ApiModelProperty()
  refreshToken: string;

  constructor(fields?: Partial<LogoutRequest>) {
    if(fields) {
      Object.assign(this, fields);
    }
  }
}
