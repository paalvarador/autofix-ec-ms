import { Module } from '@nestjs/common';
import { QuotationRequestsService } from './quotation-requests.service';
import { QuotationRequestsController } from './quotation-requests.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuotationRequestsController],
  providers: [QuotationRequestsService],
  exports: [QuotationRequestsService],
})
export class QuotationRequestsModule {}
