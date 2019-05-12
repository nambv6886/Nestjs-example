import { Injectable, Inject } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as ms from 'ms';

import { UserTokenRepository } from './user-token.repository';
import { UserToken } from './user-token.model';
import { REFRESH_LOGIN_KEY_LENGTH, REFRESH_LOGIN_TIME_EXPIRES, REFRESH_LOGIN_JWT_KEY } from 'config/environment';

@Injectable()
export class UserTokenService {
  constructor(
    private readonly userTokenRepository: UserTokenRepository
  ){}

  public async create(model: UserToken): Promise<UserToken> {
    return await this.userTokenRepository.create(model);
  }

  public async deleteByUserId(id: number): Promise<any> {
    return await this.userTokenRepository.deleteByUserId(id);
  }

  public async deleteByUserIdAndKey(userId: number, key: string): Promise<any> {
    return await this.deleteByUserIdAndKey(userId, key);
  }

  public async findOneByUserId(userId: number): Promise<UserToken> {
    return await this.userTokenRepository.findByUserId(userId);
  }

  public async findOneByUserIdAndKey(userId: number, key: string): Promise<UserToken> {
    return await this.userTokenRepository.findByUserIdAndKey(userId, key);
  }

  public async generateRefeshToken(userId: number): Promise<string> {
    const key = crypto.randomBytes(REFRESH_LOGIN_KEY_LENGTH).toString('hex');
    const refeshTokenPayload = {
      key,
      userId
    };

    const expiresTime = REFRESH_LOGIN_TIME_EXPIRES;

    const token = jwt.sign(refeshTokenPayload, REFRESH_LOGIN_JWT_KEY, { expiresIn: REFRESH_LOGIN_TIME_EXPIRES});
    const userToken = new UserToken({
      create: new Date(Date.now()),
      expires: new Date(Date.now() + ms(expiresTime)),
      key,
      token,
      userId
    })
    await this.create(userToken);

    return token;
  } 

}
