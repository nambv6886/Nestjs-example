import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

import { UserService } from '../../modules/user/user.service';
import { RequestLogin, ResponseLogin, JwtPayload, RefreshLoginRequest, RefreshAccessToken } from '../../common/models/user';
import { ResponseCode } from '../../common/models/response-code';
import { SECRET_KEY_JWT, REFRESH_LOGIN_JWT_KEY } from '../../config/environment';
import { UserTokenService } from 'modules/user-token/user-token.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(UserTokenService) private readonly userTokenService: UserTokenService
  ) {}

  public async doLogin(requestLogin: RequestLogin): Promise<ResponseLogin> {
    const user = await this.userService.findByEmail(requestLogin.username);
    if(!user) {
      return new ResponseLogin({
        status: ResponseCode.Fail,
        message: 'Email or password is wrong'
      });
    }

    // const isMatch = await this.userService.comparePassword(requestLogin.password, user.password);
    const hashPassword = await this.userService.hashPassword(requestLogin.password, user.salt);
    const isMatch = (user.password === hashPassword);
    if(!isMatch) {
      return new ResponseLogin({
        status: ResponseCode.Fail,
        message: 'Email or password is wrong'
      })
    }

    const roles = [];
    for(const role of user.roles) {
      roles.push(role.name);
    } 

    const payload: JwtPayload = {
      roles,
      email: user.email
    };
    const accessToken = await jwt.sign(payload, SECRET_KEY_JWT, { expiresIn: 64000 });
    const refreshToken = await this.userTokenService.generateRefeshToken(user.id);

    return new ResponseLogin({
      status: ResponseCode.Success,
      message: 'Successfully',
      accessToken,
      refreshToken
    });
  }

  async validateUser(email): Promise<any> {
    return await this.userService.findByEmail(email);
    // return true;
  }

  public async doRefreshLogin(refreshLoginRequest: RefreshLoginRequest): Promise<any> {
    
    const refreshAccessToken: RefreshAccessToken = jwt.verify(refreshLoginRequest.refreshToken, REFRESH_LOGIN_JWT_KEY);
    
    if(!refreshAccessToken && (refreshAccessToken.exp*1000 < Date.now()))
    return null;
  }

  // public async parseRefreshToken(token): Promise<RefreshAccessToken> {
  //   try {
  //     return new Promise((resolve, reject) => {
  //       const result = jwt.verify(token, REFRESH_LOGIN_JWT_KEY);
  //       resolve(result);
  //     })
  //   } catch(e) {

  //   }
  // }
}

