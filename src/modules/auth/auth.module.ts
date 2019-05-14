import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../../modules/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { UserTokenModule } from '../../modules/user-token/user-token.module';
import { SharedModule } from '../../modules/shared/shared.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    UserTokenModule,
    SharedModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
