import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../utils/OrderStatus';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  status?: OrderStatus;
}
