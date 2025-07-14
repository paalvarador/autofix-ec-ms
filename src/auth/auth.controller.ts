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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado o credenciales inválidas' })
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userToken = await this.authService.loginUser(data, res);

    if (!userToken)
      throw new NotFoundException('User not found or invalid credentials');

    return {
      statusCode: HttpStatus.OK,
      message: 'Login Successfully',
      data: userToken,
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
  ) {
    try {
      const result = await this.authService.registerUser(data, res);
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
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('authToken');

    return res.status(200).json({
      message: 'Logout successful',
    });
  }
}
