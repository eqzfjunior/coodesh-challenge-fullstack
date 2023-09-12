import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './domain/entities/Seller.entity';
import { SaleEntity } from './domain/entities/Sale.entity';
import { ProductEntity } from './domain/entities/Product.entity';
import { CommissionEntity } from './domain/entities/Commission.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionsController } from './adpter/controllers/transation.controller';
import { TransactionService } from './domain/services/Transaction.service';
import { SellerRepository } from './adpter/repositories/Seller.repository';
import { ProductRepository } from './adpter/repositories/Product.respositoy';
import { SaleRepository } from './adpter/repositories/Sale.repository';
import { CommissionRepository } from './adpter/repositories/Commission.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      SellerEntity,
      SaleEntity,
      ProductEntity,
      CommissionEntity,
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionService,
    {
      provide: 'ISellerRepository',
      useClass: SellerRepository,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'ISaleRepository',
      useClass: SaleRepository,
    },
    {
      provide: 'ICommissionRepository',
      useClass: CommissionRepository,
    },
  ],
})
export class AppModule {}
