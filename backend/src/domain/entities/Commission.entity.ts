import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SaleEntity } from './Sale.entity';
import { ProductEntity } from './Product.entity';
import { SellerEntity } from './Seller.entity';

@Entity()
export class CommissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'datetime',
  })
  date: Date;

  @Column()
  value: number;

  @OneToOne(() => SellerEntity)
  @JoinColumn()
  seller: SellerEntity;

  @Column()
  sellerId: number;

  @ManyToMany(() => ProductEntity)
  product: ProductEntity;

  @Column()
  productId: string;
}
