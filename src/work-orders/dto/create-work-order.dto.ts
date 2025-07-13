import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { WorkOrderStatus } from '@prisma/client';

export class CreateWorkOrderDto {
  @ApiProperty({
    description: 'Quotation ID to convert to work order',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  quotationId: string;

  @ApiProperty({
    description: 'Workshop ID that will handle the work',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  workshopId: string;

  @ApiProperty({
    description: 'Customer ID who owns the vehicle',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({
    description: 'Status of the work order',
    enum: WorkOrderStatus,
    default: 'IN_PROGRESS',
  })
  @IsEnum(WorkOrderStatus)
  status: WorkOrderStatus = WorkOrderStatus.IN_PROGRESS;
}
