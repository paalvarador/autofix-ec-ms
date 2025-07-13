import { ApiProperty } from '@nestjs/swagger';
import { Appointment, AppointmentStatus } from '@prisma/client';

export class AppointmentEntity implements Appointment {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  workshopId: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: AppointmentStatus })
  status: AppointmentStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: string;
}