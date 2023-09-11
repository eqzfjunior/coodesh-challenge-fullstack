import { SaleEntity } from '../entities/Sale.entity';

export interface ISaleRepository {
  findOneBySellerIdAndProductIdAndDate(
    sellerId: number,
    productId: number,
    date: Date,
  ): Promise<SaleEntity>;
  save(entity: SaleEntity): Promise<SaleEntity>;
}
