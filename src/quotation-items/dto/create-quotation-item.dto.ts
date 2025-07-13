import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { QuotationItemType } from '@prisma/client';

export class CreateQuotationItemDto {
  @ApiProperty({
    description: 'Quotation ID that this item belongs to',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  quotationId: string;

  @ApiProperty({
    description: 'Description of the quotation item',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Type of quotation item',
    enum: QuotationItemType,
    required: true,
  })
  @IsEnum(QuotationItemType)
  type: QuotationItemType;

  @ApiProperty({ description: 'Price of the item', required: true })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Labor task ID (if type is LABOR)',
    required: false,
  })
  @IsString()
  @IsOptional()
  laborTaskId?: string;

  @ApiProperty({
    description: 'Part ID (required for both PART and LABOR types)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  partId: string;
}
