import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrderDto';
import { UpdateOrderDto } from './dto/updateOrderDto';
import { ProductApiService } from './productApi.service';
import { CreateOrderAggregateDto } from './dto/createOrderAggregateDto';
import { OrderProducerService } from './orderProducer.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productApiService: ProductApiService,
    private readonly orderProducerService: OrderProducerService,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const productIds = createOrderDto.lineItems.map((item) => item.productId);
    const products = await this.productApiService.getProductsByIds(productIds);

    const lineItems = createOrderDto.lineItems.map((item) => {
      const { name, manufacturer, country, unitPrice } = products.find(
        (p) => p.id === item.productId,
      );
      return {
        productId: item.productId,
        name,
        manufacturer,
        country,
        unitPrice,
        quantity: item.quantity,
        total: item.quantity * unitPrice,
      };
    });
    const netTotal = lineItems.reduce((acc, item) => acc + item.total, 0);
    const createdOrder = await this.orderService.create(createOrderDto);

    const orderAggregate: CreateOrderAggregateDto = {
      id: createdOrder.id,
      lineItems,
      netTotal,
      status: createdOrder.status,
      createdOn: createdOrder.createdOn,
      modifiedOn: createdOrder.modifiedOn,
    };

    await this.orderProducerService.addOrderToQueue(orderAggregate);
    return orderAggregate;
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    await this.orderService.update(+id, updateOrderDto);
  }

  @Put('/status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderDto,
  ) {
    await this.orderService.update(+id, updateOrderStatusDto);
    await this.orderProducerService.addOrderUpdateToQueue({
      orderId: +id,
      status: updateOrderStatusDto.status,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
