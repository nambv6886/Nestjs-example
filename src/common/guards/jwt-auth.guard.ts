import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../modules/auth/auth.service';
import logger from '../../common/utils/logger';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService
  ){
    super(AuthService)
  }
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    const request = context.switchToHttp().getRequest();
    if(this.authService.isTokenDeactivate(request.headers.authorization)) {
      return false;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      logger.error(`[Guard][JWT-Auth]: ${JSON.stringify(err)}`);
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
