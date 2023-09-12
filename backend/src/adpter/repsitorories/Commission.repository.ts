import { CommissionEntity } from '@/domain/entities/Commission.entity';
import { ICommissionRepository } from '@/domain/repositories/Commission.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class CommissionRepository implements ICommissionRepository {
  constructor(
    @InjectRepository(CommissionEntity)
    private repository: Repository<CommissionEntity>,
  ) {}

  findOneBySellerIdAndProductIdAndDate(
    sellerId: number,
    productId: number,
    date: Date,
  ): Promise<CommissionEntity> {
    return this.repository.findOneBy({ sellerId, productId, date });
  }

  save(entity: CommissionEntity): Promise<CommissionEntity> {
    return this.repository.save(entity);
  }

  async getSumBySellerId(sellerId: number): Promise<number> {
    const data = await this.repository
      .createQueryBuilder('c')
      .select('SUM(c.value)')
      .where('c.seller.id = :sellerId', { sellerId })
      .getRawOne();

    return Number(data.sum);
  }
}
