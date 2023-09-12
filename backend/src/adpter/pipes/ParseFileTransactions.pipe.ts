import { Injectable, PipeTransform } from '@nestjs/common';
import { TransactionFileDto } from '../dtos/TransactionFile.dto';

@Injectable()
export class ParseTransactionsPipe implements PipeTransform {
  transform(file: Express.Multer.File): TransactionFileDto[] {
    const content = file.buffer.toString('utf-8');
    const lines = content
      .split('\n')
      .filter((line) => line)
      .map((line) => {
        return {
          type: parseInt(line.slice(0, 1)),
          date: new Date(line.slice(1, 26)),
          productName: line.slice(26, 56).trim(),
          value: Number(line.slice(56, 66)),
          sellerName: line.slice(66, 86),
        };
      });

    return lines;
  }
}
