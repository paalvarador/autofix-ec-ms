import { ApiProperty } from '@nestjs/swagger';

export class VehicleBrandEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  vehicleBrandId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  vehicleBrand?: VehicleBrandEntity;
}
