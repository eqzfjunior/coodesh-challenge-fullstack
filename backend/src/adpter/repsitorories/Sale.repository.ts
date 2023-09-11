import { SaleEntity } from '@/domain/entities/Sale.entity';
import { ISaleRepository } from '@/domain/repositories/Sale.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class SaleRepository implements ISaleRepository {
  constructor(
    @InjectRepository(SaleEntity)
    private repository: Repository<SaleEntity>,
  ) {}

  findOneBySellerIdAndProductIdAndDate(
    sellerId: number,
    productId: number,
    date: Date,
  ): Promise<SaleEntity> {
    return this.repository.findOneBy({
      sellerId,
      productId,
      date,
    });
  }

  save(entity: SaleEntity): Promise<SaleEntity> {
    return this.repository.save(entity);
  }
}
