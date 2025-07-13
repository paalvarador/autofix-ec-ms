import { ApiProperty } from '@nestjs/swagger';
import { QuotationItem, QuotationItemType } from '@prisma/client';

export class QuotationItemEntity implements QuotationItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quotationId: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: QuotationItemType })
  type: QuotationItemType;

  @ApiProperty()
  price: number;

  @ApiProperty()
  laborTaskId: string | null;

  @ApiProperty()
  partId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: string;
}