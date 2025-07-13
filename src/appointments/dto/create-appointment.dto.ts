import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Customer ID who requests the appointment',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({
    description: 'Workshop ID where the appointment will take place',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  workshopId: string;

  @ApiProperty({
    description: 'Date and time for the appointment',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    default: 'PENDING',
  })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus = AppointmentStatus.PENDING;
}
