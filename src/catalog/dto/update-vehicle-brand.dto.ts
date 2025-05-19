import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVehicleBrandDto } from './create-vehicle-brand.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVehicleBrandDto extends PartialType(CreateVehicleBrandDto) {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;
}
