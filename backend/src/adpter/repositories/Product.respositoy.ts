import { ProductEntity } from '@/domain/entities/Product.entity';
import { IProductRepository } from '@/domain/repositories/Product.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private repository: Repository<ProductEntity>,
  ) {}

  findOneByName(name: string): Promise<ProductEntity> {
    return this.repository.findOneBy({ name });
  }

  save(entity: ProductEntity): Promise<ProductEntity> {
    return this.repository.save(entity);
  }
}
