import { ApiProperty } from '@nestjs/swagger';
import { Workshop } from '@prisma/client';

export class WorkshopEntity implements Workshop {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phone: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: string;
}
