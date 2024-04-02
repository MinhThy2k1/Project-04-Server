import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { TokenMiddleWare } from 'src/middlewares/authen.middleware';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService, UserService],
})
export class ReceiptModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleWare)
      .forRoutes(
        { path: "receipt", method: RequestMethod.GET, version: "1" },
        { path: "receipt/add-to-cart", method: RequestMethod.POST, version: "1" },
        { path: "receipt", method: RequestMethod.PATCH, version: "1" },
        { path: "receipt/:id", method: RequestMethod.DELETE, version: "1" },
        { path: "receipt/pay/:id", method: RequestMethod.PATCH, version: "1" },
        { path: "receipt/updates/:id", method: RequestMethod.PATCH, version: "1" },
        { path: "receipt/done/:id", method: RequestMethod.PATCH, version: "1" },
      )
  }
}
