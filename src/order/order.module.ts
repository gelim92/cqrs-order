import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { LineItemEntity } from './entities/lineItem.entity';
import { ProductApiService } from './productApi.service';
import { OrderProducerService } from './orderProducer.service';

@Module({
  controllers: [OrderController],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'mypassword',
      username: 'myusername',
      entities: [Order, LineItemEntity],
      database: 'cqrs_order',
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Order, LineItemEntity]),
    HttpModule,
  ],
  providers: [OrderService, ProductApiService, OrderProducerService],
})
export class OrderModule {}
