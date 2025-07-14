import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ 
    required: true,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token para obtener un nuevo access token'
  })
  @IsString({ message: 'El refresh token debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El refresh token es requerido' })
  refreshToken: string;

  @ApiProperty({ 
    required: false,
    example: 'mobile-app-v1.0',
    description: 'Identificador del dispositivo/aplicación'
  })
  @IsOptional()
  @IsString({ message: 'El deviceId debe ser una cadena de texto' })
  deviceId?: string;
}

export class TokenResponseDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Nuevo access token JWT'
  })
  accessToken: string;

  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Nuevo refresh token'
  })
  refreshToken: string;

  @ApiProperty({ 
    example: 3600,
    description: 'Tiempo de expiración del access token en segundos'
  })
  expiresIn: number;

  @ApiProperty({ 
    example: 'Bearer',
    description: 'Tipo de token'
  })
  tokenType: string;
}