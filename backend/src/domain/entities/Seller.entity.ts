import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SellerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
