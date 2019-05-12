import { Controller, Post, Body, Inject, forwardRef, Get, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import {
  RegisterRequest,
  RegisterResponse,
  ResponseLogin,
  RequestLogin,
  GetUserListResponse
} from '../../common/models/user';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { UserModel } from '../user/user.model';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleType } from '../../config/constant';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('user')
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

  @Get('findAll')
  @ApiResponse({
    status: 200,
    type: GetUserListResponse
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  public async doFindAll(@CurrentUser() user: UserModel): Promise<UserModel[]>{
    return await this.userService.findAll(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.USER)
  public async doFindById(@Param('id') id: number): Promise<UserModel> {
    return this.userService.findById(id);
  }

  @Get('findByEmail')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.USER)
  public async doFindByEmail(@Body() email: string): Promise<UserModel> {
    return this.userService.findByEmail(email);
  }
}
