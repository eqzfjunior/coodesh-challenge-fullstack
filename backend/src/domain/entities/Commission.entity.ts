import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './Product.entity';
import { SellerEntity } from './Seller.entity';

@Entity({
  name: 'commission',
})
export class CommissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
  })
  date: Date;

  @Column()
  value: number;

  @ManyToOne(() => SellerEntity)
  @JoinColumn()
  seller: SellerEntity;

  @Column()
  sellerId: number;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  @Column()
  productId: number;
}
