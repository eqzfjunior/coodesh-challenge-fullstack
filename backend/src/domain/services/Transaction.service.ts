import { Inject, Injectable } from '@nestjs/common';
import { ISellerRepository } from '../repositories/Seller.repository';
import { SellerEntity } from '../entities/Seller.entity';
import { IProductRepository } from '../repositories/Product.repository';
import { ProductEntity } from '../entities/Product.entity';
import { ISaleRepository } from '../repositories/Sale.repository';
import { SaleEntity } from '../entities/Sale.entity';
import { CommissionEntity } from '../entities/Commission.entity';
import { ICommissionRepository } from '../repositories/Commission.repository';

export interface ITransactionSummary {
  sellerName: string;
  totalSales: number;
  totalCommissions: number;
  balance: number;
}

export enum TransactionType {
  SALE_PRODUCER = 1,
  SALE_AFFILIATE = 2,
  COMMISSION_PAID = 3,
  COMMISSION_RECEIVED = 4,
}

export interface Transaction {
  type: TransactionType;
  date: Date;
  productName: string;
  value: number;
  sellerName: string;
}

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ISellerRepository')
    private sellerRepository: ISellerRepository,

    @Inject('IProductRepository')
    private productRepository: IProductRepository,

    @Inject('ISaleRepository')
    private saleRepository: ISaleRepository,

    @Inject('ICommissionRepository')
    private commissionRepository: ICommissionRepository,
  ) {}

  async summary(): Promise<ITransactionSummary[]> {
    const salesSummary = await this.saleRepository.summary();

    const summaryTransaction: ITransactionSummary[] = [];

    for await (const saleSummary of salesSummary) {
      const totalCommissions = await this.commissionRepository.getSumBySellerId(
        saleSummary.seller_id,
      );

      summaryTransaction.push({
        sellerName: saleSummary.seller_name,
        totalSales: saleSummary.total_sales,
        totalCommissions,
        balance: saleSummary.total_sales + totalCommissions,
      });
    }

    return summaryTransaction;
  }

  async import(transactions: Transaction[]): Promise<void> {
    for await (const transaction of transactions) {
      let seller = await this.sellerRepository.findOneByName(
        transaction.sellerName,
      );

      if (!seller) {
        const newSeller = new SellerEntity();
        newSeller.name = transaction.sellerName;
        seller = await this.sellerRepository.save(newSeller);
      }

      let product = await this.productRepository.findOneByName(
        transaction.productName,
      );

      if (!product) {
        const newProduct = new ProductEntity();
        newProduct.name = transaction.productName;
        product = await this.productRepository.save(newProduct);
      }

      if (
        [
          TransactionType.SALE_PRODUCER,
          TransactionType.SALE_AFFILIATE,
        ].includes(transaction.type)
      ) {
        let sale =
          await this.saleRepository.findOneBySellerIdAndProductIdAndDate(
            seller.id,
            product.id,
            transaction.date,
          );

        if (!sale) {
          const newSale = new SaleEntity();
          newSale.seller = seller;
          newSale.product = product;
          newSale.date = transaction.date;
          newSale.value = transaction.value;
          sale = await this.saleRepository.save(newSale);
        }
      }

      if (
        [
          TransactionType.COMMISSION_PAID,
          TransactionType.COMMISSION_RECEIVED,
        ].includes(transaction.type)
      ) {
        const commission =
          await this.commissionRepository.findOneBySellerIdAndProductIdAndDate(
            seller.id,
            product.id,
            transaction.date,
          );

        if (!commission) {
          const newCommission = new CommissionEntity();
          newCommission.product = product;
          newCommission.seller = seller;
          newCommission.date = transaction.date;
          newCommission.value = transaction.value;

          if (transaction.type == TransactionType.COMMISSION_PAID) {
            newCommission.value *= -1;
          }

          await this.commissionRepository.save(newCommission);
        }
      }
    }
  }
}
