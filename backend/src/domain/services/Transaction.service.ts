import { Inject, Injectable } from '@nestjs/common';
import {
  Transaction,
  TransactionType,
} from '../interfaces/Transaction.interface';
import { SummaryTransaction } from '../interfaces/SummaryTransaction.interface';
import { ISellerRepository } from '../repositories/Seller.repository';
import { SellerEntity } from '../entities/Seller.entity';
import { IProductRepository } from '../repositories/Product.repository';
import { ProductEntity } from '../entities/Product.entity';
import { ISaleRepository } from '../repositories/Sale.repository';
import { SaleEntity } from '../entities/Sale.entity';
import { CommissionEntity } from '../entities/Commission.entity';
import { ICommissionRepository } from '../repositories/Commission.repository';

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

  summary(transactions: Transaction[]): SummaryTransaction[] {
    const summary: SummaryTransaction[] = [];

    transactions.forEach((transaction) => {
      const index = summary.findIndex(
        (item) => item.sellerName == transaction.sellerName,
      );
      let item: SummaryTransaction;

      if (index == -1) {
        item = {
          sellerName: transaction.sellerName,
          totalSales: 0,
          totalCommissionsPaid: 0,
          totalCommissionsReceived: 0,
          balance: 0,
        } as SummaryTransaction;
      } else {
        item = summary[index];
      }

      if (
        [
          TransactionType.SALE_PRODUCER,
          TransactionType.SALE_AFFILIATE,
        ].includes(transaction.type)
      ) {
        item.totalSales = transaction.value + item.totalSales;
      }

      if ([TransactionType.COMMISSION_RECEIVED].includes(transaction.type)) {
        item.totalCommissionsReceived =
          transaction.value + item.totalCommissionsReceived;
      }

      if ([TransactionType.COMMISSION_PAID].includes(transaction.type)) {
        item.totalCommissionsPaid =
          transaction.value + item.totalCommissionsPaid;
      }

      item.balance =
        item.totalSales -
        item.totalCommissionsPaid +
        item.totalCommissionsReceived;

      if (index == -1) {
        summary.push(item);
      } else {
        summary[index] = item;
      }
    });

    return summary;
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
