export class CreateLineItemDto {
  productId: number;
  quantity: number;
}

export class CreateOrderDto {
  status: string;
  lineItems: CreateLineItemDto[];
}
