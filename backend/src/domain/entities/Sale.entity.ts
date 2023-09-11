import { Column, ManyToOne } from 'typeorm';
import { SellerEntity } from './Seller.entity';
import { ProductEntity } from './Product.entity';

export class SaleEntity {
  id: number;

  @Column({
    type: 'datetime',
  })
  date: Date;

  @Column()
  value: number;

  @ManyToOne(() => SellerEntity)
  seller: SellerEntity;

  @Column()
  sellerId: number;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  @Column()
  productId: string;
}
