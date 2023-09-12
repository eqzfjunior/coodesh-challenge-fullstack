import { SellerEntity } from '@/domain/entities/Seller.entity';
import { ISellerRepository } from '@/domain/repositories/Seller.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class SellerRepository implements ISellerRepository {
  constructor(
    @InjectRepository(SellerEntity)
    private repository: Repository<SellerEntity>,
  ) {}

  findOneByName(name: string): Promise<SellerEntity> {
    return this.repository.findOneBy({ name });
  }

  save(entity: SellerEntity): Promise<SellerEntity> {
    return this.repository.save(entity);
  }
}
