export class CreateLineItemDto {
  productId: number;
  quantity: number;
}

export class CreateOrderDto {
  lineItems: CreateLineItemDto[];
}
