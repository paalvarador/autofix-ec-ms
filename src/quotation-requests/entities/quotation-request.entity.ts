import { ApiProperty } from '@nestjs/swagger';
import { QuotationRequest, QuotationRequestStatus } from '@prisma/client';

export class QuotationRequestEntity implements QuotationRequest {
  @ApiProperty()
  id: string;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  vehicleId: string;

  @ApiProperty()
  workshopId: string | null;

  @ApiProperty({ enum: QuotationRequestStatus })
  status: QuotationRequestStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: string;
}
