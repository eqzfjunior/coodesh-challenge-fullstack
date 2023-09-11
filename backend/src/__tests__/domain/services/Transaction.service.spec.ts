import { Test } from '@nestjs/testing';
import {
  Transaction,
  TransactionType,
} from '../../../domain/interfaces/Transaction.interface';
import { TransactionService } from '../../../domain/services/Transaction.service';
import { ISellerRepository } from '../../../domain/repositories/Seller.repository';
import { SellerEntity } from '../../../domain/entities/Seller.entity';
import { IProductRepository } from '../../../domain/repositories/Product.repository';
import { ProductEntity } from '../../../domain/entities/Product.entity';
import { ISaleRepository } from '../../../domain/repositories/Sale.repository';
import { SaleEntity } from '../../../domain/entities/Sale.entity';
import { CommissionEntity } from '../../../domain/entities/Commission.entity';
import { ICommissionRepository } from '../../../domain/repositories/Commission.repository';

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

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let sellerRepository: ISellerRepository;
  let productRepository: IProductRepository;
  let saleRepository: ISaleRepository;
  let commissionRepository: ICommissionRepository;

  beforeEach(async () => {
    sellerRepository = {
      findOneByName: jest.fn().mockResolvedValue(() => {
        const seller = new SellerEntity();
        seller.id = 1;
        seller.name = 'JOSE CARLOS';
        return seller;
      }),
      save: jest.fn().mockResolvedValue(() => {
        const seller = new SellerEntity();
        seller.id = 1;
        seller.name = 'JOSE CARLOS';
        return seller;
      }),
    };

    productRepository = {
      findOneByName: jest.fn().mockResolvedValue(() => {
        const product = new ProductEntity();
        product.id = 1;
        product.name = 'CURSO DE BEM-ESTAR';
        return product;
      }),
      save: jest.fn().mockResolvedValue(() => {
        const product = new ProductEntity();
        product.id = 1;
        product.name = 'CURSO DE BEM-ESTAR';
        return product;
      }),
    };

    saleRepository = {
      findOneBySellerIdAndProductIdAndDate: jest.fn().mockResolvedValue(() => {
        const sale = new SaleEntity();
        return sale;
      }),
      save: jest.fn().mockResolvedValue(() => {
        const sale = new SaleEntity();
        return sale;
      }),
    };

    commissionRepository = {
      findOneBySellerIdAndProductIdAndDate: jest.fn().mockResolvedValue(() => {
        const commission = new CommissionEntity();
        return commission;
      }),
      save: jest.fn().mockResolvedValue(() => {
        const commission = new CommissionEntity();
        return commission;
      }),
    };

    const module = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'ISellerRepository',
          useValue: sellerRepository,
        },
        {
          provide: 'IProductRepository',
          useValue: productRepository,
        },
        {
          provide: 'ISaleRepository',
          useValue: saleRepository,
        },
        {
          provide: 'ICommissionRepository',
          useValue: commissionRepository,
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
  });

  describe('import', () => {
    test('Should register a seller', async () => {
      sellerRepository.findOneByName = jest.fn().mockResolvedValue(null);

      await transactionService.import(transactions);

      expect(sellerRepository.save).toHaveBeenCalled();
    });

    test('should not register a seller if he is already registered', async () => {
      const seller = new SellerEntity();
      seller.id = 1;
      seller.name = 'JOSE CARLOS';

      sellerRepository.findOneByName = jest.fn().mockResolvedValue(seller);
      sellerRepository.save = jest.fn();

      await transactionService.import(transactions);

      expect(sellerRepository.save).not.toHaveBeenCalled();
    });

    test('Should register a product', async () => {
      productRepository.findOneByName = jest.fn().mockResolvedValue(null);

      await transactionService.import(transactions);

      expect(productRepository.save).toHaveBeenCalled();
    });

    test('should not register a product if he is already registered', async () => {
      const product = new ProductEntity();
      product.id = 1;
      product.name = 'CURSO DE BEM-ESTAR';

      productRepository.findOneByName = jest.fn().mockResolvedValue(product);

      await transactionService.import(transactions);

      expect(productRepository.save).not.toHaveBeenCalled();
    });

    test('Should register the sales of producers and affiliates', async () => {
      saleRepository.findOneBySellerIdAndProductIdAndDate = jest.fn();

      await transactionService.import(transactions);

      expect(saleRepository.save).toHaveBeenCalled();
    });

    test('Should not register the sales of producers and affiliates already registered', async () => {
      await transactionService.import(transactions);

      expect(saleRepository.save).not.toHaveBeenCalled();
    });

    test('Should not register sales for commission transactions', async () => {
      saleRepository.findOneBySellerIdAndProductIdAndDate = jest.fn();

      await transactionService.import(transactions);

      expect(saleRepository.save).toHaveBeenCalledTimes(5);
    });

    test('Should not register already registered commissions', async () => {
      await transactionService.import(transactions);

      expect(commissionRepository.save).toHaveBeenCalledTimes(0);
    });

    test('Should register payment of commissions', async () => {
      const mockSave = jest.fn();

      commissionRepository.findOneBySellerIdAndProductIdAndDate = jest.fn();
      commissionRepository.save = mockSave;

      await transactionService.import(transactions);

      expect(mockSave).toHaveBeenCalledTimes(2);
      expect(mockSave.mock.calls[0][0]).toHaveProperty('value', -4500);
      expect(mockSave.mock.calls[1][0]).toHaveProperty('value', 4500);
    });
  });
});
