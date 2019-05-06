import { Controller, Post, Body, Inject, forwardRef } from '@nestjs/common';
import { RegisterRequest, RegisterResponse, ResponseLogin, RequestLogin } from '../../common/models/user';
import { UserService } from './user.service';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'modules/auth/auth.service';

@Controller()
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(AuthService) private readonly authService: AuthService
  ) {}

  @Post('register')
  @ApiResponse({
    status: 200,
    type: RegisterResponse
  })
  public async doRegister(@Body() registerRequest: RegisterRequest): Promise<RegisterResponse> {
    return await this.userService.create(registerRequest);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    type: ResponseLogin
  })
  public async doLogin(@Body() requestLogin: RequestLogin): Promise<ResponseLogin> {
    return await this.authService.doLogin(requestLogin);
  }
}
