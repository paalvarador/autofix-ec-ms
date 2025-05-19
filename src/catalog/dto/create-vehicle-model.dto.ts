import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateVehicleModelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  vehicleBrandId: string;
}
