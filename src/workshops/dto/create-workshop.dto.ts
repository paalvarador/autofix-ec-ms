import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateWorkshopDto {
  @ApiProperty({ description: 'Workshop name', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Workshop address', required: true })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Workshop phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Workshop email', required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User ID who owns the workshop', required: true })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
