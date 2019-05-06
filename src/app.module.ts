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

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    UserRoleModule,
    AuthModule,
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
