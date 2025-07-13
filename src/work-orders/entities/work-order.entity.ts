import { ApiProperty } from '@nestjs/swagger';
import { WorkOrder, WorkOrderStatus } from '@prisma/client';

export class WorkOrderEntity implements WorkOrder {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quotationId: string;

  @ApiProperty()
  workshopId: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty({ enum: WorkOrderStatus })
  status: WorkOrderStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: string;
}
