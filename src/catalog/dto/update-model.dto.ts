import { PartialType } from '@nestjs/mapped-types';
import { CreateModelDto } from './create-model.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateModelDto extends PartialType(CreateModelDto) {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  vehicleBrandId?: string;
}
