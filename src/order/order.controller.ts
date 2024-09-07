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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductApiService } from './productApi.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productApiService: ProductApiService,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const productIds = createOrderDto.lineItems.map((item) => item.productId);
    const products = await this.productApiService.getProductsByIds(productIds);

    const lineItems = createOrderDto.lineItems.map((item) => {
      const { name, manufacturer, country, unitPrice, id } = products.find(
        (p) => p.id === item.productId,
      );
      return {
        id,
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

    const orderAggregate = {
      id: createdOrder.id,
      lineItems,
      netTotal,
      status: createdOrder.status,
      createdOn: createdOrder.createdOn,
      modifiedOn: createdOrder.modifiedOn,
    };
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
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
