import { Module } from '@nestjs/common';
import { QuotationService } from './quotations.service';
import { QuotationsController } from './quotations.controller';

@Module({
  controllers: [QuotationsController],
  providers: [QuotationService],
})
export class QuotationsModule {}
