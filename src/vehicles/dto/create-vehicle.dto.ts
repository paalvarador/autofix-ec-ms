import { ApiProperty } from '@nestjs/swagger';
import { VehicleColor } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ required: true })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ required: true })
  @IsEnum(VehicleColor)
  color: VehicleColor;

  @ApiProperty({ required: true })
  @IsUUID()
  ownerId: string;

  @ApiProperty({ required: true })
  @IsUUID()
  modelId: string;
}
