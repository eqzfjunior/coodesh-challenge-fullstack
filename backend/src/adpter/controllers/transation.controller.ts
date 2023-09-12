import {
  Controller,
  Get,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseTransactionsPipe } from '../pipes/ParseFileTransactions.pipe';
import { TransactionService } from '../../domain/services/Transaction.service';
import { TransactionFileDto } from '../dtos/TransactionFile.dto';

@Controller('Transactions')
export class TransactionsController {
  constructor(private transactinosService: TransactionService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async import(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'text',
        })
        .addMaxSizeValidator({
          maxSize: 10240,
        })
        .build(),
      ParseTransactionsPipe,
    )
    transactions: TransactionFileDto[],
  ): Promise<void> {
    await this.transactinosService.import(transactions);
  }

  @Get('summary')
  summary() {
    return this.transactinosService.summary();
  }
}
