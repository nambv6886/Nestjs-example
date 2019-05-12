import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserRepository } from './user.repository';
import { UserRoleService } from '../user-role/user-role.service';
import { EmailService } from '../email/email.service';
import { AuthModule } from '../../modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'modules/auth/auth.service';

@Module({
  imports: [
    UserRoleModule,
    AuthModule,
  ],
  providers: [UserRepository, UserService, EmailService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
