import { ApiProperty } from '@nestjs/swagger';
import { QuotationStatus } from '@prisma/client';

export class CreateQuotationDto {
  @ApiProperty({ required: true })
  customerId: string;

  @ApiProperty({ required: true })
  workshopId: string;

  @ApiProperty({ required: true })
  vehicleId: string;

  @ApiProperty({ required: true, default: 'PENDING' })
  status: QuotationStatus = 'PENDING';

  @ApiProperty({ required: true, default: 0.0 })
  total: number;

  @ApiProperty({ required: true })
  estimatedTime: number;
}
