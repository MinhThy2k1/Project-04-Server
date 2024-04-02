import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenMiddleWare } from 'src/middlewares/authen.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleWare)
      .forRoutes(
        { path: "user/confirm_ip/:token", method: RequestMethod.GET, version: "1" },
        { path: "user/confirm_email/:token", method: RequestMethod.GET, version: "1" },
        { path: "user/decodeToken/:token", method: RequestMethod.GET, version: "1" },
        { path: "user/address/:id", method: RequestMethod.PATCH, version: "1" },
        // { path: "user/loginWithGoogle", method: RequestMethod.POST, version: "1" }
        { path: "user/finduser/:id", method: RequestMethod.GET, version: "1" },

      )
  }
}
