import { ProductEntity } from '../entities/Product.entity';

export interface IProductRepository {
  findOneByName(name: string): Promise<ProductEntity>;
  save(entity: ProductEntity): Promise<ProductEntity>;
}
