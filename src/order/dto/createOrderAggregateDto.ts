export class LineItemDto {
  productId: number;
  name: string;
  manufacturer: string;
  country: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export class CreateOrderAggregateDto {
  id: number;
  lineItems: LineItemDto[];
  netTotal: number;
  status: string;
  createdOn: Date;
  modifiedOn: Date;
}
