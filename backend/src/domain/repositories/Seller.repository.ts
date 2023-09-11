import { SellerEntity } from '../entities/Seller.entity';

export interface ISellerRepository {
  findOneByName(sellerName: string): Promise<SellerEntity>;
  save(entity: SellerEntity): Promise<SellerEntity>;
}
