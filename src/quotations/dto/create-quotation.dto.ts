import { ItemType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class QuotationItemDto {
  @IsEnum(ItemType)
  type: ItemType;

  @IsUUID()
  partId: string;

  @IsUUID()
  laborTaskId?: string;

  @IsNumber()
  price: number;

  description: string;
}

export class CreateQuotationDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  vehicleId: string;

  @IsUUID()
  workshopId: string;

  @IsNumber()
  total: number;

  @IsInt()
  estimatedTime: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationItemDto)
  items: QuotationItemDto[];
}
