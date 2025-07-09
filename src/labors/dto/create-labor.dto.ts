import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateLaborDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  hourlyRate: number;

  @IsInt()
  @Min(1)
  estimatedHours: number;

  @IsUUID()
  workshopId: string;
}
