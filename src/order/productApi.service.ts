import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

interface Product {
  id: number;
  name: string;
  manufacturer: string;
  country: string;
  unitPrice: number;
  createdOn: string;
  modifiedOn: string;
}

@Injectable()
export class ProductApiService {
  private productServiceApi: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.productServiceApi =
      this.configService.get<string>('productServiceApi');
  }

  async getProductsByIds(ids: number[]): Promise<Product[]> {
    const idsQueryString = ids.map((id) => `ids=${id}`).join('&');
    const url = `${this.productServiceApi}/products?${idsQueryString}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }
}
