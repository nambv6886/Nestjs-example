import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../../modules/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { UserTokenModule } from 'modules/user-token/user-token.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    UserTokenModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
