import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ 
    required: true,
    example: 'abc123def456ghi789',
    description: 'Token de reset de contraseña recibido por email'
  })
  @IsString({ message: 'El token debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El token es requerido' })
  token: string;

  @ApiProperty({ 
    required: true,
    example: 'NewPassword123!',
    description: 'Nueva contraseña del usuario',
    minLength: 8
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
    message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número' 
  })
  newPassword: string;
}