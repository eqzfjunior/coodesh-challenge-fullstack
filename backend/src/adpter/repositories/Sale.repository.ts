import { SaleEntity } from '@/domain/entities/Sale.entity';
import {
  ISaleRepository,
  ISaleSummaryRaw,
} from '@/domain/repositories/Sale.repository';
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

  async summary(): Promise<ISaleSummaryRaw[]> {
    const rows = await this.repository
      .createQueryBuilder('sale')
      .innerJoinAndSelect('sale.seller', 'seller')
      .select(
        `
          seller.id seller_id,
          seller.name seller_name,
          SUM(sale.value) total_sales
        `,
      )
      .groupBy('seller.id')
      .getRawMany();

    return rows.map((row) => ({
      ...row,
      total_sales: Number(row.total_sales),
    }));
  }
}
