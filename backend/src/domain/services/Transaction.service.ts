import { Injectable } from '@nestjs/common';
import {
  Transaction,
  TransactionType,
} from '../interfaces/Transaction.interface';
import { SummaryTransaction } from '../interfaces/SummaryTransaction.interface';

@Injectable()
export class TransactionService {
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
}
