import { Module } from '@nestjs/common';
import { QuotationItemsService } from './quotation-items.service';
import { QuotationItemsController } from './quotation-items.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuotationItemsController],
  providers: [QuotationItemsService],
  exports: [QuotationItemsService],
})
export class QuotationItemsModule {}
