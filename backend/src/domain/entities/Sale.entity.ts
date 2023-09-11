import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SellerEntity } from './Seller.entity';
import { ProductEntity } from './Product.entity';

@Entity({
  name: 'sale',
})
export class SaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
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
  productId: number;
}
