import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelmetMiddleware } from './common/middlewares/helmet.middleware';
import { CompressionMiddleware } from './common/middlewares/compression.middleware';
import { DatabaseModule } from './config/db.config.module';
import { UserModule } from './modules/user/user.module';
import { EmailService } from './modules/email/email.service';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserTokenService } from './modules/user-token/user-token.service';
import { UserTokenModule } from './modules/user-token/user-token.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    UserRoleModule,
    AuthModule,
    UserTokenModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        HelmetMiddleware,
        CompressionMiddleware
      )
      .forRoutes('/api/')
  }
}
