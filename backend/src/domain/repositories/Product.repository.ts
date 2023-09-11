import { ProductEntity } from '../entities/Product.entity';

export interface IProductRepository {
  findOneByName(productName: string): Promise<ProductEntity>;
  save(entity: ProductEntity): Promise<ProductEntity>;
}
