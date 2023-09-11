import { CommissionEntity } from '../entities/Commission.entity';

export interface ICommissionRepository {
  findOneBySellerIdAndProductIdAndDate(
    sellerId: number,
    productId: number,
    date: Date,
  ): Promise<CommissionEntity>;

  save(entity: CommissionEntity): Promise<CommissionEntity>;
}
