import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  ConflictException,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto, TokenResponseDto } from './dto/refresh-token.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { Request, Response } from 'express';

interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso', type: TokenResponseDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado o credenciales inválidas' })
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const tokens = await this.authService.loginUser(data, res, req);

    if (!tokens)
      throw new NotFoundException('User not found or invalid credentials');

    return {
      statusCode: HttpStatus.OK,
      message: 'Login Successfully',
      data: tokens,
    };
  }

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async register(
    @Body() data: RegisterDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    try {
      const result = await this.authService.registerUser(data, res, req);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Usuario registrado exitosamente',
        data: result,
      };
    } catch (error) {
      if (error.message.includes('Email already exists')) {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener información del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Información del usuario' })
  @ApiResponse({ status: 401, description: 'Token no válido o expirado' })
  me(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies['authToken'];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      const userData = this.authService.decodeToken(token);
      return res.status(200).json(userData);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  @Public()
  @Post('/logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Logout exitoso' })
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithCookies,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('authToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({
      message: 'Logout successful',
    });
  }

  @Public()
  @Post('/refresh')
  @ApiOperation({ summary: 'Renovar access token usando refresh token' })
  @ApiResponse({ status: 200, description: 'Tokens renovados exitosamente', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshAccessToken(refreshTokenDto, req);

    // Actualizar cookies con nuevos tokens
    res.cookie('authToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 * 1000, // 1 hora
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 3600 * 1000, // 30 días
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Tokens renovados exitosamente',
      data: tokens,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout-all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión en todos los dispositivos' })
  @ApiResponse({ status: 200, description: 'Logout exitoso en todos los dispositivos' })
  async logoutAll(@Req() req: any) {
    const userId = req.user?.userId;
    
    if (userId) {
      await this.authService.logoutFromAllDevices(userId);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Sesión cerrada en todos los dispositivos',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/sessions/:deviceId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión en un dispositivo específico' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada en el dispositivo' })
  async logoutDevice(
    @Req() req: any,
    @Param('deviceId') deviceId: string,
  ) {
    const userId = req.user?.userId;
    
    if (userId) {
      await this.authService.logoutFromDevice(userId, deviceId);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Sesión cerrada en el dispositivo',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/sessions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener sesiones activas del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de sesiones activas' })
  async getActiveSessions(@Req() req: any) {
    const userId = req.user?.userId;
    
    const sessions = await this.authService.getUserActiveSessions(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Sesiones activas obtenidas exitosamente',
      data: sessions,
    };
  }

  @Public()
  @Post('/forgot-password')
  @ApiOperation({ summary: 'Solicitar reset de contraseña' })
  @ApiResponse({ status: 200, description: 'Email de reset enviado si el usuario existe' })
  @ApiResponse({ status: 400, description: 'Email inválido' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(forgotPasswordDto);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Public()
  @Post('/reset-password')
  @ApiOperation({ summary: 'Resetear contraseña con token' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(resetPasswordDto);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }
}
