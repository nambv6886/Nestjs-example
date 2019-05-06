import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../../modules/user/user.service';
import { RequestLogin, ResponseLogin, JwtPayload } from '../../common/models/user';
import { ResponseCode } from 'common/models/response-code';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService
  ) { }

  public async doLogin(requestLogin: RequestLogin): Promise<ResponseLogin> {
    const user = await this.userService.findByEmail(requestLogin.username);
    if(!user) {
      return new ResponseLogin({
        status: ResponseCode.Fail,
        message: 'Email or password is wrong'
      });
    }

    const isMatch = await this.userService.comparePassword(requestLogin.password, user.password);
    if(!isMatch) {
      return new ResponseLogin({
        status: ResponseCode.Fail,
        message: 'Email or password is wrong'
      })
    }

    const payload: JwtPayload = {
      role: user.roles[0].name,
      email: user.email
    };
    const accessToken = this.jwtService.sign(payload);

    return new ResponseLogin({
      status: ResponseCode.Success,
      message: 'Successfully',
      accessToken
    });
  }

  async validateUser(email): Promise<any> {
    return await this.userService.findByEmail(email);
    // return true;
  }
}
