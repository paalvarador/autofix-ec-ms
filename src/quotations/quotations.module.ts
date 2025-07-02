import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuotationsController } from './quotations.controller';
import { QuotationService } from './quotations.service';

@Module({
  imports: [PrismaModule],
  controllers: [QuotationsController],
  providers: [QuotationService],
})
export class QuotationsModule {}
