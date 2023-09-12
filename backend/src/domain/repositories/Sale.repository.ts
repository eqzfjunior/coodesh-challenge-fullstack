import { SaleEntity } from '../entities/Sale.entity';

export interface ISaleSummaryRaw {
  seller_id: number;
  seller_name: string;
  total_sales: number;
}

export interface ISaleRepository {
  findOneBySellerIdAndProductIdAndDate(
    sellerId: number,
    productId: number,
    date: Date,
  ): Promise<SaleEntity>;

  save(entity: SaleEntity): Promise<SaleEntity>;

  summary(): Promise<ISaleSummaryRaw[]>;
}
