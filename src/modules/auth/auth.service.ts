import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { UserService } from '../../modules/user/user.service';
import { RequestLogin, ResponseLogin, JwtPayload, RefreshLoginRequest, RefreshAccessToken, Response } from '../../common/models/user';
import { ResponseCode } from '../../common/models/response-code';
import { SECRET_KEY_JWT, REFRESH_LOGIN_JWT_KEY, JWT_EXPIRES_TIME } from '../../config/environment';
import { UserTokenService } from '../../modules/user-token/user-token.service';
import { CommonUtils } from '../../common/utils/common';
import { CacheServie } from '../../modules/shared/cache.service';
import { UserModel } from '../../modules/user/user.model';
import logger from '../../common/utils/logger';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(UserTokenService) private readonly userTokenService: UserTokenService,
    @Inject(CacheServie) private readonly cacheService: CacheServie
  ) {
  }

  public async doLogin(requestLogin: RequestLogin): Promise<ResponseLogin> {
    const user = await this.userService.findByEmail(requestLogin.username);
    if (!user) {
      return new ResponseLogin({
        status: ResponseCode.Fail,
        message: 'Email or password is wrong'
      });
    }

    // const isMatch = await this.userService.comparePassword(requestLogin.password, user.password);
    const hashPassword = await this.userService.hashPassword(requestLogin.password, user.salt);
    const isMatch = (user.password === hashPassword);
    if (!isMatch) {
      return new ResponseLogin({
        status: ResponseCode.Fail,
        message: 'Email or password is wrong'
      })
    }

    const roles = [];
    for (const role of user.roles) {
      roles.push(role.name);
    }

    const payload: JwtPayload = {
      roles,
      email: user.email,
      userId: user.id
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

  public async doLogout(user: JwtPayload, refreshLogin: string, accessToken: string): Promise<Response> {
    try {
      const refreshAccessToken = this.parseRefreshToken(refreshLogin);
      if (CommonUtils.isNullOrUndefined(refreshAccessToken) && CommonUtils.isNullOrUndefined(refreshAccessToken.userId)
        && user.userId != refreshAccessToken.userId) {
        return new Response({
          message: 'Logout fail',
          status: ResponseCode.Fail
        })
      }

      this.deactivateAccessToken(accessToken);
      const userToken = await this.userTokenService.findOneByUserIdAndKey(user.userId, refreshAccessToken.key);
      if (userToken) {
        await this.userTokenService.deleteByUserIdAndKey(user.userId, refreshAccessToken.key);
      }

      return new Response({
        message: 'Logout Success',
        status: ResponseCode.Success
      });
    } catch (err) {
      logger.error(`[AuthService][Logout]: ${JSON.stringify(err)}`);
      return new Response({
        message: 'Common error',
        status: ResponseCode.Fail
      })
    }
  }

  async validateUser(email): Promise<any> {
    return await this.userService.findByEmail(email);
  }

  public async doRefreshLogin(refreshLoginRequest: RefreshLoginRequest): Promise<any> {
    const refreshAccessToken = this.parseRefreshToken(refreshLoginRequest.refreshToken);
    if (CommonUtils.isNullOrUndefined(refreshAccessToken) || CommonUtils.isNullOrUndefined(refreshAccessToken.exp)
      || refreshAccessToken.exp * 1000 < Date.now() || CommonUtils.isNullOrUndefined(refreshAccessToken.userId) || CommonUtils.isNullOrUndefined(refreshAccessToken.key)
    ) {
      return new ResponseLogin({
        status: ResponseCode.Invalid,
        message: 'Account refresh login invalid'
      })
    }
    const userToken = await this.userTokenService.findOneByUserIdAndKey(refreshAccessToken.userId, refreshAccessToken.key);
    if (CommonUtils.isNullOrUndefined(userToken)) {
      return new ResponseLogin({
        status: ResponseCode.Invalid,
        message: 'Account refresh login invalid'
      })
    }
    const user = await this.userService.findById(refreshAccessToken.userId);
    const roles = [];
    for (let role of user.roles) {
      roles.push(role.name);
    }
    const payload: JwtPayload = {
      email: user.email,
      roles,
      userId: user.id
    };
    const accessToken = jwt.sign(payload, SECRET_KEY_JWT, { expiresIn: JWT_EXPIRES_TIME });
    return new ResponseLogin({
      accessToken,
      message: 'Account Refresh Login Success',
      status: ResponseCode.Success,
      refreshToken: refreshLoginRequest.refreshToken
    });
  }

  public parseRefreshToken(token: string): RefreshAccessToken {
    const decode = jwt.decode(token);
    const exp = decode['exp'];
    const userId = decode['userId'];
    const key = decode['key'];
    const iat = decode['iat'];
    return new RefreshAccessToken({
      exp,
      iat,
      key,
      userId
    });
  }

  public deactivateAccessToken(token: string): void {
    token = token.substring(7).trim();
    this.cacheService.set(token, token, 3600);
  }

  public isTokenDeactivate(token: string): boolean {
    token = token.substring(7).trim();
    const tokenInCache = this.cacheService.get(token);
    if (tokenInCache) {
      return true;
    }
    return false;
  }
}

