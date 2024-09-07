import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { EmailModule } from './email/email.module';
import configuration from './configuration';

@Module({
  imports: [
    OrderModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
})
export class AppModule {}
