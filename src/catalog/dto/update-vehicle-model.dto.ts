import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleModelDto } from './create-vehicle-model.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVehicleModelDto extends PartialType(CreateVehicleModelDto) {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  vehicleBrandId?: string;
}
