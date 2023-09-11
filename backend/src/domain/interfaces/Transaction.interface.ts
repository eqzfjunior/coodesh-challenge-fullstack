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
