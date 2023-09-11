import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'seller',
})
export class SellerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
