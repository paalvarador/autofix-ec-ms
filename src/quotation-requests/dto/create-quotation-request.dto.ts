import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { QuotationRequestStatus } from '@prisma/client';

export class CreateQuotationRequestDto {
  @ApiProperty({
    description: 'Description of the service needed',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Customer ID who requests the quotation',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Vehicle ID for the service', required: true })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ description: 'Workshop ID (optional)', required: false })
  @IsString()
  @IsOptional()
  workshopId?: string;

  @ApiProperty({
    description: 'Status of the quotation request',
    enum: QuotationRequestStatus,
    default: 'ACTIVE',
  })
  @IsEnum(QuotationRequestStatus)
  status: QuotationRequestStatus = QuotationRequestStatus.ACTIVE;
}
