import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ 
    required: true,
    example: 'Juan',
    description: 'Nombre del usuario'
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  firstName: string;

  @ApiProperty({ 
    required: true,
    example: 'Pérez',
    description: 'Apellido del usuario'
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  lastName: string;

  @ApiProperty({ 
    required: true,
    example: 'usuario@ejemplo.com',
    description: 'Email del usuario'
  })
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({ 
    required: false,
    example: '+1234567890',
    description: 'Teléfono del usuario'
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^\+?[\d\s\-\(\)]+$/, { message: 'Formato de teléfono inválido' })
  phone?: string;

  @ApiProperty({ 
    required: true,
    example: 'Password123!',
    description: 'Contraseña del usuario',
    minLength: 8
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
    message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número' 
  })
  password: string;

  @ApiProperty({ 
    required: true,
    enum: UserRole,
    example: UserRole.CUSTOMER,
    description: 'Rol del usuario'
  })
  @IsEnum(UserRole, { message: 'El rol debe ser CUSTOMER, WORKSHOP o ADMIN' })
  @IsNotEmpty({ message: 'El rol es requerido' })
  role: UserRole;

  @ApiProperty({ 
    required: false,
    example: 'uuid-del-workshop',
    description: 'ID del workshop (solo para usuarios WORKSHOP)'
  })
  @IsOptional()
  @IsString({ message: 'El ID del workshop debe ser una cadena de texto' })
  workshopId?: string;
}