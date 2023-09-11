import { Test } from '@nestjs/testing';
import { SummaryTransaction } from '../../../domain/interfaces/SummaryTransaction.interface';
import {
  Transaction,
  TransactionType,
} from '../../..//domain/interfaces/Transaction.interface';
import { TransactionService } from '../../..//domain/services/Transaction.service';

describe('TransactionService', () => {
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TransactionService],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
  });

  describe('summary', () => {
    test('Should return the summarized list of transactions', async () => {
      const transactions = [
        {
          type: TransactionType.SALE_PRODUCER,
          date: new Date('2022-01-15T19:20:30-03:00'),
          productName: 'CURSO DE BEM-ESTAR',
          value: 12750,
          sellerName: 'JOSE CARLOS',
        } as Transaction,
        {
          type: TransactionType.SALE_PRODUCER,
          date: new Date('2021-12-03T11:46:02-03:00'),
          productName: 'DOMINANDO INVESTIMENTOS',
          value: 50000,
          sellerName: 'MARIA CANDIDA',
        } as Transaction,
        {
          type: TransactionType.SALE_AFFILIATE,
          date: new Date('2022-01-16T14:13:54-03:00'),
          productName: 'CURSO DE BEM-ESTAR',
          value: 12750,
          sellerName: 'THIAGO OLIVEIRA',
        } as Transaction,
        {
          type: TransactionType.COMMISSION_PAID,
          date: new Date('2022-01-16T14:13:54-03:00'),
          productName: 'CURSO DE BEM-ESTAR',
          value: 4500,
          sellerName: 'THIAGO OLIVEIRA',
        } as Transaction,
        {
          type: TransactionType.COMMISSION_RECEIVED,
          date: new Date('2022-01-16T14:13:54-03:00'),
          productName: 'CURSO DE BEM-ESTAR',
          value: 4500,
          sellerName: 'JOSE CARLOS',
        } as Transaction,
        {
          type: TransactionType.SALE_PRODUCER,
          date: new Date('2022-01-22T08:59:13-03:00'),
          productName: 'DOMINANDO INVESTIMENTOS',
          value: 50000,
          sellerName: 'MARIA CANDIDA',
        } as Transaction,
        {
          type: TransactionType.SALE_PRODUCER,
          date: new Date('2022-03-01T02:09:54-03:00'),
          productName: 'CURSO DE BEM-ESTAR',
          value: 12750,
          sellerName: 'JOSE CARLOS',
        } as Transaction,
      ];

      const summary = await transactionService.summary(transactions);

      expect(summary).toEqual([
        {
          sellerName: 'JOSE CARLOS',
          totalSales: 12750 + 12750,
          totalCommissionsPaid: 0,
          totalCommissionsReceived: 4500,
          balance: 12750 + 12750 + 4500,
        } as SummaryTransaction,
        {
          sellerName: 'MARIA CANDIDA',
          totalSales: 50000 + 50000,
          totalCommissionsPaid: 0,
          totalCommissionsReceived: 0,
          balance: 50000 + 50000,
        } as SummaryTransaction,
        {
          sellerName: 'THIAGO OLIVEIRA',
          totalSales: 12750,
          totalCommissionsPaid: 4500,
          totalCommissionsReceived: 0,
          balance: 12750 - 4500,
        },
      ]);
    });
  });
});
