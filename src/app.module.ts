import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { MailModule } from './modules/mail/mail.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { ReceiptModule } from './modules/receipt/receipt.module';

@Module({
  imports: [UserModule,
    PrismaModule,
    MailModule,
    ProductModule,
    CategoryModule,
    ReceiptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
