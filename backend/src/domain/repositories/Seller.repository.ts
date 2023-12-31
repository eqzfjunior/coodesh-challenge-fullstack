import { SellerEntity } from '../entities/Seller.entity';

export interface ISellerRepository {
  findOneByName(name: string): Promise<SellerEntity>;
  save(entity: SellerEntity): Promise<SellerEntity>;
}
